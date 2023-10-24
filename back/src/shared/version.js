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

	async saveChanges(database, driver) {
		const dir = join(rootPath, driver.port.toString());
		if (!existsSync(dir)) {
			bash.runBash(`mkdir ${dir} && cd ${dir} && git init --initial-branch=main`);
		}

		const result = await driver.saveState(join(dir, database), database);
		if (result.error) {
			return;
		}
		const r = bash.runBash(`cd ${dir} && git add --all && git commit -m '${(new Date()).getTime()}'`);
		if (r.error) {
			return;
		}
		//git format-patch -${versions}
		//tester DISABLE_WATCHER
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
		if (!["update", "delete", "insert", "drop", "alter", "add"].some(v => command.toLowerCase().includes(v.toLowerCase()))) {
			return;
		}
		this.changes[database] = {
			done: false,
			driver
		};
	}
}

module.exports = new Version();
