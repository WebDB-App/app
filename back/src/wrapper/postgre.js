import pg from "pg";
import SQL from "../shared/sql.js";
import {writeFileSync} from "fs";
import {URL} from "url";
import bash from "../shared/bash.js";

const {Pool} = pg;
const dirname = new URL(".", import.meta.url).pathname;

export default class PostgreSQL extends SQL {

	commonUser = ["postgres", "postgre"];
	commonPass = ["postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast"];

	async scan() {
		return super.scan(this.host, 5430, 5440);
	}

	async sampleDatabase(name, {count, tables}) {
		const [database, schema] = name.split(this.dbToSchemaDelimiter);
		const getSample = async (table) => {
			return {
				structure: (bash.runBash(`pg_dump ${this.makeUri(database)} -t '${schema}.${table}' --schema-only`)).result,
				data: await this.runCommand(`SELECT * FROM ${table} LIMIT ${count}`, name)
			};
		};

		const promises = [];
		for (const table of tables) {
			promises.push(getSample(table));
		}

		return await Promise.all(promises);
	}

	async modifyColumn(database, table, old, column) {
		if (old.name !== column.name) {
			const r = await this.runCommand(`ALTER TABLE ${table} RENAME COLUMN ${old.name} TO ${column.name}`, database);
			if (r.error) {
				return r;
			}
		}
		if (JSON.stringify(old) === JSON.stringify(column)) {
			return {ok: true};
		}
		if (old.type !== column.type) {
			let r = await this.runCommand(`ALTER TABLE ${table} ALTER COLUMN ${column.name} TYPE ${column.type}`, database);
			if (r.error) {
				const using = /"(USING .*)"/.exec(r.error);
				if (using?.length > 0) {
					r = await this.runCommand(`ALTER TABLE ${table} ALTER COLUMN ${column.name} TYPE ${column.type} ${using[1]}`, database);
				}
				if (r.error) {
					return r;
				}
			}
		}
		if (old.nullable !== column.nullable) {
			const r = await this.runCommand(`ALTER TABLE ${table} ALTER COLUMN ${column.name} ${column.nullable ? "DROP NOT NULL" : "SET NOT NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		if (old.defaut !== column.defaut) {
			const r = await this.runCommand(`ALTER TABLE ${table} ALTER COLUMN ${column.name} SET DEFAULT ${column.defaut || "NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		return {};
	}

	async dump(dbSchema, exportType = "sql", tables, includeData = true) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		const path = `${dirname}../front/dump/${database}.${exportType}`;
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${database}'`);

		if (exportType === "sql") {
			const cmd = `pg_dump ${this.makeUri(database)}`;
			const data = includeData ? "" : "-s -b";
			const dbOpts = (tables === false || tables.length === total[0].total) ? "" : `${tables.map(table => `-t ${table}`).join(" ")}`;

			const result = bash.runBash(`${cmd} ${dbOpts} ${data} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = await this.runCommand(`SELECT * FROM ${table}`, dbSchema);
			}

			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}

		return {path: `dump/${database}.${exportType}`};
	}

	makeUri(database = false) {
		return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}` + (database ? ("/" + database) : "");
	}

	async load(filePath, dbSchema) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		return bash.runBash(`psql ${this.makeUri(database)} < ${filePath}`);
	}

	async insert(db, table, datas) {
		return await super.insert(db, table, datas);
	}

	async replaceTrigger(database, table, trigger) {
		return await this.runCommand(`CREATE OR REPLACE TRIGGER ${trigger.name} ${trigger.timing} ${trigger.event} ON ${table} ${trigger.code}`, database);
	}

	async dropTrigger(database, name, table) {
		return await this.runCommand(`DROP TRIGGER ${name} ON ${table}`, database);
	}

	async listTrigger(database, table) {
		const triggers = await this.runCommand(`SELECT trigger_schema, trigger_name, event_manipulation, action_statement, action_timing FROM information_schema.triggers WHERE event_object_table = '${table}'`, database);
		return triggers.map(trigger => {
			return {
				code: trigger.action_statement,
				timing: trigger.action_timing,
				event: trigger.event_manipulation,
				name: trigger.trigger_name
			};
		});
	}

	async duplicateTable(database, old_table, new_name) {
		return await this.runCommand(`CREATE TABLE ${new_name} AS ${old_table};`, database);
	}

	async statsDatabase(name) {
		const database = name.split(this.dbToSchemaDelimiter)[0];
		return {
			data_length: (await this.runCommand(`SELECT pg_database_size('${database}') AS "data_length"`, database))[0].data_length,
			index_length: (await this.runCommand("SELECT SUM(pg_indexes_size(relid)) as \"index_length\" FROM pg_catalog.pg_statio_user_tables", database))[0].index_length
		};
	}

	async statsTable(database, table) {
		return (await this.runCommand(`SELECT pg_indexes_size (relid) AS "index_length", pg_table_size (relid) AS "data_length" FROM pg_catalog.pg_statio_user_tables WHERE relname = '${table}'`, database.split(this.dbToSchemaDelimiter)[0]))[0];
	}

	async getAvailableCollations() {
		return await this.runCommand("SELECT * FROM pg_collation");
	}

	async setCollation(database, collate) {
		return true;
	}

	async getRelations() {
		const dbs = await this.getDbs();
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				const indexes = await this.runCommand(`
					WITH
						unnested_confkey AS (
							SELECT
								oid,
								UNNEST(confkey) AS confkey
							FROM
								pg_constraint
						),
						unnested_conkey AS (
							SELECT
								oid,
								UNNEST(conkey) AS conkey
							FROM
								pg_constraint
						)
					SELECT
						ns.nspname AS "database",
						c.conname AS "name",
						tbl.relname AS "table_source",
						col.attname AS "column_source",
						referenced_tbl.relname AS "table_dest",
						referenced_field.attname AS "column_dest",
						CASE c.confupdtype
							WHEN 'a' THEN 'NO ACTION'
							WHEN 'r' THEN 'RESTRICT'
							WHEN 'c' THEN 'CASCADE'
							WHEN 'n' THEN 'SET NULL'
							WHEN 'd' THEN 'SET DEFAULT'
							ELSE 'UNKNOWN' END AS update_rule,
						CASE c.confdeltype
							WHEN 'a' THEN 'NO ACTION'
							WHEN 'r' THEN 'RESTRICT'
							WHEN 'c' THEN 'CASCADE'
							WHEN 'n' THEN 'SET NULL'
							WHEN 'd' THEN 'SET DEFAULT'
							ELSE 'UNKNOWN' END AS delete_rule
					FROM
						pg_constraint c
						LEFT JOIN unnested_conkey con ON c.oid = con.oid
						LEFT JOIN pg_class tbl ON tbl.oid = c.conrelid
						LEFT JOIN pg_namespace ns ON tbl.relnamespace = ns.oid
						LEFT JOIN pg_attribute col ON (
							col.attrelid = tbl.oid
							AND col.attnum = con.conkey
						)
						LEFT JOIN pg_class referenced_tbl ON c.confrelid = referenced_tbl.oid
						LEFT JOIN unnested_confkey conf ON c.oid = conf.oid
						LEFT JOIN pg_attribute referenced_field ON (
							referenced_field.attrelid = c.confrelid
							AND referenced_field.attnum = conf.confkey
						)
					WHERE
						c.contype = 'f';`, db.datname);

				for (const [key, index] of Object.entries(indexes)) {
					indexes[key].database = db.datname + this.dbToSchemaDelimiter + index.database;
				}

				resolve(indexes);
			}));
		}

