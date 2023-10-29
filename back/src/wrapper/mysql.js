const mysql = require("mysql2");
const SQL = require("../shared/sql.js");
const version = require("../shared/version.js");
const {writeFileSync} = require("fs");
const bash = require("../shared/bash.js");
const {join} = require("path");
const buffer = require("../shared/buffer");

module.exports = class MySQL extends SQL {

	nameDel = "`";
	commonUser = ["mysql", "maria", "mariadb"];
	commonPass = ["mysql", "my-secret-pw", "maria", "mariadb", "mypass"];
	systemDbs = ["information_schema", "mysql", "performance_schema", "sys"];

	async scan() {
		return super.scan(this.host, 3300, 3320);
	}

	async sampleDatabase(name, {count, tables}) {
		const getSample = async (table) => {
			let create = await this.runCommand(`SHOW CREATE TABLE \`${table}\``, name);
			create = create[0];

			if (create["Create View"]) {
				return {
					structure: create["Create View"],
					data: []
				};
			}
			return {
				structure: create["Create Table"],
				data: await this.runCommand(`SELECT * FROM \`${table}\` LIMIT ${count}`, name)
			};
		};

		const promises = [];
		for (const table of tables) {
			promises.push(getSample(table));
		}

		return await Promise.all(promises);
	}

	async dump(database, exportType = "sql", tables, includeData = true) {
		const path = join(__dirname, `../../static/dump/${database}.${exportType}`);
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${database}'`);

		if (exportType === "sql") {
			const cmd = `mysqldump --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' ${database} `;
			const data = includeData ? "" : "--no-data";
			const dbOpts = (tables === false || tables.length >= total[0].total) ? "" : ` ${tables.join(" ")}`;
			const cliOpts = "--column-statistics=0";

			const result = bash.runBash(`${cmd} ${cliOpts} ${dbOpts} ${data} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = buffer.loadData(await this.runCommand(`SELECT * FROM ${table}`, database));
			}

			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}

		return {path: `dump/${database}.${exportType}`};
	}

	async saveState(path, database) {
		return bash.runBash(`mysqldump --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' --column-statistics=0 --skip-extended-insert ${database} > ${path}`);
	}

	async load(filePath, database) {
		return bash.runBash(`mysql --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' ${database} < ${filePath}`);
	}

	async insert(db, table, datas) {
		for (const [key, data] of Object.entries(datas)) {
			for (const [index, da] of Object.entries(data)) {
				if (typeof da === "string") {
					datas[key][index] = `"${da}"`;
				}
			}
		}
		return super.insert(db, table, datas);
	}

	async modifyColumn(database, table, old, column) {
		return await this.runCommand(`ALTER TABLE \`${table}\` CHANGE \`${old.name}\` ${this.columnToSQL(column)}`, database);
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

	async getComplexes() {
		return [
			...(await this.runCommand("SELECT routine_name as name, routine_type as type, routine_schema as 'database' FROM information_schema.routines WHERE routine_schema != 'sys' ORDER BY routine_name;")),
			...(await this.runCommand("SELECT trigger_name as name, 'TRIGGER' as type, trigger_schema as 'database', EVENT_OBJECT_TABLE as 'table' FROM information_schema.triggers WHERE trigger_schema != 'sys'")),
			...(await this.runCommand("SELECT CONSTRAINT_SCHEMA as 'database', CONSTRAINT_NAME as name, 'CHECK' as type, TABLE_NAME as 'table' FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'CHECK' AND CONSTRAINT_SCHEMA != 'sys'"))
		];
	}

	async setCollation(database, collate) {
		const colls = await this.getAvailableCollations();
		const character = colls.find(coll => coll.Collation === collate).Charset;

		const r = await this.runCommand(`ALTER DATABASE \`${database}\` CHARACTER SET ${character} COLLATE ${collate};`);
		if (r.error) {
			return r;
		}

		const tables = await this.runCommand(`SELECT CONCAT("ALTER TABLE ", TABLE_SCHEMA, '.', TABLE_NAME, ' CONVERT TO CHARACTER SET ${character} COLLATE ${collate};') AS 'table'
				FROM INFORMATION_SCHEMA.TABLES
				WHERE TABLE_SCHEMA = '${database}'
				AND TABLE_TYPE = 'BASE TABLE';`);
		for (const table of tables) {
			await this.runCommand("SET FOREIGN_KEY_CHECKS = 0; " + table.table + " SET FOREIGN_KEY_CHECKS = 1;");
		}

		return true;
	}

	async getRelations() {
		return await this.runCommand(`
			SELECT
				key_column.CONSTRAINT_NAME AS name,
				key_column.TABLE_SCHEMA AS "database",
				key_column.TABLE_NAME AS table_source,
				key_column.COLUMN_NAME AS column_source,
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
		const indexes = await this.runCommand(`SELECT TABLE_SCHEMA AS 'database', TABLE_NAME AS 'table', INDEX_NAME AS 'name', GROUP_CONCAT(COLUMN_NAME) AS 'columns', CARDINALITY AS 'cardinality', NOT NON_UNIQUE as 'unique'
			FROM INFORMATION_SCHEMA.STATISTICS
			GROUP BY TABLE_SCHEMA, TABLE_NAME, INDEX_NAME, CARDINALITY, INDEX_TYPE, NON_UNIQUE, NULLABLE;`);

		return indexes.map(index => {
			index.unique = !!index.unique;
			index.columns = index.columns.split(",");
			index.primary = index.name === "PRIMARY";
			return index;
		});
	}

	async getDatabases(full) {
		const [dbs, tables, columns] = await Promise.all([
			this.runCommand("SELECT * FROM information_schema.schemata"),
			this.runCommand("SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES"),
			(full ? this.runCommand("SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, ORDINAL_POSITION FROM information_schema.COLUMNS ORDER BY ORDINAL_POSITION") : undefined)
		]);

		const struct = {};
		for (const db of dbs) {
			struct[db.SCHEMA_NAME] = {
				name: db.SCHEMA_NAME,
				collation: db.DEFAULT_COLLATION_NAME,
				tables: {}
			};

			for (const table of tables) {
				if (table.TABLE_SCHEMA !== db.SCHEMA_NAME) {
					continue;
				}
				struct[db.SCHEMA_NAME].tables[table.TABLE_NAME] = {
					name: table.TABLE_NAME,
					view: table.TABLE_TYPE !== "BASE TABLE",
					columns: []
				};
				if (!full) {
					continue;
				}

				for (const column of columns) {
					if (column.TABLE_SCHEMA !== db.SCHEMA_NAME ||
						column.TABLE_NAME !== table.TABLE_NAME) {
						continue;
					}

					column.EXTRA = column.EXTRA ? [column.EXTRA] : [];
					struct[column.TABLE_SCHEMA].tables[column.TABLE_NAME].columns.push({
						name: column.COLUMN_NAME,
						type: column.COLUMN_TYPE,
						size: column.CHARACTER_MAXIMUM_LENGTH,
						nullable: column.IS_NULLABLE !== "NO",
						defaut: column.COLUMN_DEFAULT,
						extra: column.EXTRA
					});
				}
			}
		}

		return struct;
	}

	async nbChangment(command, database) {
		const res = await this.runCommand(command, database);
		return res.error ? res : res.affectedRows;
	}

	async runCommand(command, database = false) {
		const cid = bash.startCommand(command, database, this.port);
		const connection = await this.connection.promise().getConnection();
		let lgth = -1;

		try {
			if (database) {
				await connection.query(`USE \`${database}\``);
			}
			const [res] = await connection.query(command);
			lgth = res.length;
			version.commandFinished(this, command, database);
			return res;
		} catch (e) {
			return this.foundErrorPos({error: e.sqlMessage}, command);
		} finally {
			bash.endCommand(cid, lgth);
			connection.release();
		}
	}

	foundErrorPos(error, command) {
		let message = error.error || "";
		error["position"] = -1;

		if (message.indexOf("'") >= 0) {
			message = message.substring(message.indexOf("'") + 1);
			message = message.substring(0, message.lastIndexOf("'"));

			const separators = ["\n", "\t", " ", ""];
			for (const start of separators) {
				for (const end of separators) {
					error.position = command.indexOf(start + message + end);
					if (error.position >= 0) {
						break;
					}
				}
				if (error.position >= 0) {
					break;
				}
			}
		}
		return error;
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
};
