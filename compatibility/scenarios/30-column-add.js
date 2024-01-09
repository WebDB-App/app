import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";
import {columnsForTests, tableForStruct} from "../base.js";

async function run(config) {
	const columns = columnsForTests[config.wrapper].slice(1);

	const created = await post(`column/add`, {columns}, tableForStruct);
	await test('[column] Creation ok', () => {
		assert.ok(!created.error);
	});

	if (created.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await post(`server/structure?full=1&size=50`, config.credentials, tableForStruct);
	await test('[column] Created are present in structure', () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === tableForStruct.Table);
		const cols = table.columns.filter(col => col.name !== '_id' && col.name !== "rowid");

		assert.ok(cols[1].name === columns[0].name);
		assert.ok(cols[2].name === columns[1].name);
		assert.ok(cols[3].name === columns[2].name);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
