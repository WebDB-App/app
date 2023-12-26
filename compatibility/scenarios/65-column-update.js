import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";
import {getDatabase} from "../helper.js";

async function run(config) {
	const before = {...config.columns[0]};
	const after = {...config.columns[0]};

	//--------------------------------------------

	after.name = "changedName";
	const updatedName = await axios.post(`${config.api}column/modify`, {
		old: before,
		columns: [after]
	});
	await test('[column] Rename ok', () => {
		assert.equal(updatedName.status, 200);
		assert.ok(!updatedName.data.error);
	});
	if (updatedName.status !== 200 || !updatedName.data) {
		return;
	}
	before.name = after.name;


	//--------------------------------------------


	after.type = config.columns[1].type;
	const updatedType = await axios.post(`${config.api}column/modify`, {
		old: before,
		columns: [after]
	});
	await test(`[column] Cast from ${before.type} to ${after.type} ok`, () => {
		assert.equal(updatedType.status, 200);
		assert.ok(!updatedType.data.error);
	});
	if (updatedType.status !== 200 || !updatedType.data) {
		return;
	}
	before.type = after.type;


	//--------------------------------------------


	after.nullable = !after.nullable;
	const updatedNullable = await axios.post(`${config.api}column/modify`, {
		old: before,
		columns: [after]
	});
	await test('[column] Became nullable', () => {
		assert.equal(updatedNullable.status, 200);
		assert.ok(!updatedNullable.data.error);
	});
	before.nullable = after.nullable;


	//--------------------------------------------


	after.defaut = "Example";
	const updatedDefault = await axios.post(`${config.api}column/modify`, {
		old: before,
		columns: [after]
	});
	await test('[column] Default to "Example"', () => {
		assert.equal(updatedDefault.status, 200);
		assert.ok(!updatedDefault.data.error);
	});
	before.defaut = after.defaut;


	//--------------------------------------------


	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test("[column] Updated correspond to structure's one", () => {
		const db = getDatabase(structure.data.dbs, config.database);
		const table = db.tables.find(table => table.name === config.table);
		const cols = table.columns.filter(col => !col.name.startsWith('_id'));

		after.type = after.type.replace('character varying', 'varchar');

		assert.equal(cols[0].name, after.name);
		assert.equal(cols[0].type, after.type);
		assert.equal(cols[0].defaut.replaceAll("'", ""), after.defaut);
		assert.equal(cols[0].nullable, after.nullable);
	});
}

export default run;

/*
import {loadConfig} from "../config.js";
import servers from "../servers.js";
await add(await loadConfig(servers.mysql));
*/
