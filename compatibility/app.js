import {suite, test} from "node:test";
import assert from "node:assert";
import {runWebDB} from "./helper.js";

runWebDB();

await suite("webdb:app", async () => {

	const logs = await (await fetch("http://localhost:22070/logs/finished.log", {
		"method": "GET",
	})).text();
	await test("[monitoring] Finished queries list ok", async () => {
		assert.notEqual(logs.length, 0);
	});


	//--------------------------------------------


});
