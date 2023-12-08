import assert from 'node:assert';
import {test} from "node:test";
import axios from "axios";

async function run(config) {

	const scan = await axios.get(`${config.api}server/scan`);
	const result_scan = scan.data.find(sc => sc.port === config.credentials.port);
	await test('[server] Scan found docker port', () => {
		assert.ok(result_scan);
	});
	if (!result_scan) {
		throw new Error();
	}

	//--------------------------------------------

	const goodConnect = await axios.post(`${config.api}server/connect`, config.credentials);
	const result_goodConnect = goodConnect.data.user && goodConnect.data.password;
	await test('[server] Connect with hard coded credentials works', () => {
		assert.ok(result_goodConnect);
	});
	if (!result_goodConnect) {
		throw new Error();
	}

	const currentWithoutCreds = {...config.credentials};
	currentWithoutCreds.user = "";
	currentWithoutCreds.password = "";

	config.credentials.name = currentWithoutCreds.name = "connection01";

	//--------------------------------------------

	const guess = await axios.post(`${config.api}server/guess`, currentWithoutCreds);
	const result_guess = guess.data.length >= 1;
	await test('[server] Guessed credentials', () => {
		assert.ok(result_guess);
	});
	if (result_guess) {

		//--------------------------------------------

		const connect = await axios.post(`${config.api}server/connect`, guess.data[0]);
		test('[server] Connect with guessed credentials works', () => {
			assert.ok(connect.data.user);
			assert.ok(connect.data.password);
		});
	}

	//--------------------------------------------

	const badConnect = await axios.post(`${config.api}server/connect`, currentWithoutCreds);
	test('[server] Empty connect does not works', () => {
		assert.ok(badConnect.data.error);
	});

	//--------------------------------------------

	const preview = await axios.post(`${config.api}server/structure?full=0&size=50`, config.credentials);
	const result_preview = preview.data.dbs.length >= 1;
	await test('[server] Peview structure works', () => {
		assert.ok(result_preview);
	});
	if (!result_preview) {
		throw new Error();
	}

	//--------------------------------------------

	const full = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	const result_full = full.data.dbs.length >= 1 && full.data.indexes.length >= 0 && full.data.relations.length >= 0;
	await test('[server] Full structure works', () => {
		assert.ok(result_full);
	});
	if (!result_full) {
		throw new Error();
	}
}

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await run(await changeServer(servers.mysql, "latest"));
*/
export default run;
