import http from "../../shared/http.js";

class Controller {

	async add(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.addColumns(database, table, req.body.columns.map(col => col.length)));
	}

	async drop(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.dropColumn(database, table, req.body.column));
	}

	async modify(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.modifyColumn(database, table, req.body.old, req.body.columns[0]));
	}
}

export default new Controller();
