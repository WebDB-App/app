import http from "../../shared/http.js";
import {unlinkSync} from "fs";
import {join} from "path";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

class Controller {

	async create(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.createDatabase(req.body.name));
	}

	async drop(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		if (driver.isSystemDbs(database)) {
			return res.send({error: `You should not delete ${database}`});
		}
		res.send(await driver.dropDatabase(database, req.body.associated));
	}

	async setCollation(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.setCollation(database, req.body.collation));
	}

	async getAvailableCollations(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		const collations = await driver.getAvailableCollations();

		res.send(collations.map(collation => collation["Collation"]).sort());
	}

	async duplicate(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		const r = await driver.createDatabase(req.body.name);
		if (r.error) {
			return r;
		}

		const path = await driver.dump(database, undefined, false);
		const p = join(dirname, "../../../static/", path.path);

		await new Promise(resolve => setTimeout(resolve, 1000));

		await driver.load([{path: p}], req.body.name);
		unlinkSync(p);

		res.send({});
	}
}

export default new Controller();
