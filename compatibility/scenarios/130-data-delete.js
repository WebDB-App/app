import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {checkCityNumber, cityNumber, tableCity} from "../base.js";

const data = [{
	"name": "Jerusalem",
	"lat": 47.47156,
	"lng": -0.55202,
	"region_code": "FR.52.49"
}];

async function run(config) {

	const updated = await post(`data/delete`, data, tableCity);
	await test('[data] Delete ok', () => {
		assert.ok(!updated.error);
	});


	//--------------------------------------------


	cityNumber.EU--;
	const ok = await checkCityNumber(config);
	await test('[data] Deleted are calculated', () => {
		assert.ok(ok);
	});
}

export default run;
