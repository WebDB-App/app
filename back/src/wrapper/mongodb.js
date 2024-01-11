import {BSON, MongoClient, ObjectId} from "mongodb";
import Driver from "../shared/driver.js";
import bash from "../shared/bash.js";
import {writeFileSync} from "fs";
import {join} from "path";
import {loadData} from "../shared/buffer.js";
import version from "../shared/version.js";
import {URL} from "url";
import {complex, mongo_injectAggregate, removeComment} from "../shared/helper.js";

const dirname = new URL(".", import.meta.url).pathname;

export default class MongoDB extends Driver {
	commonUser = ["mongo"];
	commonPass = ["mongo"];
	systemDbs = ["admin", "config", "local"];

	async scan() {
		return super.scan(this.host, 27010, 27030);
	}

	async getViewCode(database, view) {
		const colls = await this.connection.db(database).listCollections().toArray();
		const options = colls.find(coll => coll.name === view).options;

		return {
			code: `db.command({
	collMod: "${view}",
	viewOn: "${options.viewOn}",
	pipeline: ${JSON.stringify(options.pipeline)}
});`
		};
	}

	async dump(database, exportType = "bson", tables, options = "") {
		let path = join(dirname, `../../static/dump/${database}`);
		let frontPath = `dump/${database}`;

		if (exportType === "json") {
			path = `${path}.json`;
			frontPath += ".json";

			const results = {};
			for (const table of tables) {
				try {
					results[table] = loadData(await this.connection.db(database).collection(table).find().toArray());
				} catch (e) {
					console.error(e);
				}
			}
			writeFileSync(path, JSON.stringify({
				database: database,
				tables: results
			}));
		}
		if (exportType === "bson") {
			path = `${path}.gz`;
			frontPath += ".gz";

			const result = bash.runBash(`mongodump --uri="${this.makeUri()}" --db=${database} --archive=${path} ${options}`);
			if (result.error) {
				return result;
			}
		}
		return {path: frontPath};
	}

	async saveState(path, database) {
		return bash.runBash(`mongodump --uri="${this.makeUri()}" --db=${database} --out=${path}`);
	}

	readDiff(database, diff) {
		diff = diff.replaceAll("\\ No newline at end of file", "");
		return diff;
	}

	async load(files, database) {
		const folder = files.find(file => file.originalname.endsWith(".metadata.json"));
		if (folder) {
			bash.runBash(`mongorestore --uri="${this.makeUri()}" --db="${database}" ${files[0].destination}`);
			return {ok: true};
		}

		for (const file of files) {
			if (file.originalname.endsWith(".csv") ||
				file.originalname.endsWith(".json") ||
				file.originalname.endsWith(".tsv")) {
				bash.runBash(`mongoimport --uri="${this.makeUri()}" --db="${database}" --file "${file.path}" --collection ${file.originalname.split(".")[0]}`);
			} else {
				bash.runBash(`mongorestore --uri="${this.makeUri()}" --nsFrom="*" --nsTo="${database}.*" --gzip --archive="${file.path}"`);

				const tables = (await this.getDatabases(false, 0))[database].tables;
				for (const table of Object.values(tables)) {
					if (table.name.indexOf(".") < 0) {
						continue;
					}

					await this.renameTable(database, table.name, table.name.split(".")[1]);
				}
			}
		}
		return {ok: true};
	}

	async createView(database, view, code, table) {
		try {
			const fct = new Function(`return ${code}`);
			const res = await fct();

			await this.connection.db(database).createCollection(view, {
				viewOn: table,
				pipeline: res
			});
			version.commandFinished(this, "", database, true);
			return {ok: 1};
		} catch (e) {
			return {error: e.message};
		}
	}

	async dropView(database, table) {
		version.commandFinished(this, "", database, true);
		return await this.connection.db(database).dropCollection(table);
	}

	async process() {
		const ops = await this.connection.db().admin().command({currentOp: true});
		return ops.inprog.map(op => {
			return {
				pid: op.opid,
				db: op.ns,
				query: op.desc + " : " + op.op,
				duration: Math.floor(op.microsecs_running / 1000)
			};
		});
	}

	async kill(pid) {
		await this.connection.db().admin().command({killOp: 1, op: pid});
	}

