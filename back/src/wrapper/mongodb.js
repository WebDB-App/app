import {BSON, MongoClient, ObjectId} from "mongodb";
import Driver from "../shared/driver.js";
import bash from "../shared/bash.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

export default class MongoDB extends Driver {
	commonUser = ["mongo"];
	commonPass = ["mongo"];
	systemDbs = ["admin", "config", "local"];
	sampleSize = process.env.MONGO_SAMPLE || 1000;

	async scan() {
		return super.scan(this.host, 27010, 27020);
	}

	async dump(database, exportType, tables) {
		//compatibility with import

		const path = `${dirname}../front/dump/${database}`;
		if (exportType === "json") {
			tables.map(table => {
				bash.runBash(`mongoexport --uri="${this.makeUri(true)}" --db=${database} --out=${path + table}`);
			});
			//.${exportType}
			return;
		}
		if (exportType === "bson") {
			return bash.runBash(`mongodump --uri="${this.makeUri(true)}" --db=${database}`);
		}
	}

	async load(filePath, database, table) {
		return bash.runBash(`mongoimport --db="${database}" --collection "${table}" --uri="${this.makeUri(true)}" --file "${filePath}"`);
	}

	async replaceTrigger(database, table, trigger) {
		return [];
	}

	async dropTrigger(database, name) {
		return [];
	}

	async listTrigger(database, table) {
		return [];
		/*const l = await this.connection.db(database).command({
			listCollections: 1,
			filter: {name: table}
		});
		return l;
		return await this.connection.db(database).collectionInfos(table).options.validator;*/
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
		const stats = await this.connection.db(name).stats();
		return {
			data_length: stats.dataSize,
			index_length: stats.indexSize
		};
	}

	async statsTable(database, table) {
		const stats = await this.connection.db(database).collection(table).stats();
		return {
			data_length: stats.size,
			index_length: stats.totalIndexSize
		};
	}

	async dropDatabase(name) {
		if (this.isSystemDbs(name)) {
			return {error: `You should not delete ${name}`};
		}

		return await this.connection.db(name).dropDatabase();
	}

	async createTable(database, table) {

	}

	async dropTable(database, table) {
		return await this.connection.db(database).dropCollection(table);
	}

	async truncateTable(database, table) {
		return await this.connection.db(database).collection(table).deleteMany();
	}

	async getAvailableCollations() {
		return [];
	}

	async setCollation(database, collate) {

	}

	async modifyColumn(database, table, old, column) {
		return [];
	}

	async getRelations(databases, indexes) {
		//match de type(null?array?) puis match de value min 2 max 100

		//match entre tous les indexes
		//si non match : flat si [] puis query
		return [];
	}

	async addIndex(database, table, name, type, columns) {
		const opt = {};
		const names = {};
		if (type === "UNIQUE") {
			opt["unique"] = true;
			opt["name"] = name;
		}
		for (const column of columns) {
			names[column] = 1;
		}

		try {
			await this.connection.db(database).collection(table).createIndex(names, opt);
		} catch (e) {
			return {error: e.message};
		}
		return {};
	}

	async dropIndex(database, table, name) {
		try {
			await this.connection.db(database).collection(table).dropIndex(name);
		} catch (e) {
			return {error: e.message};
		}
		return {};
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
			const fct = new Function("db", "bson", "mongo", command);
			const res = await fct(db, BSON, MongoClient);
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

	async getDatabases() {
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
					let samples = [];

					struct[database.name].tables[coll.collectionName] = {
						name: coll.collectionName,
						view: infos.type === "view",
						columns: {}
					};

					try {
						samples = await coll.aggregate([{$sample: {size: this.sampleSize}}]).toArray();
					} catch (e) { /* empty */ }
					struct[database.name].tables[coll.collectionName].columns = this.inferColumn(samples);
					resolve();
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

	getPropertyType(property) {
		if (property === null) {
			return "null";
		}

		const type = property.constructor.name;
		if (type === "Array") {
			return property.sort().map(pro => this.getPropertyType(pro));
		}
		if (type === "Object") {
			const types = {};
			for (const [key, val] of Object.entries(property).sort()) {
				types[key] = this.getPropertyType(val);
			}
			return types;
		}
		return type;
	}

	inferColumn(samples) {
		const columns = {};

		samples.map(sample => {
			for (const [key, val] of Object.entries(sample)) {
				if (val === null) {
					continue;
				}

				//merge obj prop + nested null
				//keep only first elem of array

				const type = JSON.stringify(this.getPropertyType(val));
				if (columns[key]) {
					if (columns[key].type.indexOf(type) < 0) {
						columns[key].type.push(type);
					} else {
						columns[key].nullable++;
					}
				} else {
					columns[key] = {
						name: key,
						type: [type],
						nullable: 1
					};
				}
			}
		});

		for (const [key] of Object.entries(columns)) {
			columns[key].type = columns[key].type.map(ty => JSON.parse(ty));
			columns[key].nullable = columns[key].nullable < this.sampleSize;
		}

		return columns;
	}
}
