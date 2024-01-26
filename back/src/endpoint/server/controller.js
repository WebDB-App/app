import wrapperModel from "../../shared/wrapper.js";
import {commonPass, commonUser} from "../../shared/guess.js";
import http from "../../shared/http.js";
import fs, {unlinkSync} from "fs";
import Tunnel from "../tunnel/controller.js";
import {join} from "path";
import version from "../../shared/version.js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

class Controller {

	async scan(req, res) {
		let hosts = ["127.0.0.1", "host.docker.internal"];
		if (process.env.SCAN_HOSTS) {
			hosts = hosts.concat(process.env.SCAN_HOSTS.split(","));
		}

		const wrappers = await wrapperModel.getWrappers();
		const openned = {};
		const promises = [];

		for (const host of hosts) {
			for (const wrapper of wrappers) {
				const driver = new wrapper(undefined, host);
				promises.push(driver.scan());
			}
		}

		(await Promise.all(promises)).filter(prom => prom.length).flat().map(scan => openned[scan.host + scan.port] = scan);
		res.send(Object.values(openned));
	}

	async getStructure(req, res) {
		const driver = await wrapperModel.getDriver(req.body);
		const final = {
			dbs: [],
			indexes: [],
			relations: [],
			complexes: []
		};
		const promises = [
			new Promise(async resolve => {
				const structure = await driver.getStructure(+req.query.full, +req.query.size);

				for (const str of Object.values(structure)) {
					structure[str.name].system = driver.isSystemDbs(str.name);

					if (structure[str.name].tables) {
						for (const table of Object.values(structure[str.name].tables)) {
							structure[str.name].tables[table.name].columns = Object.values(table.columns);
						}

						structure[str.name].tables = Object.values(str.tables).sort((a, b) => a.name.localeCompare(b.name));
					}
				}
				final.dbs = Object.values(structure).sort((a, b) => a.name.localeCompare(b.name));
				resolve();
			})
		];

		if (+req.query.full) {
			promises.push(
				(final.complexes = await driver.getComplexes()),
				(final.indexes = await driver.getIndexes()),
			);
		}

		await Promise.all(promises);

		if (+req.query.full) {
			final.relations = await driver.getRelations(final.dbs, +req.query.size);
		}

		res.send(final);
	}

	async load(req, res) {
		if (process.env.PROTECTED_MODE === "true") {
			return res.send({error: "Load is disable by backend configuration"});
		}

		const [driver] = await http.getLoggedDriver(req);
		const result = await driver.load(req.files, req.get("Database"));
		res.send(result);

		version.commandFinished(driver, "", req.get("Database"), true);
		fs.rmSync(req.files[0].destination, {recursive: true, force: true});
	}

	async dump(req, res) {
		if (process.env.PROTECTED_MODE === "true") {
			return res.send({error: "Dump is disable by backend configuration"});
		}

		const [driver, database] = await http.getLoggedDriver(req);

		const result = await driver.dump(
			database,
			req.body.exportType,
			req.body.tables,
			req.body.options.replaceAll("\n", " "),
		);

		version.commandFinished(driver, "update ", database);
		res.send(result);

		setTimeout(() => {
			try {
				unlinkSync(join(dirname, "../../../static/", result.path));
			} catch (e) {
				console.log(e);
			}
		}, 60 * 1000);
	}

	async guess(req, res) {
		if (process.env.PROTECTED_MODE === "true") {
			return res.send({error: "Guess is disable by backend configuration"});
		}

		let scanned = [];
		const driverClass = await wrapperModel.getDriverClass(req.body.wrapper);
		const driverInstance = new driverClass();
		const users = req.body.user ? [req.body.user] : Array.from(new Set(driverInstance.commonUser.concat(commonUser)));
		const passwords = req.body.password ? [req.body.password] : Array.from(new Set(driverInstance.commonPass.concat(commonPass)));

		for (const user of users) {
			const promise = [];
			for (const password of passwords) {
				const connection = {
					wrapper: req.body.wrapper,
					host: req.body.host,
					port: req.body.port,
					user,
					password,
					params: req.body.params
				};

				promise.push(new Promise(async resolve => {
					const driver = await wrapperModel.getDriver(connection, true);
					if (!driver.connection.error) {
						resolve(connection);
					}
					resolve();
				}));
			}

			scanned = scanned.concat((await Promise.all(promise)).filter(r => r));
		}

		res.send(scanned);
	}

	async connect(req, res) {
		const driverClass = await wrapperModel.getDriverClass(req.body.wrapper);
		if (!driverClass) {
			return res.send({error: "Driver not yet implemented"});
		}

		try {
			const forwardPort = await Tunnel.handleSsh(req.body, false);
			if (forwardPort) {
				req.body.port = forwardPort;
			}
		} catch (error) {
			return res.send(error);
		}

		const driver = new driverClass(req.body.port, req.body.host, req.body.user, req.body.password, req.body.params);
		const connection = await driver.establish(false, true);

		if (connection?.error) {
			res.send(connection);
		} else {
			res.send({...req.body, uri: driver.makeUri()});
		}
	}
}

export default new Controller();
