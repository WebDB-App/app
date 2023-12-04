import http from "../../shared/http.js";

class Controller {

	async create(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.createTable(database, req.body));
	}

	async createView(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.createView(database, req.body.name, req.body.code, table));
	}

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropTable(database, table));
	}

	async dropView(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropView(database, table));
	}

	async rename(req, res) {
		const [driver, database, old_table] = await http.getLoggedDriver(req);

		res.send(await driver.renameTable(database, old_table, req.body.new_name));
	}

	async truncate(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.truncateTable(database, table));
	}

	async dropRelation(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropRelation(database, table, req.body.relation));
	}

	async addRelation(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.addRelation(database, table, req.body.relation));
	}

	async duplicate(req, res) {
		const [driver, database, old_table] = await http.getLoggedDriver(req);

		res.send(await driver.duplicateTable(database, old_table, req.body.new_name));
	}
}

export default new Controller();
