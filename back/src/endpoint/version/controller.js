import http from "../../shared/http.js";
import version from "../../shared/version.js";
import Log from "../../shared/log.js";

class Controller {

	async list(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.list(database.split(driver.dbToSchemaDelimiter)[0], driver, req.body.page));
		} catch (e) {
			Log.error(e);
			res.send(e);
		}
	}

	async diff(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.diff(database.split(driver.dbToSchemaDelimiter)[0], driver, req.body.hash));
		} catch (e) {
			Log.error(e);
			res.send(e);
		}
	}

	async reset(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		try {
			res.send(await version.reset(database, driver, req.body.hash));
		} catch (e) {
			Log.error(e);
			res.send(e);
		}
	}
}

export default new Controller();
