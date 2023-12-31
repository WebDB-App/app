import assert from 'node:assert';
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../config.js";

async function run(config) {
	const before = {...config.columns[0]};
	const after = {...config.columns[0]};

	//--------------------------------------------

	after.name = "changedName";
	const updatedName = await post(`column/modify`, {
		old: before,
		columns: [after]
	});
	await test('[column] Rename ok', () => {
		assert.ok(!updatedName.error);
	});
	if (updatedName.error) {
		return;
	}
	before.name = after.name;


	//--------------------------------------------


	after.type = config.columns[1].type;
	const updatedType = await post(`column/modify`, {
		old: before,
		columns: [after]
	});
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
	});
	await test('[column] Set nullable', () => {
		assert.ok(!updatedNullable.error);
	});
	before.nullable = after.nullable;


	//--------------------------------------------


	after.defaut = "Example";
	const updatedDefault = await post(`column/modify`, {
		old: before,
		columns: [after]
	});
	await test('[column] Set default to "Example"', () => {
		assert.ok(!updatedDefault.error);
	});
	before.defaut = after.defaut;


	//--------------------------------------------


	const structure = await post(`server/structure?full=1&size=50`, config.credentials);
	await test("[column] Updated correspond to structure's one", () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);
		const cols = table.columns.filter(col => col.name !== '_id' && col.name !== "rowid");

		cols[0].defaut = cols[0].defaut.replaceAll("'", "").replace('::character varying', '');

		assert.equal(cols[0].name, after.name);
		assert.equal(cols[0].type, after.type);
		assert.equal(cols[0].defaut, after.defaut);
		assert.equal(cols[0].nullable, after.nullable);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await run(await loadConfig(servers.cockroachdb));
*/
