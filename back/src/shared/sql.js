import Driver from "./driver.js";
import {removeComment, singleLine, sql_isSelect} from "./helper.js";
import version from "./version.js";

export default class SQL extends Driver {

	escapeValue(value) {
		return value;
	}

	escapeId(id) {
		return id;
	}

	columnToSQL(column) {
		if (!column.name || !column.type) {
			return;
		}

		let cmd = `${this.escapeId(column.name)} ${column.type} `;

		if (!column.nullable) {
			cmd += "NOT NULL ";
			delete column.defaut;
		}

		if (column.extra?.length) {
			cmd += `${column.extra.join(" ")} `;
		}

		if (Object.keys(column).indexOf("defaut") >= 0) {
			if (column.defaut && column.defaut !== "" && !column.defaut.endsWith(")")
				&& !["'", "\"", "`"].find(quote => column.defaut.startsWith(quote))) {
				column.defaut = this.escapeValue(column.defaut);
			}
			cmd += `DEFAULT ${column.defaut || "NULL"} `;
		}
		return cmd;
	}

	objectToSql(data, where = true) {
		let sql = [];
		for (const [col, value] of Object.entries(data)) {
			if (typeof value === "string") {
				sql.push(`${col} = ${this.escapeValue(value)}`);
			} else if (value === null) {
				sql.push(`${col} ${where ? "IS" : "="} ${value}`);
			} else {
				sql.push(`${col} = '${value}'`);
			}
		}

		return sql;
	}

	async createDatabase(name) {
		return await this.runCommand(`CREATE DATABASE ${this.escapeId(name)}`);
	}

	async addRelation(relation) {
		return await this.runCommand(`ALTER TABLE
    		${this.escapeId(relation.table_source)}
    		ADD CONSTRAINT ${this.escapeId(relation.name)}
    		FOREIGN KEY (${this.escapeId(relation.column_source)})
    		REFERENCES ${this.escapeId(relation.table_dest)} (${this.escapeId(relation.column_dest)})
			ON DELETE ${relation.delete_rule}
			ON UPDATE ${relation.update_rule}`,
		relation.database);
	}

	async dropRelation(relation) {
		return await this.runCommand(`ALTER TABLE ${this.escapeId(relation.table_source)} DROP CONSTRAINT ${this.escapeId(relation.name)}`, relation.database);
	}

	async exampleData(database, table, column, limit) {
		const examples = await this.runCommand(`SELECT DISTINCT ${this.escapeId(column)} as example FROM ${this.escapeId(table)} ORDER BY example ASC LIMIT ${limit}`, database);
		return examples.map(example => example.example);
	}

	async dropDatabase(name, associated = false) {
		await this.runCommand(`DROP DATABASE ${this.escapeId(name)}`);
		if (associated) {
			version.deleteDatabase(this, name);
		}
		return {ok: true};
	}

	async createTable(database, table) {
		const cols = table.columns.map(column => this.columnToSQL(column)).filter(col => col).join(", ");
		return await this.runCommand(`CREATE TABLE ${this.escapeId(table.name)} (${cols})`, database);
	}

	async createView(database, view, code) {
		return await this.runCommand(`CREATE VIEW ${this.escapeId(view)} AS ${code}`, database);
	}

	async dropTable(database, table) {
		return await this.runCommand(`DROP TABLE ${this.escapeId(table)};`, database);
	}

	async truncateTable(database, table) {
		return await this.runCommand(`TRUNCATE TABLE ${this.escapeId(table)};`, database);
	}

	async dropView(database, table) {
		return await this.runCommand(`DROP VIEW ${this.escapeId(table)};`, database);
	}

	async renameTable(database, old_name, new_name) {
		return await this.runCommand(`ALTER TABLE ${this.escapeId(old_name)} RENAME TO ${this.escapeId(new_name)}`, database);
	}

	async addColumns(database, table, columns) {
		for (const column of columns) {
			const result = await this.runCommand(`ALTER TABLE ${this.escapeId(table)} ADD COLUMN ${this.columnToSQL(column)}`, database);
			if (result.error) {
				return result;
			}
		}

		return true;
	}

	async dropColumn(database, table, column) {
		return await this.runCommand(`ALTER TABLE ${this.escapeId(table)} DROP COLUMN ${this.escapeId(column)}`, database);
	}

	pkToObject(indexes, row) {
		const pks = {};
		for (const index of indexes) {
			index.columns.map(pk => {
				pks[pk] = row[pk];
			});
		}

		return Object.keys(pks).length > 0 ? pks : row;
	}

	async getPks(db, table) {
		const indexes = await this.getIndexes();
		const tableIndexes = indexes.filter(index => index.database === db && index.table === table);

		return tableIndexes.filter(index => index.primary === true);
	}

	async insert(db, table, datas) {
		const values = [];
		for (const data of datas) {
			values.push(`(${Object.values(data).map(d => d === null ? "NULL" : d).join(", ")})`);
		}

		const res = await this.nbChangment(`INSERT INTO ${this.escapeId(table)} (${Object.keys(datas[0]).join(",")}) VALUES ${values.join(", ")}`, db);
		return res.error ? res : res.toString();
	}

	async delete(db, table, rows) {
		const pks = await this.getPks(db, table);
		let nbT = 0;

		for (const row of rows) {
			const where = this.objectToSql(this.pkToObject(pks, row)).join(" AND ");
			const res = (await this.nbChangment(`DELETE FROM ${this.escapeId(table)} WHERE ${where}`, db));
			if (res.error) {
				return res;
			}

			nbT += res;
		}

		return nbT.toString();
	}

	async update(db, table, old_data, new_data) {
		const pks = await this.getPks(db, table);

		const to_update = {};
		for (const [key, value] of Object.entries(new_data)) {
			if (JSON.stringify(value) !== JSON.stringify(old_data[key])) {
				to_update[key] = value;
			}
		}
		if (Object.keys(to_update).length < 1) {
			return {untouched: 1};
		}

		const update = this.objectToSql(to_update, false);
		const where = this.objectToSql(this.pkToObject(pks, old_data));

		const res = await this.nbChangment(`UPDATE ${this.escapeId(table)} SET ${update.join(", ")} WHERE ${where.join(" AND ")}`, db);
		return res.error ? res : res.toString();
	}

	cleanQuery(query, keepLength = false) {
		query = removeComment(query);
		query = singleLine(query, keepLength);
		return query;
	}

	getLastQuery(query) {
		const list = query.split(";");
		for (const l of list.reverse()) {
			if (l.trim().length > 0) {
				return l;
			}
		}
		return "";
	}

	async querySize(query, database) {
		query = this.getLastQuery(query);
		query = this.cleanQuery(query);

		if (!sql_isSelect(query)) {
			return null;
		}

		const result = await this.runCommand(`SELECT COUNT(*) AS querysize FROM (${query}) AS query`, database);
		return result.error ? "0" : result[0]["querysize"];
	}

	async runPagedQuery(queries, page, pageSize, database) {
		let result;
		let doneQuery = "";
		for (let query of queries.split(";")) {
			if (query.trim().length < 1) {
				continue;
			}

			query = this.cleanQuery(query, true);

			if (sql_isSelect(query)
				&& query.toLowerCase().indexOf(" offset ") < 0
				&& query.toLowerCase().indexOf(" limit ") < 0) {
				query = `${query} LIMIT ${pageSize} OFFSET ${page * pageSize}`;
			}
			result = await this.runCommand(query, database);
			if (result.error) {
				if (result.position >= 0) {
					result.position += doneQuery.length;
				}
				return result;
			}
			doneQuery += query;
		}
		return result;
	}
}
