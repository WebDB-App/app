import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Table } from "../../../classes/table";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { Tabs } from "../tables/tables.component";
import { isSQL } from "../../../shared/helper";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";

@Component({
	selector: 'app-table-advanced',
	templateUrl: './advanced.component.html',
	styleUrls: ['./advanced.component.scss']
})
export class TableAdvancedComponent {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	obs: Subscription
	stats?: any;

	constructor(
		private dialog: MatDialog,
		private request: RequestService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.obs = combineLatest([this.activatedRoute.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.selectedServer = Server.getSelected();
			this.selectedDatabase = Database.getSelected();
			this.selectedTable = Table.getSelected();

			await this.getStats();
		});
	}

	async getStats() {
		this.stats = await this.request.post('table/stats', undefined);
	}

	drop() {
		const dialogRef = this.dialog.open(DropTableDialog, {
			data: this.selectedTable
		});

		dialogRef.afterClosed().subscribe(async (result: any) => {
			if (!result) {
				return;
			}
			this.snackBar.open(`Dropped Table ${this.selectedTable?.name}`, "╳", {duration: 3000});
			await this.goToNew('');
		});
	}

	truncate() {
		const dialogRef = this.dialog.open(TruncateTableDialog);
		dialogRef.afterClosed().subscribe(async (result: any) => {
			if (!result) {
				return;
			}
			this.snackBar.open(`Table ${this.selectedTable?.name} truncated`, "╳", {duration: 3000});
			await this.getStats();
		});
	}

	async rename(new_name: string) {
		await this.request.post('table/rename', {new_name});
		this.snackBar.open(`Table ${this.selectedTable?.name} renamed to ${new_name}`, "╳", {duration: 3000});
		await this.goToNew(new_name);
	}

	async duplicate(new_name: string) {
		await this.request.post('table/duplicate', {new_name});
		this.snackBar.open(`Table ${this.selectedTable?.name} duplicated to ${new_name}`, "╳", {duration: 3000});
		await this.goToNew(new_name);
	}

	async goToNew(new_name: string) {
		await this.request.reloadServer(this.selectedServer, false);
		await this.router.navigate([
			'/',
			this.selectedServer?.name,
			this.selectedDatabase?.name,
			new_name,
			Tabs.at(-1)!.link]
		);
	}

	protected readonly isSQL = isSQL;

	validName(name: string) {
		return name.length > 1 && !this.selectedDatabase?.tables?.find(table => table.name === name);
	}
}

@Component({
	templateUrl: './drop-table-dialog.html',
})
export class DropTableDialog {
	constructor(
		@Inject(MAT_DIALOG_DATA) public table: Table,
		public dialogRef: MatDialogRef<DropTableDialog>,
		private request: RequestService) {
	}

	async remove() {
		if (this.table.view) {
			await this.request.post('table/dropView', undefined);
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
		public dialogRef: MatDialogRef<TruncateTableDialog>,
		private request: RequestService) {
	}

	async truncate() {
		await this.request.post('table/truncate', undefined);
		this.dialogRef.close(true);
	}
}
