import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {getDatabase} from "../helper.js";

async function run(config) {
	const columns = config.columns.slice(1);

	const created = await axios.post(`${config.api}column/add`, {columns});
	await test('[column] Creation ok', () => {
		assert.equal(created.status, 200);
		assert.ok(!created.data.error);
	});

	if (created.status !== 200 || created.data.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test('[column] Created are present in structure', () => {
		const db = getDatabase(structure.data.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);

		assert.ok(table.columns[1].name === columns[0].name);
		assert.ok(table.columns[2].name === columns[1].name);
		assert.ok(table.columns[3].name === columns[2].name);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
