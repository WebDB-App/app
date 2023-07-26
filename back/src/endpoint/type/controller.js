import http from "../../shared/http.js";

class Controller {

	async drop(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.dropType(req.body.type));
	}

	async add(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.addType(req.body.type));
	}

	async modify(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.modifyType(req.body.type));
	}
}

export default new Controller();
