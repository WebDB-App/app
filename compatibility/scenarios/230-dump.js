import assert from "node:assert";
import {test} from "node:test";
import {listenAddr, post} from "../api.js";
import {base} from "../docker.js";
import {iterateDir} from "../helper.js";
import {readFile} from "node:fs/promises";

const defaultParams = {
	[base.MongoDB]: {
		options: "",
		exportType: "bson"
	},
	[base.PostgreSQL]: {
		options: "",
		exportType: "sql"
	},
	[base.MySQL]: {
		options: "--column-statistics=0",
		exportType: "sql"
	},
};

function calculateMatchPercentage(number1, number2) {
	const difference = Math.abs(number1 - number2);
	const maxNumber = Math.max(number1, number2);
	return ((maxNumber - difference) / maxNumber) * 100;
}

async function run(config) {

	if (config.wrapper === "CockroachDB") {
		return;
	}


	//--------------------------------------------


	defaultParams[config.base].tables = false;

	const dump = await post("server/dump", defaultParams[config.base]);
	await test("[dump] Dump world ok", () => {
		assert.ok(!dump.error);
		assert.ok(dump.path);
	});

	if (dump.error || !dump.path) {
		return;
	}

	const req = await fetch(listenAddr + dump.path);
	const file = await req.blob();
	const files = await iterateDir(`../static/world-${config.base.toLowerCase()}/`);
	const origin = new Blob([await readFile(files[0])]);

	await test("[dump] Dump size match original one", () => {
		const percent = calculateMatchPercentage(file.size, origin.size);
		assert.ok(percent > 90);
	});
}

export default run;
/*
import {loadConfig} from "../api.js";
import servers from "../docker.js";
await run(await loadConfig(servers.mysql));
*/
