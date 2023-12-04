import http from "../../shared/http.js";

class Controller {

	async list(req, res) {
		const [driver] = await http.getLoggedDriver(req);
		let list = [];
		try {
			list = await driver.process();
		} catch (e) {
			console.error(e);
		}

		res.send(list);
	}

	async kill(req, res) {
		const [driver] = await http.getLoggedDriver(req);
		let list = [];
		try {
			list = await driver.kill(req.body.pid);
		} catch (e) {
			console.error(e);
		}

		res.send(list);
	}
}

export default new Controller();
