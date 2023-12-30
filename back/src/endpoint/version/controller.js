import http from "../../shared/http.js";
import version from "../../shared/version.js";

class Controller {

	async list(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.list(database, driver, req.body.page));
		} catch (e) {
			console.error(e);
			res.send(e);
		}
	}

	async diff(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.diff(database, driver, req.body.hash));
		} catch (e) {
			console.error(e);
			res.send(e);
		}
	}

	async reset(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.reset(database, driver, req.body.hash));
		} catch (e) {
			console.error(e);
			res.send(e);
		}
	}
}

export default new Controller();
