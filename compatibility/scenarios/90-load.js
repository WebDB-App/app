import assert from "node:assert";
import {test} from "node:test";
import {readFile} from "node:fs/promises";
import {getDatabase, iterateDir} from "../helper.js";
import {multipart, post} from "../api.js";

async function run(config) {

	const files = await iterateDir(`../static/world-${config.base.toLowerCase()}/`);
	const form_data = new FormData();
	for (const file of files) {
		form_data.append("files[]", new Blob([await readFile(file)]));
	}

	const loaded = await multipart("server/load", form_data);

	assert.ok(loaded.ok);
	await test("[load] Load native dataset");

	const structure = await post("server/structure?full=0&size=50", config.credentials);
	await test("[load] Loaded dataset is present in structure", () => {
		assert.ok(getDatabase(structure.dbs, config.database));
	});
}

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.percona));
*/
export default run;
