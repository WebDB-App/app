import assert from "node:assert";
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";

async function run(config) {
	const created = await post("database/create", {name: config.database.replace(" | public", "")});

	assert.strictEqual(created.error, undefined);
	assert.strictEqual(created.error, undefined);
	await test("[database] Creation ok");

	const structure = await post("server/structure?full=0&size=50", config.credentials);

	assert.strictEqual(structure.error, undefined);
	assert.ok(getDatabase(structure.dbs, config.database));
	await test("[database] Created is present in structure");
}

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.postgres));
*/
export default run;
