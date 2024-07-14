import pg from "pg";
import SQL from "../shared/sql.js";
import {writeFileSync} from "fs";
import bash from "../shared/bash.js";
import {loadData} from "../shared/buffer.js";
import {join} from "path";
import version from "../shared/version.js";
import {URL} from "url";
import {sql_cleanQuery} from "../shared/helper.js";

pg.types.setTypeParser(1114, v => v);
pg.types.setTypeParser(1184, v => v);
pg.types.setTypeParser(1082, v => v);

const Pool = pg.Pool;
const dirname = new URL(".", import.meta.url).pathname;

export default class PostgreSQL extends SQL {

	commonUser = ["postgres", "postgre"];
	commonPass = ["postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast", "pg_temp"];

	escapeValue(value) {
		return pg.escapeLiteral(value);
	}

	escapeId(id) {
		return pg.escapeIdentifier(id);
	}

	async scan() {
		return super.scan(this.host, 5430, 5450);
	}

	async getViewCode(database, view) {
		const def = await this.runCommand(`SELECT pg_get_viewdef(${this.escapeValue(view)}, TRUE)`, database);

		return {
			code: `CREATE OR REPLACE VIEW ${this.escapeId(view)} AS
${def[0]["pg_get_viewdef"]}`
		};
	}

	async tableDDL(dbSchema, table) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		const res = await bash.runBash(`pg_dump ${this.makeUri(database)} -n ${schema} -t ${table} --schema-only`);
		if (res.error) {
			return res;
		}

		let definition = res.result.substring(res.result.indexOf("--\n\nCREATE ") + 4);
		definition = definition.replace(/^.* OWNER TO .*$/mg, "");
		definition = definition.replace(/^--.*$/mg, "");
		definition = definition.replace(/\n\s*\n/g, "\n");

