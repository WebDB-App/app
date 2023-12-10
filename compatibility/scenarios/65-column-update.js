import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {getDatabase} from "../helper.js";

async function run(config) {
	const original = {...config.columns[0]};
	const updated = {...config.columns[0]};

	//--------------------------------------------

	updated.name = "changedName";
	const updatedName = await axios.post(`${config.api}column/modify`, {
		old: original,
		columns: [updated]
	});
	await test('[column] Rename ok', () => {
		assert.equal(updatedName.status, 200);
		assert.ok(updatedName.data);
	});
	if (updatedName.status !== 200 || !updatedName.data) {
		return;
	}
	original.name = updated.name;


	//--------------------------------------------


	updated.type = config.columns[1].type;
	const updatedType = await axios.post(`${config.api}column/modify`, {
		old: original,
		columns: [updated]
	});
	await test(`[column] Cast from ${updated.type} to ${config.columns[1].type} ok`, () => {
		assert.equal(updatedType.status, 200);
		assert.ok(updatedType.data);
	});
	if (updatedType.status !== 200 || !updatedType.data) {
		return;
	}
	original.type = updated.type;


	//--------------------------------------------


	updated.nullable = !updated.nullable;
	const updatedNullable = await axios.post(`${config.api}column/modify`, {
		old: original,
		columns: [updated]
	});
	await test('[column] Became nullable', () => {
		assert.equal(updatedNullable.status, 200);
		assert.ok(updatedNullable.data);
	});
	original.nullable = updated.nullable;



	//--------------------------------------------


	updated.defaut = "Example";
	const updatedDefault = await axios.post(`${config.api}column/modify`, {
		old: original,
		columns: [updated]
	});
	await test('[column] Default to "Example"', () => {
		assert.equal(updatedDefault.status, 200);
		assert.ok(updatedDefault.data);
	});
	original.defaut = updated.defaut;


	//--------------------------------------------


	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test("[column] Updated correspond to structure's one", () => {
		const db = getDatabase(structure.data.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);

		assert.ok(JSON.stringify(table.columns[0]) === JSON.stringify(updated));
	});
}

export default run;

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await add(await changeServer(servers.mysql, "latest"));
*/
