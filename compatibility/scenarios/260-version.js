import assert from 'node:assert';
import {test} from "node:test";
import {post} from "../api.js";

async function run(config) {
	const versions = await post(`version/list`, {});
	await test('[version] Found some version', () => {
		assert.ok(!versions.error);
		assert.ok(versions.length > 0);
	});
}

export default run;
