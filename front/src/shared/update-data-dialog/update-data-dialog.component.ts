import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../request.service";
import { Table } from "../../classes/table";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";

@Component({
	selector: 'app-update-data-dialog',
	templateUrl: './update-data-dialog.component.html',
	styleUrls: ['./update-data-dialog.component.scss']
})
export class UpdateDataDialogComponent {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;

	updateSuggestions: { [key: string]: string[] } = {};
	str = "";
	editorOptions = {
		language: 'json'
	};

	constructor(
		public dialogRef: MatDialogRef<UpdateDataDialogComponent>,
		public snackBar: MatSnackBar,
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public data: {
			row: {},
			updateInPlace: boolean
		},
	) {
		this.str = JSON.stringify(data.row, null, "\t");
		this.loadSuggestions();
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.selectedTable = Table.getSelected();
	}

	async update() {
		const n = JSON.parse(this.str);

		if (this.data.updateInPlace) {
			const nb = await this.request.post('data/update', {old_data: this.data.row, new_data: n}, this.selectedTable, this.selectedDatabase, this.selectedServer);
			this.snackBar.open(`${nb} row(s) updated`, "╳", {duration: 3000});
		}
		this.dialogRef.close(n);
	}

	isTouched() {
		return JSON.stringify(this.data.row, null, "\t") !== this.str;
	}

	async loadSuggestions() {
		const relations = Table.getRelations();
		const limit = 1000;

		for (const col of Table.getSelected().columns) {
			const enums = Server.getSelected().driver.extractEnum(col);
			if (enums) {
				this.updateSuggestions[col.name] = enums;
				continue;
			}

			const relation = relations.find(relation => relation.column_source === col.name);
			if (relation) {
				const datas = await this.request.post('relation/exampleData', {
					column: relation.column_dest,
					table: relation.table_dest,
					limit
				});
				if (datas && datas.length < limit) {
					this.updateSuggestions[col.name] = datas.map((data: any) => data.example);
				}
			}
		}
	}

	setValue(column: string, value: any) {
		const row = JSON.parse(this.str);
		row[column] = value;
		this.str = JSON.stringify(row, null, "\t");
	}
}
