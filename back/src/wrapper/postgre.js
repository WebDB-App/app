const {Pool} = require("pg");
const SQL = require("../shared/sql.js");
const {writeFileSync} = require("fs");
const bash = require("../shared/bash.js");
const buffer = require("../shared/buffer");
const {join} = require("path");
const version = require("../shared/version");

module.exports = class PostgreSQL extends SQL {

	commonUser = ["postgres", "postgre"];
	commonPass = ["postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast"];

	async scan() {
		return super.scan(this.host, 5430, 5450);
	}

	async sampleDatabase(name, {count, tables}) {
		const [database, schema] = name.split(this.dbToSchemaDelimiter);
		const getSample = async (table) => {
			return {
				structure: (bash.runBash(`pg_dump ${this.makeUri(database)} -t '${schema}.${table}' --schema-only`)).result,
				data: await this.runCommand(`SELECT * FROM ${this.nameDel + table + this.nameDel} LIMIT ${count}`, name)
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
			const r = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} RENAME COLUMN ${this.nameDel + old.name + this.nameDel} TO ${this.nameDel + column.name + this.nameDel}`, database);
			if (r.error) {
				return r;
			}
		}
		if (old.type !== column.type) {
			let r = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} ALTER COLUMN ${this.nameDel + column.name + this.nameDel} TYPE ${this.nameDel + column.type + this.nameDel}`, database);
			if (r.error) {
				const match = /"(USING .*)"/.exec(r.error);
				if (match?.length > 0) {
					r = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} ALTER COLUMN ${this.nameDel + column.name + this.nameDel} TYPE ${this.nameDel + column.type + this.nameDel} ${match[1]}`, database);
				}
				if (r.error) {
					return r;
				}
			}
		}
		if (old.nullable !== column.nullable) {
			const r = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} ALTER COLUMN ${this.nameDel + column.name + this.nameDel} ${column.nullable ? "DROP NOT NULL" : "SET NOT NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		if (old.defaut !== column.defaut) {
			const r = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} ALTER COLUMN ${this.nameDel + column.name + this.nameDel} SET DEFAULT ${column.defaut || "NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		return {ok: true};
	}

	async dump(dbSchema, exportType = "sql", tables, includeData = true) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		const path = join(__dirname, `../../static/dump/${database}.${exportType}`);
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${schema}'`, database);

		if (exportType === "sql") {
			const cmd = `pg_dump ${this.makeUri(database)}`;
			const data = includeData ? "" : "-s -b";
			const dbOpts = (tables === false || tables.length.toString() === total[0].total) ? "" : `${tables.map(table => `-t '${table}'`).join(" ")}`;

			const result = bash.runBash(`${cmd} ${dbOpts} -n ${schema} ${data} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = buffer.loadData(await this.runCommand(`SELECT * FROM ${table}`, dbSchema));
			}

			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}

		return {path: `dump/${database}.${exportType}`};
	}

	async saveState(path, dbSchema) {
		const [database] = dbSchema.split(this.dbToSchemaDelimiter);
		return bash.runBash(`pg_dump ${this.makeUri(database)} > ${path}`);
	}

	makeUri(database = false) {
		return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}` + (database ? ("/" + database) : "");
	}

	async load(filePath, dbSchema) {
		const [database] = dbSchema.split(this.dbToSchemaDelimiter);
		return bash.runBash(`psql ${this.makeUri(database)} < ${filePath}`);
	}

	async process() {
		return await this.runCommand("SELECT pid, query, ROUND( EXTRACT( epoch FROM NOW() - pg_stat_activity.query_start ) * 1000 ) AS duration FROM pg_stat_activity");
	}

	async kill(pid) {
		await this.runCommand(`SELECT pg_terminate_backend(${pid});`);
	}

	async serverStats() {
		return {error: "Statistics unavailable for PostgreSQL"};
	}

	async getComplexes() {
		const promises = [];

		for (const db of await this.getDbs()) {
			promises.push(new Promise(async resolve => {
				const complexes = [
					...(await this.runCommand("SELECT routine_name as name, routine_type as type, routine_schema as database FROM information_schema.routines WHERE routine_schema NOT IN ('pg_catalog', 'information_schema') ORDER BY routine_name;", db.datname)),
					...(await this.runCommand("SELECT trigger_name as name, 'TRIGGER' as type, trigger_schema as database, event_object_table as table FROM information_schema.triggers", db.datname)),
					...(await this.runCommand("SELECT constraint_name AS name, 'CHECK' as type, ccu.table_schema AS database, table_name as table FROM pg_constraint pgc JOIN pg_namespace nsp ON nsp.oid = pgc.connamespace JOIN pg_class cls ON pgc.conrelid = cls.oid LEFT JOIN information_schema.constraint_column_usage ccu ON pgc.conname = ccu.constraint_name AND nsp.nspname = ccu.constraint_schema WHERE contype = 'c' ORDER BY pgc.conname", db.datname))
				];
				for (let comp of await this.runCommand("SELECT t.typname AS name, typtype as type, nspname as database FROM pg_type t LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace WHERE ( t.typrelid = 0 OR ( SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid ) ) AND NOT EXISTS ( SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid ) AND n.nspname NOT IN ('pg_catalog', 'information_schema')", db.datname)) {
					if (comp.type === "c") {
						comp.type = "CUSTOM_TYPE";
					} else if (comp.type === "d") {
						comp.type = "DOMAIN";
					} else if (comp.type === "r") {
						comp.type = "SEQUENCE";
					} else {
						comp.type = "ENUM";
					}
					complexes.push(comp);
				}
				resolve(complexes.map(complex => {
					complex.database = db.datname + this.dbToSchemaDelimiter + complex.database;
					return complex;
				}));
			}));
		}
		return (await Promise.all(promises)).flat(1);
	}

	async insert(db, table, datas) {
		datas = datas.map(row => {
			for (const [index, obj] of Object.entries(row)) {
				if (Array.isArray(obj)) {
					row[index] = `'{${JSON.stringify(obj).slice(1, -1)}}'`;
				}
				if (typeof obj === "string") {
					row[index] = `'${obj}'`;
				}
			}
			return row;
		});
		return await super.insert(db, table, datas);
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
		console.error("Feature not yet available", database, collate);
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

		let error = "PostgreSQL database deletion is not supported with WebDB.\n";
		error += "First, close all connection to this database, so restart WebDB and other possibly connected app\n";
		error += "Finally, run: \n";
		error += `# psql ${this.makeUri()} -c 'DROP DATABASE ${this.nameDel + name + this.nameDel}'`;
		return {error};
	}

	getDbs() {
		return this.runCommand("SELECT * FROM pg_database WHERE datistemplate = false");
	}

	async getDatabases(full) {
		const dbs = await this.getDbs();
		const struct = {};
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				let [schemas, tables, columns] = await Promise.all([
					this.runCommand("SELECT * FROM information_schema.schemata", db.datname),
					this.runCommand("SELECT table_schema, table_name, table_type FROM information_schema.tables", db.datname),
					(full ? this.runCommand("SELECT table_schema, table_name, column_name, character_maximum_length, ordinal_position, column_default, is_nullable, udt_name::regtype as data_type FROM information_schema.columns ORDER BY ordinal_position", db.datname) : undefined)
				]);

				if (!Array.isArray(schemas)) {
					console.error(`Can't read schemas of ${db.datname}`);
					return resolve();
				}

				for (const schema of schemas) {
					const dbPath = `${db.datname + this.dbToSchemaDelimiter + schema.schema_name}`;
					struct[dbPath] = {
						name: dbPath,
						collation: db.datcollate,
						tables: {}
					};

					for (const table of tables) {
						if (table.table_schema !== schema.schema_name) {
							continue;
						}
						struct[dbPath].tables[table.table_name] = {
							name: table.table_name,
							view: table.table_type !== "BASE TABLE",
							columns: []
						};
						if (!full) {
							continue;
						}

						for (const column of columns) {
							if (column.table_schema !== schema.schema_name ||
								column.table_name !== table.table_name) {
								continue;
							}

							if (Number.isInteger(column.character_maximum_length)) {
								column.data_type += `(${column.character_maximum_length})`;
							}

							struct[dbPath].tables[column.table_name].columns.push({
								name: column.column_name,
								type: column.data_type,
								nullable: column.is_nullable !== "NO",
								defaut: column.column_default,
							});
						}
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

		const cid = bash.startCommand(command, (database || "") + (schema ? `,${schema}` : ""), this.port);
		try {
			if (schema) {
				await connection.query(`SET search_path TO ${schema};`);
			}
			let res = await connection.query(command);
			res = res.command === "SELECT" ? res.rows : res;
			lgth = res.length;
			version.commandFinished(this, command, database);
			return res;
		} catch (e) {
			return {error: e.message + ". " + (e.hint || ""), position: e.position};
		} finally {
			bash.endCommand(cid, lgth);
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
				database: database || "postgres",
				...this.params
			};

			const pool = new Pool(creds);
			const connection = await pool.connect();
			connection.release();

			return pool;
		} catch (e) {
			return {error: e.message};
		}
	}
};
