import {join} from "path";
import {existsSync} from "fs";
import bash from "./bash.js";
import {URL} from "url";
import { simpleGit } from "simple-git";

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
			setTimeout(() => loop(), 20 * 1000);
		};
		loop();
	}

	getPath(database, driver) {
		return join(rootPath, driver.port.toString(), database);
	}

	// eslint-disable-next-line no-unused-vars
	async resetTo(database, driver, hash) {
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return {error: "Directory does not exist"};
		}

		//tester fuctions/procedure/complex dans le patch

		//const r = bash.runBash(`cd ${dir} && git reset --hard ${hash}`);
		//delete db
		//import file
		return {ok: 1};
	}

	async diff(database, driver, hash) {
		const dir = this.getPath(database, driver);
		const git = simpleGit(dir);

		let diff = await git.diff(["--no-prefix", hash]);
		if (diff) {
			diff = diff.split("\n+++ " + database)[1].trim();
		} else {
			diff = "[Empty diff]";
		}

		return {diff};
	}

	async list(database, driver) {
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return [];
		}

		const git = simpleGit(dir);

		const commits = await git.log(["--max-count=200"]);
		return commits.all.map(commit => {
			return {
				time: commit.message,
				hash: commit.hash,
			};
		});
	}

	async saveChanges(database, driver) {
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			bash.runBash(`mkdir -p ${dir} && cd ${dir} && git init --initial-branch=main`);
		}

		const result = await driver.saveState(join(dir, database), database);
		if (result.error) {
			return;
		}
		const r = bash.runBash(`cd ${dir} && git add --all && git commit -m '${(new Date()).getTime()}'`);
		if (r.error) {
			return;
		}
		return r;
	}

	commandFinished(driver, command, database) {
		if (!database) {
			return;
		}
		if (driver.isSystemDbs(database)) {
			return;
		}
		if (process.env.DISABLE_WATCHER &&
			(process.env.DISABLE_WATCHER === "true" ||
				process.env.DISABLE_WATCHER.indexOf(database) >= 0)) {
			return;
		}
		if (![
			"updateone", "updatemany", "update ",
			"deleteone", "deletemany", "delete ",
			"insertone", "insertmany", "insert ",
			"drop", "alter ", "add ", "create", "rename", "replace"].some(v => command.toLowerCase().includes(v.toLowerCase()))) {
			return;
		}

		this.changes[database] = {
			done: false,
			driver
		};
	}
}

export default new Version();

/*
- Checksum par table
- https://stackoverflow.com/questions/17177914/is-there-a-more-elegant-way-to-detect-changes-in-a-large-sql-table-without-alter#comment24874308_17178078
- https://www.tutorialspoint.com/mysql/mysql_checksum_table_statement.htm
- https://www.google.com/search?q=mongo+watch+databasr&oq=mongo+watch+databasr&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKAB0gEJMTM3MDVqMGo0qAIAsAIA&client=ms-android-google&sourceid=chrome-mobile&ie=UTF-8
- https://github.com/debezium/debezium
 */
