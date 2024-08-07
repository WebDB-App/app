import assert from "node:assert";
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";

async function run(config) {
	const created = await post("database/create", {name: config.database.replace(" | public", "")});
	await test("[database] Creation ok", () => {
		assert.ok(!created.error);
	});
	if (created.error) {
		throw new Error();
	}

	const structure = await post("server/structure?full=0&size=50", config.credentials);
	const check_structure = getDatabase(structure.dbs, config.database);
	await test("[database] Created is present in structure", () => {
		assert.ok(check_structure);
	});
	if (!check_structure) {
		throw new Error();
	}
}

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.postgres));
*/
export default run;
