import {MongoClient, ObjectId, BSON} from "mongodb";
import Driver from "../shared/driver.js";
import bash from "../shared/bash.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

export default class MongoDB extends Driver {
	commonUser = ["mongo"];
	commonPass = ["mongo"];
	systemDbs = ["admin", "config", "local"];
	sampleSize = process.env.MONGO_SAMPLE || 250;

	async scan() {
		return super.scan(this.host, 27010, 27020);
	}

	async dump(database, exportType, tables, includeData) {
		//compatibility with import
	}

	async load(filePath, database, table) {
		return bash.runBash(`mongoimport --db "${database}" --collection "${table}" "${this.makeUri(true)}" --file "${filePath}"`);
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

	async insert(db, table, datas) {
		const res = await this.connection.db(db).collection(table).insertMany(BSON.EJSON.deserialize(datas));
		return res.insertedCount.toString();
	}

	async delete(db, table, rows) {
		let nbT = 0;
		for (const row of rows) {
			const res = await this.connection.db(db).collection(table).deleteOne(BSON.EJSON.deserialize(row));
			if (res.error) {
				return res;
			}

			nbT += res.deletedCount;
		}

		return nbT.toString();
	}

	async update(db, table, old_data, new_data) {
		try {
			old_data = BSON.EJSON.deserialize(old_data);
			new_data = BSON.EJSON.deserialize(new_data);

			const res = await this.connection.db(db).collection(table).updateOne(old_data, {$set: new_data});
			return res.modifiedCount.toString();
		} catch (e) {
			return {error: e.message};
		}
	}

	async duplicateTable(database, old_table, new_name) {
		const db = this.connection.db(database);
		return await db.collection(old_table).aggregate([{$out: new_name}]).toArray();
	}

	async renameTable(database, old_name, new_name) {
		const db = this.connection.db(database);
		await db.renameCollection(old_name, new_name);
		return {};
	}

	async createDatabase(name) {
		const remove_me = "remove_me";
		const db = await this.connection.db(name);
		let coll = db.collection(remove_me);

		if (!coll) {
			coll = await db.createCollection(remove_me);
		}
		if ((await coll.find().toArray()).length < 1) {
			await coll.insertOne({_id: new ObjectId(), remove_me});
		}

		return true;
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
		const relations = [];
		const promises = [];
		const databases = (await this.connection.db().admin().listDatabases()).databases;

		for (const database of databases) {
			const db = this.connection.db(database.name);

			for (const coll of await db.collections()) {

				promises.push(new Promise(async resolve => {

					try {
						(await coll.aggregate([{$sample: {size: this.sampleSize / 2}}]).toArray()).map(sample => {

						});
					} catch (e) {
						/* empty */
					} finally {
						resolve();
					}
				}));
			}
		}


		await Promise.all(promises);
		return relations;
	}

	async addIndex(database, table, name, type, columns) {

	}

	async dropIndex(database, table, name) {

	}

	async getIndexes() {
		const indexes = [];

		const databases = (await this.connection.db().admin().listDatabases()).databases;
		for (const database of databases) {
			const db = this.connection.db(database.name);

			for (const coll of await db.collections()) {
				for (const index of await coll.indexes()) {
					indexes.push({
						database: database.name,
						table: coll.collectionName,
						columns: Object.keys(index.key),
						name: index.name,
						primary: index.name === "_id_",
						unique: index.unique || false
					});
				}
			}
		}

		return indexes;
	}

	async runCommand(command, database = false) {
		let db = this.connection;
		const start = Date.now();

		command = command.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "");
		command = command.trim();
		if (!command.trim().startsWith("return")) {
			command = `return ${command}`;
		}

		try {
			if (database) {
				db = await this.connection.db(database);
			}
			const fct = new Function("db", command);
			const res = await fct(db);
			return BSON.EJSON.stringify(res);
		} catch (e) {
			return {error: e.message};
		} finally {
			bash.logCommand(command, database, Date.now() - start, this.port);
		}
	}

	async querySize(query, database) {
		query = query.replace(".find(", ".countDocuments(");
		query = query.replace(".toArray()", "");

		const result = await this.runCommand(query, database);
		return result.error ? "0" : result.toString();
	}

	async runPagedQuery(query, page, pageSize, database) {
		if (query.indexOf(".skip(") < 0 && query.indexOf(".limit(") < 0) {
			query = query.replaceAll(".toArray()", `.skip(${page * pageSize}).limit(${pageSize}).toArray()`);
		}

		return await this.runCommand(query, database);
	}

	getPropertyType(property) {
		return property.constructor.name;
	}

	async getStructure() {
		const struct = {};
		const promises = [];

		const databases = (await this.connection.db().admin().listDatabases()).databases;
		for (const database of databases) {
			const db = this.connection.db(database.name);
			const collInfos = await db.listCollections().toArray();

			struct[database.name] = {
				name: database.name,
				tables: {}
			};

			for (const coll of await db.collections()) {
				promises.push(new Promise(async resolve => {
					const infos = collInfos.find(col => col.name === coll.collectionName);

					struct[database.name].tables[coll.collectionName] = {
						name: coll.collectionName,
						view: infos.type === "view",
						columns: {}
					};

					try {
						(await coll.aggregate([{$sample: {size: this.sampleSize}}]).toArray()).map(sample => {
							for (const [key, val] of Object.entries(sample)) {
								const type = this.getPropertyType(val);

								if (struct[database.name].tables[coll.collectionName].columns[key]) {
									if (struct[database.name].tables[coll.collectionName].columns[key].type.indexOf(type) < 0) {
										struct[database.name].tables[coll.collectionName].columns[key].type.push(type);
									} else {
										struct[database.name].tables[coll.collectionName].columns[key].nullable++;
									}
								} else {
									struct[database.name].tables[coll.collectionName].columns[key] = {
										name: key,
										type: [type],
										nullable: 1
									};
								}
							}
						});

						for (const [key] of Object.entries(struct[database.name].tables[coll.collectionName].columns)) {
							struct[database.name].tables[coll.collectionName].columns[key].type = struct[database.name].tables[coll.collectionName].columns[key].type.join(" | ");
							struct[database.name].tables[coll.collectionName].columns[key].nullable = struct[database.name].tables[coll.collectionName].columns[key].nullable < this.sampleSize;
						}
					} catch (e) {
						/* empty */
					} finally {
						resolve();
					}
				}));
			}
		}

		await Promise.all(promises);
		return struct;
	}

	makeUri(withParams = false) {
		let url = (this.user && this.password) ?
			`mongodb://${this.user}:${this.password}@${this.host}:${this.port}/` :
			`mongodb://${this.host}:${this.port}/`;

		if (withParams) {
			url += "?" + (new URLSearchParams(this.params)).toString();
		}

		return url;
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
