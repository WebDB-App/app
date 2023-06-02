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
import { Group, Generator } from "../../../classes/generator";

const localStorageName = "codes";

@Component({
	selector: 'app-insert',
	templateUrl: './insert.component.html',
	styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	columns?: string[];
	structure: any = {};
	obs: Subscription;

	editorOptions = {
		lineNumbers: 'off',
		glyphMargin: false,
		folding: false,
		lineDecorationsWidth: 2,
		lineNumbersMinChars: 0,
		language: 'javascript'
	};

	actionColum = "##ACTION##";
	dataSource: MatTableDataSource<any> = new MatTableDataSource();
	randomSource?: MatTableDataSource<any>;
	selection = new SelectionModel<any>(true, []);
	displayedColumns?: string[];

	interval?: NodeJS.Timer;
	codes: any = JSON.parse(localStorage.getItem(localStorageName) || "{}");
	generatorGroups!: Group[];

	constructor(
		private request: RequestService,
		private route: ActivatedRoute,
		private _snackBar: MatSnackBar) {

		this.obs = combineLatest([this.route.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.dataSource = new MatTableDataSource();
			this.selection.clear();
			await this.ngOnInit();
		});
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.selectedTable = Table.getSelected();

		const generator = new Generator();
		this.generatorGroups = generator.getGroups();

		const relations = Table.getRelations();
		const limit = 300;

		this.columns = this.selectedTable?.columns.map(col => col.name)
		this.displayedColumns = [...this.columns!];
		this.displayedColumns!.push(this.actionColum);

		const select: any = {};
		const fct: any = {};
		const error: any = {};

		for (const col of this.columns!) {
			this.structure[col] = this.selectedTable?.columns.find(column => column.name === col)!.type;

			select[col] = '';
			fct[col] = this.beautify(this.getCode(col));
			error[col] = '';
		}

		for (const col of this.selectedTable!.columns) {
			const values = this.selectedServer!.driver.extractEnum(col);
			if (values) {
				fct[col.name] = `(() => {const enums = [${values.map(value => `'${value}'`).join(",")}];return enums[Math.floor(Math.random() * (enums.length))]})()`;
				fct[col.name] = this.beautify(fct[col.name]);
			} else if (relations.find(relation => relation.column_source === col.name)) {
				const datas = await this.request.post('relation/exampleData', {column: col.name, limit});
				if (datas) {
					fct[col.name] = `(() => {const fk = [${datas.map((data: any) => `'${data.example}'`).join(",")}];return fk[Math.floor(Math.random() * (fk.length))]})()`;
					fct[col.name] = this.beautify(fct[col.name]);
				}
			}
		}

		this.randomSource = new MatTableDataSource([select, fct, error]);
		this.interval = setInterval(() => this.saveCode(), 1000);
	}

	ngOnDestroy() {
		this.obs.unsubscribe();
		clearInterval(this.interval);
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

		this._snackBar.open(`${result.inserted} Affected Rows`, "╳", {duration: 3000});
	}

	removeRows() {
		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});

		this.selection.clear();
	}

	generate(nb: number) {
		for (let i = 0; i < nb; i++) {
			const random: any = {};
			for (const [index, fct] of Object.entries(this.randomSource?.data[1])) {
				try {
					random[index] = new Function("cryptojs", "return " + fct)(cryptojs);
					this.randomSource!.data[2][index] = "";
				} catch (e) {
					this.randomSource!.data[2][index] = e;
					return;
				}
			}
			this.dataSource.data = this.dataSource.data.concat(random);
		}
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
			this._snackBar.open("File not compatible", "╳", {panelClass: 'snack-error'});
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
			const types = this.selectedServer!.driver.typesList.find(t => t.name === presetType)!.full;

			if (types.find(type => columnType === type)) {
				return true;
			}
		}

		return false;
	}

	saveCode() {
		for (const [index, fct] of Object.entries(this.randomSource?.data[1])) {
			this.codes[this.selectedDatabase!.name][this.selectedTable!.name][index] = fct;
		}

		localStorage.setItem(localStorageName, JSON.stringify(this.codes));
	}

	getCode(col: string) {
		this.codes[this.selectedDatabase!.name] = this.codes[this.selectedDatabase!.name] || {};
		this.codes[this.selectedDatabase!.name][this.selectedTable!.name] = this.codes[this.selectedDatabase!.name][this.selectedTable!.name] || {};

		if (this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col]) {
			return this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col];
		}
		return '(() => {return undefined})()';
	}
}
