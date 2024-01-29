import nodePortScanner from "node-port-scanner";

export default class Driver {

	dbToSchemaDelimiter = " | ";

	connection;
	port;
	host;
	user;
	password;
	params;
	ssh;

	dbPool = {};

	constructor(port, host, user, password, params, ssh) {
		this.port = port;
		this.host = host;
		this.user = user;
		this.password = password;
		this.params = params;
		this.ssh = ssh;
	}

	async scan(host, from, to) {
		const scanned = await nodePortScanner(host, Array.from(Array(to + 1).keys()).slice(from));
		return scanned.ports.open.map(port => {
			return {
				wrapper: this.constructor.name,
				host,
				port
			};
		});
	}

	isSystemDbs(dbName) {
		return this.systemDbs.find(db => dbName.indexOf(db) >= 0);
	}

	makeUri() {
		return null;
	}

	async getConnectionOfDatabase(database) {
		if (this.dbPool[database]) {
			return this.dbPool[database];
		}

		const co = await this.establish(database);
		this.dbPool[database] = co;
		return co;
	}

	async sampleDatabase() {
		return [{
			structure: {},
			data: []
		}];
	}

	readDiff(database, diff) {
		return diff.slice(4);
	}
}
