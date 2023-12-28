import http from "../../shared/http.js";

class Controller {

	async create(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.createView(database, req.body.name, req.body.code, table));
	}

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropView(database, table));
	}

	async getCode(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.getViewCode(database, table));
	}
}

export default new Controller();
