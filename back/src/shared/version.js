const {join} = require("path");
const versionPath = join(__dirname, "../../static/version/");
const bash = require("./bash");

class Version {

	changes = {};

	constructor() {
		const loop = () => {
			for (const [database, change] of Object.entries(this.changes)) {
				if (!change.done) {
					//TODO
					//this.saveChanges(database, change.driver);
					this.changes[database].done = true;
				}
			}
			setTimeout(() => {loop();}, 20 * 1000);
		};
		//bash.runBash(`cd ${versionPath} && git init --initial-branch=main`);
		loop();
	}

	async saveChanges(database, driver) {
		const path = join(versionPath, database);

		const result = await driver.saveState(path, database);
		if (result.error) {
			return;
		}
		const r = bash.runBash(`cd ${versionPath} && git add --all && git commit -m '${(new Date()).getTime()}'`);
		if (r.error) {
			return;
		}
		//git format-patch -100
		//tester DISABLE_WATCHER et add dans la doc
		//limit a 10 en free, 50 en medium, 200 en ultimate
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
		if (this.changes[database]) {
			if (!["update", "delete", "insert", "drop", "alter", "add"].some(v => command.toLowerCase().includes(v.toLowerCase()))) {
				return;
			}
		}
		this.changes[database] = {
			done: false,
			driver
		};
	}
}

module.exports = new Version();
