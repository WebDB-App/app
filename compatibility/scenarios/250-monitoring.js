import assert from "node:assert";
import {test} from "node:test";
import {post} from "../api.js";
import {tableCity} from "../base.js";

async function run(config) {

	const table = await post("stats/tableSize", {}, tableCity);
	await test("[monitoring] Table stats ok", () => {
		assert.ok(!table.error);
		assert.ok(table.data_length > 0);
		assert.ok(table.index_length > 0);
	});


	//--------------------------------------------


	if (config.wrapper !== "CockroachDB") {
		const db = await post("stats/dbSize", {});
		await test("[monitoring] Database stats ok", () => {
			assert.ok(!db.error);
			assert.ok(db.data_length > 0);
			assert.ok(db.index_length > 0);
		});
	}


	//--------------------------------------------


	const processes = await post("process/list", {});
	await test("[monitoring] Processes list ok", () => {
		assert.ok(!processes.error);
		assert.ok(processes.length >= 0);
	});
}

export default run;
