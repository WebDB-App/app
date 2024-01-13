import {join} from "path";
import {existsSync, readdirSync} from "fs";
import bash from "./bash.js";
import {URL} from "url";
import {simpleGit} from "simple-git";
import {alterStructure} from "./helper.js";
import Driver from "./driver.js";
import {BSON} from "mongodb";

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
			setTimeout(() => loop(), 15 * 1000);
		};
		loop();
	}

	getPath(database, driver) {
		return join(rootPath, driver.port.toString(), database);
	}

	async reset(database, driver, hash) {
		const db = database.split(" ¦ ")[0];
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return {error: "Directory does not exist"};
		}

		const r = bash.runBash(`cd ${dir} && git reset --hard ${hash}`);
		if (r.error) {
			return r;
		}
		const files = readdirSync(dir).filter(f => !f.startsWith(".")).map(f => {return {
			originalname: f,
			path: join(dir, f),
			destination: dir};
		});

		await driver.dropDatabase(database);
		await driver.createDatabase(db);
		await driver.load(files, db);

		return {ok: 1};
	}

	async diff(database, driver, hash) {
		const dir = this.getPath(database, driver);
		const git = simpleGit(dir);

		let diff = await git.diff(["--no-prefix", "--text", hash]);
		if (!diff) {
			diff = "⸻ Empty diff ⸻";
		} else {
			diff = driver.readDiff(database, diff).slice(0, 2000000);
			// eslint-disable-next-line no-control-regex
			diff = diff.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F]/g, " ");
			diff = diff.replaceAll("�", " ");
			diff = diff.replace(/ +(?= )/g,"");
		}

		return {diff};
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

		const commits = await git.log(["--max-count=200"]);
		return commits.all.slice(1).map(commit => {
			return {
				time: commit.message,
				hash: commit.hash,
			};
		});
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
			console.error(e);
			return;
		}

		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			bash.runBash(`mkdir -p ${dir} && cd ${dir} && git init --initial-branch=main`);
		}

		const state = await driver.saveState(dir, database);
		if (state.error) {
			console.error(state.error);
			return;
		}
		const commit = bash.runBash(`cd ${dir} && git add --all && (git commit -m '${(new Date()).getTime()}' || echo)`);
		if (commit.error) {
			console.error(commit.error);
			return;
		}
		return commit;
	}

	commandFinished(driver, command, database, force = false) {
		if (!database) {
			return;
		}
		database = database.split(" ¦ ")[0];
		if (driver.isSystemDbs(database)) {
			return;
		}
		if (process.env.WATCHER_EXCLUDE &&
			(process.env.WATCHER_EXCLUDE === "true" ||
				process.env.WATCHER_EXCLUDE.indexOf(database) >= 0)) {
			return;
		}
		if (!force && !alterStructure(command.toLowerCase())) {
			return;
		}

		this.changes[database] = {
			done: false,
			driver
		};
	}
}

export default new Version();