		return {definition};
	}

	async sampleDatabase(name, {count, tables}) {
		const getSample = async (table) => {
			return {
				structure: (await this.tableDDL(name, table)).definition,
				data: await this.runCommand(`SELECT * FROM ${this.escapeId(table)} LIMIT ${count}`, name)
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
			const r = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} RENAME COLUMN ${this.escapeId(old.name)} TO ${this.escapeId(column.name)}`, database);
			if (r.error) {
				return r;
			}
		}
		if (old.type !== column.type) {
			let r = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ALTER COLUMN ${this.escapeId(column.name)} TYPE ${column.type}`, database);
			if (r.error) {
				const match = /"(USING .*)"/.exec(r.error);
				if (match?.length > 0) {
					r = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ALTER COLUMN ${this.escapeId(column.name)} TYPE ${column.type} ${match[1]}`, database);
				}
				if (r.error) {
					return r;
				}
			}
		}
		if (old.nullable !== column.nullable) {
			const r = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ALTER COLUMN ${this.escapeId(column.name)} ${column.nullable ? "DROP NOT NULL" : "SET NOT NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		if (old.defaut !== column.defaut) {
			if (column.defaut !== "" && !column.defaut.endsWith(")")
				&& !["'", "\"", "`"].find(quote => column.defaut.startsWith(quote))) {
				column.defaut = this.escapeValue(column.defaut);
			}

			const r = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ALTER COLUMN ${this.escapeId(column.name)} SET DEFAULT ${column.defaut || "NULL"}`, database);
			if (r.error) {
				return r;
			}
		}
		return {ok: true};
	}

	async dump(dbSchema, exportType = "sql", tables, options = "") {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		const path = join(dirname, `../../static/dump/${database}.${exportType}`);
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ${this.escapeValue(schema)}`, database);

		if (exportType === "sql") {
			const cmd = `pg_dump ${this.makeUri(database)}`;
			const dbOpts = (tables === false || tables.length.toString() === total[0].total) ? "" : `${tables.map(table => `-t '${table}'`).join(" ")}`;

			const result = await bash.runBash(`${cmd} ${dbOpts} ${options} -n ${schema} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = loadData(await this.runCommand(`SELECT * FROM ${table}`, dbSchema));
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
		return await bash.runBash(`pg_dump ${this.makeUri(database)} > ${join(path, database)}`);
	}

	makeUri(database = false) {
		return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}` + (database ? ("/" + database) : "");
	}

	async load(files, dbSchema) {
		const [database] = dbSchema.split(this.dbToSchemaDelimiter);

		for (const file of files) {
			const r = await bash.runBash(`psql ${this.makeUri(database)} < ${file.path}`);
			if (r.error) {
				return r;
			}
		}

		return {ok: true};
	}

	async process() {
		return await this.runCommand("SELECT pid, concat_ws(' : ', backend_type, query) as query, datname as db, ROUND( EXTRACT( epoch FROM NOW() - pg_stat_activity.query_start ) * 1000 ) AS duration FROM pg_stat_activity");
	}

	async kill(pid) {
		await this.runCommand(`SELECT pg_terminate_backend(${pid});`);
	}

	async variableSet(variable) {
		return await this.runCommand(`SET ${variable.name} = ${variable.value};`);
	}

	async variableList() {
		const list = await this.runCommand("SHOW ALL");
		return list.rows.map(l => {
			return {
				name: l.name,
				link: `https://postgresqlco.nf/doc/en/param/${l.name}/`,
				value: l.setting,
				description: l.description
			};
		});
	}

	async serverStats() {
		const stats = (await this.runCommand("SELECT SUM(xact_commit) as xact_commit, SUM(blks_read) as blks_read, SUM(tup_returned) as tup_returned, SUM(tup_fetched) as tup_fetched, SUM(tup_inserted) as tup_inserted, SUM(tup_updated) as tup_updated, SUM(tup_deleted) as tup_deleted FROM pg_stat_database;"))[0];
		const sessions = await this.runCommand("SELECT state FROM pg_stat_activity;");
		return [
			{Variable_name: "Block read", "Value": stats.blks_read},
			{Variable_name: "Session active", "Value": sessions.filter(s => s.state === "active").length},
			{Variable_name: "Session idle", "Value": sessions.filter(s => s.state === "idle").length},
			{Variable_name: "Session total", "Value": sessions.length},
			{Variable_name: "Transactions", "Value": stats.xact_commit},
			{Variable_name: "Tupl fetch", "Value": stats.tup_fetched},
			{Variable_name: "Tupl return", "Value": stats.tup_returned},
			{Variable_name: "Tupl insert", "Value": stats.tup_inserted},
			{Variable_name: "Tupl update", "Value": stats.tup_updated},
			{Variable_name: "Tupl delete", "Value": stats.tup_deleted},
		];
	}

	async getComplexes() {
		const promises = [];
		const complexes = {
			"CHECK": [],
			"CUSTOM_TYPE": [],
			"DOMAIN": [],
			"ENUM": [],
			"FUNCTION": [],
			"MATERIALIZED_VIEW": [],
			"PROCEDURE": [],
			"SEQUENCE": [],
			"TRIGGER": [],
		};

		for (const db of await this.getDbs()) {
			promises.push(new Promise(async resolve => {
				const routines = await this.runCommand("SELECT routine_name as name, routine_type as type, routine_schema as schema, routine_definition as value FROM information_schema.routines WHERE routine_schema NOT IN ('pg_catalog', 'information_schema') AND routine_type IS NOT NULL ORDER BY routine_name;", db.datname);
				const tmp = {};
				tmp.CHECK = await this.runCommand("SELECT constraint_name AS name, ccu.table_schema AS schema, table_name as table, column_name as column, pg_get_constraintdef(pgc.oid) as value FROM pg_constraint pgc JOIN pg_namespace nsp ON nsp.oid = pgc.connamespace JOIN pg_class cls ON pgc.conrelid = cls.oid LEFT JOIN information_schema.constraint_column_usage ccu ON pgc.conname = ccu.constraint_name AND nsp.nspname = ccu.constraint_schema WHERE contype = 'c' ORDER BY pgc.conname", db.datname);
				tmp.CUSTOM_TYPE = await this.runCommand("SELECT user_defined_type_schema AS schema, user_defined_type_name AS name FROM information_schema.user_defined_types", db.datname);
				tmp.ENUM = await this.runCommand("SELECT t.typname AS name, string_agg(e.enumlabel, ', ') AS value, nspname AS schema FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace GROUP BY schema, name;", db.datname);
				tmp.FUNCTION = routines.filter(routine => routine.type.toLowerCase() === "function");
				tmp.MATERIALIZED_VIEW = await this.runCommand("SELECT schemaname AS SCHEMA, matviewname AS name, definition AS VALUE FROM pg_matviews", db.datname);
				tmp.PROCEDURE = routines.filter(routine => routine.type.toLowerCase() === "procedure");
				tmp.SEQUENCE = await this.runCommand("SELECT sequence_schema AS SCHEMA, sequence_name AS name, ' AS ' || data_type || '\n MINVALUE ' || minimum_value || '\n MAXVALUE ' || maximum_value || '\n START WITH ' || start_value || '\n INCREMENT BY ' || INCREMENT AS value FROM information_schema.sequences;", db.datname);
				tmp.TRIGGER = await this.runCommand("SELECT trigger_name as name, trigger_schema as schema, event_object_table as table, action_statement as value FROM information_schema.triggers", db.datname);
				tmp.DOMAIN = [];

				const domains = await this.runCommand("SELECT n.nspname AS SCHEMA, t.typname AS name, pg_catalog.format_type (t.typbasetype, t.typtypmod) AS underlying_type, t.typnotnull AS not_null, ( SELECT c.collname FROM pg_catalog.pg_collation c, pg_catalog.pg_type bt WHERE c.oid = t.typcollation AND bt.oid = t.typbasetype AND t.typcollation <> bt.typcollation ) AS COLLATION, t.typdefault AS DEFAULT, pg_catalog.array_to_string ( ARRAY( SELECT pg_catalog.pg_get_constraintdef (r.oid, TRUE) FROM pg_catalog.pg_constraint r WHERE t.oid = r.contypid ), ' ' ) AS check_constraints FROM pg_catalog.pg_type t LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace WHERE t.typtype = 'd' AND n.nspname <> 'pg_catalog' AND n.nspname <> 'information_chema' AND pg_catalog.pg_type_is_visible (t.oid)", db.datname);
				domains.map(domain => {
					let value = domain.underlying_type;
					value += domain.not_null === "true" ? " NOT NULL " : "";
					value += domain.default ? " DEFAULT " + domain.default + "" : "";
					value += " " + domain.check_constraints;

					tmp.DOMAIN.push({
						name: domain.name,
						schema: domain.schema,
						value
					});
				});
				for (const [type, list] of Object.entries(tmp)) {
					complexes[type] = complexes[type].concat(list.map(complex => {
						complex.database = db.datname + this.dbToSchemaDelimiter + complex.schema;
						return complex;
					}));
				}
				resolve();
			}));
		}
		await Promise.all(promises);
		return complexes;
	}

	async dropComplex(complex, type, database) {
		if (type === "SEQUENCE") {
			return await this.runCommand(`DROP SEQUENCE ${this.escapeId(complex.name)}`, database);
		}
		if (type === "MATERIALIZED_VIEW") {
			return await this.runCommand(`DROP MATERIALIZED VIEW ${this.escapeId(complex.name)}`, database);
		}
		if (type === "ENUM" || type === "CUSTOM_TYPE") {
			return await this.runCommand(`DROP TYPE ${this.escapeId(complex.name)}`, database);
		}
		if (type === "DOMAIN") {
			return await this.runCommand(`DROP DOMAIN ${this.escapeId(complex.name)}`, database);
		}

		return super.dropComplex(complex, type, database);
	}

	async update(db, table, old_data, new_data) {
		const transform = (row) => {
			for (const [index, obj] of Object.entries(row)) {
				if (Array.isArray(obj)) {
					row[index] = `{${JSON.stringify(obj).slice(1, -1)}}`;
				}
			}
			return row;
		};
		return await super.update(db, table, transform(old_data), transform(new_data));
	}

	async insert(db, table, datas) {
		datas = datas.map(row => {
			for (const [index, obj] of Object.entries(row)) {
				if (Array.isArray(obj)) {
					row[index] = `'{${JSON.stringify(obj).slice(1, -1)}}'`;
				}
				if (typeof obj === "string") {
					row[index] = this.escapeValue(obj);
				}
			}
			return row;
		});
		return await super.insert(db, table, datas);
	}

	async duplicateTable(database, old_table, new_name) {
		return await this.runCommand(`CREATE TABLE ${this.escapeId(new_name)} AS SELECT * FROM ${this.escapeId(old_table)};`, database);
	}

	async statsDatabase(name) {
		const database = name.split(this.dbToSchemaDelimiter)[0];
		const data_length = (await this.runCommand(`SELECT pg_database_size('${database}') AS "data_length"`, database))[0].data_length;
		const index_length = (await this.runCommand("SELECT SUM(pg_indexes_size(relid)) as \"index_length\" FROM pg_catalog.pg_statio_user_tables", database))[0].index_length;

		return {data_length, index_length};
	}

	async statsTable(database, table) {
		return (await this.runCommand(`SELECT pg_indexes_size (relid) AS "index_length", pg_table_size (relid) AS "data_length" FROM pg_catalog.pg_statio_user_tables WHERE relname = ${this.escapeValue(table)}`, database.split(this.dbToSchemaDelimiter)[0]))[0];
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

	async dropDatabase(name, associated = false) {
		const schema = name.split(this.dbToSchemaDelimiter)[1];

		await this.runCommand(`DROP SCHEMA ${this.escapeId(schema)} CASCADE`);
		await this.runCommand(`CREATE SCHEMA ${this.escapeId(schema)}`);

		if (associated) {
			version.deleteDatabase(this, name.split(this.dbToSchemaDelimiter)[0]);
		}
		return {ok: true};
	}

	getDbs() {
		return this.runCommand("SELECT * FROM pg_database WHERE datistemplate = false");
	}

	async getStructure(full) {
		const dbs = await this.getDbs();
		const struct = {};
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				let [schemas, tables, columns] = await Promise.all([
					this.runCommand("SELECT * FROM information_schema.schemata", db.datname),
					this.runCommand("SELECT table_schema, table_name, table_type FROM information_schema.tables", db.datname),
					(full ? this.runCommand("SELECT table_schema, table_name, column_name, character_maximum_length, ordinal_position, column_default, is_nullable, udt_name, data_type FROM information_schema.columns ORDER BY ordinal_position", db.datname) : undefined)
				]);

				if (!Array.isArray(schemas)) {
					console.error(`Problem retrieving schemas of ${db.datname}`);
					return resolve();
				}

				for (const schema of schemas) {
					const dbPath = `${db.datname + this.dbToSchemaDelimiter + schema.schema_name}`;
					struct[dbPath] = {
						name: dbPath,
						collation: db.datcollate,
						tables: {}
					};

					if (!Array.isArray(tables)) {
						console.error(`Problem retrieving tables of ${dbPath}`);
						continue;
					}

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

						if (!Array.isArray(columns)) {
							console.error(`Problem retrieving columns of ${table.table_name}`);
							continue;
						}

						for (const column of columns) {
							if (column.table_schema !== schema.schema_name ||
								column.table_name !== table.table_name) {
								continue;
							}

							if (column.data_type === "ARRAY") {
								if (column.udt_name.startsWith("_")) {
									column.data_type = column.udt_name.slice(1) + "[]";
								} else {
									column.data_type = column.udt_name;
								}
							} else if (column.data_type === "USER-DEFINED") {
								column.data_type = column.udt_name;
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
			try {
				connection = await co.connect();
			} catch (e) {
				console.table(co);
			}
		} else {
			try {
				connection = await this.connection.connect();
			} catch (e) {
				console.table(this.connection);
			}
		}

		const cid = bash.startCommand(sql_cleanQuery(command), (database || "") + (schema ? `,${schema}` : ""), this.port);
		try {
			if (schema) {
				await connection.query(`SET search_path TO ${this.escapeId(schema)};`);
			}
			let res = await connection.query(command);
			res = res.command === "SELECT" ? res.rows : res;
			lgth = res.length;
			version.commandFinished(this, sql_cleanQuery(command), database);
			return res;
		} catch (e) {
			return {error: e.message + ". " + (e.hint || ""), position: e.position};
		} finally {
			bash.endCommand(cid, lgth);
			connection.release();
		}
	}

	async getVersionInfo() {
		//const version = (await this.variableList()).find(variable => variable.name === "version_comment");
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
			return {error: e.message || "Unknown error"};
		}
	}
}
