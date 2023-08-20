import { AfterViewChecked, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Column } from "../../../classes/column";
import { RequestService } from "../../../shared/request.service";
import { Index, IndexSymbol } from "../../../classes";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DrawerService } from "../../../shared/drawer.service";
import { HoverService } from "../../../shared/hover.service";
import { isSQL } from "../../../shared/helper";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
	selector: 'app-structure',
	templateUrl: './structure.component.html',
	styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit, AfterViewChecked {

	selectedTable?: Table;
	selectedDatabase?: Database;
	selectedServer?: Server;

	actionColum = "##ACTION##";

	structureColumns: string[] = [];
	structureSource!: MatTableDataSource<Column>;

	indexColumns: string[] = [];
	indexSource!: MatTableDataSource<Index>;

	constructor(private request: RequestService,
				private activatedRoute: ActivatedRoute,
				private router: Router,
				private drawer: DrawerService,
				private dialog: MatDialog,
				private container: ElementRef,
				private hoverService: HoverService,
				private snackBar: MatSnackBar
	) {
	}

	async loadData() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		this.selectedTable = Table.getSelected();

		this.indexColumns = ['tags', 'columns', 'name'];
		this.structureColumns = ['name', 'type', 'nullable'];

		if (isSQL()) {
			this.structureColumns.push('defaut');
			this.indexColumns.push('cardinality');
		}
		if (this.selectedServer.driver.language.extraAttributes.length) {
			this.structureColumns.push('extra');
		}
		if (isSQL()) {
			this.structureColumns.push('comment');
		}
		if (!this.selectedTable.view) {
			this.structureColumns.push(this.actionColum);
		}

		this.indexColumns.push(this.actionColum);
		this.structureSource = new MatTableDataSource(this.selectedTable?.columns);
		this.indexSource = new MatTableDataSource(Table.getIndexes());
	}

	async ngOnInit() {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			await this.loadData()
		});
	}

	ngAfterViewChecked() {
		this.selectedTable!.columns.map(col => {
			this.hoverService.makeHover(this.container, 'hover-' + col.name);
		})
	}

	async refreshData() {
		await this.request.reloadServer();
		await this.loadData();
	}

	async deleteStructure(row: any) {
		const dialogRef = this.dialog.open(DropColumnDialog, {
			data: row,
		});

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result) {
				return;
			}
			await this.refreshData();
		});
	}

	async addColumn() {
		const dialogRef = this.dialog.open(AddColumnDialog, {
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result) {
				return;
			}
			await this.refreshData();
		});
	}

	async updateColumn(row: Column) {
		const dialogRef = this.dialog.open(UpdateColumnDialog, {
			data: row,
			id: JSON.stringify(row),
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result) {
				return;
			}
			await this.refreshData();
		});
	}

	async deleteIndex(row: any) {
		await this.request.post('index/drop', {name: row.name});

		this.snackBar.open(`Dropped Index ${row.name}`, "╳", {duration: 3000})
		await this.refreshData();
	}

	addIndex() {
		const dialogRef = this.dialog.open(AddIndexDialog, {
			data: this.selectedTable,
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result) {
				return;
			}
			await this.refreshData();
		});
	}

	getClasses(columns: string[]) {
		return columns.map(col => 'hover-' + col)
	}

	display(row: any, column: string): string {
		if (column === this.actionColum) {
			return '';
		}
		if (column === 'tags') {
			return Index.getSymbol([row]).join(' ');
		}

		return row[column];
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.structureSource.filter = filterValue.trim().toLowerCase();
	}
}

@Component({
	templateUrl: 'add-index-dialog.html',
})
export class AddIndexDialog {

	selectedServer?: Server;
	selectedDatabase?: Database;
	indexNames: string[] = [];
	symbols = IndexSymbol;
	protected readonly isSQL = isSQL;

	constructor(
		private dialogRef: MatDialogRef<AddIndexDialog>,
		private request: RequestService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public table: Table,
	) {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.indexNames = Table.getIndexes().map(index => index.name);
	}

	async createIndex(name: string, type: string, columns: string[]) {
		await this.request.post('index/add', {
			name,
			type,
			columns
		}, this.table, this.selectedDatabase, this.selectedServer);

		this.snackBar.open(`Added Index ${name}`, "╳", {duration: 3000})
		this.dialogRef.close(true);
	}
}

@Component({
	templateUrl: 'drop-column-dialog.html',
})
export class DropColumnDialog {

	constructor(
		private dialogRef: MatDialogRef<DropColumnDialog>,
		private request: RequestService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public column: Column,
	) {
	}

	async dropColumn() {
		await this.request.post('column/drop', {column: this.column.name});

		this.snackBar.open(`Dropped Column ${this.column.name}`, "╳", {duration: 3000})
		this.dialogRef.close(true);
	}
}

@Component({
	templateUrl: 'add-column-dialog.html',
})
export class AddColumnDialog {

	selectedServer?: Server;
	selectedTable!: Table;
	form!: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<AddColumnDialog>,
		private fb: FormBuilder,
		private request: RequestService,
		private snackBar: MatSnackBar,
	) {
		this.selectedServer = Server.getSelected();
		this.selectedTable = Table.getSelected();
		this.form = fb.group({
			columns: fb.array([
				Column.getFormGroup(this.selectedTable),
			])
		});
	}

	async apply() {
		await this.request.post('column/add', this.form.value);
		this.snackBar.open(`Columns Added`, "╳", {duration: 3000});
		this.dialogRef.close(true);
	}

	addColumn(column?: any) {
		const cols = this.form.get("columns") as FormArray;
		cols.push(column || Column.getFormGroup(this.selectedTable));
	}
}

@Component({
	templateUrl: 'update-column-dialog.html',
})
export class UpdateColumnDialog {

	form!: FormGroup;
	selectedServer?: Server;
	selectedTable?: Table;
	oldValues = false;
	protected readonly JSON = JSON;

	constructor(
		private dialogRef: MatDialogRef<AddColumnDialog>,
		private request: RequestService,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public column: Column,
	) {
		this.selectedTable = Table.getSelected();
		this.selectedServer = Server.getSelected();

		const old = Column.getFormGroup(undefined, column);
		old.disable();

		this.form = fb.group({
			old,
			columns: fb.array([
				Column.getFormGroup(this.selectedTable, column)
			])
		});
	}

	async update() {
		await this.request.post('column/modify', this.form.getRawValue());
		this.snackBar.open(`Columns Altered`, "╳", {duration: 3000});
		this.dialogRef.close(true);
	}
}
