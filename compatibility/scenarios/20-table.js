import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../config.js";

async function run(config) {
	const table = {
		name: config.table, columns: [config.columns[0]]
	};

	const created = await post(`table/create`, table);
	await test('[table] Creation ok', () => {
		assert.ok(!created.error);
	});
	if (created.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	await test('[table] Created is present in structure', () => {
		const db = getDatabase(structure.dbs, config.database);
		assert.ok(db.tables.find(table => table.name === config.table));
	});

	//--------------------------------------------

	//rename

	//--------------------------------------------

	//drop

	//--------------------------------------------

	//truncate

	//--------------------------------------------

	//world -> View
	//dropView
}

export default run;
