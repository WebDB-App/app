import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";
import {columnsForTests, tableForStruct} from "../base.js";

async function run(config) {
	const before = {...columnsForTests[config.wrapper][0]};
	const after = {...columnsForTests[config.wrapper][0]};

	//--------------------------------------------

	after.name = "changedName";
	const updatedName = await post(`column/modify`, {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test('[column] Rename ok', () => {
		assert.ok(!updatedName.error);
	});
	if (updatedName.error) {
		return;
	}
	before.name = after.name;


	//--------------------------------------------


	after.type = columnsForTests[config.wrapper][1].type;
	const updatedType = await post(`column/modify`, {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test(`[column] Cast from ${before.type} to ${after.type} ok`, () => {
		assert.ok(!updatedType.error);
	});
	if (updatedType.error) {
		return;
	}
	before.type = after.type;


	//--------------------------------------------


	after.nullable = !after.nullable;
	const updatedNullable = await post(`column/modify`, {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test('[column] Set nullable', () => {
		assert.ok(!updatedNullable.error);
	});
	before.nullable = after.nullable;


	//--------------------------------------------


	after.defaut = "Example";
	const updatedDefault = await post(`column/modify`, {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test('[column] Set default to "Example"', () => {
		assert.ok(!updatedDefault.error);
	});
	before.defaut = after.defaut;


	//--------------------------------------------


	const structure = await post(`server/structure?full=1&size=50`, config.credentials, tableForStruct);
	await test("[column] Updated correspond to structure's one", () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === tableForStruct.Table);
		const cols = table.columns.filter(col => col.name !== '_id' && col.name !== "rowid");

		const final = cols.find(col => col.name === after.name);
		assert.ok(final);
		assert.equal(final.type, after.type);

		if (config.wrapper !== "MongoDB") {
			assert.equal(final.nullable, after.nullable);
			final.defaut = final.defaut.replaceAll("'", "").replace('::character varying', '');
			assert.equal(final.defaut, after.defaut);
		}
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.cockroachdb));
*/
