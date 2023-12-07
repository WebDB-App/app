import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../request.service";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { Table } from "../../classes/table";

@Component({
	templateUrl: './batch-update-dialog.html',
	styleUrls: ['./batch-update-dialog.scss']
})
export class BatchUpdateDialog {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;

	str!: string;
	columns: string[];
	loading = -1;
	editorOptions = {
		language: 'json'
	};

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService,
		private dialogRef: MatDialogRef<BatchUpdateDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any[],
	) {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.selectedTable = Table.getSelected();

		const allProps: any = {};
		data.map(row => {
			for (const [key, val] of Object.entries(row)) {
				allProps[key] = null;
			}
		});
		this.columns = Object.keys(allProps);
		this.show([]);
	}

	show(columns: string[]) {
		this.loading = 0;
		setTimeout(() => {
			const obj: any = {};
			columns.map(column => {
				obj[column] = null;
			});

			this.str = JSON.stringify(obj, null, "\t");
			this.loading = 100;
		});
	}

	async update() {
		const replacer = JSON.parse(this.str);
		let nb = 0;

		for (const old_data of this.data) {
			this.loading = ++nb * 100 / this.data.length;
			const new_data = {...old_data};

			for (const [key, val] of Object.entries(replacer)) {
				new_data[key] = val;
			}
			await this.request.post('data/update', {
				old_data,
				new_data
			}, this.selectedTable, this.selectedDatabase, this.selectedServer);
		}

		this.snackBar.open(`${nb} row(s) updated`, "╳", {duration: 3000});
		this.dialogRef.close(true);
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
