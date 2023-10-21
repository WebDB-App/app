const {join} = require("path");
const statePath = join(__dirname, "../../static/state/");
const bash = require("./bash");

class State {

	changes = {};

	constructor() {
		const loop = () => {
			for (const [database, change] of Object.entries(this.changes)) {
				if (!change.done) {
					this.saveChanges(database, change.driver);
					this.changes[database].done = true;
				}
			}
			setTimeout(() => {loop();}, 20 * 1000);
		};
		return;
		// eslint-disable-next-line no-unreachable
		bash.runBash(`cd ${statePath} && git init --initial-branch=main`);
		loop();
	}

	async saveChanges(database, driver) {
		const path = join(statePath, database);

		const result = await driver.saveState(path, database);
		if (result.error) {
			return;
		}
		const r = bash.runBash(`cd ${statePath} && git add --all && git commit -m '${new Date()}'`);
		if (r.error) {
			return;
		}
	}

	commandFinished(driver, command, database) {
		return;
		// eslint-disable-next-line no-unreachable
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

module.exports = new State();
