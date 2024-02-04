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

	async sample(req, res) {
		const [wrapper, database] = await http.getLoggedDriver(req);

		let txt = `I'm WebDB, a database IDE.
There is a database called "${database}" on a ${wrapper.constructor.name} server.
`;

		const tables = await wrapper.sampleDatabase(database, req.body.preSent);
		for (const table of tables) {

			const indexes = Object.keys(table.data);
			for (const [index, row] of Object.entries(table.data)) {
				for (const [key, value] of Object.entries(row)) {

					if (Buffer.isBuffer(value)) {
						delete table.data[index][key];
						continue;
					}
					if (req.body.preSent.anonymize === 1) {
						table.data[indexes[Math.floor(Math.random() * indexes.length)]][key] = value;
					}
					if (req.body.preSent.anonymize === 2) {
						table.data[index][key] = value === null ? "null" : value.constructor.name;
					}
				}
			}
			txt += `There is a entity with structure : \`\`\`${table.structure}\`\`\``;
			if (table.data) {
				txt += `and with this associated data : \`\`\`${JSON.stringify(table.data)}\`\`\``;
			}
			txt += ".\n\n";
		}

		txt += `So you are an expert in database and IT science. Your goal is to provide the most personalize answers.
Ask as many questions as need to provide the most accurate answer possible.
Don't make presumption, use only provided data.`;

		res.send({txt});
	}

	async query(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);
		let rows = await driver.runPagedQuery(req.body.query, req.body.page, req.body.pageSize, database);

		if (Array.isArray(rows)) {
			rows = rows.slice(0, process.env.RESULT_LIMIT || 500000).map(row => {
				for (const [key, col] of Object.entries(row)) {
					if (Buffer.isBuffer(col)) {
						row[key] = col.toString();
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
		const p = join(dirname, "../../../static/", path.path);

		await new Promise(resolve => setTimeout(resolve, 1000));

		await driver.load([{path: p}], req.body.name);
		unlinkSync(p);

		res.send({});
	}
}

export default new Controller();
