import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Table } from "../../../classes/table";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { isSQL } from "../../../shared/helper";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { Stats } from "../../../classes/stats";

@Component({
	selector: 'app-table-advanced',
	templateUrl: './advanced.component.html',
	styleUrls: ['./advanced.component.scss']
})
export class TableAdvancedComponent implements OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;

	interval?: NodeJS.Timeout | number;
	stats?: Stats;
	ddl?: string | false;
	protected readonly isSQL = isSQL;

	constructor(
		private dialog: MatDialog,
		private request: RequestService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			this.selectedServer = Server.getSelected();
			this.selectedDatabase = Database.getSelected();
			this.selectedTable = Table.getSelected();

			this.ddl = undefined;
			this.reloadData();
		});
	}

	async reloadData() {
		this.stats = await this.request.post('stats/tableSize', undefined);
		this.ddl = (await this.request.post('table/ddl', undefined)).definition;

		if (!this.interval) {
			this.interval = setInterval(async () => {
				this.stats = await this.request.post('stats/tableSize', undefined);
			}, 2000);
		}
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	drop() {
		const dialogRef = this.dialog.open(DropTableDialog, {
			data: this.selectedTable
		});

		dialogRef.afterClosed().subscribe(async (result: any) => {
			if (!result) {
				return;
			}
			this.snackBar.open(`Dropped ${this.selectedTable?.name}`, "⨉", {duration: 3000});
			await this.router.navigate([
				'/',
				this.selectedServer?.name,
				this.selectedDatabase?.name
			]);
			await this.request.reloadServer();
		});
	}

	truncate() {
		const dialogRef = this.dialog.open(TruncateTableDialog);
		dialogRef.afterClosed().subscribe(async (result: any) => {
			if (!result) {
				return;
			}
			this.snackBar.open(`Table ${this.selectedTable?.name} truncated`, "⨉", {duration: 3000});
		});
	}

	async rename(new_name: string) {
		await this.request.post('table/rename', {new_name});
		this.snackBar.open(`Table ${this.selectedTable?.name} renamed to ${new_name}`, "⨉", {duration: 3000});
		await this.goToNew(new_name);
	}

	async duplicate(new_name: string) {
		await this.request.post('table/duplicate', {new_name});
		this.snackBar.open(`Table ${this.selectedTable?.name} duplicated to ${new_name}`, "⨉", {duration: 3000});
		await this.goToNew(new_name);
	}

	async goToNew(new_name: string) {
		await this.request.reloadServer();
		await this.router.navigate([
			'/',
			this.selectedServer?.name,
			this.selectedDatabase?.name,
			new_name,
			"advanced"
		]);
	}

	validName(name: string) {
		return name.length > 1 && !this.selectedDatabase?.tables.find(table => table.name === name);
	}
}

@Component({
	templateUrl: './drop-table-dialog.html',
})
export class DropTableDialog {
	constructor(
		@Inject(MAT_DIALOG_DATA) public table: Table,
		private dialogRef: MatDialogRef<DropTableDialog>,
		private request: RequestService) {
	}

	async remove() {
		if (this.table.view) {
			await this.request.post('view/drop', undefined);
		} else {
			await this.request.post('table/drop', undefined);
		}

		this.dialogRef.close(true);
	}
}

@Component({
	templateUrl: './truncate-table-dialog.html',
})
export class TruncateTableDialog {
	constructor(
		private dialogRef: MatDialogRef<TruncateTableDialog>,
		private request: RequestService) {
	}

	async truncate() {
		await this.request.post('table/truncate', undefined);
		this.dialogRef.close(true);
	}
}
