import { Database } from "./database";
import { Relation } from "./relation";
import { Index } from "./index";
import { Driver } from "./driver";
import { Complex } from "./complex";

const localStorageName = "servers";
let selected: Server | undefined;

export class SSH {
	host!: string;
	port = 22;
	user!: string;
	password?: string;
	privateKey?: string;
}

export class Server {
	connected!: boolean;
	hide!: boolean;
	host = "127.0.0.1";
	name!: string;
	password?: string;
	scanned?: boolean;
	stored!: boolean;
	port!: number;
	user?: string;
	wrapper!: string;
	isLoading!: boolean;
	relations!: Relation[];
	dbs!: Database[];
	indexes!: Index[];
	complexes!: Complex[];
	driver!: Driver;
	params?: {};
	uri?: string;
	ssh = new SSH();

	static getAll(): Server[] {
		const stored: Server[] = JSON.parse(localStorage.getItem(localStorageName) || "[]");
		return stored.map(store => {
			store.stored = true;
			return store
		});
	}

	static add(newData: Server) {
		const servers = JSON.parse(localStorage.getItem(localStorageName) || "[]");

		newData = Server.getShallow(newData);
		delete newData.scanned;
		newData.name = Server.setName(newData);

		servers.push(newData);
		localStorage.setItem(localStorageName, JSON.stringify(servers));

		return newData;
	}

	static remove(name: string) {
		const servers: Server[] = JSON.parse(localStorage.getItem(localStorageName) || "[]");

		const index = servers.findIndex(server => server.name === name);
		if (index !== -1) {
			servers.splice(index, 1);
		}

		localStorage.setItem(localStorageName, JSON.stringify(servers));
	}

	static setSelected(server: Server | undefined) {
		selected = server;
	}

	static getSelected(): Server {
		return selected!;
	}

	static setName(scan: Server) {
		return `${scan.user}@${scan.host}:${scan.port}`
	}

	static getShallow(server: Server) {
		const shallow = {...server}
		shallow.dbs = [];
		shallow.relations = [];
		shallow.indexes = [];
		shallow.complexes = [];
		shallow.driver = <Driver>{};
		shallow.isLoading = false;

		return shallow;
	}
}
