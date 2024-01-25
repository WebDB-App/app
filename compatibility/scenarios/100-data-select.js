import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {checkCityNumber, cityNumber, initCityNumber, selectCitiesNumber} from "../base.js";

async function run(config) {
	initCityNumber();

	const ok = await checkCityNumber(config);
	await test('[data] Select join ok', () => {
		assert.ok(ok);
	});


	//--------------------------------------------


	const querySize = await post(`database/querySize`, {
		query: selectCitiesNumber[config.base],
	});
	await test('[data] Select has good size', () => {
		assert.equal(querySize, Object.keys(cityNumber).length);
	});
}

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
export default run;
