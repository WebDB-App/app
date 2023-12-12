import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Table } from "../../classes/table";
import { Relation } from "../../classes/relation";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { commonHelper } from "../common-helper.mjs";
import { Params } from "@angular/router";
import { saveAs } from "file-saver-es";
import { Column } from "../../classes/column";
import { Group } from "../../classes/driver";

@Component({
	selector: 'app-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

	@Input() value!: any;
	@Input() column!: string;
	@Input() stringify = false;

	selectedServer?: Server;
	relations?: Relation[];
	nested = false;
	expand = true;
	fkLink?: string[];
	fkParams?: Params;
	blob = false;

	constructor(
		public ref: ElementRef
	) {
	}

	ngOnInit(): void {
		if (this.value === undefined) {
			return;
		}

		const col = Table.getSelected().columns.find(col => col.name === this.column);
		if (col) {
			this.blob = Column.isOfGroups(Server.getSelected().driver, col, [Group.Blob]);
			if (this.blob) {
				return;
			}
		}

		this.relations = Table.getRelations();
		this.selectedServer = Server.getSelected();

		this.value = JSON.parse(JSON.stringify(this.value));
		this.nested = commonHelper.isNested(this.value);
		if (this.nested) {
			if (JSON.stringify(this.value).length > 70) {
				this.expand = false;
			}
		} else if (this.stringify) {
			this.value = JSON.stringify(this.value);
		}

		const relation = this.relations?.find(relation => relation.column_source === this.column);
		this.fkLink = !relation ? undefined : ['/', Server.getSelected().name, Database.getSelected().name, relation.table_dest, 'explore'];
		if (relation) {
			const col = Database.getSelected().tables!.find(tab => tab.name === relation.table_dest)!.columns.find(col => col.name === relation.column_dest)!;

			this.value = this.nested ? Object.values(this.value)[0] : this.value;

			if (this.value !== null) {
				let ref = this.value.toString();
				if (ref.startsWith("\"") && ref.endsWith("\"")) {
					ref = ref.slice(1, -1);
				}
				this.fkParams = {chips: this.selectedServer?.driver.quickSearch(this.selectedServer?.driver, col, ref) + ';'}
			}
		}
	}

	download() {
		const blob = new Blob([this.value.data]);
		saveAs(blob, Table.getSelected().name + '-' + this.column.toLowerCase() + '.bin');
	}
}
