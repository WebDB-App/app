import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../config.js";

async function run(config) {
	const name = config.columns[2].name;

	const dropped = await post(`column/drop`, {column: name});
	await test('[column] Drop ok', () => {
		assert.ok(!dropped.error);
	});

	//--------------------------------------------

	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	await test('[column] Created are not present in structure', () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);

		assert.ok(table.columns.find(column => column.name === name) === undefined);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
