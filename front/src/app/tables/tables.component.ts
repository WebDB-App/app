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
import { uniqueValidator } from "../../shared/unique.validator";
import { validName } from "../../shared/helper";

const localStorageTableWidthKey = "tableWidth";

@Component({
	selector: 'app-tables',
	templateUrl: './tables.component.html',
	styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

	selectedDatabase?: Database;
	selectedServer?: Server;
	selectedTable?: Table;

	width?: number;
	tooltips: { [key: string]: string } = {};
	tabs!: string[];

	constructor(
		private router: Router,
		private titleService: Title,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
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
			this.tabs = table.view ? ["explore", "query", "structure", "advanced"] : ["explore", "query", "structure", "insert", "advanced"];

			if (!this.activatedRoute.snapshot.paramMap.get('table')) {
				await this.router.navigate([
					this.selectedServer.name,
					this.selectedDatabase.name,
					this.selectedTable.name
				]);
			}

			const widths = JSON.parse(localStorage.getItem(localStorageTableWidthKey) || "{}");
			if (widths[this.selectedDatabase!.name]) {
				this.width = widths[this.selectedDatabase!.name];
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
			match = match || (table.columns.findIndex(col => col.name.toLowerCase().indexOf(value) > -1 || col.type.toLowerCase().indexOf(value) > -1) > -1);

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

			str += `<tr class="mat-row"><td class="mat-cell">${col.name}　${tags.join(' ')}</td><td class="mat-cell">${JSON.stringify(col.type).replaceAll('"', " ")}</td></tr>`;
		}

		this.tooltips[table.name] = str + "</table>";
	}

	async addTable() {
		this.dialog.open(CreateTableDialog, {
			hasBackdrop: false
		});
	}

	async changeTable(name: string) {
		let url = this.router.url;
		if (url.indexOf(`/(${this.selectedTable!.name}/`) >= 0) {
			url = url.replace(`/(${this.selectedTable!.name}/`, `/(${name}/`);
		} else {
			url = url.replace(`/${this.selectedTable!.name}/`, `/${name}/`);
		}

		await this.router.navigateByUrl(url);
	}

	saveWidth(width: number) {
		const widths = JSON.parse(localStorage.getItem(localStorageTableWidthKey) || "{}");
		widths[this.selectedDatabase!.name] = width;
		localStorage.setItem(localStorageTableWidthKey, JSON.stringify(widths));
	}
}


@Component({
	templateUrl: 'create-table-dialog.html',
})
export class CreateTableDialog {

	selectedServer: Server;
	selectedDatabase: Database;
	form!: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<CreateTableDialog>,
		private fb: FormBuilder,
		private request: RequestService,
		private snackBar: MatSnackBar,
		private router: Router,
	) {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();

		this.form = this.fb.group({
			name: [null, [Validators.required, Validators.pattern(validName), uniqueValidator('name', Database.getSelected().tables!.map(table => table.name))]],
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

		this.snackBar.open(`Table ${this.form.get('name')?.value} created`, "╳", {duration: 3000});
		this.dialogRef.close(true);
	}
}
