import { Component, Inject, OnInit } from '@angular/core';
import { EditableComplex } from "../../../classes/complex";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { complex } from "../../../shared/helper";
import { Table } from "../../../classes/table";
import { MatDrawer } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: 'app-complex',
	templateUrl: './complex.component.html',
	styleUrls: ['./complex.component.scss']
})
export class ComplexComponent implements OnInit {

	complexes: { [type: string]: EditableComplex[] } = {};
	selectedServer?: Server;
	selectedDatabase?: Database;

	protected readonly Object = Object;
	protected readonly complex = complex;

	constructor(
		private drawer: MatDrawer,
		private router: Router,
		private request: RequestService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();

		for (const [type, complexes] of Object.entries(this.selectedServer.complexes)) {
			const list = <EditableComplex[]>complexes.filter(complex => this.selectedDatabase!.name === complex.database);
			this.complexes[type] = list.map(complex => { complex.newName = complex.name; return complex });
		}
	}

	filterChanged(_value: string) {
		const value = _value.toLowerCase();

		for (const [type, complexes] of Object.entries(this.complexes)) {
			this.complexes[type] = complexes.filter(complex => {
				complex.hide = complex.name.indexOf(value) < 0;
				if (complex.hide && complex.table) {
					complex.hide = complex.table.indexOf(value) < 0;
				}
				return complex;
			});
		}
	}

	async rename(complex: EditableComplex, type: string) {
		const query = this.selectedServer!.driver.renameComplex(complex, type, this.selectedDatabase!.name);
		await this.request.post('query/run', { query });

		this.snackBar.open(`Rename ${complex.name} to ${complex.newName}`, "⨉", {duration: 3000});
		complex.name = complex.newName!;
		complex.rename = false;
	}

	alter(complex: EditableComplex, type: string) {
		const query = this.selectedServer?.driver.alterComplex(complex, type);
		this.router.navigate([Server.getSelected().name, Database.getSelected().name, Table.getSelected().name, 'query', query]);
		this.drawer.close();
	}

	drop(complex: EditableComplex, type: string) {
		const dialogRef = this.dialog.open(DropComplexDialog, {
			data: EditableComplex
		});

		dialogRef.afterClosed().subscribe(async (result: any) => {
			if (!result) {
				return;
			}
			await this.request.post('complex/drop', {complex, type});
			this.snackBar.open(`Dropped ${complex.name}`, "⨉", {duration: 3000});
			await this.request.reloadServer();
		});
	}
}


@Component({
	templateUrl: './drop-complex-dialog.html',
})
export class DropComplexDialog {
	constructor(
		@Inject(MAT_DIALOG_DATA) public complex: EditableComplex,
		private dialogRef: MatDialogRef<DropComplexDialog>) {
	}

	async remove() {
		this.dialogRef.close(true);
	}
}
