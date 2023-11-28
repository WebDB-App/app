const fsp = require("fs").promises;
const Tunnel = require("../endpoint/tunnel/controller.js");
const {join} = require("path");

class Wrapper {

	pool = [];

	async getWrappers() {
		if (this.wrappers === undefined) {
			this.wrappers = (async () => {
				const wrapperPath = join(__dirname, "../wrapper/");
				const files = await fsp.readdir(wrapperPath);

				const wrappers = [];
				for (const file of files) {
					wrappers.push(await require(`${wrapperPath}/${file}`));
				}

				return wrappers;
			})();
		}

		return this.wrappers;
	}

	async getDriverClass(className) {
		className = className.toLowerCase();

		for (const wrapper of await this.getWrappers()) {
			const drv = new wrapper;
			if (drv.constructor.name.toLowerCase() === className) {
				return wrapper;
			}
		}

		return false;
	}

	async getDriver(connection, test = false) {
		// eslint-disable-next-line no-unused-vars
		const makeHash = (port, user, password, host, params) => {
			return JSON.stringify(arguments);
		};

		try {
			const forwardPort = await Tunnel.handleSsh(connection);
			if (forwardPort) {
				connection.port = forwardPort;
			}
		} catch (error) {
			return false;
		}

		if (!test) {
			const hash = makeHash(connection.port, connection.host, connection.user, connection.password, connection.params);
			if (this.pool[hash] && this.pool[hash].connection) {
				return this.pool[hash];
			}
		}

		const driverClass = await this.getDriverClass(connection.wrapper);
		if (!driverClass) {
			return false;
		}

		const driver = new driverClass(connection.port, connection.host, connection.user, connection.password, connection.params);
		driver.connection = await driver.establish(false, test);

		this.pool[hash] = driver;
		return driver;
	}
}

module.exports = new Wrapper();
