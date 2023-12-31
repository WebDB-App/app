import Driver from "./driver.js";
import {singleLine, sql_isSelect} from "./helper.js";


export default class SQL extends Driver {

	columnToSQL(column) {
		if (!column.name || !column.type) {
			return;
		}

		let cmd = `${this.nameDel + column.name + this.nameDel} ${column.type} `;

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
				column.defaut = this.stringEscape + column.defaut + this.stringEscape;
			}
			cmd += `DEFAULT ${column.defaut || "NULL"} `;
		}
		return cmd;
	}

	objectToSql(data, where = true) {
		let sql = [];
		for (const [col, value] of Object.entries(data)) {
			if (typeof value === "string") {
				sql.push(`${col} = ${this.stringEscape + value + this.stringEscape}`);
			} else if (value === null) {
				sql.push(`${col} ${where ? "IS" : "="} ${value}`);
			} else {
				sql.push(`${col} = '${value}'`);
			}
		}

		return sql;
	}

	async createDatabase(name) {
		return await this.runCommand(`CREATE DATABASE ${this.nameDel + name + this.nameDel}`);
	}

	async addRelation(relation) {
		return await this.runCommand(`ALTER TABLE
    		${this.nameDel + relation.table_source + this.nameDel}
    		ADD CONSTRAINT ${this.nameDel + relation.name + this.nameDel}
    		FOREIGN KEY (${this.nameDel + relation.column_source + this.nameDel})
    		REFERENCES ${this.nameDel + relation.table_dest + this.nameDel} (${this.nameDel + relation.column_dest + this.nameDel})
			ON DELETE ${relation.delete_rule}
			ON UPDATE ${relation.update_rule}`,
		relation.database);
	}

	async dropRelation(relation) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel + relation.table_source + this.nameDel} DROP CONSTRAINT ${this.nameDel + relation.name + this.nameDel}`, relation.database);
	}

	async exampleData(database, table, column, limit) {
		const examples = await this.runCommand(`SELECT DISTINCT ${this.nameDel + column + this.nameDel} as example FROM ${this.nameDel + table + this.nameDel} ORDER BY example ASC LIMIT ${limit}`, database);
		return examples.map(example => example.example);
	}

	async dropDatabase(name) {
		return await this.runCommand(`DROP DATABASE ${this.nameDel + name + this.nameDel}`);
	}

	async createTable(database, table) {
		const cols = table.columns.map(column => this.columnToSQL(column)).filter(col => col).join(", ");
		return await this.runCommand(`CREATE TABLE ${this.nameDel + table.name + this.nameDel} (${cols})`, database);
	}

	async createView(database, view, code) {
		return await this.runCommand(`CREATE VIEW ${this.nameDel + view + this.nameDel} AS ${code}`, database);
	}

	async dropTable(database, table) {
		return await this.runCommand(`DROP TABLE ${this.nameDel + table + this.nameDel};`, database);
	}

	async truncateTable(database, table) {
		return await this.runCommand(`TRUNCATE TABLE ${this.nameDel + table + this.nameDel};`, database);
	}

	async dropView(database, table) {
		return await this.runCommand(`DROP VIEW ${this.nameDel + table + this.nameDel};`, database);
	}

	async renameTable(database, old_name, new_name) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel + old_name + this.nameDel} RENAME TO ${this.nameDel + new_name + this.nameDel}`, database);
	}

	async addColumns(database, table, columns) {
		for (const column of columns) {
			const result = await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} ADD COLUMN ${this.columnToSQL(column)}`, database);
			if (result.error) {
				return result;
			}
		}

		return true;
	}

	async dropColumn(database, table, column) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel + table + this.nameDel} DROP COLUMN ${this.nameDel + column + this.nameDel}`, database);
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
			values.push(`(${Object.values(data).join(", ")})`);
		}

		const res = await this.nbChangment(`INSERT INTO ${this.nameDel + table + this.nameDel} (${Object.keys(datas[0]).join(",")}) VALUES ${values.join(", ")}`, db);
		return res.error ? res : res.toString();
	}

	async delete(db, table, rows) {
		const pks = await this.getPks(db, table);
		let nbT = 0;

		for (const row of rows) {
			const where = this.objectToSql(this.pkToObject(pks, row)).join(" AND ");
			const res = (await this.nbChangment(`DELETE FROM ${this.nameDel + table + this.nameDel} WHERE ${where}`, db));
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

		const res = await this.nbChangment(`UPDATE ${this.nameDel + table + this.nameDel} SET ${update.join(", ")} WHERE ${where.join(" AND ")}`, db);
		return res.error ? res : res.toString();
	}

	cleanQuery(query, keepLength = false) {
		query = singleLine(query, keepLength);
		return query.trim().endsWith(";") ? query.trim().slice(0, -1) : query;
	}

	async querySize(query, database) {
		if (!sql_isSelect(query)) {
			return null;
		}

		const result = await this.runCommand(`SELECT COUNT(*) AS querysize FROM (${this.cleanQuery(query)}) AS query`, database);
		return result.error ? "0" : result[0]["querysize"];
	}

	async runPagedQuery(query, page, pageSize, database) {
		query = this.cleanQuery(query, true);

		if (sql_isSelect(query)
			&& query.toLowerCase().indexOf(" offset ") < 0
			&& query.toLowerCase().indexOf(" limit ") < 0) {
			query = `${query} LIMIT ${pageSize} OFFSET ${page * pageSize}`;
		}

		return await this.runCommand(query, database);
	}
}
