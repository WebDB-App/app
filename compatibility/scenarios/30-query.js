import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const query = await axios.post(`${config.api}database/query`, {
		query: config.select20Relational,
		page: 0,
		pageSize: 100,
	});
	const result_query = query.status === 200 && !query.data.error && query.data.length === 20;
	test('[database] Select 20 elements', () => {
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
}
/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await run(await changeServer(servers.postgres, "latest"));
*/
export default run;
