import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const table = {
		name: config.table, columns: [config.columns[0]]
	};

	const created = await axios.post(`${config.api}table/create`, table);
	test('[table] Creation ok', () => {
		assert.equal(created.status, 200);
		assert.ok(!created.data.error);
	});
	if (created.status !== 200 || created.data.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	test('[table] Created is present in structure', () => {
		const db = structure.data.dbs.find(db => db.name.startsWith(config.database));
		assert.ok(db.tables.find(table => table.name === config.table));
	});

	//--------------------------------------------

	//rename

	//--------------------------------------------

	//drop

	//--------------------------------------------

	//truncate

	//--------------------------------------------

	//sakila -> View
	//dropView
}

export default run;
