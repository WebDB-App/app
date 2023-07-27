import { Component, Input, OnInit } from '@angular/core';
import { Table } from "../../classes/table";
import { Relation } from "../../classes/relation";
import { isNested } from "../helper";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";

@Component({
	selector: 'app-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

	@Input() row!: any;
	@Input() column!: string;

	selectedTable?: Table;
	relations?: Relation[];
	nested = false;
	expand = true;
	fkLink?: string[];

	constructor() {
	}

	ngOnInit(): void {
		this.relations = Table.getRelations();
		const fk = this.relations?.find(relation => relation.column_source === this.column);
		this.fkLink = !fk ? undefined : ['/', Server.getSelected().name, Database.getSelected().name, fk.table_dest, 'explore'];

		this.nested = isNested(this.row[this.column]);
		if (this.nested) {
			if (Object.keys(this.row[this.column]).length > 2) {
				this.expand = false;
			}
		}
	}

	getFkParams() {
		const fk = this.relations?.find(relation => relation.column_source === this.column);

		return {chips: `${fk!.column_dest}='${this.row[this.column]}';`};
	}
}
