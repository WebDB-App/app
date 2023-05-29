import nodePortScanner from "node-port-scanner";

export default class Driver {

	dbToSchemaDelimiter = ", "
	nameDel = '"';

	connection;
	port;
	host;
	user;
	password;
	params;

	dbPool = {};

	constructor(port, host, user, password, params) {
		this.port = port;
		this.host = host;
		this.user = user;
		this.password = password;
		this.params = params;
	}

	async scan(host, from, to) {
		const scanned = await nodePortScanner(host, Array.from(Array(to + 1).keys()).slice(from));
		return scanned.ports.open.map(port => {
			return {
				wrapper: this.constructor.name,
				host: host,
				port
			};
		});
	}

	isSystemDbs(dbName) {
		return this.systemDbs.find(db => dbName.indexOf(db) >= 0);
	}

	async getConnectionOfDatabase(database) {
		if (this.dbPool[database]) {
			return this.dbPool[database];
		}

		const co = await this.establish(database);
		this.dbPool[database] = co;
		return co;
	}

	async sampleDatabase(name, limit) {
		return [{
			structure: {},
			data: []
		}];
	}
}
