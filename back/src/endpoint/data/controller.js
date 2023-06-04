import http from "../../shared/http.js";

class Controller {

	async insert(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send({insert: await driver.insert(database, table, req.body)});
	}

	async update(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.update(database, table, req.body.old_data, req.body.new_data));
	}

	async delete(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.delete(database, table, req.body));
	}

	async download(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.download(database, table, req.body));
	}

	async upload(req, res) {
		const [driver, database, table] = await http.getLoggedDriver(req);

		res.send(await driver.upload(database, table, req.body));
	}
}

export default new Controller();
