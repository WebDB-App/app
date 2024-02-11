import { Table } from "./table";

let selected: Database;

export class Database {
	name!: string;
	hide!: boolean;
	system!: boolean;
	collation!: string;
	tables!: Table[];

	static setSelected(database: Database) {
		selected = database;
	}

	static getSelected(): Database {
		return selected;
	}

	static reload(dbs: Database[]) {
		if (!selected) {
			return;
		}

		Database.setSelected(dbs.find(db => db.name === selected.name)!);
	}
}
