import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Router } from "@angular/router";
import helper from "../../../shared/common-helper.mjs";

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
	str = "";
	editorOptions = {
		language: 'json',
		readOnly: true
	};

	constructor(
		public request: RequestService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private router: Router) {
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		const {driver, ...rest} = {...this.selectedServer};
		this.str = JSON.stringify(rest, null, 4);

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

	initEditor(editor: any) {
		setTimeout(() => {
			editor.trigger('fold', 'editor.foldAll');
			editor.trigger('unfold', 'editor.unfold', {
				levels: 2,
			});
		}, 1);
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

	nameValid(name: string) {
		if (!name.match(helper.validName)) {
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
