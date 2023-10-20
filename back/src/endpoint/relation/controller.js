const http = require("../../shared/http.js");

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
		const [driver, db] = await http.getLoggedDriver(req);

		res.send(await driver.exampleData(db, req.body.table, req.body.column, req.body.limit));
	}
}

module.exports = new Controller();
