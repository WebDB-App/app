import assert from 'node:assert';
import {test} from "node:test";
import axios from "axios";

async function run(config) {

	const scan = await axios.get(`${config.api}server/scan`);
	const check_scan = scan.data.find(sc => sc.port === config.credentials.port);
	await test('[server] Scan found docker port', () => {
		assert.ok(check_scan);
	});
	if (!check_scan) {
		throw new Error();
	}

	//--------------------------------------------

	const goodConnect = await axios.post(`${config.api}server/connect`, config.credentials);
	const check_goodConnect = goodConnect.data.user && goodConnect.data.password;
	await test('[server] Connect with hard coded credentials', () => {
		assert.ok(check_goodConnect);
	});
	if (!check_goodConnect) {
		throw new Error();
	}

	const currentWithoutCreds = {...config.credentials};
	currentWithoutCreds.user = "";
	currentWithoutCreds.password = "";

	config.credentials.name = currentWithoutCreds.name = "connection01";

	//--------------------------------------------

	const guess = await axios.post(`${config.api}server/guess`, currentWithoutCreds);
	const check_guess = guess.data.length >= 1;
	await test('[server] Guessed credentials', () => {
		assert.ok(check_guess);
	});
	if (check_guess) {

		//--------------------------------------------

		const connect = await axios.post(`${config.api}server/connect`, guess.data[0]);
		await test('[server] Connect with guessed credentials', () => {
			assert.ok(connect.data.user);
			assert.ok(connect.data.password);
		});
	}

	//--------------------------------------------

	const badConnect = await axios.post(`${config.api}server/connect`, currentWithoutCreds);
	await test('[server] Empty connect does not works', () => {
		assert.ok(badConnect.data.error);
	});

	//--------------------------------------------

	const preview = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	const check_preview = preview.data.dbs.length >= 1;
	await test('[server] Peview structure', () => {
		assert.ok(check_preview);
	});
	if (!check_preview) {
		throw new Error();
	}

	//--------------------------------------------

	const full = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	const check_full = full.data.dbs.length >= 1 && full.data.indexes.length >= 0 && full.data.relations.length >= 0;
	await test('[server] Full structure', () => {
		assert.ok(check_full);
	});
	if (!check_full) {
		throw new Error();
	}
}

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.mysql));
*/
export default run;
