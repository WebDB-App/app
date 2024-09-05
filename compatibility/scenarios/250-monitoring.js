import assert from "node:assert";
import {test} from "node:test";
import {post} from "../api.js";
import {tableCountry} from "../base.js";

async function run(config) {

	const table = await post("stats/tableSize", {}, tableCountry);
	await test("[monitoring] Table stats ok", () => {
		assert.strictEqual(table.error, undefined);
		assert.notStrictEqual(table.data_length, 0);
		assert.notStrictEqual(table.index_length, 0);
	});


	//--------------------------------------------


	if (config.wrapper !== "CockroachDB") {
		const db = await post("stats/dbSize", {});
		await test("[monitoring] Database stats ok", () => {
			assert.strictEqual(db.error, undefined);
			assert.notStrictEqual(db.data_length, 0);
			assert.notStrictEqual(db.index_length, 0);
		});
	}


	//--------------------------------------------


	const processes = await post("process/list", {});
	await test("[monitoring] Processes list ok", () => {
		assert.strictEqual(processes.error, undefined);
		assert.ok(processes.length >= 0);
	});
}

export default run;
