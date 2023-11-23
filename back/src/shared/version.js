const {join} = require("path");
const {existsSync} = require("fs");
const rootPath = join(__dirname, "../../static/version/");
const bash = require("./bash");

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
	async resetTo(database, driver, sha1) {
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return {error: "Directory does not exist"};
		}

		//tester fuctions/procedure/complex dans le patch

		//const r = bash.runBash(`cd ${dir} && git reset --hard ${sha1}`);
		//delete db
		//import file
		return {};
	}

	async listPatch(database, driver, versions) {
		const dir = this.getPath(database, driver);
		if (!existsSync(dir)) {
			return [];
		}

		const r = bash.runBash(`cd ${dir} && git format-patch --stdout -${versions}`);
		let tmp = Object.entries(r.result.split(/(From [a-zA-Z0-9]{40})/g));

		const patches = [];
		for (const [index, patch] of tmp) {
			if (!patch || patch.startsWith("From ")) {
				continue;
			}
			let diff = "@@ " + patch.split("\n@@ ")[1];
			diff = diff.length > 100000 ? diff.slice(0, 100000) + "\n\n\n### DIFF SHORTEN ###" : diff;

			const obj = {
				time: patch.split("] ")[1].split("\n\n---")[0],
				sha1: tmp[index - 1][1].split("From ")[1],
				diff
			};
			patches.push(obj);
		}
		return patches.reverse();
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
			//TODO
		}
		/*
		this.changes[database] = {
			done: false,
			driver
		};*/
	}
}

module.exports = new Version();

/*
- Checksum par table
- https://stackoverflow.com/questions/17177914/is-there-a-more-elegant-way-to-detect-changes-in-a-large-sql-table-without-alter#comment24874308_17178078
- https://www.tutorialspoint.com/mysql/mysql_checksum_table_statement.htm
- https://www.google.com/search?q=mongo+watch+databasr&oq=mongo+watch+databasr&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKAB0gEJMTM3MDVqMGo0qAIAsAIA&client=ms-android-google&sourceid=chrome-mobile&ie=UTF-8
- https://github.com/debezium/debezium
 */
