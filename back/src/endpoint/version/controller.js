import http from "../../shared/http.js";
import version from "../../shared/version.js";

class Controller {

	async list(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.listPatch(database, driver));
		} catch (e) {
			console.error(e);
			res.send(e);
		}
	}

	async reset(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.resetTo(database, driver, req.body.sha1));
		} catch (e) {
			console.error(e);
			res.send(e);
		}
	}
}

export default new Controller();
