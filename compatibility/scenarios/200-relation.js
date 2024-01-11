import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";
import {getDatabase} from "../helper.js";

async function getCountryRelation(config) {
	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	return structure.relations.find(relation => {
		if (relation.table_source !== "country") {
			return false;
		}
		return relation.database === config.database || relation.database === (config.database + " ¦ public");
	});
}

async function run(config) {

	const countryRelation = await getCountryRelation(config);
	await test('[relation] Country->Continent relation found in structure', () => {
		assert.ok(countryRelation.column_source, "continent_id");
		assert.ok(countryRelation.table_dest, "continent");
	});
	if (!countryRelation) {
		return;
	}
	if (config.wrapper === "MongoDB") {
		return;
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
	});
}

export default run;

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
