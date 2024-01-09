import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {selectCitiesNumber} from "../base.js";

const results = [
	{
		"city_count": 5541,
		"continent_name": "AF"
	},
	{
		"city_count": 3,
		"continent_name": "AN"
	},
	{
		"city_count": 30205,
		"continent_name": "AS"
	},
	{
		"city_count": 64779,
		"continent_name": "EU"
	},
	{
		"city_count": 29785,
		"continent_name": "NA"
	},
	{
		"city_count": 4714,
		"continent_name": "OC"
	},
	{
		"city_count": 6737,
		"continent_name": "SA"
	}
];

async function run(config) {
	const query = await post(`database/query`, {
		query: selectCitiesNumber[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[data] Select number of country per continent', () => {
		for (const result of results) {
			const q = query.find(data => data.continent_name === result.continent_name);
			assert.equal(q.city_count, result.city_count);
		}
	});


	//--------------------------------------------


	const querySize = await post(`database/querySize`, {
		query: selectCitiesNumber[config.wrapper],
	});
	await test('[data] Good size result', () => {
		assert.equal(querySize, results.length);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.mysql));
*/
export default run;
