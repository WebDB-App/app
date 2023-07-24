import {
	Component,
	EventEmitter,
	HostListener,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Table } from "../../classes/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Database } from "../../classes/database";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { RequestService } from "../request.service";
import { Relation } from "../../classes/relation";
import { saveAs } from "file-saver-es";
import { DiffEditorModel } from "ngx-monaco-editor-v2";
import { Server } from "../../classes/server";
import { Configuration } from "../../classes/configuration";
import { HttpClient } from "@angular/common/http";
import { initBaseEditor } from "../helper";
import { HistoryService, Query } from "../history.service";

declare var monaco: any;

const localStorageName = "right-code";

@Component({
	selector: 'app-code',
	templateUrl: './code.component.html',
	styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit, OnChanges, OnDestroy {

	@Input() query = '';
	@Input() selectedTable?: Table;

	codes: { [key: string]: string } = JSON.parse(localStorage.getItem(localStorageName) || "{}");
	interval?: NodeJS.Timer;
	configuration: Configuration = new Configuration();
	selectedServer?: Server;
	selectedDatabase?: Database;
	relations?: Relation[];
	editors: any[] = [];
	editorOptions = {
		language: ''
	};
	originalResult: DiffEditorModel = {
		code: '',
		language: 'json'
	};
	modifiedResult: DiffEditorModel = {
		code: '',
		language: 'json'
	};
	diff = false;
	query2 = '';
	pageSize = 50;
	isLoading = false;
	displayedColumns?: string[];
	dataSource?: MatTableDataSource<any>
	page = 0;
	querySize!: number;
	preBuilds: { id: string, tooltip: string, icon: string }[] = [
		{
			id: "select",
			tooltip: "Select",
			icon: "description"
		}, {
			id: "select_join",
			tooltip: "Select with relations",
			icon: "file_present"
		}, {
			id: "update",
			tooltip: "Update",
			icon: "edit_document"
		}, {
			id: "insert",
			tooltip: "Insert",
			icon: "note_add"
		}, {
			id: "delete",
			tooltip: "Delete",
			icon: "scan_delete"
		},
	];
	protected readonly Math = Math;

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService,
		private dialog: MatDialog,
		private http: HttpClient,
		private history: HistoryService
	) {
	}

	@HostListener('keydown', ['$event'])
	async onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && ['Enter', 's'].indexOf(event.key) >= 0) {
			if (this.diff) {
				await this.compareQuery();
			} else {
				await this.runQuery();
			}
			event.preventDefault();
		}
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.editorOptions.language = this.selectedServer?.driver.language.id!;

		if (this.selectedTable) {
			this.loadPreBuild("select");
			this.relations = Table.getRelations();
		} else {
			this.query = this.codes[this.selectedDatabase!.name];
			this.interval = setInterval(() => this.saveCode(), 1000);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedTable']) {
			delete this.dataSource;
			delete this.displayedColumns;

			this.ngOnInit();
		}
	}

	ngOnDestroy(): void {
		clearInterval(this.interval);
	}

	async initEditor(editor: any, index: number) {
		initBaseEditor(editor);

		this.editors[index] = editor;

		await this.selectedServer?.driver.loadExtraLib(this.http);
	}

	async runQuery() {
		this.isLoading = true;

		try {
			let result;
			await Promise.all([
				result = await this.request.post('database/query', {
					query: this.query,
					pageSize: this.pageSize,
					page: this.page
				}, undefined, undefined, undefined, undefined, false),
				this.querySize = await this.request.post('database/querySize', {query: this.query})
			]);

			monaco.editor.setModelMarkers(this.editors[0].getModel(), "owner", []);

			if (result.error) {
				const pos = +result.position || 0;
				const startLineNumber = this.query.substring(0, pos).split(/\r\n|\r|\n/).length

				monaco.editor.setModelMarkers(this.editors[0].getModel(), "owner", [{
					startLineNumber: startLineNumber,
					startColumn: 0,
					endLineNumber: +result.position ? startLineNumber : Infinity,
					endColumn: Infinity,
					message: result.error,
					severity: monaco.MarkerSeverity.Error
				}]);
			}

			if (this.querySize === 0) {
				result.push({" ": "No Data"});
			} else if (this.selectedTable) {
				this.history.addLocal(new Query(this.query, this.querySize));
			}

			if (!Array.isArray(result)) {
				result = [result];
			}

			this.displayedColumns = [...new Set(result.flatMap(res => Object.keys(res)))];
			this.dataSource = new MatTableDataSource(result);
		} catch (err: unknown) {
			this.dataSource = new MatTableDataSource();
		} finally {
			this.isLoading = false;
		}
	}

	async compareQuery() {
		const run = async (query: string) => {
			const data = await this.request.post('database/query', {
				query,
				pageSize: this.pageSize,
				page: 0
			}, undefined, undefined, undefined, undefined, false)
			if (data.length) {
				this.history.addLocal(new Query(query, data.length));
			}

			return JSON.stringify(data, null, "\t");
		}

		this.isLoading = true;
		[this.originalResult.code, this.modifiedResult.code] = await Promise.all([run(this.query), run(this.query2)]);
		this.isLoading = false;
	}

	loadPreBuild(value: string) {
		switch (value) {
			case "delete":
				this.query = this.selectedServer!.driver.getBaseDelete(this.selectedTable!);
				break;
			case "insert":
				this.query = this.selectedServer!.driver.getBaseInsert(this.selectedTable!);
				break;
			case "update":
				this.query = this.selectedServer!.driver.getBaseUpdate(this.selectedTable!);
				break;
			case "select":
				this.query = this.selectedServer!.driver.getBaseSelect(this.selectedTable!);
				break;
			case "select_join":
				this.query = this.selectedServer!.driver.getBaseSelectWithRelations(this.selectedTable!, this.relations!);
				break;
		}
		setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
	}

	exportQuery() {
		this.dialog.open(ExportQueryDialog, {data: this.query});
	}

	async exportResult() {
		this.isLoading = true;
		const data = await this.request.post('database/query', {
			query: this.query,
			pageSize: this.querySize,
			page: 0
		}, undefined, undefined, undefined, undefined, false);
		this.isLoading = false;
		this.dialog.open(ExportResultDialog, {data});
	}

	toggleDiff() {
		this.diff = !this.diff;
		this.query2 = this.query;
	}

	saveCode() {
		this.codes[this.selectedDatabase!.name] = this.query;
		localStorage.setItem(localStorageName, JSON.stringify(this.codes));
	}
}

