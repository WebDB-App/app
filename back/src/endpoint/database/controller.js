import http from "../../shared/http.js";
import {unlinkSync} from "fs";
import {URL} from "url";
const dirname = new URL(".", import.meta.url).pathname;

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

		try {
			res.send(await driver.statsDatabase(database));
		} catch (e) {
			console.error(e);
			res.send({});
		}
	}

	async sample(req, res) {
		const [wrapper, database] = await http.getLoggedDriver(req);

		const sample = await wrapper.sampleDatabase(database, req.body.preSent);
		let txt = `There is a database called ${database} on a ${wrapper.constructor.name} server. `;

		if (req.body.preSent.datas?.indexOf("structure") >= 0) {
			for (const table of sample) {
				txt += `\n \`\`\`${table.structure}\`\`\` is a table and here is a data sample : \`\`\`${JSON.stringify(table.data)}\`\`\``;
			}
		}
		if (req.body.preSent.datas?.indexOf("triggers") >= 0) {
			for (const table of sample) {
				const view = await wrapper.listTrigger(database, table);
				txt += `\n \`\`\`${view.name}\`\`\` is a view with the code : \`\`\`${JSON.stringify(view.code)}\`\`\``;
			}
		}

		txt += `Respond me in ${req.body.language} for sentences and markdown for codes`;
		txt += "You can ask me queries to run if it can help you be more precise. ";
		res.send({txt});
	}

	async query(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);
		let rows = await driver.runPagedQuery(req.body.query, req.body.page, req.body.pageSize, database);

		if (Array.isArray(rows)) {
			rows = rows.slice(0, process.env.RESULT_LIMIT || 5000).map(row => {
				for (const [key, col] of Object.entries(row)) {
					if (Buffer.isBuffer(col)) {
						row[key] = "###BLOB###";
					}
				}
				return row;
			});
		}

		res.send(rows);
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

	async duplicate(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		const r = await driver.createDatabase(req.body.name);
		if (r.error) {
			return r;
		}

		const path = await driver.dump(database, undefined, false);
		const p = dirname + "../../front/" + path.path;

		await new Promise(resolve => setTimeout(resolve, 1000));
		await driver.load(p, req.body.name);
		unlinkSync(p);

		res.send({});
	}
}

export default new Controller();
