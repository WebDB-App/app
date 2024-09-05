import assert from "node:assert";
import {test} from "node:test";
import {getDatabase} from "../helper.js";
import {post} from "../api.js";
import {columnsForTests, tableForStruct} from "../base.js";
import {base} from "../docker.js";

async function run(config) {
	const before = structuredClone(columnsForTests[config.base][0]);
	const after = structuredClone(columnsForTests[config.base][0]);

	//--------------------------------------------

	after.name = "changedName";
	const updatedName = await post("column/modify", {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test("[column] Rename ok", () => {
		assert.ok(!updatedName.error);
	});
	if (updatedName.error) {
		return;
	}
	before.name = after.name;


	//--------------------------------------------


	after.type = columnsForTests[config.base][1].type;
	const updatedType = await post("column/modify", {
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
	const updatedNullable = await post("column/modify", {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test("[column] Set nullable", () => {
		assert.ok(!updatedNullable.error);
	});
	before.nullable = after.nullable;


	//--------------------------------------------


	after.defaut = "'Example'";
	const updatedDefault = await post("column/modify", {
		old: before,
		columns: [after]
	}, tableForStruct);
	await test("[column] Set default to \"Example\"", () => {
		assert.ok(!updatedDefault.error);
	});


	//--------------------------------------------


	const structure = await post("server/structure?full=1&size=50", config.credentials, tableForStruct);
	await test("[column] Updated correspond to structure's one", () => {
		const db = getDatabase(structure.dbs, config.database);
		const table = db.tables.find(table => table.name === tableForStruct.Table);
		const cols = table.columns.filter(col => col.name !== "_id" && col.name !== "rowid");

		const final = cols.find(col => col.name === after.name);
		assert.ok(final);
		assert.equal(final.type, after.type);

		if (config.base !== base.MongoDB) {
			assert.equal(final.nullable, after.nullable);

			final.defaut = final.defaut.replace("::character varying", "");
			final.defaut = final.defaut.replaceAll("'", "");
			after.defaut = after.defaut.replaceAll("'", "");
			assert.equal(final.defaut, after.defaut);
		}
	});
}

export default run;

/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.cockroachdb));
*/
