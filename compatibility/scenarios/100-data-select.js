import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {checkCityNumber, cityNumber, selectCitiesNumber} from "../base.js";


async function run(config) {
	const ok = await checkCityNumber(config);
	await test('[data] Select number of country per continent', () => {
		assert.ok(ok);
	});


	//--------------------------------------------


	const querySize = await post(`database/querySize`, {
		query: selectCitiesNumber[config.wrapper],
	});
	await test('[data] Good size result', () => {
		assert.equal(querySize, Object.keys(cityNumber).length);
	});
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.mysql));
*/
export default run;
