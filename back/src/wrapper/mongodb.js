import {MongoClient} from "mongodb";
// eslint-disable-next-line no-unused-vars
import {BSON, UUID, ObjectId, Code, Binary, Long, BSONError, BSONValue, BSONSymbol, BSONVersionError, BSONRuntimeError, BSONRegExp, DBRef, Double, Int32, Decimal128, MaxKey, MinKey, Timestamp} from "bson";
import Driver from "../shared/driver.js";
import bash from "../shared/bash.js";
import * as child_process from "child_process";

//import {URL} from "url";
//const dirname = new URL(".", import.meta.url).pathname;

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
		const start = Date.now();
		const getResponse = async () => {
			return await new Promise(resolve => {
				this.spawnedShell.stdout.on("data", d => {
					d = d.toString();
					if (d.endsWith("> ")) {
						return;
					}
					resolve(d);
				});
			});
		};

		try {
			if (database && this.currentDb !== database) {
				this.currentDb = database;
				this.spawnedShell.stdin.write(`use ${database};\n`);
				await getResponse();
			}

			this.spawnedShell.stdin.write(command + "\n");
			let res = await getResponse();
			try {
				return eval(`(${res})`);
			} catch (e) {
				return res;
			}
		} catch (e) {
			console.error(e);
			return {error: e.message};
		} finally {
			bash.logCommand(command, database, Date.now() - start, this.port);
		}
	}

	async querySize(query, database) {

	}

	async runPagedQuery(query, page, pageSize, database) {
		//.skip(5).limit(5)

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
						(await coll.aggregate([{$sample: {size: 1000}}]).toArray()).map(sample => {
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

			this.spawnedShell = child_process.spawn("mongosh", ["--quiet", this.makeUri()]);
			return connection;
		} catch (e) {
			return {error: e.message};
		}
	}
}
