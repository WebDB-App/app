import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";

async function getCountryIndexes(config) {
	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	return structure.indexes.filter(index => {
		if (index.table !== "country") {
			return false;
		}
		return relation.database === config.database;
	});
}

async function run(config) {

	/*const countryIndexes = await getCountryIndexes(config);

	if (config.base !== "MongoDB") {
		const continent_id = countryIndexes.find(index => index.columns[0] === "continent_id");

		await test('[index] Foreign key found in structure', () => {
			assert.ok(!continent_id.primary);
			assert.ok(!continent_id.unique);
		});

		const continent_id = countryIndexes.find(index => index.columns[0] === "continent_id");

		await test('[index] Foreign key found in structure', () => {
			assert.ok(!continent_id.primary);
			assert.ok(!continent_id.unique);
		});
	}






	//--------------------------------------------


	const dropped = await post(`relation/drop`, {relation: countryRelation});
	const droppedCheck = await getCountryRelation(config);
	await test('[relation] Drop ok', () => {
		assert.ok(!dropped.error);
		assert.ok(!droppedCheck);
	});


	//--------------------------------------------


	const added = await post(`relation/add`, {relation: countryRelation});
	const addedCheck = await getCountryRelation(config);
	await test('[relation] Add ok', () => {
		assert.ok(!added.error);
		assert.ok(addedCheck);
	});*/
}

export default run;
/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mongo));
*/
