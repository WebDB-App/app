import http from "../../shared/http.js";

class Controller {

	async create(req, res) {
		const [driver] = await http.getLoggedDriver(req);

		res.send(await driver.createDatabase(req.body.name));
	}

	async drop(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.dropDatabase(database));
	}

	async stats(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.statsDatabase(database));
	}

	async sample(req, res) {
		const [wrapper, database] = await http.getLoggedDriver(req);
		const sample = await wrapper.sampleDatabase(database, Math.max(req.body.preSent.filter((pre => Number.isInteger(pre)))));

		let txt = `There is a database called ${database} on a ${wrapper.constructor.name} server`;
		for (const table of sample) {
			txt += `In this database, there is a table as \`\`\`${table.structure}\`\`\` containing a sample of the following data : \`\`\`${JSON.stringify(table.data)}\`\`\``;
		}

		txt += `Respond me in ${req.body.language} language`;
		res.send({txt});
	}

	async query(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.runPagedQuery(req.body.query, req.body.page, req.body.pageSize, database));
	}

	async querySize(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.querySize(req.body.query, database));
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
}

export default new Controller();
