import {join} from "path";
import fs, {existsSync, readdirSync} from "fs";
import bash from "./bash.js";
import {URL} from "url";
import {simpleGit} from "simple-git";
import {alterStructure} from "./helper.js";
import Log from "./log.js";

const dirname = new URL(".", import.meta.url).pathname;
const rootPath = join(dirname, "../../static/version/");

class Version {

	changes = {};

	constructor() {
		const loop = async () => {
			for (const [database, change] of Object.entries(this.changes)) {
				if (!change.done) {
					await this.saveChanges(database, change.driver);
					this.changes[database].done = true;
				}
			}
			setTimeout(() => loop(), (process.env.WATCHER_DELAY || 15) * 1000);
		};
		loop();
	}

	getPath(database, driver) {
		return join(rootPath, `${driver.user}@${driver.host}:${driver.port}`, database);
	}

	async reset(dbSchema, driver, hash) {
		const db = dbSchema.split(" | ")[0];
		const dir = this.getPath(db, driver);
		if (!existsSync(dir)) {
			return {error: "Directory does not exist"};
		}

		const r = await bash.runBash(`cd ${dir} && git reset --hard ${hash}`);
		if (r.error) {
			return r;
		}
		const files = readdirSync(dir).filter(f => !f.startsWith(".")).map(f => {
			return {
				originalname: f,
				path: join(dir, f),
				destination: dir
			};
		});

		await driver.dropDatabase(dbSchema);
		await driver.createDatabase(db);
		await driver.load(files, db);

		return {ok: 1};
	}

	async diff(database, driver, hash) {
		const dir = this.getPath(database, driver);
		const git = simpleGit(dir);

		let original = await git.diff(["--no-prefix", "--text", hash]);
		let final = [];
		if (!original) {
			final.push("⸻ Empty diff ⸻");
		} else {
			for (let row of driver.readDiff(database, original.split("\n"))) {
				// eslint-disable-next-line no-control-regex
				row = row.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F]/g, " ");
				// eslint-disable-next-line no-control-regex
				row = row.replace(/[\u007F-\u009F]/g, " ");
				row = row.replaceAll("�", " ");
				row = row.replace(/ +(?= )/g, "");
				if (!row.trim()) {
					continue;
				}

				final.push(row);
			}
		}

		return {diff: final, raw: original};
	}

	async list(database, driver) {
		if (process.env.WATCHER_EXCLUDE &&
			(process.env.WATCHER_EXCLUDE === "true" ||
				process.env.WATCHER_EXCLUDE.indexOf(database) >= 0)) {
			return {error: "Feature disabled by backend"};
		}

		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return [];
		}

		const git = simpleGit(dir);

		const finals = [];
		const tmp = (await git.log(["--max-count=200"])).all;
		for (let i = 0; i < tmp.length - 1; i++) {
			finals.push({
				time: tmp[i].message,
				hash: tmp[i + 1].hash,
			});
		}
		return finals;
	}

	async saveChanges(database, driver) {
		const limit = +process.env.WATCHER_LIMIT || 1_000_000_000;
		try {
			const stats = await driver.statsDatabase(database);
			if (!stats) {
				return;
			}
			if (stats.data_length && stats.data_length > limit) {
				return;
			}
		} catch (e) {
			Log.error(e);
			return;
		}

		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			const r = await bash.runBash(`mkdir -p ${dir} && cd ${dir} && git init --initial-branch=main && git config user.email "main.webdb@gmail.com" && git config user.name "WebDB"`);
			if (r.error) {
				return;
			}
		}

		const state = await driver.saveState(dir, database);
		if (state.error) {
			Log.error(state.error);
			return;
		}
		const commit = await bash.runBash(`cd ${dir} && git add --all && (git commit -m '${(new Date()).getTime()}' || echo)`);
		if (commit.error) {
			return;
		}
		return commit;
	}

	commandFinished(driver, command, database, force = false) {
		if (!database) {
			return;
		}
		database = database.split(" | ")[0];
		if (driver.isSystemDbs(database)) {
			return;
		}
		if (driver.constructor.name === "CockroachDB") {
			return;
		}
		if (driver.ssh && driver.ssh.host) {
			return false;
		}
		if (process.env.WATCHER_EXCLUDE &&
			(process.env.WATCHER_EXCLUDE === "true" ||
				process.env.WATCHER_EXCLUDE.indexOf(database) >= 0)) {
			return;
		}
		if (!force && !alterStructure(command)) {
			return;
		}

		this.changes[database] = {
			done: false,
			driver
		};
	}

	deleteDatabase(driver, database) {
		const dir = this.getPath(database, driver);
		fs.rmSync(dir, {recursive: true, force: true});
	}
}

export default new Version();


