import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute, Router } from "@angular/router";
import { DiffEditorModel } from "ngx-monaco-editor-v2";
import { MatTableDataSource } from "@angular/material/table";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { RequestService } from "../../../shared/request.service";
import { Relation } from "../../../classes/relation";
import { Configuration } from "../../../classes/configuration";
import { HistoryService, Query } from "../../../shared/history.service";
import {
	addMonacoError,
	alterStructure,
	initBaseEditor,
	removeComment,
	validName
} from "../../../shared/helper";
import { ExportResultDialog } from "../../../shared/export-result-dialog/export-result-dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { saveAs } from "file-saver-es";

declare var monaco: any;

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit, OnDestroy {

	configuration: Configuration = new Configuration();
	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;

	autoUp: boolean | NodeJS.Timer = false;
	stringify = this.configuration.getByName('stringifyData')?.value;
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
	reloadDb = false
	diff = false;
	pageSize = 50;
	page = 0;
	querySize!: number;
	interval?: NodeJS.Timer;
	isLoading = false;
	displayedColumns?: string[];
	dataSource?: MatTableDataSource<any>;
	autoFormat = this.configuration.getByName('autoFormat')?.value;

	protected readonly Object = Object;
	protected readonly Math = Math;

	constructor(
		public request: RequestService,
		private dialog: MatDialog,
		private http: HttpClient,
		private history: HistoryService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
	) {
	}

	@HostListener('window:keydown', ['$event'])
	async onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && ['Enter'].indexOf(event.key) >= 0) {
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
			this.relations = Table.getRelations();
			this.querySize = -1;
			this.dataSource = new MatTableDataSource<any>();
			if (this.editors.length && monaco) {
				this.editors.map(editor => monaco.editor.setModelMarkers(editor.getModel(), "owner", []));
			}
			this.loadTemplate(Object.keys(this.selectedServer!.driver.queryTemplates)[0]);
		});

		this.activatedRoute?.paramMap.subscribe(async (paramMap) => {
			if (paramMap.get('code') && paramMap.get('code')?.trim()) {
				this.query = paramMap.get('code')!;
			}
		});

		this.interval = setInterval(() => {
			if (this.query.length < 5000) {
				this.router.navigate(['query', this.query], {relativeTo: this.activatedRoute.parent});
			}
			this.configuration.update('autoFormat', this.autoFormat);
		}, 1000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	identify(index: any, rom: any) {
		return JSON.stringify(rom);
	}

	async initEditor(editor: any, index: number) {
		initBaseEditor(editor);
		this.editors[index] = editor;
		if (index < 1) {
			await this.selectedServer?.driver.loadExtraLib(this.http);
		}
	}

	async runQuery() {
		this.isLoading = true;
		this.editors.map(editor => monaco.editor.setModelMarkers(editor.getModel(), "owner", []));

		try {
			if (this.autoFormat) {
				this.query = Server.getSelected().driver.format(this.query);
				this.query2 = Server.getSelected().driver.format(this.query2);
			}
			if (this.diff) {
				await this._runCompare();
			} else {
				await this._runSingle();
			}
		} catch (e) {
		} finally {
			this.isLoading = false;
		}
	}

	async _runSingle() {
		let result = [];
		monaco.editor.setModelMarkers(this.editors[0].getModel(), "owner", []);

		try {
			await Promise.all([
				result = await this.request.post('database/query', {
					query: this.query,
					pageSize: this.pageSize,
					page: this.page
				}),
				this.querySize = await this.request.post('database/querySize', {query: this.query})
			]);
		} catch (result: any) {
			addMonacoError(this.query, this.editors[0], result.error);
			this.dataSource = new MatTableDataSource();
			this.querySize = -1;
			return;
		}

		if (this.querySize === null) {
			this.querySize = Object.values(result).length;
		} else if (this.querySize < 1 && Object.values(result).length) {
			this.querySize = 1;
		}

		if ((this.page * this.pageSize) > this.querySize) {
			this.page = 0;
			await this._runSingle();
			return;
		}

		if (this.querySize === 0) {
			result.push({" ": "No Data"});
		} else {
			this.history.addLocal(new Query(this.query, this.querySize));
		}

		if (!Array.isArray(result)) {
			result = [result];
		}

		this.displayedColumns = [...new Set(result.flatMap(res => Object.keys(res)))];
		this.dataSource = new MatTableDataSource(result);
		this.reloadDb = alterStructure(this.query.toLowerCase());
	}

	async _runCompare() {
		this.querySize = -1;

		const run = async (query: string, editor: any) => {
			let data;
			try {
				data = await this.request.post('database/query', {
					query,
					pageSize: this.pageSize,
					page: this.page
				});
				this.history.addLocal(new Query(query, data.length));

				const size = await this.request.post('database/querySize', {query: this.query});
				if (this.querySize === null) {
					this.querySize = Object.values(data).length;
				} else if (this.querySize < 1 && Object.values(data).length) {
					this.querySize = 1;
				}

				this.querySize = Math.max(this.querySize, size);
			} catch (result: any) {
				addMonacoError(query, editor, result.error);
			}

			return JSON.stringify(data, null, "\t");
		}

		[this.originalResult.code, this.modifiedResult.code] = await Promise.all([run(this.query, this.editors[0]), run(this.query2, this.editors[1])]);
	}

	setAutoUp() {
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		} else {
			this.autoUp = setInterval(async () => {
				await this.runQuery();
			}, this.configuration.getByName('reloadData')?.value * 1000);
		}
	}

	loadTemplate(fct: string) {
		this.query = this.selectedServer!.driver.queryTemplates[fct](this.selectedTable!, this.relations!);
		if (this.autoFormat) {
			setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
		}
	}

	exportQuery() {
		this.dialog.open(ExportQueryDialog, {
			data: removeComment(this.query),
			id: this.selectedTable?.name,
			hasBackdrop: false
		});
	}

	async exportResult() {
		this.isLoading = true;
		const data = await this.request.post('database/query', {
			query: this.query,
			pageSize: this.querySize,
			page: 0
		});
		this.isLoading = false;
		if (data.length > 0) {
			this.dialog.open(ExportResultDialog, {
				data,
				hasBackdrop: false
			});
		}
	}

	addView() {
		this.dialog.open(CreateViewDialog, {
			hasBackdrop: false,
			data: this.selectedServer?.driver.extractForView(removeComment(this.query))
		});
	}

	isQuerySelect() {
		return this.selectedServer?.driver.extractForView(removeComment(this.query));
	}

	async inputChange(fileInputEvent: any) {
		if (!fileInputEvent.target.files) {
			return;
		}
		this.query = await fileInputEvent.target.files[0].text();
	}

	saveToDisk() {
		const ext = this.selectedServer?.driver.language.extension;
		saveAs(new File([this.query], this.selectedTable?.name + '.' + ext, {type: `text/${ext};charset=utf-8`}));
	}

	async editView() {
		const result = await this.request.post('view/getCode', {});

		this.query = result.code;
		if (this.autoFormat) {
			setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
		}
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

@Component({
	templateUrl: 'create-view-dialog.html',
})
export class CreateViewDialog {

	form!: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<CreateViewDialog>,
		private fb: FormBuilder,
		private request: RequestService,
		private router: Router,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public code: string
	) {
		this.form = this.fb.group({
			name: [null, [Validators.required, Validators.pattern(validName)]],
			code: [code]
		});
	}

	async create() {
		await this.request.post('view/create', this.form.value);
		await this.request.reloadServer();

		await this.router.navigate([
			Server.getSelected().name,
			Database.getSelected().name,
			this.form.get('name')?.value,
			'structure']);

		this.snackBar.open(`View ${this.form.get('name')?.value} created`, "⨉", {duration: 3000});
		this.dialogRef.close(true);
	}
}

