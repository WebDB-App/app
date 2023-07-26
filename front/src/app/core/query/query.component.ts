import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute } from "@angular/router";
import { DiffEditorModel } from "ngx-monaco-editor-v2";
import { MatTableDataSource } from "@angular/material/table";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { saveAs } from "file-saver-es";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { RequestService } from "../../../shared/request.service";
import { Relation } from "../../../classes/relation";
import { Configuration } from "../../../classes/configuration";
import { HistoryService, Query } from "../../../shared/history.service";
import { initBaseEditor } from "../../../shared/helper";

declare var monaco: any;

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

	configuration: Configuration = new Configuration();
	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
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

	query = '';
	query2 = '';
	diff = false;
	pageSize = 50;
	page = 0;
	querySize!: number;
	isLoading = false;
	displayedColumns?: string[];
	dataSource?: MatTableDataSource<any>;

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

	constructor(
		private request: RequestService,
		private dialog: MatDialog,
		private http: HttpClient,
		private history: HistoryService,
		private activatedRoute: ActivatedRoute,
	) {
	}

	@HostListener('keydown', ['$event'])
	async onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && ['Enter', 's'].indexOf(event.key) >= 0) {
			await this.runQuery();
			event.preventDefault();
		}
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.editorOptions.language = this.selectedServer?.driver.language.id!;

		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			this.selectedTable = Table.getSelected();
			this.relations = Table.getRelations();
			this.loadPreBuild("select");
		});

		this.activatedRoute?.paramMap.subscribe(async (paramMap) => {
			if (paramMap.get('code')) {
				this.query = paramMap.get('code')!;
			}
		});
	}

	async initEditor(editor: any, index: number) {
		initBaseEditor(editor);
		this.editors[index] = editor;
		await this.selectedServer?.driver.loadExtraLib(this.http);
	}

	async runQuery() {
		if (this.diff) {
			await this._runCompare();
		} else {
			await this._runSingle();
		}
		setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
	}

	async _runSingle() {
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

	async _runCompare() {
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

	protected readonly Math = Math;
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
