import { Column } from "./column";
import { Database } from "./database";
import { Server } from "./server";
import { Index } from "./index";
import { Relation } from "./relation";

let selected: Table;

export class Table {
	hide!: boolean
	name!: string
	view!: boolean
	columns!: Column[]
	comment?: string;

	static setSelected(table: Table) {
		selected = table;
	}

	static getSelected(): Table {
		return selected;
	}

	static reload(db?: Database) {
		if (!selected || !db) {
			return;
		}

		Table.setSelected(db.tables!.find(table => table.name === selected.name)!);
	}

	static getIndexes(table = selected, database = Database.getSelected()): Index[] {
		const server = Server.getSelected();

		return server.indexes.filter(index => index.database === database.name && index.table === table.name)
	}

	static getRelations(table = selected): Relation[] {
		const server = Server.getSelected();
		const database = Database.getSelected();

		return server.relations.filter(relation => relation.table_source === table.name && relation.database_source === database.name)
	}
}
