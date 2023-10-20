const http = require("../../shared/http.js");

class Controller {

	async add(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.addColumns(database, table, req.body.columns));
	}

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropColumn(database, table, req.body.column));
	}

	async modify(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		if (JSON.stringify(req.body.old) === JSON.stringify(req.body.columns[0])) {
			return res.send({ok: true});
		}

		res.send(await driver.modifyColumn(database, table, req.body.old, req.body.columns[0]));
	}
}

module.exports = new Controller();
