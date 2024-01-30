import assert from "node:assert";
import {test} from "node:test";
import {post} from "../api.js";

async function getCountryIndexes(config) {
	const structure = await post("server/structure?full=1&size=50", config.credentials);
	return structure.indexes.filter(index => {
		if (index.table !== "country") {
			return false;
		}
		return index.database === config.database;
	});
}

async function run(config) {
	const countryIndexes = await getCountryIndexes(config);

	const primary_index = countryIndexes.find(index => index.primary);
	const name_index = countryIndexes.find(index => index.name === "unique_country_name");

	await test("[index] Foreign key found in structure", () => {
		assert.ok(primary_index);
		assert.ok(name_index.columns[0] === "name" && name_index.unique);
	});


	//--------------------------------------------


	const dropped = await post("index/drop", name_index);
	const droppedCheck = await getCountryIndexes(config);
	await test("[index] Drop ok", () => {
		assert.ok(!dropped.error);
		assert.ok(!droppedCheck.find(index => index.name === "unique_country_name"));
	});


	//--------------------------------------------


	const added = await post("index/add", name_index);
	const addedCheck = await getCountryIndexes(config);
	await test("[index] Add ok", () => {
		assert.ok(!added.error);
		assert.ok(addedCheck.find(index => index.name === "unique_country_name"));
	});
}

export default run;
/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
