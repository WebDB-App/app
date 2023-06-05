import {
	Component,
	EventEmitter,
	HostListener,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
	ViewChildren
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Table } from "../../classes/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Database } from "../../classes/database";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { RequestService } from "../request.service";
import { Relation } from "../../classes/relation";
import FileSaver from "file-saver";
import { DiffEditorModel, EditorComponent } from "ngx-monaco-editor-v2";
import { Server } from "../../classes/server";
import { Configuration } from "../../classes/configuration";

declare var monaco: any;

@Component({
	selector: 'app-code',
	templateUrl: './code.component.html',
	styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit, OnChanges, OnDestroy {

	@Output() addHistory = new EventEmitter();

	@Input() query = '';
	@Input() selectedTable?: Table;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChildren('editor') editors!: EditorComponent[];

	configuration: Configuration = new Configuration();

	selectedServer?: Server;
	selectedDatabase?: Database;
	relations?: Relation[];

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

	autoUp: boolean | NodeJS.Timer = false;
	diff = false;
	query2 = '';
	pageSize = 100
	isLoading = false;
	ping?: number;
	displayedColumns?: string[];
	dataSource?: MatTableDataSource<any>

	constructor(
		private _snackBar: MatSnackBar,
		private request: RequestService,
		private dialog: MatDialog
	) {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.editorOptions.language = this.selectedServer?.driver?.language!;
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
		if ((event.metaKey || event.ctrlKey) && ['l'].indexOf(event.key) >= 0) {
			await this.setQuery();
			event.preventDefault();
		}
	}

	ngOnInit() {
		if (this.selectedTable) {
			this.prebuild("select");
			this.relations = Table.getRelations();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedTable']) {
			delete this.dataSource
			delete this.displayedColumns;

			this.ngOnInit();
		}
	}

	ngOnDestroy(): void {
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		}
	}

	initEditor(editor: any) {
		editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Space,
			() => {
				editor.trigger('', 'editor.action.triggerSuggest', '');
			},
			'editorTextFocus && !editorHasSelection && ' +
			'!editorHasMultipleSelections && !editorTabMovesFocus && ' +
			'!hasQuickSuggest');
	}

	async runQuery() {
		this.isLoading = true;
		const start = Date.now();

		try {
			let result = await this.request.post('database/query', {query: this.query});
			this.ping = Date.now() - start;

			const nbResult = result.length;
			if (nbResult === 0) {
				result.push({" ": "No Data"});
			} else if (this.selectedTable) {
				this.addHistory.emit({query: this.query, nbResult});
			}

			if (!Array.isArray(result)) {
				result = [result];
			}

			this.displayedColumns = Object.keys(result[0]);
			this.dataSource = new MatTableDataSource<any>(result);

			setTimeout(() => this.dataSource!.paginator = this.paginator)
		} catch (err: unknown) {
			this.dataSource = new MatTableDataSource();
		} finally {
			this.isLoading = false;
		}
	}

	isNested(obj: any) {
		const type = typeof obj;
		return Array.isArray(obj) || (type === 'object' && obj !== null);
	}

	async compareQuery() {
		const run = async (query: string) => {
			const data = await this.request.post('database/query', {query}, undefined, undefined, undefined, undefined, false)
			if (data.length) {
				this.addHistory.emit({query, nbResult: data.length});
			}

			return JSON.stringify(data, null, "\t");
		}

		this.isLoading = true;
		await Promise.all([
			this.originalResult.code = await run(this.query),
			this.modifiedResult.code = await run(this.query2)
		]);
		this.isLoading = false;
	}

	setQuery(query: string = this.query) {
		this.query = this.selectedServer?.driver?.format(query)!;

		if (this.query2) {
			this.query2 = this.selectedServer?.driver?.format(this.query2)!;
		}
	}

	prebuild(value: string) {
		const cols = this.selectedTable!.columns?.map(column => `${column.name}`);

		switch (value) {
			case "delete":
				this.setQuery(`DELETE
							   FROM ${this.selectedTable?.name}
							   WHERE 1 = 0`);
				break;
			case "insert":
				this.setQuery(`INSERT INTO ${this.selectedTable?.name} (${cols!.join(', ')})
							   VALUES (${cols!.map(col => '""')})`);
				break;
			case "update":
				this.setQuery(`UPDATE ${this.selectedTable?.name}
							   SET ${cols!.map(col => `${col} = ""`)}
							   WHERE 1 = 0`);
				break;
			case "select":
				this.setQuery(`SELECT ${cols!.join(', ')}
							   FROM ${this.selectedTable?.name}
							   WHERE 1 = 1 LIMIT ${(this.pageSize)}`);
				break;
			case "select_join":
				const joins: string[] = [];
				const columns = cols.map(col => `${this.selectedTable!.name}.${col}`).join(', ');
				for (const relation of this.relations!) {
					joins.push(`INNER JOIN ${relation.table_dest} ON ${relation.table_dest}.${relation.column_dest} = ${relation.table_source}.${relation.column_source}`)
				}

				this.setQuery(`SELECT ${columns}
							   FROM ${this.selectedTable?.name} ${joins.join("\n")}
							   GROUP BY (${columns})
							   HAVING 1 = 1 LIMIT ${(this.pageSize)}`);
				break;
		}
	}

	exportQuery(language: string) {
		this.dialog.open(ExportQueryDialog, {data: {language, query: this.query}});
	}

	exportResult(type: string) {
		this.dialog.open(ExportResultDialog, {data: {type, result: this.dataSource!.data}});
	}

	toggleDiff() {
		this.diff = !this.diff;
		this.query2 = this.query;
	}

	setAutoUp() {
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		} else {
			this.autoUp = setInterval(async () => {
				if (this.diff) {
					await this.compareQuery();
				} else {
					await this.runQuery();
				}

			}, this.configuration.getByName('reloadData')?.value * 1000);
		}
	}
}

@Component({
	templateUrl: 'export-result-dialog.html',
})
export class ExportResultDialog {

	str!: string;
	editorOptions = {
		readOnly: true,
		language: ''
	};

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { result: any[], type: string },
	) {
		switch (data.type) {
			case "csv":
				this.str = Object.keys(data.result[0]).join(',') + '\n';
				this.editorOptions.language = 'csv';
				for (let res of data.result) {
					this.str += Object.values(res).join(',') + '\n';
				}
				break;
			case "json":
				this.str = JSON.stringify(data.result, null, "\t");
				this.editorOptions.language = 'json';
				break;
		}
	}

	download() {
		const blob = new Blob([this.str], {type: "text/plain;charset=utf-8"});
		FileSaver.saveAs(blob, Table.getSelected().name + '.' + this.data.type);
	}
}

@Component({
	templateUrl: 'export-query-dialog.html',
})
export class ExportQueryDialog {

	str!: string;
	editorOptions = {
		language: ""
	};

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { query: string, language: string },
	) {
		const queryParams = Server.getSelected().driver.extractConditionParams(data.query);

		switch (data.language) {
			case "JDBC":
				this.str = `//with JDBC lib

import java.sql.*;

class MysqlCon {
	public static void main(String args[]){
	try {
		Class.forName("com.mysql.Server.getSelected().wrapper.toLowerCase().Driver");
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
			case "node":
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
	}
}
