import mysql from "mysql2";
import SQL from "../shared/sql.js";
import version from "../shared/version.js";
import {writeFileSync} from "fs";
import bash from "../shared/bash.js";
import {join} from "path";
import {loadData} from "../shared/buffer.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

export default class MySQL extends SQL {

	commonUser = ["mysql", "maria", "mariadb"];
	commonPass = ["mysql", "my-secret-pw", "maria", "mariadb", "mypass"];
	systemDbs = ["information_schema", "mysql", "performance_schema", "sys"];

	escapeValue(value) {
		return mysql.escape(value);
	}

	escapeId(id) {
		return mysql.escapeId(id);
	}

	async scan() {
		return super.scan(this.host, 3300, 3320);
	}

	async getViewCode(database, view) {
		const def = await this.runCommand(`SELECT view_definition FROM information_schema.views WHERE table_schema = ${this.escapeValue(database)} AND table_name = ${this.escapeValue(view)};`);
		if (def.length < 1) {
			return {error: "View definition is not available"};
		}

		return {
			code: `ALTER VIEW ${this.escapeId(view)} AS
${def[0]["VIEW_DEFINITION"]}`
		};
	}

	async sampleDatabase(name, {count, tables}) {
		const getSample = async (table) => {
			let create = await this.runCommand(`SHOW CREATE TABLE ${this.escapeId(table)}`, name);
			create = create[0];

			if (create && create["Create View"]) {
				return {
					structure: create["Create View"],
					data: []
				};
			}
			return {
				structure: create["Create Table"],
				data: await this.runCommand(`SELECT * FROM ${this.escapeId(table)} LIMIT ${count}`, name)
			};
		};

		const promises = [];
		for (const table of tables) {
			promises.push(getSample(table));
		}

		return await Promise.all(promises);
	}

	async dump(database, exportType = "sql", tables, options = "") {
		const path = join(dirname, `../../static/dump/${database}.${exportType}`);
		const total = await this.runCommand(`SELECT COUNT(DISTINCT TABLE_NAME) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ${this.escapeValue(database)}`);

		if (exportType === "sql") {
			const cmd = `mysqldump --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' ${database} `;
			const dbOpts = (tables === false || tables.length >= total[0].total) ? "" : ` ${tables.join(" ")}`;

			const result = bash.runBash(`${cmd} ${dbOpts} ${options} > ${path}`);
			if (result.error) {
				return result;
			}
		}
		if (exportType === "json") {
			const results = {};
			for (const table of tables) {
				results[table] = loadData(await this.runCommand(`SELECT * FROM ${table}`, database));
			}

			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}

		return {path: `dump/${database}.${exportType}`};
	}

	async saveState(path, database) {
		return bash.runBash(`mysqldump --single-transaction --skip-comments --extended-insert --net-buffer-length=100000000 --routines --events --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' ${database} | sed 's$VALUES ($VALUES\\n($g' | sed 's$),($),\\n($g' > ${join(path, database)}`);
	}

	async load(files, database) {
		for (const file of files) {
			bash.runBash(`mysql --user='${this.user}' --port=${this.port} --password='${this.password}' --host='${this.host}' ${database} < ${file.path}`);
		}
		return {ok: true};
	}

	async process() {
		return (await this.runCommand("SHOW PROCESSLIST")).map(process => {
			return {
				pid: process.Id,
				db: process.db,
				query: process.State + " : " + process.Command + " : " + process.Info,
				duration: process.Time
			};
		});
	}

	async kill(pid) {
		await this.runCommand(`KILL ${pid}`);
	}

	async insert(db, table, datas) {
		for (const [key, data] of Object.entries(datas)) {
			for (const [index, da] of Object.entries(data)) {
				if (typeof da === "string") {
					datas[key][index] = this.escapeValue(da);
				}
			}
		}
		return super.insert(db, table, datas);
	}

	async modifyColumn(database, table, old, column) {
		return await this.runCommand(`ALTER TABLE ${this.escapeId(table)} CHANGE ${this.escapeId(old.name)} ${this.columnToSQL(column)}`, database);
	}

	async duplicateTable(database, old_table, new_name) {
		return await this.runCommand(`CREATE TABLE ${this.escapeId(new_name)} LIKE ${this.escapeId(old_table)};
			INSERT INTO ${this.escapeId(new_name)} SELECT * FROM ${this.escapeId(old_table)};`,
		database);
	}

