import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Type } from "../../../classes/types";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'app-types',
	templateUrl: './types.component.html',
	styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTypes?: Type[];

	editorOptions = {
		language: 'json'
	};

	constructor(
		private request: RequestService,
		private snackBar: MatSnackBar) {
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		await this.refreshData(true);
	}

	async refreshData(pageLoad = false) {
		if (!pageLoad) {
			await this.request.reloadServer();
		}

		this.selectedTypes = this.selectedServer?.types.filter(type => type.database === this.selectedDatabase?.name);
	}

	async delete(type: Type) {
		await this.request.post('type/drop', {type});
		this.snackBar.open(`Dropped ${type.name}`, "╳", {duration: 3000});
		await this.refreshData();
	}

	addType() {
		/*
		const relation = <Relation>{
			name: "fk_" + sourceTable.name + '_' + sourceColumn,
			database: this.selectedDatabase!.name,
			table_source: sourceTable.name,
			table_dest: destTable.name,
			column_source: sourceColumn,
			column_dest: destColumn,
			update_rule,
			delete_rule
		};

		await this.request.post('type/add', {relation});

		this.snackBar.open(`Added Relation ${relation.name}`, "╳", {duration: 3000});
		await this.refreshData();
		 */
	}
}
