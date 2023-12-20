import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const query = await axios.post(`${config.api}database/query`, {
		query: config.select20Relational,
		page: 0,
		pageSize: 100,
	});
	await test('[query] Select 20 linked elements', () => {
		assert.equal(query.status, 200);
		assert.ok(!query.data.error);
		assert.ok(query.data.length === 20);
	});


	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: config.select20Relational,
	});
	await test('[query] Good size result', () => {
		assert.equal(querySize.status, 200);
		assert.ok(querySize.data === 20);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona));
*/
export default run;
