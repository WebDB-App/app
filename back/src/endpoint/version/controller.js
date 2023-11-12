const http = require("../../shared/http.js");
const version = require("../../shared/version.js");
const subscriptionCtrl = require("../subscription/controller.js");

class Controller {

	async list(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.listPatch(database, driver, subscriptionCtrl.getPatchLimit(atob(req.get("Privatekey")))));
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

module.exports = new Controller();
