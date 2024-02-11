import {promises as fsp} from "fs";
import Tunnel from "../endpoint/tunnel/controller.js";
import {join} from "path";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

class Wrapper {

	pool = [];

	async getWrappers() {
		if (this.wrappers === undefined) {
			this.wrappers = (async () => {
				const wrapperPath = join(dirname, "../wrapper/");
				const files = await fsp.readdir(wrapperPath);

				const wrappers = [];
				for (const file of files) {
					const module = await import(`${wrapperPath}/${file}`);
					if (!module.default) {
						continue;
					}
					wrappers.push(module.default);
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
		try {
			const forwardPort = await Tunnel.handleSsh(connection);
			if (forwardPort) {
				connection.port = forwardPort;
			}
		} catch (error) {
			return false;
		}

		const hash = JSON.stringify(connection);
		if (!test) {
			if (this.pool[hash] && this.pool[hash].connection) {
				return this.pool[hash];
			}
		}

		const driverClass = await this.getDriverClass(connection.wrapper);
		if (!driverClass) {
			return false;
		}

		const driver = new driverClass(connection.port, connection.host, connection.user, connection.password, connection.params, connection.ssh);
		driver.connection = await driver.establish(false, test);

		if (!test) {
			driver.serverVersion = await driver.getVersionInfo();
		}
		this.pool[hash] = driver;
		return driver;
	}
}

export default new Wrapper();
