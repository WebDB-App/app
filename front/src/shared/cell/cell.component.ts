import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Table } from "../../classes/table";
import { Relation } from "../../classes/relation";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import helper from "../common-helper.mjs";
import { Params } from "@angular/router";

@Component({
	selector: 'app-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

	@Input() row!: any;
	@Input() column!: string;
	@Input() stringify = false;

	selectedServer?: Server;
	relations?: Relation[];
	nested = false;
	expand = true;
	fkLink?: string[];
	fkParams?: Params;

	constructor(
		public ref: ElementRef
	) {
	}

	ngOnInit(): void {
		this.relations = Table.getRelations();
		this.selectedServer = Server.getSelected();

		this.nested = helper.isNested(this.row[this.column]);
		if (this.nested) {
			if (JSON.stringify(this.row[this.column]).length > 70) {
				this.expand = false;
			}
		} else if (this.stringify) {
			this.row[this.column] = JSON.stringify(this.row[this.column]);
		}

		const relation = this.relations?.find(relation => relation.column_source === this.column);
		this.fkLink = !relation ? undefined : ['/', Server.getSelected().name, Database.getSelected().name, relation.table_dest, 'explore'];
		if (relation) {
			const col = Database.getSelected().tables!.find(tab => tab.name === relation.table_dest)!.columns.find(col => col.name === relation.column_dest)!;

			this.row[this.column] = this.nested ? Object.values(this.row[this.column])[0] : this.row[this.column];
			this.fkParams = {chips: this.selectedServer?.driver.quickSearch(this.selectedServer?.driver, col, this.row[this.column]) + ';'}
		}
	}
}
