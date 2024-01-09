import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {selectCitiesNumber, tableCity} from "../base.js";
import {wrapper} from "../docker.js";

const insertCity = {
	[wrapper.PostgreSQL]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}],
	[wrapper.MySQL]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}],
	[wrapper.MongoDB]: [{
		"name": "WebDB and spé'cial\"s ch`@°r$ctữer㍐الْأَ",
		"lat": 42.42,
		"lng": 13.37,
		"country_id": 9,
		"region_code": null
	}]
};

//TODO ObjectID en country_id

async function run(config) {

	const dropped = await post(`data/insert`, insertCity[config.wrapper], tableCity);
	await test('[data] Insert ok', () => {
		assert.ok(!dropped.error);
	});


	//--------------------------------------------


	const query = await post(`database/query`, {
		query: selectCitiesNumber[config.wrapper],
		page: 0,
		pageSize: 100,
	});
	await test('[data] Inserted are calculated', () => {
		const q = query.find(data => data.continent === "AN");
		assert.equal(q.city_count, 4);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
