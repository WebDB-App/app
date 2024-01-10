import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {checkCityNumber, cityNumber, tableCity} from "../base.js";
import {wrapper} from "../docker.js";

const old_data = {
	[wrapper.PostgreSQL]: {
		"name": "Jerusalem",
		"lat": "31.76904",
		"lng": "35.21633",
		"country_id": 103,
		"region_code": null
	},
	[wrapper.MySQL]: {
		"name": "Jerusalem",
		"lat": "31.76904",
		"lng": "35.21633",
		"country_id": 103,
		"region_code": null
	},
	[wrapper.MongoDB]: {
		"name": "Jerusalem",
		"lat": "31.76904",
		"lng": "35.21633",
		"country_id": {
			"$oid": "6589d44e3eaad6405f1aefd3"
		},
		"region_code": null
	}
};
const new_data = {
	[wrapper.PostgreSQL]: {
		"name": "Jerusalem",
		"lat": 47.47156,
		"lng": -0.55202,
		"country_id": 75,
		"region_code": "FR.52.49"
	},
	[wrapper.MySQL]: {
		"name": "Jerusalem",
		"lat": 47.47156,
		"lng": -0.55202,
		"country_id": 75,
		"region_code": "FR.52.49"
	},
	[wrapper.MongoDB]: {
		"name": "Jerusalem",
		"lat": 47.47156,
		"lng": -0.55202,
		"country_id": {
			"$oid": "6589d44e3eaad6405f1aef62"
		},
		"region_code": "FR.52.49"
	}
};

async function run(config) {

	const updated = await post(`data/update`, {old_data: old_data[config.wrapper], new_data: new_data[config.wrapper]}, tableCity);
	await test('[data] Update ok', () => {
		assert.ok(!updated.error);
	});


	//--------------------------------------------


	cityNumber.EU++;
	cityNumber.AS--;
	const ok = await checkCityNumber(config);
	await test('[data] Updated are calculated', () => {
		assert.ok(ok);
	});
}

export default run;
