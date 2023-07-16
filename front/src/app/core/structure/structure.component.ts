import { AfterViewChecked, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { HoverService } from "../../../shared/hover.service";
import { isSQL } from "../../../shared/helper";

@Component({
	selector: 'app-structure',
	templateUrl: './structure.component.html',
	styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit, OnDestroy, AfterViewChecked {

	selectedTable?: Table;
	selectedDatabase?: Database;
	selectedServer?: Server;
	obs!: Subscription;

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

		if (isSQL(this.selectedServer)) {
			this.structureColumns.push('defaut');
			this.indexColumns.push('cardinality');
		}
		if (this.selectedServer.driver.language.extraAttributes.length) {
			this.structureColumns.push('extra');
		}
		if (isSQL(this.selectedServer)) {
			this.structureColumns.push('comment');
		}

		this.structureColumns.push(this.actionColum);
		this.indexColumns.push(this.actionColum);

		this.structureSource = new MatTableDataSource(this.selectedTable?.columns);
		this.indexSource = new MatTableDataSource(Table.getIndexes());
	}

	async ngOnInit() {
		this.obs = combineLatest([this.activatedRoute.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			await this.loadData()
		});
	}

	ngOnDestroy(): void {
		this.obs.unsubscribe();
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
		this.drawer.toggle();
		await this.router.navigate(
			[{outlets: {right: ['column', 'add', this.selectedTable?.name]}}],
			{relativeTo: this.activatedRoute.parent?.parent})
	}

	async updateStructure(row: Column) {
		await this.router.navigate(
			[{outlets: {right: ['column', 'update', '']}}],
			{relativeTo: this.activatedRoute.parent?.parent})
		this.drawer.toggle();
		await this.router.navigate(
			[{outlets: {right: ['column', 'update', row.name]}}],
			{relativeTo: this.activatedRoute.parent?.parent})
	}

	async deleteIndex(row: any) {
		await this.request.post('index/drop', {name: row.name});

		this.snackBar.open(`Dropped Index ${row.name}`, "╳", {duration: 3000})
		await this.refreshData();
	}

	addIndex() {
		const dialogRef = this.dialog.open(AddIndexDialog, {
			data: this.selectedTable,
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
}


@Component({
	templateUrl: 'add-index-dialog.html',
})
export class AddIndexDialog {

	symbols = IndexSymbol;

	constructor(
		public dialogRef: MatDialogRef<AddIndexDialog>,
		private request: RequestService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public table: Table,
	) {
	}

	async createIndex(name: string, type: string, columns: string[]) {
		await this.request.post('index/add', {name, type, columns});

		this.snackBar.open(`Added Index ${name}`, "╳", {duration: 3000})
		this.dialogRef.close(true);
	}
}

@Component({
	templateUrl: 'drop-column-dialog.html',
})
export class DropColumnDialog {

	constructor(
		public dialogRef: MatDialogRef<AddIndexDialog>,
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
