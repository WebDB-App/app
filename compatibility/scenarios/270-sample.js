import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {tableCity} from "../base.js";

async function run(config) {
	const sample = await post(`database/sample`, {preSent: {
			tables: [tableCity.Table],
			deep: 2,
			count: 5,
			anonymize: 0},
		language: "fr-FR"}, tableCity);
	await test(`[sample] Found ${tableCity.Table} table and is long enough`, () => {
		assert.ok(!sample.error);
		assert.ok(sample.length > 100);
		assert.ok(sample.indexOf(tableCity.Table) > 0);
	});
}

export default run;
