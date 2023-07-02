import {MongoClient, ObjectId} from "mongodb";
//import {UUID} from "mongodb/src/bson.js";
import Driver from "../shared/driver.js";
import bash from "../shared/bash.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

export default class MongoDB extends Driver {
	commonUser = ["mongo"];
	commonPass = ["mongo"];
	systemDbs = ["admin", "config", "local"];

	async scan() {
		return super.scan(this.host, 27010, 27020);
	}

	async dump(database, exportType, tables, includeData) {

	}

	async load(filePath) {
		return bash.runBash(`mongoimport ${this.makeUri()} ${filePath}`);
	}

	async replaceTrigger(database, table, trigger) {
		return [];
	}

	async dropTrigger(database, name) {
		return [];
	}

	async listTrigger(database, table) {
		return [];
	}

	async duplicateTable(database, old_table, new_name) {

	}

	async createDatabase(name) {

	}

	async statsDatabase(name) {
		return [];
	}

	async statsTable(database, table) {
		return [];
	}

	async getAvailableCollations() {
		return [];
	}

	async setCollation(database, collate) {

	}

	async modifyColumn(database, table, old, column) {
		return [];
	}

	async getRelations() {
		return [];
	}

	async addIndex(database, table, name, type, columns) {

	}

	async dropIndex(database, table, name) {

	}

	async getIndexes() {
		return [];
		//await coll.indexInformation();
	}

	async runCommand(command, database = false) {
		let db = this.connection;
		const start = Date.now();

		try {
			if (database) {
				db = await this.connection.db(database);
			}
			if (!command.trim().startsWith("return")) {
				command = `return ${command}`;
			}
			//command = command.replaceAll(".toArray().", ".");

			const fct = new Function("db", command);
			return await fct(db);
		} catch (e) {
			console.error(e);
			return {error: e.message};
		} finally {
			bash.logCommand(command, database, Date.now() - start, this.port);
		}
	}

	async querySize(query, database) {
		if (query.trim().indexOf(".toArray()") < 0) {
			return "1";
		}

		const result = await this.runCommand(query, database);
		return result.error ? "0" : result.length.toString();
	}

	async runPagedQuery(query, page, pageSize, database) {
		if (query.indexOf(".skip(") < 0 && query.indexOf(".limit(") < 0) {
			query = query.replaceAll(".toArray()", `.skip(${page * pageSize}).limit(${pageSize}).toArray()`);
		}

		return await this.runCommand(query, database);
	}

	getPropertyType(property) {
		const type = typeof property;

		if (Array.isArray(property)) {
			return property.map(pro => this.getPropertyType(pro));
		} else if (property instanceof ObjectId) {
			return "ObjectId";
		} /*else if (type instanceof UUID) {
			return 'UUID';
		}*/ else if (property instanceof Date) {
			return "date";
		} else if (type === "object") {
			const types = {};
			for (const [key, val] of Object.entries(property)) {
				types[key] = this.getPropertyType(val);
			}
			return types;
		} else {
			return type;
		}
	}

	async getStructure() {
		const struct = {};

		const admin = this.connection.db().admin();
		const list = await admin.listDatabases();
		for (const li of list.databases) {
			const db = this.connection.db(li.name);
			const collections = await db.collections();
			const collInfos = await db.listCollections().toArray();
			const promises = [];

			struct[li.name] = {
				name: li.name,
				tables: {}
			};

			for (const coll of collections) {
				promises.push(new Promise(async resolve => {
					const infos = collInfos.find(col => col.name === coll.collectionName);

					struct[li.name].tables[coll.collectionName] = {
						name: coll.collectionName,
						view: infos.type === "view",
						columns: {}
					};

					try {
						(await coll.aggregate([{$sample: {size: process.env.MONGO_SAMPLE || 1000}}]).toArray()).map(sample => {
							for (const [key, val] of Object.entries(sample)) {
								const type = this.getPropertyType(val);

								if (struct[li.name].tables[coll.collectionName].columns[key]) {
									if (struct[li.name].tables[coll.collectionName].columns[key].type !== type) {
										struct[li.name].tables[coll.collectionName].columns[key].type = type;
									}
								} else {
									struct[li.name].tables[coll.collectionName].columns[key] = {
										name: key,
										type,
										//comment
										//nullable: row.is_nullable !== "NO",
										//collation: row.COLLATION_NAME,
										//defaut: row.column_default,
									};
								}
							}
						});
					} catch (e) {
						//console.error(e);
					}
					finally {
						resolve();
					}
				}));
			}

			await Promise.all(promises);
		}

		return struct;
	}

	makeUri() {
		return (this.user && this.password) ?
			`mongodb://${this.user}:${this.password}@${this.host}:${this.port}/` :
			`mongodb://${this.host}:${this.port}/`;
	}

	async establish() {
		try {
			const connection = await MongoClient.connect(this.makeUri(), this.params);

			const admin = await connection.db().admin();
			await admin.listDatabases();

			return connection;
		} catch (e) {
			return {error: e.message};
		}
	}
}
