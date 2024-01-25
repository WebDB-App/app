import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {checkCityNumber, cityNumber, tableCity} from "../base.js";
import {base} from "../docker.js";

const insertCity = {
	[base.PostgreSQL]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}],
	[base.MySQL]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}],
	[base.MongoDB]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": {
			"$oid": "6589d44d3eaad6405f1aee08"
		},
		"region_code": null
	}]
};

async function run(config) {

	const insert = await post(`data/insert`, insertCity[config.base], tableCity);
	await test('[data] Insert ok', () => {
		assert.ok(!insert.error);
	});


	//--------------------------------------------

	cityNumber.AN++;
	const ok = await checkCityNumber(config);
	await test('[data] Inserted are calculated', () => {
		assert.ok(ok);
	});
}

export default run;
