import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {mostPopularCurrencyPerContinent} from "../servers.js";

async function run(config) {
	const query = await axios.post(`${config.api}database/query`, {
		query: mostPopularCurrencyPerContinent[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[query] Select 20 linked elements', () => {
		assert.equal(query.status, 200);
		assert.ok(!query.data.error);
		assert.ok(query.data.length === 7);
	});


	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: mostPopularCurrencyPerContinent[config.wrapper],
	});
	await test('[query] Good size result', () => {
		assert.equal(querySize.status, 200);
		assert.ok(querySize.data === 7);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona));
*/
export default run;
