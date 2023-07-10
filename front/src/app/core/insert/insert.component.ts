import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Table } from "../../../classes/table";
import jsbeautifier from "js-beautify";
import * as cryptojs from "crypto-js";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TypeName } from 'src/classes/driver';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { Generator, Group } from "../../../classes/generator";
import { initBaseEditor } from "../../../shared/helper";
import { Column } from "../../../classes/column";

const localStorageName = "insert-codes";

class Random {
	column!: Column;
	model!: string;
	error? = "";
}

@Component({
	selector: 'app-insert',
	templateUrl: './insert.component.html',
	styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	obs?: Subscription;

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
	codes: any = JSON.parse(localStorage.getItem(localStorageName) || "{}");
	generatorGroups!: Group[];

	constructor(
		private request: RequestService,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar
	) {
	}

	ngOnInit() {
		this.obs = combineLatest([this.activatedRoute.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.dataSource = new MatTableDataSource();
			this.selection.clear();
			this.randomSource = [];
			clearInterval(this.interval);

			this.selectedServer = Server.getSelected();
			this.selectedDatabase = Database.getSelected();
			this.selectedTable = Table.getSelected();

			this.generatorGroups = (new Generator()).getGroups();
			this.displayedColumns = [...this.selectedTable.columns.map(col => col.name)];
			this.displayedColumns.push(this.actionColum);

			for (const column of this.selectedTable.columns) {
				const random = <Random>{column, model: this.getCode(column.name)};
				if (!random.model) {
					await this.sampleData(random);
				}
				this.randomSource.push(random);
			}

			this.interval = setInterval(() => this.saveCode(), 1000);
		});
	}

	ngOnDestroy() {
		this.obs?.unsubscribe();
		clearInterval(this.interval);
	}

	async sampleData(random: Random) {
		const values = this.selectedServer!.driver.extractEnum(random.column);
		if (values) {
			random.model = `(() => {const enums = [${values.map(value => `'${value}'`).join(",")}];return enums[Math.floor(Math.random() * (enums.length))]})()`;
		} else if (Table.getRelations().find(relation => relation.column_source === random.column.name)) {
			const datas = await this.request.post('relation/exampleData', {column: random.column.name, limit: this.limit});
			if (datas) {
				random.model = `(() => { const fk = [${datas.map((data: any) => `'${data.example}'`).join(",")}]; return fk[Math.floor(Math.random() * (fk.length))]; })()`;
			}
		}

		random.model = this.beautify(random.model || '(() => {return undefined})()');
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

		const newRows = Array.from({length}, (_, k) => obj);
		this.dataSource.data = this.dataSource.data.concat(newRows);
	}

	async insert() {
		const result = await this.request.post('data/insert', this.dataSource.data);

		this.snackBar.open(`${result} Affected Rows`, "╳", {duration: 3000});
	}

	removeRows() {
		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});

		this.selection.clear();
	}

	generate(nb: number, scrollAnchor: HTMLElement) {
		const random: any[] = [];
		for (let i = 0; i < nb; i++) {

			const obj: any = {};
			for (const [index, rand] of Object.entries(this.randomSource)) {
				try {
					obj[rand.column.name] = new Function("cryptojs", "return " + rand.model)(cryptojs);
					this.randomSource[+index].error = "";
				} catch (e) {
					this.randomSource[+index].error = <string>e;
					return;
				}
			}
			random.push(obj);
		}
		this.dataSource.data = this.dataSource.data.concat(random);
		setTimeout(() => {
			scrollAnchor.scrollIntoView({behavior: 'smooth'})
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
			if (!Array.isArray(data)) {
				for (const arr of Object.values(data)) {
					if (Array.isArray(arr)) {
						data = arr;
						break;
					}
				}
			}
		} else {
			data = this.csvToJSON(data);
		}
		if (!data || data.length < 1) {
			this.snackBar.open("File not compatible", "╳", {panelClass: 'snack-error'});
			return;
		}

		for (const da of data) {
			this.dataSource.data.push(da);
		}

		this.dataSource._updateChangeSubscription();
	}

	typeMatch(columnType: string, presetTypes: TypeName[]) {
		if (columnType.indexOf('(') >= 0) {
			columnType = columnType.substring(0, columnType.indexOf('('))
		}
		columnType = columnType.toLowerCase();

		for (const presetType of presetTypes) {
			const types = this.selectedServer!.driver.typesList.find(t => t.name === presetType);
			if (types?.full.find(full => columnType === full)) {
				return true;
			}
		}

		return false;
	}

	saveCode() {
		for (const random of this.randomSource) {
			this.codes[this.selectedDatabase!.name][this.selectedTable!.name][random.column.name] = random.model;
		}

		localStorage.setItem(localStorageName, JSON.stringify(this.codes));
	}

	getCode(col: string) {
		this.codes[this.selectedDatabase!.name] = this.codes[this.selectedDatabase!.name] || {};
		this.codes[this.selectedDatabase!.name][this.selectedTable!.name] = this.codes[this.selectedDatabase!.name][this.selectedTable!.name] || {};

		if (this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col]) {
			return this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col];
		}
		return false;
	}

	async initEditor(editor: any, column: string) {
		initBaseEditor(editor);

		this.editors[column] = editor;
	}
}
