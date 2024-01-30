import assert from "node:assert";
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";
import {columnsForTests, tableForStruct} from "../base.js";

async function run(config) {
	const name = columnsForTests[config.base][2].name;

	const dropped = await post("column/drop", {column: name}, tableForStruct);
	await test("[column] Drop ok", () => {
		assert.ok(!dropped.error);
	});

	//--------------------------------------------

	const structure = await post("server/structure?full=1&size=50", config.credentials, tableForStruct);
	await test("[column] Created are not present in structure", () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === tableForStruct.Table);

		assert.ok(table.columns.find(column => column.name === name) === undefined);
	});
}

export default run;
