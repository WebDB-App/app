import assert from "node:assert";
import {test} from "node:test";
import {get, post} from "../api.js";

async function run(config) {

	const scan = await get("server/scan");

	assert.ok(scan.find(sc => sc.port === config.credentials.port));
	await test("[server] Scan found docker port");

	//--------------------------------------------

	const goodConnect = await post("server/connect", config.credentials);

	assert.ok(goodConnect.user && goodConnect.password);
	await test("[server] Connect with hard coded credentials");

	const currentWithoutCreds = structuredClone(config.credentials);
	currentWithoutCreds.user = "";
	currentWithoutCreds.password = "";

	config.credentials.name = currentWithoutCreds.name = "connection01";

	//--------------------------------------------

	const guess = await post("server/guess", currentWithoutCreds);
	const check_guess = guess.length >= 1;
	await test("[server] Guessed credentials", () => {
		assert.ok(check_guess);
	});
	if (check_guess) {

		//--------------------------------------------

		const connect = await post("server/connect", guess[0]);
		await test("[server] Connect with guessed credentials", () => {
			assert.ok(connect.user);
			assert.ok(connect.password);
		});
	}

	//--------------------------------------------

	const badConnect = await post("server/connect", currentWithoutCreds);
	await test("[server] Empty connect does not works", () => {
		assert.ok(badConnect.error);
	});

	//--------------------------------------------

	const preview = await post("server/structure?full=0&size=50", config.credentials);

	assert.ok(preview.dbs.length >= 1);
	await test("[server] Peview structure");

	//--------------------------------------------

	const full = await post("server/structure?full=1&size=50", config.credentials);

	assert.ok(full.dbs.length >= 1 && full.indexes.length >= 0 && full.relations.length >= 0);
	await test("[server] Full structure");
}

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
export default run;
