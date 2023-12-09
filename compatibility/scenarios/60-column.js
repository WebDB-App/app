import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function drop(config) {
	const name = config.columns[2].name;

	const dropped = await axios.post(`${config.api}column/drop`, {column: name});
	await test('[column] Drop ok', () => {
		assert.equal(dropped.status, 200);
		assert.ok(!dropped.data.error);
	});

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test('[column] Created are not present in structure', () => {
		const table = structure.data.dbs.find(db => db.name.startsWith(config.database)).tables.find(table => table.name === config.table);

		assert.ok(table.columns.find(column => column.name === name) === undefined);
	});
}

async function add(config) {
	const columns = config.columns.slice(1);

	const created = await axios.post(`${config.api}column/add`, {columns});
	await test('[column] Creation ok', () => {
		assert.equal(created.status, 200);
		assert.ok(!created.data.error);
	});

	if (created.status !== 200 || created.data.error) {
		throw new Error();
	}

	//--------------------------------------------

	const structure = await axios.post(`${config.api}server/structure?full=1&size=50`, config.credentials);
	await test('[column] Created are present in structure', () => {
		const table = structure.data.dbs.find(db => db.name.startsWith(config.database)).tables.find(table => table.name === config.table);

		assert.ok(table.columns[1].name === columns[0].name);
		assert.ok(table.columns[2].name === columns[1].name);
		assert.ok(table.columns[3].name === columns[2].name);
	});
}

async function update(config) {
	const original = config.columns[1];
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
		columns: [{...updated, type: config.columns[2].type}]
	});
	await test(`[column] Cast from ${updated.type} to ${config.columns[2].type} ok`, () => {
		assert.equal(updatedType.status, 200);
		assert.ok(updatedType.data);
	});
	if (updatedType.status !== 200 || !updatedType.data) {
		return;
	}
	updated.type = config.columns[2].type;

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
	await test('[column] Updated correspond to structure\'s one', () => {
		const table = structure.data.dbs.find(db => db.name.startsWith(config.database)).tables.find(table => table.name === config.table);

		assert.ok(JSON.stringify(table.columns[1]) === JSON.stringify(updated));
	});
}

export default async (config) => {
	await add(config);
	await update(config);
	await drop(config);
};

/*
import {changeServer} from "../config.js";
import servers from "../servers.js";
await add(await changeServer(servers.mysql, "latest"));
*/
