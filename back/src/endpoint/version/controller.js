const http = require("../../shared/http.js");
const version = require("../../shared/version.js");

class Controller {

	async list(req, res) {
		const [driver] = await http.getLoggedDriver(req);
		res.send(await driver.dropRelation(req.body.relation));
	}
}

module.exports = new Controller();
