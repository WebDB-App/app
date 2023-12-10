import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const original = config.columns[0];
	const updated = {...original};
	const changedName = "changedName";

	const updatedName = await axios.post(`${config.api}column/modify`, {
		old: updated,
		columns: [{...updated, name: changedName}]
	});
	await test('[column] Rename ok', () => {
		assert.equal(updatedName.status, 200);
		assert.ok(updatedName.data);
	});
	if (updatedName.status !== 200 || !updatedName.data) {
		return;
	}
	updated.name = changedName;

	//--------------------------------------------

	const updatedType = await axios.post(`${config.api}column/modify`, {
		old: updated,
		columns: [{...updated, type: config.columns[1].type}]
	});
	await test(`[column] Cast from ${updated.type} to ${config.columns[1].type} ok`, () => {
		assert.equal(updatedType.status, 200);
		assert.ok(updatedType.data);
	});
	if (updatedType.status !== 200 || !updatedType.data) {
		return;
	}
	updated.type = config.columns[1].type;

	//--------------------------------------------

	const updatedNullable = await axios.post(`${config.api}column/modify`, {
		old: updated,
		columns: [{...updated, nullable: !updated.nullable}]
	});
	await test('[column] Became nullable', () => {
		assert.equal(updatedNullable.status, 200);
		assert.ok(updatedNullable.data);
	});
	updated.nullable = !updated.nullable;

	//--------------------------------------------

	const updatedDefault = await axios.post(`${config.api}column/modify`, {
		old: updated,
		columns: [{...updated, defaut: "Example"}]
	});
	await test('[column] Default to "Example"', () => {
		assert.equal(updatedDefault.status, 200);
		assert.ok(updatedDefault.data);
	});
	updated.defaut = "Example";

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test("[column] Updated correspond to structure's one", () => {
		const table = structure.data.dbs.find(db => db.name.startsWith(config.database)).tables.find(table => table.name === config.table);

		assert.ok(JSON.stringify(table.columns[0]) === JSON.stringify(updated));
	});
}

export default run;

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await add(await changeServer(servers.mysql, "latest"));
*/
