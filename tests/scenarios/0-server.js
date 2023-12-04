import assert from 'node:assert';
import {test} from "node:test";
import axios from "axios";
import * as fs from "fs";
import {iterateDir} from "../helper.js";

async function run(config) {

	const scan = await axios.get(`${config.api}server/scan`);
	const result_scan = scan.data.find(sc => sc.port === config.credentials.port);
	await test('[connection] Scan found docker port', () => {
		assert.ok(result_scan);
	});
	if (!result_scan) {
		throw new Error();
	}

	//--------------------------------------------

	const goodConnect = await axios.post(`${config.api}server/connect`, config.credentials);
	const result_goodConnect = goodConnect.data.user && goodConnect.data.password;
	await test('[connection] connect with hard coded credentials works', () => {
		assert.ok(result_goodConnect);
	});
	if (!result_goodConnect) {
		throw new Error();
	}

	config.credentials.name = currentWithoutCreds.name = "connection01";

	//--------------------------------------------

	const currentWithoutCreds = {...config.credentials};
	currentWithoutCreds.user = "";
	currentWithoutCreds.password = "";

	const guess = await axios.post(`${config.api}server/guess`, currentWithoutCreds);
	const result_guess = guess.data.length >= 1;
	await test('[connection] Guessed credentials', () => {
		assert.ok(result_guess);
	});
	if (result_guess) {

		//--------------------------------------------

		const connect = await axios.post(`${config.api}server/connect`, guess.data[0]);
		test('[connection] Connect with guessed credentials works', () => {
			assert.ok(connect.data.user);
			assert.ok(connect.data.password);
		});
	}

	//--------------------------------------------

	const badConnect = await axios.post(`${config.api}server/connect`, currentWithoutCreds);
	test('[connection] Empty connect does not works', () => {
		assert.ok(badConnect.data.error);
	});

	//--------------------------------------------

	const preview = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	const result_preview = preview.data.dbs.length >= 1;
	await test('[connection] Peview structure works', () => {
		assert.ok(result_preview);
	});
	if (!result_preview) {
		throw new Error();
	}

	//--------------------------------------------

	const full = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	const result_full = full.data.dbs.length >= 1 && full.data.indexes.length >= 0 && full.data.relations.length >= 0;
	await test('[connection] Full structure works', () => {
		assert.ok(result_full);
	});
	if (!result_full) {
		throw new Error();
	}

	//--------------------------------------------

	/*const files = await iterateDir(`../dataset/${config.wrapper.toLowerCase()}/test/`);
	const form_data = new FormData();
	for (const file of files) {
		form_data.append("files[]", fs.createReadStream(file), file);
	}

	const loaded = await axios.post(`${config.api}server/load`, form_data, {
		headers: { "Content-Type": "multipart/form-data" },
		data: form_data
	});
	test('[connection] Load pagila dataset works', () => {
		assert.ok(result_load);
	});*/

	/*
	load json et native (avec complex dedans)

	dump
	 */
}

//import {changeServer} from "../config.js";
//await run(await changeServer("percona", "8"));

export default run;
