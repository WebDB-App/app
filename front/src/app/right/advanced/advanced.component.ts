import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Router } from "@angular/router";

@Component({
	selector: 'app-advanced',
	templateUrl: './advanced.component.html',
	styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;

	collations: string[] = [];
	interval?: NodeJS.Timer;
	stats?: {
		index_length: number,
		data_length: number
	};

	constructor(private dialog: MatDialog,
				private snackBar: MatSnackBar,
				private request: RequestService,
				private router: Router) {
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		this.collations = await this.request.post('database/availableCollations', undefined);
		this.interval = setInterval(async () => {
			this.stats = await this.request.post('database/stats', undefined);
		}, 2000);

		if (!this.collations.includes(this.selectedDatabase!.collation)) {
			this.collations.push(this.selectedDatabase!.collation)
		}
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	drop() {
		const dialogRef = this.dialog.open(DropDatabaseDialog, {
			data: this.selectedDatabase
		});

		dialogRef.afterClosed().subscribe(async (databaseName) => {
			if (!databaseName) {
				return;
			}

			await this.request.post('database/drop', undefined);
			this.snackBar.open(`${databaseName} Dropped`, "╳", {duration: 3000});

			await this.request.reloadServer();
			await this.router.navigate(['/']);
		});
	}

	async rename(databaseName: string) {
		await this.request.post('table/alter', databaseName);
		this.snackBar.open(`${this.selectedDatabase!.name} Renamed to ${databaseName}`, "╳", {duration: 3000});

		await this.request.reloadServer();
		await this.router.navigate([
			Server.getSelected().name,
			databaseName]);
	}

	async changeCollation(collation: string) {
		await this.request.post('database/setCollations', {collation});

		await this.request.reloadServer();
		this.snackBar.open(`Switched`, "╳", {duration: 3000});
	}
}

@Component({
	templateUrl: './drop-database-dialog.html',
})
export class DropDatabaseDialog {
	constructor(
		@Inject(MAT_DIALOG_DATA) public database: Database,
	) {
	}
}
