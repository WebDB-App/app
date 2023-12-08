import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const created = await axios.post(`${config.api}database/create`, {name: config.database});
	const result_created = created.status === 200 && !created.data.error;
	test('[database] Creation works', () => {
		assert.ok(result_created);
	});
	if (!result_created) {
		throw new Error();
	}

	const structure = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	const result_structure = structure.data.dbs.find(db => db.name.startsWith(config.database));
	test('[database] Created is present in structure', () => {
		assert.ok(result_structure);
	});
	if (!result_structure) {
		throw new Error();
	}


	//--------------------------------------------

	const query = await axios.post(`${config.api}database/query`, {
		query: config.select20Relational,
		page: 0,
		pageSize: 100,
	});
	const result_query = query.status === 200 && !query.data.error && query.data.length === 20;
	test('[database] Select 20 elements works', () => {
		assert.ok(result_query);
	});


	//match les sakila

	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: config.select20Relational,
	});
	const result_querySize = querySize.status === 200 && querySize.data === 20;
	test('[database] Query size return good number', () => {
		assert.ok(result_querySize);
	});


	//--------------------------------------------
}

export default run;
