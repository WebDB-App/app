import pg from "pg";
import SQL from "../shared/sql.js";
import {writeFileSync} from "fs";
import {URL} from "url";
import bash from "../shared/bash.js";

const {Pool} = pg;
const dirname = new URL(".", import.meta.url).pathname;

export default class Postgre extends SQL {

	commonUser = ["postgres", "postgre"];
	commonPass = ["postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast"];

	async scan() {
		return super.scan(this.host, 5430, 5440);
	}


	async sampleDatabase(name, limit) {
		const [database, schema] = name.split(this.dbToSchemaDelimiter);
		const getSample = async (table) => {
			return {
				structure: bash.runBash(`pg_dump ${this.makeUri(database)} -t '${schema}.${table}' --schema-only`),
				data: await this.runCommand(`SELECT * FROM ${table} LIMIT ${limit}`, name)
			};
		};

		const promises = [];
		const tables = await this.runCommand(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${schema}'`, database);
		for (const table of tables) {
			promises.push(getSample(table.table_name));
		}

		return await Promise.all(promises);
	}


	async dump(dbSchema, exportType, tables, includeData) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		const path = `${dirname}../front/dump/${database}.${exportType}`;
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${database}'`);

		if (exportType === "sql") {
			const cmd = `pg_dump ${this.makeUri(database)}`;
			const data = includeData ? "" : "-s -b";
			const dbOpts = tables.length === total[0].total ? "" : `${tables.map(table => `-t ${table}`).join(" ")}`;

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
		return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}${database ? "/" + database : ""}`;
	}

	async load(filePath, dbSchema) {
		const [database, schema] = dbSchema.split(this.dbToSchemaDelimiter);

		return bash.runBash(`psql ${this.makeUri(database)} < ${filePath}`);
	}

	async insert(db, table, datas) {
		const result = await super.insert(db, table, datas);

		//TODO
		return result.affectedRows;
	}

	async replaceTrigger(database, table, trigger) {
		return [];
	}

	async dropTrigger(database, name) {
		return await this.runCommand(`DROP TRIGGER ${name}'`, database);
	}

	async listTrigger(database, table) {
		return [];
	}

	async duplicateTable(database, old_table, new_name) {
		return await this.runCommand(`CREATE TABLE ${new_name} AS ${old_table};`, database);
	}

	async statsDatabase(name) {
		const database = name.split(this.dbToSchemaDelimiter)[0];
		return {
			data_length: (await this.runCommand(`SELECT pg_database_size('${database}') AS "data_length"`, database))[0].data_length,
			index_length: (await this.runCommand(`SELECT SUM(pg_indexes_size(relid)) as "index_length" FROM pg_catalog.pg_statio_user_tables`, database))[0].index_length
		};
	}

	async statsTable(database, table) {
		return (await this.runCommand(`SELECT pg_indexes_size (relid) AS "index_length", pg_table_size (relid) AS "data_length" FROM pg_catalog.pg_statio_user_tables WHERE relname = '${table}'`, database.split(this.dbToSchemaDelimiter)[0]))[0];
	}

	async getAvailableCollations() {
		return [];
		return await this.runCommand("SHOW COLLATION WHERE `Default` = 'Yes'");
	}

	async setCollation(database, collate) {
		return true;
	}

	async modifyColumn(database, table, old, column) {
		return await this.runCommand(`ALTER TABLE ${table} CHANGE ${old.name} ${this.columnToSQL(column)}`, database);
	}

	async getRelations() {
		/*
		select
    tc.table_name,
    tc.constraint_type,
    cu.column_name,
    cu.ordinal_position



    from
    information_schema.key_column_usage cu,
    information_schema.table_constraints tc



    where       cu.constraint_name = tc.constraint_name
    and         cu.table_name = tc.table_name



    and         tc.constraint_type = 'FOREIGN KEY'



    and         tc.table_catalog = 'test'
    and         tc.table_schema = 'public'
		 */
		return [];
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
				FROM pg_class t,
					pg_class i,
					pg_index ix,
					pg_attribute a,
					pg_namespace ns
				WHERE
					t.oid = ix.indrelid
					AND i.oid = ix.indexrelid
					AND a.attrelid = t.oid
					AND a.attnum = ANY (ix.indkey)
					AND i.relnamespace = ns.oid
					AND t.relkind = 'r'
				GROUP BY
					ns.nspname,
					t.relname,
					i.relname,
					i.reltuples,
					ix.indisunique,
					ix.indisprimary`, db.datname);

				for (const [key, index] of Object.entries(indexes)) {
					indexes[key].database = db.datname + this.dbToSchemaDelimiter + index.database;
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

		bash.runBash(`psql ${this.makeUri()} -c 'DROP DATABASE ${this.nameDel}${name}${this.nameDel} WITH (FORCE)'`);
		await new Promise(resolve => setTimeout(resolve, 1000));

		return {result: "Ok"};
	}

	getDbs() {
		return this.runCommand("SELECT * FROM pg_database WHERE datistemplate = false");
	}

	async getStructure() {
		const dbs = await this.getDbs();
		const struct = {};
		const promises = [];

		for (const db of dbs) {
			promises.push(new Promise(async resolve => {
				const [schemas, columns, tables] = await Promise.all([
					this.runCommand("SELECT * FROM information_schema.schemata", db.datname),
					this.runCommand("SELECT table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, data_type FROM information_schema.columns ORDER BY table_name, ordinal_position", db.datname),
					this.runCommand("SELECT table_schema, table_name, table_type FROM information_schema.tables", db.datname)
				]);

				for (const schema of schemas) {
					const dbPath = `${db.datname}${this.dbToSchemaDelimiter}${schema.schema_name}`;
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
								view: table.table_type !== "BASE TABLE",
								columns: []
							};
						}

						struct[dbPath].tables[row.table_name].columns.push({
							name: row.column_name,
							type: row.data_type,
							nullable: row.is_nullable !== "NO",
							//collation: row.COLLATION_NAME,
							//https://stackoverflow.com/questions/57924382/how-to-change-column-collation-postgresql
							defaut: row.column_default,
						});
					}
				}
				resolve();
			}));
		}

		await Promise.all(promises);
		return struct;
	}

	async runCommand(command, database = false) {
		const start = Date.now();
		let schema, connection;

		if (database) {
			[database, schema] = database.split(this.dbToSchemaDelimiter);
			connection = await (await this.getConnectionOfDatabase(database)).connect();
		} else {
			connection = await this.connection.connect();
		}

		try {
			if (schema) {
				await connection.query(`SET search_path TO ${schema};`);
			}
			const {rows} = await connection.query(command);
			return rows;
		} catch (e) {
			console.error(e);
			return {error: e.message};
		} finally {
			bash.logCommand(command, (database || "") + (schema ? `,${schema}` : ""), Date.now() - start, this.port);
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
