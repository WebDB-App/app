import {promises as fsp} from "fs";
import Tunnel from "../endpoint/tunnel/controller.js";

class Wrapper {

	pool = [];

	async getWrappers() {
		const dirname = new URL(".", import.meta.url).pathname;

		if (this.wrappers === undefined) {
			this.wrappers = (async () => {
				const wrapperPath = dirname + "../wrapper/";
				const files = await fsp.readdir(wrapperPath);

				const wrappers = [];
				for (const file of files) {
					wrappers.push(await import(`${wrapperPath}/${file}`));
				}

				return wrappers;
			})();
		}

		return this.wrappers;
	}

	async getDriverClass(className) {
		for (const wrapper of await this.getWrappers()) {
			const drv = new wrapper.default;
			if (drv.constructor.name === className) {
				return wrapper.default;
			}
		}

		return false;
	}

	async getDriver(connection) {
		const makeHash = (port, user, password, host, params) => {
			return JSON.stringify(arguments);
		}

		try {
			const forwardPort = await Tunnel.handleSsh(connection);
			if (forwardPort) {
				connection.port = forwardPort;
			}
		} catch (error) {
			return false;
		}

		const hash = makeHash(connection.port, connection.host, connection.user, connection.password, connection.params);
		if (this.pool[hash] && this.pool[hash].connection) {
			return this.pool[hash];
		}

		const driverClass = await this.getDriverClass(connection.wrapper);
		if (!driverClass) {
			return false;
		}

		const driver = new driverClass(connection.port, connection.host, connection.user, connection.password, connection.params);
		driver.connection = await driver.establish();

		this.pool[hash] = driver;
		return driver;
	}
}

export default new Wrapper();
