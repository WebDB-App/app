import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { Table } from "../../classes/table";
import { RequestService } from "../../shared/request.service";
import { Column } from "../../classes/column";
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validName } from "../../shared/helper";

@Component({
	selector: 'app-tables',
	templateUrl: './tables.component.html',
	styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

	selectedDatabase?: Database;
	selectedServer?: Server;
	selectedTable?: Table;

	tooltips: { [key: string]: string } = {};
	tabs!: string[];

	constructor(
		private router: Router,
		private titleService: Title,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private request: RequestService,
		private activatedRoute: ActivatedRoute
	) {
	}

	async ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async (_params) => {
			this.selectedDatabase = Database.getSelected();
			this.selectedServer = Server.getSelected();

			if (!this.selectedDatabase || !this.selectedDatabase.tables?.length) {
				return;
			}

			const tableName = this.activatedRoute.snapshot.paramMap.get('table');
			let table = this.selectedDatabase.tables.find(table => table.name === tableName);
			if (this.activatedRoute.snapshot.paramMap.get('table') && !table) {
				await this.router.navigate(['/', this.selectedServer.name, this.selectedDatabase.name], {relativeTo: this.activatedRoute});
				this.snackBar.open(`Can't access to ${tableName}`, "╳", {panelClass: 'snack-error'});
				return;
			}

			table = table || this.selectedDatabase.tables[0];
			if (!table) {
				return;
			}

			this.titleService.setTitle(table.name + " – " + this.selectedDatabase.name + " – " + this.selectedServer.port);
			this.selectedTable = table;
			Table.setSelected(this.selectedTable!);
			this.tabs = table.view ? ["explore", "query", "structure", "trigger", "advanced"] : ["explore", "query", "structure", "insert", "trigger", "advanced"];

			if (!this.activatedRoute.snapshot.paramMap.get('table')) {
				await this.router.navigate([
					this.selectedServer.name,
					this.selectedDatabase.name,
					this.selectedTable.name
				], {skipLocationChange: true});
			}
		});
	}

	filterChanged(_value: string) {
		if (!this.selectedDatabase) {
			return;
		}

		const value = _value.toLowerCase();

		for (const [index, table] of this.selectedDatabase.tables!.entries()) {
			let match = table.name.toLowerCase().indexOf(value) > -1;
			match = match || (table.columns.findIndex(col => col.name.toLowerCase().indexOf(value) > -1) > -1);

			this.selectedDatabase.tables![index].hide = !match;
		}
	}

	getTooltip(table: Table) {
		if (this.tooltips[table.name]) {
			delete this.tooltips[table.name];
			return;
		}

		let str = "<table class='table'>";
		const indexes = Table.getIndexes(table);
		const relations = Table.getRelations(table);

		for (const col of table.columns) {
			const relation = relations.find(relation => relation.column_source === col.name);
			const tags = Column.getTags(col, indexes, relation);

			str += `<tr class="mat-row"><td class="mat-cell">${col.name}</td><td class="mat-cell">${tags.join('　')}</td><td class="mat-cell">${col.type.substring(0, 12)}</td></tr>`;
		}

		this.tooltips[table.name] = str + "</table>";
	}

	async addTable() {
		this.dialog.open(CreateTableDialog, {
			hasBackdrop: false
		});
	}

	addView() {
		this.dialog.open(CreateViewDialog, {
			hasBackdrop: false
		});
	}

	async changeTable(name: string) {
		let url = this.router.url.replace(`${this.selectedTable!.name}/`, `${name}/`);

		const explore = url.indexOf(`/explore?`);
		if (explore >= 0) {
			url = url.substring(0, explore) + '/explore';
		}

		await this.router.navigateByUrl(url);
	}
}


@Component({
	templateUrl: 'create-table-dialog.html',
})
export class CreateTableDialog {

	selectedServer: Server;
	form!: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<CreateTableDialog>,
		private fb: FormBuilder,
		private request: RequestService,
		private snackBar: MatSnackBar,
		private router: Router,
	) {
		this.selectedServer = Server.getSelected();
		this.form = fb.group({
			name: [null, [Validators.required, Validators.pattern(validName)]],
			columns: fb.array([
				Column.getFormGroup(),
			])
		});
	}

	addColumn(column?: any) {
		const cols = this.form.get("columns") as FormArray;
		cols.push(column || Column.getFormGroup());
	}

	async create() {
		await this.request.post('table/create', this.form.value);
		await this.request.reloadServer();

		await this.router.navigate([
			Server.getSelected().name,
			Database.getSelected().name,
			this.form.get('name')?.value,
			'structure']);

		this.snackBar.open(`Table ${this.form.get('name')?.value} Created`, "╳", {duration: 3000});
		this.dialogRef.close(true);
	}
}


@Component({
	templateUrl: 'create-view-dialog.html',
})
export class CreateViewDialog {

	form!: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<CreateViewDialog>,
		private fb: FormBuilder,
		private request: RequestService,
		private snackBar: MatSnackBar,
	) {
		this.form = fb.group({
			name: [null, [Validators.required, Validators.pattern(validName)]]
		});
	}
}
