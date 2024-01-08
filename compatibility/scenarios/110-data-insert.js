import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../config.js";

async function run(config) {

	const dropped = await post(`data/insert`, [{
		"name": "WebDB",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}]);
	await test('[data] Insert ok', () => {
		assert.ok(!dropped.error);
	});

	//insert avec des quotes et char spéciaux
	//check si bon nombre de results


	//--------------------------------------------


}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