	async serverStats() {
		const stats = await this.connection.db().admin().command({serverStatus: 1});
		return [
			{Variable_name: "Conn active", "Value": stats.connections.active},
			{Variable_name: "Conn current", "Value": stats.connections.current},
			{Variable_name: "Conn rejected", "Value": stats.connections.rejected},
			{Variable_name: "Net in (Mo)", "Value": Math.floor(stats.network.bytesIn / 1000000)},
			{Variable_name: "Net out (Mo)", "Value": Math.floor(stats.network.bytesOut / 1000000)},
			{Variable_name: "Latency reads (sec)", "Value": Math.floor(stats.opLatencies.reads.latency / 1000000)},
			{Variable_name: "Latency writes (sec)", "Value": Math.floor(stats.opLatencies.writes.latency / 1000000)},
			{Variable_name: "Oper deletes", "Value": stats.opcounters.delete},
			{Variable_name: "Oper inserts", "Value": stats.opcounters.insert},
			{Variable_name: "Oper queries", "Value": stats.opcounters.query},
			{Variable_name: "Trans committed", "Value": stats.transactions.totalCommitted},
		];
	}

	async insert(db, table, datas) {
		try {
			const res = await this.connection.db(db).collection(table).insertMany(BSON.EJSON.deserialize(datas));
			version.commandFinished(this, "", db, true);
			return res.insertedCount.toString();
		} catch (e) {
			return {error: e.message};
		}
	}

	async delete(db, table, rows) {
		let nbT = 0;
		for (const row of rows) {
			try {
				const res = await this.connection.db(db).collection(table).deleteOne(BSON.EJSON.deserialize(row));
				nbT += res.deletedCount;
			} catch (e) {
				return {error: e.message};
			}
		}
		version.commandFinished(this, "", db, true);
		return nbT.toString();
	}

	async update(db, table, old_data, new_data) {
		try {
			old_data = BSON.EJSON.deserialize(old_data);
			new_data = BSON.EJSON.deserialize(new_data);

			const res = await this.connection.db(db).collection(table).updateOne(old_data, {$set: new_data});
			version.commandFinished(this, "", db, true);
			return res.modifiedCount.toString();
		} catch (e) {
			return {error: e.message};
		}
	}

	async duplicateTable(database, old_table, new_name) {
		const db = this.connection.db(database);
		version.commandFinished(this, "", database, true);
		return await db.collection(old_table).aggregate([{$out: new_name}]).toArray();
	}

	async renameTable(database, old_name, new_name) {
		const db = this.connection.db(database);
		await db.renameCollection(old_name, new_name);
		version.commandFinished(this, "", database, true);
		return {ok: 1};
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
		const query = await this.runCommand(`db.collection("${table}").aggregate([{ $collStats: { storageStats: {} } }]).toArray()`, database);
		const stats = BSON.EJSON.parse(query)[0].storageStats;

		return {
			data_length: stats.storageSize,
			index_length: stats.indexSizes._id_
		};
	}

	async dropDatabase(name) {
		return await this.connection.db(name).dropDatabase();
	}

	async createTable(database, table) {
		const db = await this.connection.db(database);
		const coll = await db.createCollection(table.name);
		version.commandFinished(this, "", database, true);

		const row = {_id: new ObjectId()};
		table.columns.map(column => {
			row[column.name] = this.wrapValue(column.type, row[column.name] === undefined ? column.defaut : row[column.name]);
		});
		return coll.insertOne(row);
	}

	async dropTable(database, table) {
		const result = await this.connection.db(database).dropCollection(table);
		version.commandFinished(this, "", database, true);
		return result;
	}

	async truncateTable(database, table) {
		const result = await this.connection.db(database).collection(table).deleteMany();
		version.commandFinished(this, "", database, true);
		return result;
	}

	async getAvailableCollations() {
		return [];
	}

	async setCollation(database, collate) {
		console.error("Feature not yet available", database, collate);
		return true;
	}

	wrapValue(type, value) {
		const cast = (type) => {
			try {
				if (Object.keys(BSON).indexOf(type) >= 0) {
					return new BSON[type](value);
				}
				if (type === "Date") {
					return new Date(value);
				}
				return global[type](value);
			} catch (e) {
				return value;
			}
		};

		if (type.endsWith("[]")) {
			return [cast(type.slice(0, -2))];
		}
		return cast(type);
	}

	async addColumns(database, table, columns) {
		for (const column of columns) {
			const add = {$set: {}};
			add["$set"][column.name] = this.wrapValue(column.type, column.defaut || null);
			await this.connection.db(database).collection(table).updateMany({}, add);
		}
		return true;
	}

