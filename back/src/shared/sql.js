import Driver from "./driver.js";

export default class SQL extends Driver {

	columnToSQL(column) {
		if (!column.name || !column.type) {
			return;
		}

		let cmd = `${this.nameDel}${column.name}${this.nameDel} ${column.type} `;

		if (!column.nullable) {
			cmd += "NOT NULL ";
			delete column.defaut;
		}

		if (column.extra?.length) {
			cmd += `${column.extra.join(" ")} `;
		}

		//wrap defaultValue -> attention NULL / function()
		if (column.defaut) {
			if (column.defaut !== "NULL" && !column.defaut.endsWith(")")
				&& !["'", "\"", "`"].find(quote => column.defaut.startsWith(quote))) {
				column.defaut = `"${column.defaut}"`;
			}
			cmd += `DEFAULT ${column.defaut} `;
		}
		return cmd;
	}

	objectToSql(data, comparator = "=") {
		let sql = [];
		for (const [col, value] of Object.entries(data)) {
			sql.push(`${col} ${comparator} "${value}"`);
		}

		return sql;
	}

	async createDatabase(name) {
		return await this.runCommand(`CREATE DATABASE ${this.nameDel}${name}${this.nameDel}`);
	}

	async addRelation(relation) {
		return await this.runCommand(`ALTER TABLE
    		${this.nameDel}${relation.table_source}${this.nameDel}
    		ADD CONSTRAINT ${this.nameDel}${relation.name}${this.nameDel}
    		FOREIGN KEY (${this.nameDel}${relation.column_source}${this.nameDel})
    		REFERENCES ${this.nameDel}${relation.table_dest}${this.nameDel} (${this.nameDel}${relation.column_dest}${this.nameDel})
			ON DELETE ${this.nameDel}${relation.delete_rule}${this.nameDel}
			ON UPDATE ${this.nameDel}${relation.update_rule}${this.nameDel}`,
		relation.database_source);
	}

	async dropRelation(relation) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel}${relation.table_source}${this.nameDel} DROP CONSTRAINT ${this.nameDel}${relation.name}${this.nameDel}`, relation.database_source);
	}

	async exampleData(database, table, column, limit) {
		return await this.runCommand(`SELECT DISTINCT ${this.nameDel}${column}${this.nameDel} as example FROM ${this.nameDel}${table}${this.nameDel} LIMIT ${limit}`, database);
	}

	async dropDatabase(name) {
		if (this.isSystemDbs(name)) {
			return {error: `You should not delete ${name}`};
		}

		return await this.runCommand(`DROP DATABASE ${this.nameDel}${name}${this.nameDel}`);
	}

	async createTable(database, table) {
		const cols = table.columns.map(column => this.columnToSQL(column)).filter(col => col).join(", ");
		return await this.runCommand(`CREATE TABLE ${this.nameDel}${table.name}${this.nameDel} (${cols})`, database);
	}

	async dropTable(database, table) {
		return await this.runCommand(`DROP TABLE ${this.nameDel}${table}${this.nameDel};`, database);
	}

	async truncateTable(database, table) {
		return await this.runCommand(`TRUNCATE TABLE ${this.nameDel}${table}${this.nameDel};`, database);
	}

	async dropView(database, table) {
		return await this.runCommand(`DROP VIEW ${this.nameDel}${table}${this.nameDel};`, database);
	}

	async renameTable(database, old_name, new_name) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel}${old_name}${this.nameDel} RENAME TO ${this.nameDel}${new_name}${this.nameDel}`, database);
	}

	async addColumns(database, table, columns) {
		for (const column of columns) {
			const result = await this.runCommand(`ALTER TABLE ${this.nameDel}${table}${this.nameDel} ADD COLUMN ${this.columnToSQL(column)}`, database);
			if (result.error) {
				return result;
			}
		}

		return true;
	}

	async dropColumn(database, table, column) {
		return await this.runCommand(`ALTER TABLE ${this.nameDel}${table}${this.nameDel} DROP COLUMN ${this.nameDel}${column}${this.nameDel}`, database);
	}

	async insert(db, table, datas) {
		const values = [];
		for (const data of datas) {
			values.push(`(${Object.values(data).map(da => `"${da}"`).join(", ")})`);
		}

		return await this.runCommand(`INSERT INTO ${this.nameDel}${table}${this.nameDel} (${Object.keys(datas[0]).join(",")}) VALUES ${values.join(", ")}`, db);
	}

	async delete(db, table, rows) {
		for (const row of rows) {
			const where = this.objectToSql(row).join(" AND ");
			await this.runCommand(`DELETE FROM ${this.nameDel}${table}${this.nameDel} WHERE ${where} LIMIT 1`, db);
		}

		return true;
	}

	async update(db, table, old_data, new_data) {
		let where = this.objectToSql(old_data);
		let update = this.objectToSql(new_data);

		return await this.runCommand(`UPDATE ${this.nameDel}${table}${this.nameDel} SET ${update.join(", ")} WHERE ${where.join(" AND ")} LIMIT 1`, db);
	}

	async querySize(query, database) {
		const result = await this.runCommand(`SELECT COUNT(*) AS querySize FROM (${query}) AS query`, database);
		return result[0]['querySize'];
	}
}
