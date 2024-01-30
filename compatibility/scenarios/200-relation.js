import assert from "node:assert";
import {test} from "node:test";
import {post} from "../api.js";
import {base} from "../docker.js";

async function getCountryRelation(config) {
	const structure = await post("server/structure?full=1&size=50", config.credentials);
	return structure.relations.find(relation => {
		if (relation.table_source !== "country") {
			return false;
		}
		return relation.database === config.database;
	});
}

async function run(config) {

	const countryRelation = await getCountryRelation(config);
	await test("[relation] country->continent found in structure", () => {
		assert.equal(countryRelation.column_source, "continent_id");
		assert.equal(countryRelation.table_dest, "continent");
	});
	if (!countryRelation) {
		return;
	}
	if (config.base === base.MongoDB) {
		return;
	}


	//--------------------------------------------


	const dropped = await post("relation/drop", {relation: countryRelation});
	const droppedCheck = await getCountryRelation(config);
	await test("[relation] Drop ok", () => {
		assert.ok(!dropped.error);
		assert.ok(!droppedCheck);
	});


	//--------------------------------------------


	const added = await post("relation/add", {relation: countryRelation});
	const addedCheck = await getCountryRelation(config);
	await test("[relation] Add ok", () => {
		assert.ok(!added.error);
		assert.ok(addedCheck);
	});
}

export default run;

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