	async dropColumn(database, table, column) {
		const rem = {$unset: {}};
		rem["$unset"][column] = 1;
		const result = await this.connection.db(database).collection(table).updateMany({}, rem);
		version.commandFinished(this, "", database, true);
		return result;
	}

	async modifyColumn(database, table, old, column) {
		const updates = {};

		if (old.name !== column.name) {
			updates["$rename"] = {};
			updates["$rename"][old.name] = column.name;
			try {
				await this.connection.db(database).collection(table).updateMany({}, updates);
			} catch (e) {
				return {error: e.message};
			}
		}
		if (old.type !== column.type) {
			const rows = await this.connection.db(database).collection(table).find({}).toArray();
			await Promise.all(rows.map(row => {
				updates["$set"] = {};
				updates["$set"][column.name] = this.wrapValue(column.type, row[column.name] === undefined ? column.defaut : row[column.name]);
				return this.connection.db(database).collection(table).updateOne(row, updates);
			}));
		}
		version.commandFinished(this, "", database, true);
		return true;
	}

	async exampleData(database, table, column, limit) {
		const cols = {};
		cols[column] = 1;
		const res = await this.connection.db(database).collection(table).find({}, cols).limit(limit).toArray();

		return BSON.EJSON.stringify(res.map(r => r[column]));
	}

	async getComplexes() {
		const complexes = [];
		const databases = (await this.connection.db().admin().listDatabases()).databases;
		for (const database of databases) {
			const collections = await this.connection.db(database.name).command({
				listCollections: 1.0,
			});

			collections.cursor.firstBatch.map(collection => {
				const options = collection.options;
				if (Object.keys(options).length < 1 || !options.validator) {
					return;
				}
				complexes.push({
					name: JSON.stringify(options.validator).slice(0, 50) + "...",
					database: database.name,
					table: collection.name,
					type: complex.VALIDATOR
				});
			});
		}
		return complexes;
	}

	async getRelations(databases, sampleSize) {
		const relations = [];
		const promises = [];

		databases.map(database => {
			database.tables.map(table_source => {
				table_source.columns.map(column_source => {
					if (column_source.name === "_id") {
						return;
					}
					if (column_source.type === "ObjectId") {
						database.tables.map(table_dest => {
							if (table_dest.name === table_source.name) {
								return;
							}
							table_dest.columns.map(column_dest => {
								if (column_dest.name !== "_id") {
									return;
								}
								promises.push(new Promise(async resolve => {
									let fks = 0;
									const rows = await this.connection.db(database.name).collection(table_source.name).aggregate([
										{
											$lookup: {
												from: table_dest.name,
												localField: column_source.name,
												foreignField: column_dest.name,
												as: "fks"
											}
										}, {"$limit": sampleSize}]).toArray();

									rows.map(row => fks += row.fks.length);
									if (fks >= 1) {
										relations.push({
											database: database.name,
											name: `${table_source.name}_${column_source.name}.${table_dest.name}`,
											table_source: table_source.name,
											column_source: column_source.name,
											table_dest: table_dest.name,
											column_dest: column_dest.name
										});
									}
									resolve();
								}));
							});
						});
					}

					if (Array.isArray(column_source.type)) {
						//column_source.type[0].find(ty => ty === "ObjectId")
					}
				});
			});
		});

		await Promise.all(promises);
		return relations;
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
		version.commandFinished(this, "", database, true);
		return {ok: 1};
	}

	async dropIndex(database, table, name) {
		try {
			await this.connection.db(database).collection(table).dropIndex(name);
		} catch (e) {
			return {error: e.message};
		}
		version.commandFinished(this, "", database, true);
		return {ok: 1};
	}

