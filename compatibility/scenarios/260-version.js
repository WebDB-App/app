import assert from "node:assert";
import {test} from "node:test";
import {post} from "../api.js";

// eslint-disable-next-line no-unused-vars
async function run(config) {
	const versions = await post("version/list", {});
	await test("[version] List ok", () => {
		assert.ok(!versions.error);
	});
}

export default run;
