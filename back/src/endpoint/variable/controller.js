import http from "../../shared/http.js";

class Controller {

	async list(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		try {
			res.send(await driver.variableList());
		} catch (e) {
			res.send({});
		}
	}

	async set(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		try {
			res.send(await driver.variableSet(req.body));
		} catch (e) {
			res.send({});
		}
	}
}

export default new Controller();
