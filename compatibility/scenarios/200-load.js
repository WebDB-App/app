import assert from 'node:assert';
import {test} from "node:test";
import axios from "axios";
import * as fs from "fs";
import {getDatabase, iterateDir} from "../helper.js";
import FormData from 'form-data';

async function run(config) {

	const files = await iterateDir(`../static/world-${config.wrapper.toLowerCase()}/`);
	const form_data = new FormData();
	for (const file of files) {
		form_data.append("files[]", fs.createReadStream(file)/*, file.split('/').pop()*/);
	}

	const loaded = await axios.post(`${config.api}server/load`, form_data, {
		headers: {"Content-Type": "multipart/form-data"}
	});
	const check_loaded = loaded.status === 200 && loaded.data.ok;
	await test('[load] Load world dataset', async () => {
		assert.ok(check_loaded);
	});
	if (!check_loaded) {
		throw new Error();
	}

	const structure = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	await test('[load] World database is present in structure', () => {
		assert.ok(getDatabase(structure.data.dbs, config.database));
	});


	//--------------------------------------------


	//TODO dump -> file size ~ equivalent
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.percona));
*/
export default run;