	async createDatabase(name) {
		return await this.runCommand(`CREATE DATABASE ${this.escapeId(name)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
	}

	async statsDatabase(name) {
		return (await this.runCommand(`SELECT SUM(data_length) AS "data_length", SUM(index_length) AS "index_length" FROM information_schema.TABLES WHERE table_schema = "${name}"`))[0];
	}

	async statsTable(database, table) {
		return (await this.runCommand(`SELECT SUM(data_length) AS "data_length", SUM(index_length) AS "index_length" FROM information_schema.TABLES WHERE table_schema = "${database}" AND table_name = "${table}"`))[0];
	}

	async serverStats() {
		const tmp = (await this.runCommand("SHOW GLOBAL STATUS WHERE Variable_name IN ('Bytes_received', 'Bytes_sent', 'Connections', 'Created_tmp_files', 'Created_tmp_tables', 'Innodb_rows_updated', 'Innodb_rows_deleted', 'Innodb_rows_inserted', 'Innodb_rows_read', 'Handler_update', 'Handler_delete', 'Handler_write', 'Handler_read_rnd_next', 'Threads_connected', 'Threads_running')"));
		const stats = {};
		tmp.map(t => stats[t.Variable_name] = +t.Value);

		let final = [
			{Variable_name: "Conn active", "Value": stats.Threads_running},
			{Variable_name: "Conn current", "Value": stats.Threads_connected},
			{Variable_name: "Conn attempts", "Value": stats.Connections},
			{Variable_name: "Net in (Mo)", "Value": Math.floor(stats.Bytes_received / 1000000)},
			{Variable_name: "Net out (Mo)", "Value": Math.floor(stats.Bytes_sent / 1000000)},
			{Variable_name: "Tmp created files", "Value": stats.Created_tmp_files},
			{Variable_name: "Tmp created tables", "Value": stats.Created_tmp_tables},
		];

		if (stats["Innodb_rows_read"]) {
			final = final.concat([
				{Variable_name: "Rows deletes", "Value": stats.Innodb_rows_deleted},
				{Variable_name: "Rows updates", "Value": stats.Innodb_rows_updated},
				{Variable_name: "Rows inserts", "Value": stats.Innodb_rows_inserted},
				{Variable_name: "Rows reads", "Value": stats.Innodb_rows_read}
			]);
		} else {
			final = final.concat([
				{Variable_name: "Oper deletes", "Value": stats.Handler_delete},
				{Variable_name: "Oper updates", "Value": stats.Handler_update},
				{Variable_name: "Oper inserts", "Value": stats.Handler_write},
				{Variable_name: "Oper reads", "Value": stats.Handler_read_rnd_next}
			]);
		}

		return final;
	}

	async getAvailableCollations() {
		return await this.runCommand("SHOW COLLATION WHERE `Default` = 'Yes'");
	}

	async getComplexes() {
		const complexes = [
			...(await this.runCommand("SELECT routine_name as name, routine_type as type, routine_schema as 'database', ROUTINE_DEFINITION as 'value' FROM information_schema.routines WHERE routine_schema != 'sys' ORDER BY routine_name;")),
			...(await this.runCommand("SELECT trigger_name as name, 'TRIGGER' as type, trigger_schema as 'database', EVENT_OBJECT_TABLE as 'table', ACTION_STATEMENT as 'value' FROM information_schema.triggers WHERE trigger_schema != 'sys'")),
		];
		try {
			complexes.push(...(await this.runCommand("SELECT CHECK_CONSTRAINTS.CONSTRAINT_SCHEMA AS 'database', CHECK_CONSTRAINTS.CONSTRAINT_NAME AS 'name', `CHECK_CLAUSE` AS 'value', TABLE_CONSTRAINTS.TABLE_NAME AS 'table', 'CHECK' AS type FROM information_schema.CHECK_CONSTRAINTS JOIN information_schema.TABLE_CONSTRAINTS ON CHECK_CONSTRAINTS.CONSTRAINT_SCHEMA = TABLE_CONSTRAINTS.CONSTRAINT_SCHEMA AND CHECK_CONSTRAINTS.CONSTRAINT_NAME = TABLE_CONSTRAINTS.CONSTRAINT_NAME")));
		} catch (e) { /* empty */ }
		return complexes;
	}

	async setCollation(database, collate) {
		const colls = await this.getAvailableCollations();
		const character = colls.find(coll => coll.Collation === collate).Charset;

		const r = await this.runCommand(`ALTER DATABASE ${this.escapeId(database)} CHARACTER SET ${character} COLLATE ${collate};`);
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

	async dropRelation(relation) {
		return await this.runCommand(`ALTER TABLE ${this.escapeId(relation.table_source)} DROP FOREIGN KEY ${this.escapeId(relation.name)}`, relation.database);
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
			return await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ADD PRIMARY KEY (${columns.map(c => this.escapeId(c)).join(",")})`, database);
		} else if (type === "INDEX") {
			return await this.runCommand(`CREATE INDEX ${this.escapeId(name)} ON ${this.escapeId(table)} (${columns.map(c => this.escapeId(c)).join(",")})`, database);
		} else if (type === "UNIQUE") {
			return await this.runCommand(`CREATE UNIQUE INDEX ${this.escapeId(name)} ON ${this.escapeId(table)} (${columns.map(c => this.escapeId(c)).join(",")})`, database);
		}
	}

	async dropIndex(database, table, name) {
		if (name === "PRIMARY") {
			return await this.runCommand(`ALTER TABLE ${this.escapeId(table)} DROP PRIMARY KEY;`, database);
		} else {
			return await this.runCommand(`DROP INDEX ${this.escapeId(name)} ON ${this.escapeId(table)}`, database);
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

	async getStructure(full) {
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
				await connection.query(`USE ${this.escapeId(database)}`);
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
			message = message.substring(0, message.indexOf("'"));

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

	// eslint-disable-next-line no-unused-vars
	async establish(database = false, test = false) {
		const params = {
			host: this.host,
			port: this.port,
			user: this.user,
			password: this.password,
			...this.params
		};
		try {
			if (test) {
				const co = mysql.createConnection(params);
				await co.promise().query("select 1");
				co.end();
				return params;
			}

			const pool = mysql.createPool(params);
			const connection = await pool.promise().getConnection();
			connection.release();

			return pool;
		} catch (e) {
			return {error: e.sqlMessage || e.message};
		}
	}
}
