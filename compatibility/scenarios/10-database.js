import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {getDatabase} from "../helper.js";

async function run(config) {
	const created = await axios.post(`${config.api}database/create`, {name: config.database});
	await test('[database] Creation ok', () => {
		assert.notEqual(created.data, {error: ""});
	});
	if (created.status !== 200 || created.data.error) {
		throw new Error();
	}

	const structure = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	const check_structure = getDatabase(structure.data.dbs, config.database);
	await test('[database] Created is present in structure', () => {
		assert.ok(check_structure);
	});
	if (!check_structure) {
		throw new Error();
	}
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.postgres));
*/
export default run;
