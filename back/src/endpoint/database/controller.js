import http from "../../shared/http.js";

class Controller {

	async create(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.createDatabase(req.body.name));
	}

	async drop(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.dropDatabase(database));
	}

	async stats(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.statsDatabase(database));
	}

	async sample(req, res) {
		const [wrapper, database] = await http.getLoggedDriver(req);

		res.send(await wrapper.sampleDatabase(database, req.body.limit));
	}

	async query(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.runPagedQuery(req.body.query, req.body.page, req.body.pageSize, database));
	}

	async querySize(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.querySize(req.body.query, database));
	}

	async setCollation(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.setCollation(database, req.body.collation));
	}

	async getAvailableCollations(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		const collations = await driver.getAvailableCollations();

		res.send(collations.map(collation => collation["Collation"]).sort());
	}
}

export default new Controller();
