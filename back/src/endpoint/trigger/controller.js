import http from "../../shared/http.js";

class Controller {

	async drop(req, res) {
		const [driver, db, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropTrigger(db, req.body.name, table));
	}

	async replace(req, res) {
		const [driver, db, table] = await http.getLoggedDriver(req);

		res.send(await driver.replaceTrigger(db, table, req.body));
	}

	async list(req, res) {
		const [driver, db, table] = await http.getLoggedDriver(req);

		res.send(await driver.listTrigger(db, table));
	}
}

export default new Controller();
