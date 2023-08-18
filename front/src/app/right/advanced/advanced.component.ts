import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Router } from "@angular/router";
import { validName } from "../../../shared/helper";

@Component({
	selector: 'app-advanced',
	templateUrl: './advanced.component.html',
	styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;

	duplicateLoading = false;
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

		this.stats = await this.request.post('database/stats', undefined);
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

	async changeCollation(collation: string) {
		await this.request.post('database/setCollations', {collation});

		await this.request.reloadServer();
		this.snackBar.open(`Switched Collation to ${collation}`, "╳", {duration: 3000});
	}

	async duplicate(copyName: string) {
		this.duplicateLoading = true;
		await this.request.post('database/duplicate', {name: copyName});
		await this.request.reloadServer();
		this.duplicateLoading = false;

		this.snackBar.open(`${this.selectedDatabase?.name} duplicated to ${copyName}`, "╳", {duration: 3000});
	}

	validName(name: string) {
		if (!name.match(validName)) {
			return false;
		}
		return name.length > 1 && !this.selectedServer?.dbs?.find(db => db.name.split(',')[0] === name);
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
