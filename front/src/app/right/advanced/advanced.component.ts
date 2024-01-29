import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Router } from "@angular/router";
import { DrawerService } from "../../../shared/drawer.service";
import { getStorageKey, validName } from "../../../shared/helper";
import { Stats } from "../../../classes/stats";
import { Subscription } from "rxjs";

@Component({
	selector: 'app-advanced',
	templateUrl: './advanced.component.html',
	styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;

	drawerObs!: Subscription;
	duplicateLoading = false;
	collations: string[] = [];
	stats?: Stats;
	str = "";
	editorOptions = {
		language: 'json',
		readOnly: true
	};

	constructor(
		public request: RequestService,
		public snackBar: MatSnackBar,
		private dialog: MatDialog,
		private drawer: DrawerService,
		private router: Router) {

		this.drawerObs = this.drawer.drawer.openedChange.subscribe(async (state) => {
			if (!state) {
				return;
			}
			await this.refreshData();
		});
	}

	ngOnDestroy() {
		this.drawerObs.unsubscribe();
	}

	async refreshData() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		const {driver, ...rest} = {...this.selectedServer};
		this.str = JSON.stringify(rest, null, 4);

		this.collations = await this.request.post('database/availableCollations', undefined);
		this.stats = await this.request.post('stats/dbSize', undefined);
		if (!this.collations.includes(this.selectedDatabase!.collation)) {
			this.collations.push(this.selectedDatabase!.collation)
		}
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

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result.databaseName) {
				return;
			}

			await this.request.post('database/drop', result);
			if (result.associated) {
				for (const key in localStorage){
					if (!key.startsWith(getStorageKey(""))) {
						continue;
					}
					localStorage.removeItem(key);
				}
			}

			this.snackBar.open(`${result.databaseName} dropped`, "⨉", {duration: 3000});

			await this.request.reloadServer();
			await this.router.navigate(['/']);
		});
	}

	async changeCollation(collation: string) {
		await this.request.post('database/setCollations', {collation});

		await this.request.reloadServer();
		this.snackBar.open(`Switched collation to ${collation}`, "⨉", {duration: 3000});
	}

	async duplicate(copyName: string) {
		this.duplicateLoading = true;
		await this.request.post('database/duplicate', {name: copyName});
		await this.request.reloadServer();
		this.duplicateLoading = false;

		this.snackBar.open(`${this.selectedDatabase?.name} duplicated to ${copyName}`, "⨉", {duration: 3000});
	}

	nameValid(name: string) {
		if (!name.match(validName)) {
			return false;
		}
		return name.length > 1 && !this.selectedServer?.dbs?.find(db => db.name.split(' | ')[0] === name);
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
