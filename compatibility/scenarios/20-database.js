import assert from 'node:assert';
import axios from "axios";
import {test} from "node:test";

async function run(config) {
	const created = await axios.post(`${config.api}database/create`, {name: config.database});
	test('[database] Creation works', () => {
		assert.equal(created.status, 200);
		assert.ok(!created.data.error);
	});
	if (created.status !== 200 || created.data.error) {
		throw new Error();
	}

	/*
	router.post("/query", databaseCtrl.query);
router.post("/querySize", databaseCtrl.querySize);
router.post("/duplicate", databaseCtrl.duplicate);
router.post("/sample", databaseCtrl.sample);
router.post("/availableCollations", databaseCtrl.getAvailableCollations);
	 */
}

export default run;