	async getIndexes() {
		const indexes = [];
		const databases = (await this.connection.db().admin().listDatabases()).databases;
		for (const database of databases) {
			const db = this.connection.db(database.name);

			for (const coll of await db.collections()) {
				const opts = await coll.options();
				if (opts.viewOn) {
					continue;
				}
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
		let lgth = -1;

		command = removeComment(command);
		if (!command.trim().startsWith("return")) {
			command = `return ${command}`;
		}
		const cid = bash.startCommand(command, database, this.port);

		try {
			if (database) {
				db = await this.connection.db(database);
			}
			const fct = new Function("db", "bson", "mongo", command);
			const res = await fct(db, BSON, MongoClient);
			lgth = res.length;
			version.commandFinished(this, command, database);
			return BSON.EJSON.stringify(res);
		} catch (e) {
			return {error: e.message};
		} finally {
			bash.endCommand(cid, lgth);
		}
	}

	async sampleDatabase(name, {count, deep, tables}) {
		const promises = [];
		const limit = (obj, count, deep) => {
			if (deep-- < 1) {
				return null;
			}
			for (const [index, prop] of Object.entries(obj)) {
				if (prop?.constructor.name === "Array") {
					obj[index] = obj[index].slice(0, count);
				}
				if (prop?.constructor.name === "Object") {
					const limited = limit(prop, count, deep);
					if (limited === null) {
						delete obj[index];
					} else {
						obj[index] = limited;
					}
				}
			}
			return obj;
		};
		for (const table of tables) {
			promises.push(new Promise(async resolve => {
				let samples = [];
				try {
					samples = await this.connection.db(name).collection(table).aggregate([{$sample: {size: count}}]).toArray();
					samples = samples.map(sample => limit(sample, count, deep));
				} catch (e) { /* empty */
				}
				resolve({
					structure: table,
					data: samples
				});
			}));
		}
		return await Promise.all(promises);
	}

	async querySize(query, database) {
		if (process.env.PROTECTED_MODE === "true") {
			return {error: "Code evaluation is disable by backend configuration"};
		}

		if (query.indexOf(".toArray(") < 1) {
			const result = await this.runCommand(query, database);
			return result.error ? "0" : "1";
		}

		if (query.indexOf(".aggregate(") >= 0) {
			query = mongo_injectAggregate(query, {"$group": {"_id": null, "count": {"$sum": 1}}});
			let result = await this.runCommand(query, database);
			if (result.error) {
				return "0";
			}
			result = JSON.parse(result);
			return result.length < 1 ? "0" : result[0].count.toString();
		}

		if (query.indexOf(".find(") > 0) {
			query = query.replace(".find(", ".countDocuments(");
			query = query.replace(".toArray()", "");
			const result = await this.runCommand(query, database);
			return result.error ? "0" : result.toString();
		}

		return "1";
	}

	async runPagedQuery(query, page, pageSize, database) {
		if (process.env.PROTECTED_MODE === "true") {
			return {error: "Code evaluation is disable by backend configuration"};
		}

		if (query.indexOf("skip") < 0 &&
			query.indexOf("limit") < 0) {

			if (query.indexOf(".aggregate(") >= 0) {
				query = mongo_injectAggregate(query, {"$limit": pageSize});
				query = mongo_injectAggregate(query, {"$skip": page});
			} else if (query.indexOf(".toArray(") >= 0) {
				query = query.replace(".toArray()", `.skip(${page * pageSize}).limit(${pageSize}).toArray()`);
			}
		}

		let results = await this.runCommand(query, database);
		if (results === null) {
			results = [["null"]];
		}
		return results;
	}

	async getDatabases(full, sampleSize) {
		const struct = {};
		const promises = [];
		sampleSize = sampleSize > 500 ? 500 : sampleSize;

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
					if (full) {
						try {
							samples = await coll.aggregate([{$sample: {size: sampleSize}}]).toArray();
						} catch (e) {
							//console.error(e);
						}
						struct[database.name].tables[coll.collectionName].columns = this.inferColumn(samples);
					}
					resolve();
				}));
			}
		}

		await Promise.all(promises);
		return struct;
	}

	makeUri(withParams = true) {
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
			const connection = await MongoClient.connect(this.makeUri(false), this.params);

			const admin = await connection.db().admin();
			await admin.listDatabases();

			return connection;
		} catch (e) {
			return {error: e.message};
		}
	}

	getPropertyType(property) {
		if (property === null) {
			return null;
		}

		let type = property.constructor.name;
		if (type === "Array") {
			return property
				.map(pro => JSON.stringify(this.getPropertyType(pro)))
				.filter((value, index, array) => array.indexOf(value) === index)
				.map(pro => JSON.parse(pro));
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
				const type = JSON.stringify(this.getPropertyType(val));

				if (columns[key] && columns[key][type]) {
					columns[key][type]++;
				} else {
					if (!columns[key]) {
						columns[key] = {};
					}
					columns[key][type] = 1;
				}
			}
		});

		const final = [];
		for (const [name, type] of Object.entries(columns)) {
			let types = Object.keys(type)
				.map(ty => JSON.parse(ty))
				.filter(ty => Array.isArray(ty) ? ty.length > 0 : ty);
			const nullable = types.length !== Object.keys(type).length;

			if (types.length === 1 && typeof types[0] === "string") {
				types = types[0];
			}

			final.push({
				name,
				type: types,
				nullable
			});
		}

		return final;
	}
}
