import assert from 'node:assert';
import {test} from "node:test";
import {get, post} from "../config.js";

async function run(config) {

	const scan = await get(`server/scan`);
	const check_scan = scan.find(sc => sc.port === config.credentials.port);
	await test('[server] Scan found docker port', () => {
		assert.ok(check_scan);
	});
	if (!check_scan) {
		throw new Error();
	}

	//--------------------------------------------

	const goodConnect = await post(`server/connect`, config.credentials);
	const check_goodConnect = goodConnect.user && goodConnect.password;
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

	const guess = await post(`server/guess`, currentWithoutCreds);
	const check_guess = guess.length >= 1;
	await test('[server] Guessed credentials', () => {
		assert.ok(check_guess);
	});
	if (check_guess) {

		//--------------------------------------------

		const connect = await post(`server/connect`, guess[0]);
		await test('[server] Connect with guessed credentials', () => {
			assert.ok(connect.user);
			assert.ok(connect.password);
		});
	}

	//--------------------------------------------

	const badConnect = await post(`server/connect`, currentWithoutCreds);
	await test('[server] Empty connect does not works', () => {
		assert.ok(badConnect.error);
	});

	//--------------------------------------------

	const preview = await post(`server/structure?full=0&size=50`, config.credentials);
	const check_preview = preview.dbs.length >= 1;
	await test('[server] Peview structure', () => {
		assert.ok(check_preview);
	});
	if (!check_preview) {
		throw new Error();
	}

	//--------------------------------------------

	const full = await post(`server/structure?full=1&size=50`, config.credentials);
	const check_full = full.dbs.length >= 1 && full.indexes.length >= 0 && full.relations.length >= 0;
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