		return (await Promise.all(promises)).flat(1);
	}

	async addIndex(database, table, name, type, columns) {
		if (type === "PRIMARY") {
			return await this.runCommand(`ALTER TABLE ${table} ADD PRIMARY KEY (${columns.join(",")})`, database);
		} else if (type === "INDEX") {
			return await this.runCommand(`CREATE INDEX ${name} ON  ${table} (${columns.join(",")})`, database);
		} else if (type === "UNIQUE") {
			return await this.runCommand(`CREATE UNIQUE INDEX ${name} ON  ${table} (${columns.join(",")})`, database);
		}
	}

	async dropIndex(database, table, name) {
		if (name === "PRIMARY") {
			return await this.runCommand(`ALTER TABLE ${table} DROP PRIMARY KEY;`, database);
		} else {
			return await this.runCommand(`DROP INDEX ${name} ON ${table}`, database);
		}
	}

	async getIndexes() {
		const dbs = await this.getDbs();
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				const indexes = await this.runCommand(`
				SELECT ns.nspname AS "database",
					   t.relname AS "table",
					   i.relname AS "name",
					   ARRAY_TO_STRING(ARRAY_AGG(a.attname), ',') AS "columns",
					   i.reltuples AS "cardinality",
					   ix.indisunique AS "unique",
					   ix.indisprimary AS "primary"
				FROM pg_class t
				INNER JOIN pg_index ix ON t.oid = ix.indrelid
				INNER JOIN pg_class i ON i.oid = ix.indexrelid
				INNER JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY (ix.indkey)
				INNER JOIN pg_namespace ns ON i.relnamespace = ns.oid
				WHERE t.relkind = 'r'
				GROUP BY ns.nspname, t.relname, i.relname, i.reltuples, ix.indisunique, ix.indisprimary`, db.datname);

				for (const [key, index] of Object.entries(indexes)) {
					indexes[key].database = db.datname + this.dbToSchemaDelimiter + index.database;
					indexes[key].columns = index.columns.split(",");
				}

				resolve(indexes);
			}));
		}

		return (await Promise.all(promises)).flat(1);
	}

	async dropDatabase(name) {
		name = name.split(this.dbToSchemaDelimiter)[0];

		await this.connection.end();
		delete this.connection;
		this.dbPool = {};

		bash.runBash(`trap \`psql ${this.makeUri()} -c 'DROP DATABASE ${this.nameDel + name + this.nameDel} WITH (FORCE)'\` ERR`);
		await new Promise(resolve => setTimeout(resolve, 1000));

		return {};
	}

	getDbs() {
		return this.runCommand("SELECT * FROM pg_database WHERE datistemplate = false");
	}

	async getDatabases() {
		const dbs = await this.getDbs();
		const struct = {};
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				const [schemas, columns, tables] = await Promise.all([
					this.runCommand("SELECT * FROM information_schema.schemata", db.datname),
					this.runCommand("SELECT c.table_schema, c.table_name, c.column_name, c.ordinal_position, c.column_default, c.is_nullable, c.data_type, e.data_type AS subtype, COL_DESCRIPTION( (c.table_schema || '.' || c.table_name)::regclass, c.ordinal_position ) AS column_comment FROM information_schema.columns AS c LEFT JOIN information_schema.element_types e ON ( ( c.table_catalog, c.table_schema, c.table_name, 'TABLE', c.dtd_identifier ) = ( e.object_catalog, e.object_schema, e.object_name, e.object_type, e.collection_type_identifier ) ) ORDER BY c.ordinal_position;", db.datname),
					this.runCommand("SELECT t.table_schema, t.table_name, t.table_type, pgd.description as comment FROM information_schema.tables t LEFT OUTER JOIN pg_catalog.pg_description pgd ON pgd.objoid = (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass AND pgd.objsubid = 0", db.datname)
				]);

				for (const schema of schemas) {
					const dbPath = `${db.datname + this.dbToSchemaDelimiter + schema.schema_name}`;
					struct[dbPath] = {
						name: dbPath,
						collation: db.datcollate,
						tables: {}
					};

					for (const row of columns) {
						if (row.table_schema !== schema.schema_name) {
							continue;
						}

						if (!struct[dbPath].tables[row.table_name]) {
							const table = tables.find(ta => ta.table_name === row.table_name && ta.table_schema === row.table_schema);

							struct[dbPath].tables[row.table_name] = {
								name: row.table_name,
								comment: row.comment,
								view: table.table_type !== "BASE TABLE",
								columns: []
							};
						}

						struct[dbPath].tables[row.table_name].columns.push({
							name: row.column_name,
							type: row.subtype ? `${row.subtype}[]` : row.data_type,
							nullable: row.is_nullable !== "NO",
							defaut: row.column_default,
							comment: row.column_comment
						});
					}
				}
				resolve();
			}));
		}

		await Promise.all(promises);
		return struct;
	}

	async nbChangment(command, database) {
		const res = await this.runCommand(command, database);
		return res.error ? res : res.rowCount;
	}

	async runCommand(command, database = false) {
		const start = Date.now();
		let schema, connection;
		let lgth = -1;

		if (database) {
			[database, schema] = database.split(this.dbToSchemaDelimiter);
			const co = await this.getConnectionOfDatabase(database);
			if (co.error) {
				return co;
			}
			connection = await co.connect();
		} else {
			connection = await this.connection.connect();
		}

		try {
			if (schema) {
				await connection.query(`SET search_path TO ${schema};`);
			}
			let res = await connection.query(command);
			res = res.command === "SELECT" ? res.rows : res;
			lgth = res.length;
			return res;
		} catch (e) {
			return {error: e.message + ". " + (e.hint || ""), position: e.position};
		} finally {
			bash.logCommand(command, (database || "") + (schema ? `,${schema}` : ""), Date.now() - start, this.port, lgth);
			connection.release();
		}
	}

	async establish(database = false) {
		try {
			const creds = {
				host: this.host,
				port: this.port,
				user: this.user,
				password: this.password,
				...this.params
			};
			if (database) {
				creds["database"] = database;
			}

			const pool = new Pool(creds);
			const connection = await pool.connect();
			connection.release();

			return pool;
		} catch (e) {
			return {error: e.message};
		}
	}
}
