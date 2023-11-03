const http = require("../../shared/http.js");

class Controller {

	async dbSize(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await driver.statsDatabase(database));
		} catch (e) {
			console.error(e);
			res.send({});
		}
	}

	async tableSize(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		try {
			res.send(await driver.statsTable(database, table));
		} catch (e) {
			res.send({});
		}
	}

	async server(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		try {
			res.send(await driver.serverStats());
		} catch (e) {
			res.send({});
		}
	}
}

module.exports = new Controller();
