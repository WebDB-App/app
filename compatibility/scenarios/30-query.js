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
	await test('[query] Select 20 linked elements', () => {
		assert.ok(result_query);
	});


	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: config.select20Relational,
	});
	const result_querySize = querySize.status === 200 && querySize.data === 20;
	await test('[query] Good size result', () => {
		assert.ok(result_querySize);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona, "8"));
*/
export default run;
