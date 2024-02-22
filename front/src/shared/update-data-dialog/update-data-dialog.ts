import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../request.service";
import { Table } from "../../classes/table";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { Column } from "../../classes/column";
import { Group } from "../../classes/driver";

@Component({
	templateUrl: './update-data-dialog.html',
	styleUrls: ['./update-data-dialog.scss']
})
export class UpdateDataDialog {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;

	relationHelper: { [key: string]: any[] } = {};
	datesHelper: { [key: string]: (date: string) => {} } = {};
	str = "";
	editorOptions = {
		language: 'json'
	};
	protected readonly Object = Object;
	protected readonly JSON = JSON;

	constructor(
		private dialogRef: MatDialogRef<UpdateDataDialog>,
		public snackBar: MatSnackBar,
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public data: {
			row: any,
			updateInPlace: boolean
		},
	) {
		data.row = structuredClone(data.row);
		for (const col of Object.keys(data.row)) {
			if (Column.isOfGroups(Server.getSelected().driver, Table.getSelected().columns.find(c => c.name === col)!, [Group.Blob])) {
				delete data.row[col];
			}
		}

		this.str = JSON.stringify(data.row, null, "\t");
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.selectedTable = Table.getSelected();
		this.loadHelper();
	}

	async update() {
		const n = JSON.parse(this.str);

		if (this.data.updateInPlace) {
			const nb = await this.request.post('data/update', {
				old_data: this.data.row,
				new_data: n
			}, this.selectedTable, this.selectedDatabase, this.selectedServer);
			if (nb.error) {
				this.snackBar.open(`Error while updating: ${nb.error}`, "⨉", {duration: 3000, panelClass: 'snack-error'});
				return;
			}
			this.snackBar.open(`${nb} row(s) updated`, "⨉", {duration: 3000});
		}
		this.dialogRef.close(n);
	}

	isTouched() {
		return JSON.stringify(this.data.row, null, "\t") !== this.str;
	}

	async loadHelper() {
		const relations = Table.getRelations();
		const limit = 1000;

		for (const col of Table.getSelected().columns) {
			const tsFunction = Column.isTimestamp(this.selectedServer!.driver, col);
			if (tsFunction) {
				this.datesHelper[col.name] = tsFunction;
				continue;
			}

			const enums = this.selectedServer!.driver.extractEnum(col);
			if (enums) {
				this.relationHelper[col.name] = enums;
				continue;
			}

			const relation = relations.find(relation => relation.column_source === col.name);
			if (relation) {
				this.relationHelper[col.name] = await this.request.post('relation/exampleData', {
					column: relation.column_dest,
					table: relation.table_dest,
					limit
				});
			}
		}
	}

	setValue(column: string, value: any) {
		const row = JSON.parse(this.str);
		row[column] = value;
		this.str = JSON.stringify(row, null, "\t");
	}

	strError() {
		try {
			JSON.parse(this.str);
		} catch (e) {
			return e;
		}
		return null;
	}
}
