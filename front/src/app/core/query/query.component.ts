import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute, Router } from "@angular/router";
import { DiffEditorModel } from "ngx-monaco-editor-v2";
import { MatTableDataSource } from "@angular/material/table";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { RequestService } from "../../../shared/request.service";
import { Relation } from "../../../classes/relation";
import { Configuration } from "../../../classes/configuration";
import { HistoryService, Query } from "../../../shared/history.service";
import { initBaseEditor } from "../../../shared/helper";
import { ExportResultDialog } from "../../../shared/export-result-dialog/export-result-dialog";

declare var monaco: any;

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

	protected readonly Math = Math;
	prebuilds!: string[];
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

	constructor(
		private request: RequestService,
		private dialog: MatDialog,
		private http: HttpClient,
		private history: HistoryService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
	) {
	}

	@HostListener('window:keydown', ['$event'])
	async onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && ['Enter', 's'].indexOf(event.key) >= 0) {
			await this.runQuery();
			event.preventDefault();
		}
		if (event.altKey && event.code === "Space") {
			this.editors[0].trigger('', 'editor.action.triggerSuggest', '');
			event.preventDefault();
		}
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.editorOptions.language = this.selectedServer?.driver.language.id!;

		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			this.selectedTable = Table.getSelected();
			this.prebuilds = this.selectedTable.view ? ['select', 'select_join'] : ['select', 'select_join', 'update', 'insert', 'delete'];
			this.relations = Table.getRelations();
			this.querySize = -1;
			this.dataSource = new MatTableDataSource<any>();
			this.loadPreBuild("select");
		});

		this.activatedRoute?.paramMap.subscribe(async (paramMap) => {
			if (paramMap.get('code') && paramMap.get('code')?.trim()) {
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
		this.isLoading = true;
		if (this.diff) {
			await this._runCompare();
		} else {
			await this._runSingle();
		}
		this.router.navigate([Server.getSelected().name, Database.getSelected().name, Table.getSelected().name, 'query', this.query]);
		this.isLoading = false;
		setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
	}

	async _runSingle() {
		let result = [];
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
		} else {
			if (this.querySize === 0) {
				result.push({" ": "No Data"});
			} else if (this.selectedTable) {
				this.history.addLocal(new Query(this.query, this.querySize));
			}
		}

		if (!Array.isArray(result)) {
			result = [result];
		}

		this.displayedColumns = [...new Set(result.flatMap(res => Object.keys(res)))];
		this.dataSource = new MatTableDataSource(result);
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

		[this.originalResult.code, this.modifiedResult.code] = await Promise.all([run(this.query), run(this.query2)]);
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
		this.dialog.open(ExportQueryDialog, {
			data: this.query,
			hasBackdrop: false
		});
	}

	async exportResult() {
		this.isLoading = true;
		const data = await this.request.post('database/query', {
			query: this.query,
			pageSize: this.querySize,
			page: 0
		}, undefined, undefined, undefined, undefined, false);
		this.isLoading = false;
		this.dialog.open(ExportResultDialog, {
			data,
			hasBackdrop: false
		});
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
