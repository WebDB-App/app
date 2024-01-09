import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";
import {columnsForTests, tableForStruct} from "../base.js";

async function run(config) {
	const table = {
		name: tableForStruct.Table, columns: [columnsForTests[config.wrapper][0]]
	};

	const created = await post(`table/create`, table);
	await test('[table] Creation ok', () => {
		assert.ok(!created.error);
	});
	if (created.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	await test('[table] Created is present in structure', () => {
		const db = getDatabase(structure.dbs, config.database);
		assert.ok(db.tables.find(table => table.name === tableForStruct.Table));
	});

	//--------------------------------------------

	const oldTable = {...tableForStruct};
	const duplicate = await post(`table/duplicate`, {new_name: "tableTest02"}, oldTable);
	await test('[table] Duplication ok', () => {
		assert.ok(!duplicate.error);
	});

	//--------------------------------------------

	oldTable.Table = "tableTest02";
	const renamed = await post(`table/rename`, {new_name: "tableTest03"}, oldTable);
	await test('[table] Rename ok', () => {
		assert.ok(!renamed.error);
	});

	//--------------------------------------------

	oldTable.Table = "tableTest03";
	const truncated = await post(`table/truncate`, {}, oldTable);
	await test('[table] Truncate ok', () => {
		assert.ok(!truncated.error);
	});

	//--------------------------------------------

	const dropped = await post(`table/drop`, {}, oldTable);
	await test('[table] Drop ok', () => {
		assert.ok(!dropped.error);
	});
}

export default run;
