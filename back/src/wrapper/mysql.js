import mysql from "mysql2";
import SQL from "../shared/sql.js";
import {writeFileSync} from "fs";
import bash from "../shared/bash.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

export default class MySQL extends SQL {

	nameDel = "\`";
	commonUser = ["mysql", "maria", "mariadb"];
	commonPass = ["mysql", "my-secret-pw", "maria", "mariadb", "mypass"];
	systemDbs = ["information_schema", "mysql", "performance_schema", "sys"];

	async scan() {
		return super.scan(this.host, 3300, 3310);
	}

	async sampleDatabase(name, limit) {
		const getSample = async (table) => {
			const create = await this.runCommand(`SHOW CREATE TABLE \`${table}\``, name);
			return {
				structure: create[0]["Create Table"],
				data: await this.runCommand(`SELECT * FROM \`${table}\` LIMIT ${limit}`, name)
			};
		};

		const promises = [];
		const tables = await this.runCommand("SHOW TABLES", name);
		for (const table of tables) {
			promises.push(getSample(table[Object.keys(table)[0]]));
		}

		return await Promise.all(promises);
	}

	async dump(database, exportType, tables, includeData) {
		const path = `${dirname}../front/dump/${database}.${exportType}`;
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${database}'`);

		if (exportType === "sql") {
			const cmd = `mysqldump --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}'`;
			const data = includeData ? "" : "--no-data";
			const dbOpts = tables.length === total[0].total ? `-B ${database}` : `${database} ${tables.join(" ")}`;
			const cliOpts = "--column-statistics=0";

			const result = bash.runBash(`${cmd} ${cliOpts} ${dbOpts} ${data} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = await this.runCommand(`SELECT * FROM ${table}`, database);
			}

			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}

		return {path: `dump/${database}.${exportType}`};
	}

	async load(filePath) {
		return bash.runBash(`mysql --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' < ${filePath}`);
	}

	async insert(db, table, datas) {
		const result = await super.insert(db, table, datas);

		return result.affectedRows;
	}

	async replaceTrigger(database, table, trigger) {
		return await this.runCommand(`CREATE OR REPLACE TRIGGER ${trigger.name} ${trigger.timing} ${trigger.event} ON ${table} ${trigger.code}`, database);
	}

	async dropTrigger(database, name) {
		return await this.runCommand(`DROP TRIGGER ${name}`, database);
	}

	async listTrigger(database, table) {
		const triggers = await this.runCommand(`SHOW TRIGGERS WHERE \`Table\` = '${table}'`, database);
		return triggers.map(trigger => {
			return {
				code: "FOR EACH ROW " + trigger.Statement,
				timing: trigger.Timing,
				event: trigger.Event,
				name: trigger.Trigger
			};
		});
	}

	async duplicateTable(database, old_table, new_name) {
		return await this.runCommand(`CREATE TABLE \`${new_name}\` LIKE \`${old_table}\`;
			INSERT INTO \`${new_name}\` SELECT * FROM \`${old_table}\`;`,
		database);
	}

	async createDatabase(name) {
		return await this.runCommand(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
	}

	async statsDatabase(name) {
		return (await this.runCommand(`SELECT SUM(data_length) AS "data_length", SUM(index_length) AS "index_length" FROM information_schema.TABLES WHERE table_schema = "${name}"`))[0];
	}

	async statsTable(database, table) {
		return (await this.runCommand(`SELECT SUM(data_length) AS "data_length", SUM(index_length) AS "index_length" FROM information_schema.TABLES WHERE table_schema = "${database}" AND table_name = "${table}"`))[0];
	}

	async getAvailableCollations() {
		return await this.runCommand("SHOW COLLATION WHERE `Default` = 'Yes'");
	}

	async setCollation(database, collate) {
		const colls = await this.getAvailableCollations();
		const character = colls.find(coll => coll.Collation === collate).Charset;

		await this.runCommand(`ALTER DATABASE \`${database}\` CHARACTER SET ${character} COLLATE ${collate};`);

		const tables = await this.runCommand(`SELECT CONCAT("ALTER TABLE ", TABLE_SCHEMA, '.', TABLE_NAME, ' CONVERT TO CHARACTER SET ${character} COLLATE ${collate};') AS 'table'
				FROM INFORMATION_SCHEMA.TABLES
				WHERE TABLE_SCHEMA = '${database}'
				AND TABLE_TYPE = 'BASE TABLE';`);
		for (const table of tables) {
			await this.runCommand("SET FOREIGN_KEY_CHECKS = 0; " + table.table + " SET FOREIGN_KEY_CHECKS = 1;");
		}

		return true;
	}

	async modifyColumn(database, table, old, column) {
		return await this.runCommand(`ALTER TABLE \`${table}\` CHANGE \`${old.name}\` ${this.columnToSQL(column)}`, database);
	}

	async getRelations() {
		return await this.runCommand(`
			SELECT
				key_column.CONSTRAINT_NAME AS name,
				key_column.TABLE_SCHEMA AS database_source,
				key_column.TABLE_NAME AS table_source,
				key_column.COLUMN_NAME AS column_source,
				key_column.REFERENCED_TABLE_SCHEMA AS database_dest,
				key_column.REFERENCED_TABLE_NAME AS table_dest,
				key_column.REFERENCED_COLUMN_NAME AS column_dest,
				UPDATE_RULE AS update_rule,
				DELETE_RULE AS delete_rule
			FROM information_schema.KEY_COLUMN_USAGE key_column
			INNER JOIN information_schema.REFERENTIAL_CONSTRAINTS ON information_schema.REFERENTIAL_CONSTRAINTS.CONSTRAINT_NAME = key_column.CONSTRAINT_NAME
			WHERE
				key_column.REFERENCED_TABLE_NAME IS NOT NULL;`);
	}

	async addIndex(database, table, name, type, columns) {
		if (type === "PRIMARY") {
			return await this.runCommand(`ALTER TABLE \`${table}\` ADD PRIMARY KEY (${columns.map(c => `\`${c}\``).join(",")})`, database);
		} else if (type === "INDEX") {
			return await this.runCommand(`CREATE INDEX \`${name}\` ON  \`${table}\` (${columns.map(c => `\`${c}\``).join(",")})`, database);
		} else if (type === "UNIQUE") {
			return await this.runCommand(`CREATE UNIQUE INDEX \`${name}\` ON  \`${table}\` (${columns.map(c => `\`${c}\``).join(",")})`, database);
		}
	}

	async dropIndex(database, table, name) {
		if (name === "PRIMARY") {
			return await this.runCommand(`ALTER TABLE \`${table}\` DROP PRIMARY KEY;`, database);
		} else {
			return await this.runCommand(`DROP INDEX \`${name}\` ON \`${table}\``, database);
		}
	}

	async getIndexes() {
		const indexes = await this.runCommand(`SELECT TABLE_SCHEMA AS 'database', TABLE_NAME AS 'table', INDEX_NAME AS 'name', GROUP_CONCAT(COLUMN_NAME) AS 'columns', CARDINALITY AS 'cardinality', INDEX_TYPE AS 'type', NOT NON_UNIQUE as 'unique'
			FROM INFORMATION_SCHEMA.STATISTICS
			GROUP BY TABLE_SCHEMA, TABLE_NAME, INDEX_NAME, CARDINALITY, INDEX_TYPE, NON_UNIQUE, NULLABLE;`);

		return indexes.map(index => {
			index.unique = !!index.unique;
			return index;
		});
	}

	async getStructure() {
		const [dbs, columns, tables] = await Promise.all([
			this.runCommand("SELECT * FROM information_schema.schemata ORDER BY SCHEMA_NAME"),
			this.runCommand("SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLLATION_NAME, COLUMN_DEFAULT, EXTRA, ORDINAL_POSITION FROM information_schema.COLUMNS ORDER BY TABLE_NAME, ORDINAL_POSITION"),
			this.runCommand("SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES")
		]);

		const struct = {};
		for (const db of dbs) {
			struct[db.SCHEMA_NAME] = {
				name: db.SCHEMA_NAME,
				collation: db.DEFAULT_COLLATION_NAME,
				tables: {}
			};
		}

		for (const row of columns) {
			if (!struct[row.TABLE_SCHEMA].tables[row.TABLE_NAME]) {
				const table = tables.find(ta => ta.TABLE_NAME === row.TABLE_NAME && ta.TABLE_SCHEMA === row.TABLE_SCHEMA);

				struct[row.TABLE_SCHEMA].tables[row.TABLE_NAME] = {
					name: row.TABLE_NAME,
					view: table.TABLE_TYPE !== "BASE TABLE",
					columns: []
				};
			}

			row.EXTRA = row.EXTRA ? [row.EXTRA] : [];

			struct[row.TABLE_SCHEMA].tables[row.TABLE_NAME].columns.push({
				name: row.COLUMN_NAME,
				type: row.COLUMN_TYPE,
				nullable: row.IS_NULLABLE !== "NO",
				collation: row.COLLATION_NAME,
				defaut: row.COLUMN_DEFAULT,
				extra: row.EXTRA,
				ordinal: row.ORDINAL_POSITION,
			});
		}

		return struct;
	}

	async runCommand(command, database = false) {
		const connection = await this.connection.promise().getConnection();
		const start = Date.now();

		try {
			if (database) {
				await connection.query(`USE \`${database}\``);
			}
			const [rows] = await connection.query(command);
			return rows;
		} catch (e) {
			console.error(e);
			return {error: e.sqlMessage};
		} finally {
			bash.logCommand(command, database, Date.now() - start, this.port);
			connection.release();
		}
	}

	async establish() {
		try {
			const pool = mysql.createPool({
				host: this.host,
				port: this.port,
				user: this.user,
				password: this.password,
				...this.params
			});

			const connection = await pool.promise().getConnection();
			connection.release();

			return pool;
		} catch (e) {
			return {error: e.sqlMessage || e.message};
		}
	}
}
