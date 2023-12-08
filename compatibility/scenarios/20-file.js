import assert from 'node:assert';
import {test} from "node:test";
import axios from "axios";
import * as fs from "fs";
import {iterateDir} from "../helper.js";
import FormData from 'form-data';

async function run(config) {

	const sakilaName = "sakila";
	const oldDb = axios.defaults.headers.common['Database'];
	axios.defaults.headers.common['Database'] = sakilaName;

	await axios.post(`${config.api}database/create`, {name: sakilaName});

	const files = await iterateDir(`./sakila/${config.wrapper.toLowerCase()}/`);
	const form_data = new FormData();
	for (const file of files) {
		form_data.append("files[]", fs.createReadStream(file)/*, file.split('/').pop()*/);
	}

	const loaded = await axios.post(`${config.api}server/load`, form_data, {
		headers: { "Content-Type": "multipart/form-data" }
	});
	const result_loaded = loaded.status === 200 && loaded.data.ok;
	test('[file] Load sakila dataset', async () => {
		assert.ok(result_loaded);
	});
	if (!result_loaded) {
		throw new Error();
	}

	const structure = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	test('[file] Sakila database is present in structure', () => {
		assert.ok(structure.data.dbs.find(db => db.name.startsWith(sakilaName)));
	});


	//--------------------------------------------


	//dump -> file size ~ equivalent


	//--------------------------------------------


	//TODO load+dump json


	//--------------------------------------------


	axios.defaults.headers.common['Database'] = oldDb;
}

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await run(await changeServer(servers.postgres, "latest"));
*/

export default run;