@Component({
	templateUrl: 'export-result-dialog.html',
})
export class ExportResultDialog {

	str!: string;
	type = "JSON";
	editorOptions = {
		readOnly: true,
		language: ''
	};
	isLoading = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any[],
	) {
		this.show();
	}

	show() {
		this.isLoading = true;
		setTimeout(() => {
			switch (this.type) {
				case "CSV":
					this.str = Object.keys(this.data[0]).join(',') + '\n';
					this.editorOptions.language = 'csv';
					for (let res of this.data) {
						this.str += Object.values(res).join(',') + '\n';
					}
					break;
				case "JSON":
					this.str = JSON.stringify(this.data, null, "\t");
					this.editorOptions.language = 'json';
					break;
			}
			this.isLoading = false;
		});
	}

	download() {
		const blob = new Blob([this.str], {type: "text/plain;charset=utf-8"});
		saveAs(blob, Table.getSelected().name + '.' + this.type);
	}
}

@Component({
	templateUrl: 'export-query-dialog.html',
})
export class ExportQueryDialog {

	str!: string;
	framework = "NODE";
	isLoading = true;
	editorOptions = {
		language: ""
	};
	protected readonly initBaseEditor = initBaseEditor;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: string,
	) {
		this.show();
	}

	show() {
		this.isLoading = true;

		setTimeout(() => {
			const queryParams = Server.getSelected().driver.extractConditionParams(this.data);

			switch (this.framework) {
				case "JDBC":
					this.str = `//with JDBC lib

import java.sql.*;

class MysqlCon {
	public static void main(String args[]){
	try {
		Class.forName("com.${Server.getSelected().wrapper.toLowerCase()}.Driver");
		Connection con = DriverManager.getConnection("jdbc:${Server.getSelected().wrapper.toLowerCase()}://${Server.getSelected().host}:${Server.getSelected().port}/${Database.getSelected().name}", "${Server.getSelected().user}", "${Server.getSelected().password}");

		String query = """
			${queryParams.query}
		"""
		PreparedStatement pstmt = connection.prepareStatement( query );

		ResultSet results = pstmt.executeQuery( );
		con.close();
	} catch(Exception e) {}
}`;
					this.editorOptions.language = "java";
					break;
				case "NODE":
					this.str = Server.getSelected().driver.nodeLib(queryParams);
					this.editorOptions.language = "javascript";
					break;
				case "PDO":
					this.str = `//with PDO lib
<?php

	$pdo = new PDO("${Server.getSelected().wrapper.toLowerCase()}:host=${Server.getSelected().host};port=${Server.getSelected().port};dbname=${Database.getSelected().name};user=${Server.getSelected().user};password=${Server.getSelected().password}");

	$query = $pdo->prepare(\`${queryParams.query}\`);
	$query->execute([]);
	$results = $query->fetchAll();

?>`;
					this.editorOptions.language = "php";
					break;
			}
			this.isLoading = false;
		});
	}
}
