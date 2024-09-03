import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Table } from "../../../classes/table";
import jsbeautifier from "js-beautify";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { getStorageKey, initBaseEditor, loadLibAsset } from "../../../shared/helper";
import { Column } from "../../../classes/column";
import { MatPaginator } from "@angular/material/paginator";
import { allFakers, faker } from '@faker-js/faker';
import * as falso from '@ngneat/falso';
import * as bson from "bson";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { UpdateDataDialog } from "../../../shared/update-data-dialog/update-data-dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DrawerService } from "../../../shared/drawer.service";


class Random {
	column!: Column;
	model!: string;
	error? = "";
}

declare var monaco: any;

@Component({
	selector: 'app-insert',
	templateUrl: './insert.component.html',
	styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	actionColum = "##ACTION##";
	dataSource: MatTableDataSource<any> = new MatTableDataSource();
	displayedColumns?: string[];
	selection = new SelectionModel<any>(true, []);
	editorOptions = {
		language: 'javascript'
	};
	editors: any = {};
	limit = 300;
	randomSource: Random[] = [];
	interval?: NodeJS.Timer;
	iframe?: SafeResourceUrl;
	codes: any = JSON.parse(localStorage.getItem(getStorageKey("insertCode")) || "{}");

	protected readonly JSON = JSON;
	@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

	constructor(
		private request: RequestService,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private http: HttpClient,
		private dialog: MatDialog,
		private drawer: DrawerService,
		private router: Router,
		public sanitizer: DomSanitizer
	) {
	}

	ngOnInit() {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			this.dataSource.data = [];
			this.selection.clear();
			this.randomSource = [];
			clearInterval(this.interval);

			this.selectedServer = Server.getSelected();
			this.selectedDatabase = Database.getSelected();
			this.selectedTable = Table.getSelected();

			this.displayedColumns = [...this.selectedTable.columns.map(col => col.name)];
			this.displayedColumns.push(this.actionColum);

			for (const column of this.selectedTable.columns) {
				const random = <Random>{column, model: this.getCode(column.name)};
				if (!random.model) {
					await this.sampleData(random);
				}
				this.randomSource.push(random);
			}

			this.interval = setInterval(() => this.saveCode(), 2000);
		});

		this.activatedRoute?.paramMap.subscribe(async (paramMap) => {
			if (paramMap.get('json')) {
				this.dataSource.data = JSON.parse(paramMap.get('json')!);
				this.scrollToBottom();
			}
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	async sampleData(random: Random, userDemand = false) {
		const values = this.selectedServer!.driver.extractEnum(random.column);
		let fks = [];
		if (values) {
			random.model = `return (() => {const enums = [${values.map(value => `'${value}'`).join(",")}];return enums[Math.floor(Math.random() * (enums.length))]})()`;
		} else {
			const relation = Table.getRelations().find(relation => relation.column_source === random.column.name);
			if (relation) {
				fks = await this.request.post('relation/exampleData', {
					table: relation.table_dest,
					column: relation.column_dest,
					limit: this.limit
				});
				if (fks) {
					random.model = `return (() => { const fk = [${fks.map((data: string) => JSON.stringify(data)).join(",")}]; return fk[Math.floor(Math.random() * (fk.length))]; })()`;
				}
			}
		}

		if (userDemand) {
			this.snackBar.open(`Found ${values ? values.length : fks.length} possible data`, "⨉", {duration: 3000})
		}

		random.model = this.beautify(random.model || `return faker.datatype.string();`);
	}

	beautify(str: string) {
		return jsbeautifier.js_beautify(str);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.dataSource.data);
	}

	addRows(length: number) {
		const obj: any = {};
		this.displayedColumns?.map(col => {
			if (col !== this.actionColum) {
				obj[col] = null
			}
		});

		const newRows = Array.from({length}, (_, k) => obj);
		this.dataSource.data = this.dataSource.data.concat(newRows);

		if (length < 2) {
			this.editRow(this.dataSource.data.length - 1, obj);
		}
	}

	async insert() {
		const result = await this.request.post('data/insert', this.dataSource.data);
		this.snackBar.open(`${result} affected Rows`, "⨉", {duration: 3000});
	}

	removeRows() {
		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});
		this.selection.clear();
	}

	generate(nb: number) {
		for (let i = 0; i < nb; i++) {
			const obj: any = {};
			for (const [index, rand] of Object.entries(this.randomSource)) {
				try {
					let value = new Function("faker", "falso", "bson", "allFakers", rand.model)(faker, falso, bson, allFakers);
					if (typeof value === 'function') {
						value = value();
					}
					if (typeof value === "bigint") {
						value = value.toString();
					}
					obj[rand.column.name] = value;
					this.randomSource[+index].error = "";
				} catch (e) {
					this.randomSource[+index].error = <string>e;
					return;
				}
			}
			this.dataSource.data.push(obj);
		}
		this.dataSource._updateChangeSubscription();
		this.scrollToBottom();
	}

	scrollToBottom() {
		setTimeout(() => {
			this.scrollContainer.nativeElement.scrollIntoView({behavior: 'smooth'})
		}, 300);
	}

	csvToJSON(csv: string) {
		const lines = csv.split("\n");
		const result = [];
		const headers = lines[0].split(",");

		for (let i = 1; i < lines.length; i++) {
			const obj: any = {};

			if (lines[i] == undefined || lines[i].trim() == "") {
				continue;
			}

			const words = lines[i].split(",");
			for (let j = 0; j < words.length; j++) {
				obj[headers[j].trim()] = words[j];
			}

			result.push(obj);
		}
		return result;
	}

	async inputChange(fileInputEvent: any) {
		if (!fileInputEvent.target.files) {
			return;
		}
		const file = (<FileList>fileInputEvent.target.files)[0];
		let data: any = await file.text();

		if (file.type === "application/json") {
			data = JSON.parse(data);
			if (data.tables && data.tables[this.selectedTable!.name]) {
				data = data.tables[this.selectedTable!.name];
			}
		} else {
			data = this.csvToJSON(data);
		}
		if (!data || data.length < 1 || !Array.isArray(data)) {
			this.snackBar.open("File not compatible.\nIf you try to import JSON file, it has to be a array of object corresponding to table structure", "⨉", {panelClass: 'snack-error'});
			return;
		}

		for (const da of data) {
			this.dataSource.data.push(da);
		}

		this.dataSource._updateChangeSubscription();
	}

	saveCode() {
		for (const random of this.randomSource) {
			if (!random.column.name) {
				continue;
			}
			this.codes[this.selectedTable!.name][random.column.name] = random.model;
		}

		localStorage.setItem(getStorageKey("insertCode"), JSON.stringify(this.codes));
	}

	getCode(col: string) {
		this.codes[this.selectedTable!.name] = this.codes[this.selectedTable!.name] || {};

		if (this.codes[this.selectedTable!.name][col]) {
			return this.codes[this.selectedTable!.name][col];
		}
		return false;
	}

	async initEditor(editor: any, column: string) {
		initBaseEditor(editor);

		await loadLibAsset(this.http, ['bson.d.ts', 'faker.d.ts', 'falso.d.ts']);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			`import * as bsonModule from "bson.d.ts";
			import { faker as fakerModule, allFakers as allFakersModule } from "faker.d.ts";
			import * as falsoModule from "falso.d.ts";

			declare global {
				var bson: typeof bsonModule;
				var faker: typeof fakerModule;
				var allFakers: typeof allFakersModule;
				var falso: typeof falsoModule;
			}`,
			`file:///main.tsx`
		);

		this.editors[column] = editor;
	}

	editRow(i: number, row: any) {
		const dialogRef = this.dialog.open(UpdateDataDialog, {
			data: {
				row,
				updateInPlace: false
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result) {
				this.dataSource.data[i] = result;
				this.dataSource._updateChangeSubscription();
			}
		});
	}

	async iaCode(random: Random, framework: string) {
		await this.router.navigate(
			[{outlets: {right: ['assistant']}}],
			{relativeTo: this.activatedRoute.parent?.parent});
		await this.drawer.open(`Using ${framework} dependency, give me the code to generate random data for my column "${random.column.name}" in the table "${this.selectedTable?.name}". Return the data generated and avoid logging`);
	}
}
