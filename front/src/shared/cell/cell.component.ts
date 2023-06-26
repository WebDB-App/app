import { Component, Input, OnInit } from '@angular/core';
import { Table } from "../../classes/table";
import { Relation } from "../../classes/relation";

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
	fkLink?: any[];

	constructor() {
	}

	ngOnInit(): void {
		this.relations = Table.getRelations();
		const fk = this.relations?.find(relation => relation.column_source === this.column);
		this.fkLink = !fk ? undefined : ['../../', fk.table_dest];

		const type = typeof this.row[this.column];
		this.nested = Array.isArray(this.row[this.column]) || (type === 'object' && this.row[this.column] !== null);
	}

	getFkParams() {
		const fk = this.relations?.find(relation => relation.column_source === this.column);

		return {chips: `${fk!.column_dest}="${this.row[this.column]}";`};
	}
}
