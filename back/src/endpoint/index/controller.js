import http from "../../shared/http.js";

class Controller {

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropIndex(database, table, req.body.name));
	}

	async add(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.addIndex(database, table, req.body.name, req.body.type, req.body.columns));
	}
}

export default new Controller();
