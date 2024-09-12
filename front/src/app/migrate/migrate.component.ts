import { Component, Inject, OnInit } from '@angular/core';
import { LoadingStatus, RequestService } from "../../shared/request.service";
import { DiffEditorModel } from "ngx-monaco-editor-v2";
import { Server } from "../../classes/server";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Database } from "../../classes/database";
import { Table } from "../../classes/table";
import { Column } from "../../classes/column";
import { initBaseEditor } from "../../shared/helper";
import { HttpClient } from "@angular/common/http";
import { Variable } from "../../classes/variable";

class Side {
	server?: Server;
	database?: Database;
	table?: Table;
	query?: string;
	querySize?: number;
	columnsToHide?: Column[];
	diff: DiffEditorModel = {
		code: '',
		language: 'json'
	};
}

@Component({
	selector: 'app-migrate',
	templateUrl: './migrate.component.html',
	styleUrls: ['./migrate.component.scss']
})
export class MigrateComponent implements OnInit {

	page = 0;
	pageSize = 200;
	isComparing = false;
	sub!: Subscription;
	servers: Server[] = [];
	left = new Side();
	right = new Side();
	loading: LoadingStatus = LoadingStatus.LOADING;
	type: 'structure' | 'relation' | 'indexes' | 'complex' | 'data' | 'variable' = "structure";
	editorOptions = {
		readOnly: true,
		language: ''
	};

	protected readonly Math = Math;
	protected readonly LoadingStatus = LoadingStatus;
	protected readonly Object = Object;

	constructor(
		private request: RequestService,
		private titleService: Title,
		private dialog: MatDialog
	) {
		this.sub = this.request.loadingServer.subscribe((progress) => {
			this.loading = progress;
		});
	}

	async ngOnInit() {
		Server.setSelected(undefined);
		this.titleService.setTitle("WebDB – Migration");
		this.loading = LoadingStatus.LOADING;

		const servers = await Promise.all(Server.getAll().map(server => this.request.initServer(server)));
		this.servers = await this.request.loadServers(servers.filter(server => server.connected), true);
	}

	filterByDb(datas: any[], database: string) {
		return datas.filter(data => data.database === database || data.database === (database + " | public"));
	}

	async refreshSide(side: Side) {
		if (!side.server) {
			return;
		}
		if (this.type !== 'variable' && !side.database) {
			return;
		}

		this.isComparing = true;
		if (this.type === 'structure') {
			side.diff.code = JSON.stringify(side.database, null, "\t");
		} else if (this.type === 'relation') {
			side.diff.code = JSON.stringify(this.filterByDb(side.server.relations, side.database!.name), null, "\t");
		} else if (this.type === 'indexes') {
			side.diff.code = JSON.stringify(this.filterByDb(side.server.indexes, side.database!.name), null, "\t");
		} else if (this.type === 'complex') {
			side.diff.code = JSON.stringify(this.filterByDb(Object.values(side.server.complexes).flatMap(c => c), side.database!.name), null, "\t");
		} else if (this.type === 'data' && side.table) {
			if (!side.query) {
				side.query = side.server!.driver.basicFilter(side.table, [], 'AND');
			}
			const result = await this.request.post('query/run', {
				query: side.query,
				pageSize: this.pageSize,
				page: this.page
			}, side.table, side.database, side.server);

			for (const col of side.columnsToHide!) {
				for (const [index, row] of Object.entries(result)) {
					delete result[index][col.name];
				}
			}

			side.diff.code = JSON.stringify(result, null, "\t");
			side.diff.code = side.diff.code.replaceAll(",\n\t\t", ", ");
			side.diff.code = side.diff.code.replaceAll("{\n\t\t", "{ ");
			side.diff.code = side.diff.code.replaceAll("\n\t}", " }");

			side.querySize = await this.request.post('query/size', {query: side.query}, side.table, side.database, side.server);
			if (side.querySize === null) {
				side.querySize = Object.values(result).length;
			} else if (side.querySize! < 1 && Object.values(result).length) {
				side.querySize = 1;
			}
		} else if (this.type === 'variable') {
			const list = <Variable[]>(await this.request.post('variable/list', {}, undefined, undefined, side.server));
			side.diff.code = JSON.stringify(list, null, "\t");
		}

		setTimeout(() => this.isComparing = false, 1);
	}

	editQuery(side: Side) {
		const dialogRef = this.dialog.open(EditQueryDialog, {
			data: side,
		});
		dialogRef.afterClosed().subscribe(async result => {
			if (!result) {
				return;
			}
			side.query = result;
			this.refreshSide(side);
		});
	}
}


@Component({
	templateUrl: 'edit-query-dialog.html',
})
export class EditQueryDialog {

	str: string;
	editorOptions = {
		language: ''
	};

	constructor(
		private http: HttpClient,
		private dialogRef: MatDialogRef<EditQueryDialog>,
		@Inject(MAT_DIALOG_DATA) public side: Side
	) {
		Server.setSelected(side.server);
		Table.setSelected(side.table!);
		Database.setSelected(side.database!);
		this.str = side.query!;
		this.editorOptions.language = side.server!.driver.language.id;
	}

	async create() {
		this.dialogRef.close(true);
	}

	reset() {
		this.str = this.side.server!.driver.basicFilter(this.side.table!, [], 'AND');
		this.str = this.side.server!.driver.format(this.str);
	}

	save() {
		this.dialogRef.close(this.str);
	}

	async initEditor(editor: any) {
		initBaseEditor(editor);
		await this.side.server!.driver.loadExtraLib(this.http);
	}
}
