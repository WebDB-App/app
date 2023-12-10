import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {getDatabase} from "../helper.js";

async function run(config) {
	const name = config.columns[2].name;

	const dropped = await axios.post(`${config.api}column/drop`, {column: name});
	await test('[column] Drop ok', () => {
		assert.equal(dropped.status, 200);
		assert.ok(!dropped.data.error);
	});

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test('[column] Created are not present in structure', () => {
		const db = getDatabase(structure.data.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);

		assert.ok(table.columns.find(column => column.name === name) === undefined);
	});
}

export default run;

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await add(await changeServer(servers.mysql, "latest"));
*/
