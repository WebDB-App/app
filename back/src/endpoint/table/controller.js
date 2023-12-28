import http from "../../shared/http.js";

class Controller {

	async create(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.createTable(database, req.body));
	}

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropTable(database, table));
	}

	async rename(req, res) {
		const [driver, database, old_table] = await http.getLoggedDriver(req);

		res.send(await driver.renameTable(database, old_table, req.body.new_name));
	}

	async truncate(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.truncateTable(database, table));
	}

	async duplicate(req, res) {
		const [driver, database, old_table] = await http.getLoggedDriver(req);

		res.send(await driver.duplicateTable(database, old_table, req.body.new_name));
	}
}

export default new Controller();
