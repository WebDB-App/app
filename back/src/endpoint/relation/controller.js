import http from "../../shared/http.js";

class Controller {

	async drop(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.dropRelation(req.body.relation));
	}

	async add(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.addRelation(req.body.relation));
	}

	async exampleData(req, res) {
		const [driver, db, table] = await http.getLoggedDriver(req);

		res.send(await driver.exampleData(db, table, req.body.column, req.body.limit));
	}
}

export default new Controller();
