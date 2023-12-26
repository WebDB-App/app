import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {countryPerContinent} from "../servers.js";

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
	const query = await axios.post(`${config.api}database/query`, {
		query: countryPerContinent[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[query] Select number of country per continent', () => {
		assert.equal(query.status, 200);

		for (const result of results) {
			const q = query.data.find(data => data.continent === result.continent);
			assert.equal(q.nb, result.nb);
		}
	});


	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: countryPerContinent[config.wrapper],
	});
	await test('[query] Good size result', () => {
		assert.equal(querySize.status, 200);
		assert.equal(querySize.data, results.length);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona));
*/
export default run;
