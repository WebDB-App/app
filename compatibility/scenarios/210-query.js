import assert from 'node:assert';
import {test} from "node:test";
import {countryPerContinent} from "../servers.js";
import {post} from "../config.js";

const results = [
	{
		"continent": "AF",
		"nb": "58"
	},
	{
		"continent": "AN",
		"nb": "5"
	},
	{
		"continent": "AS",
		"nb": "53"
	},
	{
		"continent": "EU",
		"nb": "52"
	},
	{
		"continent": "NA",
		"nb": "41"
	},
	{
		"continent": "OC",
		"nb": "27"
	},
	{
		"continent": "SA",
		"nb": "14"
	}
];

async function run(config) {
	const query = await post(`database/query`, {
		query: countryPerContinent[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[query] Select number of country per continent', () => {
		for (const result of results) {
			const q = query.find(data => data.continent === result.continent);
			assert.equal(q.nb, result.nb);
		}
	});


	//--------------------------------------------


	const querySize = await post(`database/querySize`, {
		query: countryPerContinent[config.wrapper],
	});
	await test('[query] Good size result', () => {
		assert.equal(querySize, results.length);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona));
*/
export default run;
