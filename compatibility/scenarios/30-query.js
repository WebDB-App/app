import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {currencyPerContinent} from "../servers.js";

const results = [
	{
		continent: 'AF',
		nbCurrencies: '69'
	},
	{
		continent: 'AN',
		nbCurrencies: '4'
	},
	{
		continent: 'AS',
		nbCurrencies: '54'
	},
	{
		continent: 'EU',
		nbCurrencies: '54'
	},
	{
		continent: 'NA',
		nbCurrencies: '47'
	},
	{
		continent: 'OC',
		nbCurrencies: '27'
	},
	{
		continent: 'SA',
		nbCurrencies: '17'
	}
];

async function run(config) {
	const query = await axios.post(`${config.api}database/query`, {
		query: currencyPerContinent[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[query] Run currencyPerContinent', () => {
		assert.equal(query.status, 200);
		assert.equal(JSON.stringify(query.data), JSON.stringify(results));
	});


	//--------------------------------------------


	const querySize = await axios.post(`${config.api}database/querySize`, {
		query: currencyPerContinent[config.wrapper],
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
