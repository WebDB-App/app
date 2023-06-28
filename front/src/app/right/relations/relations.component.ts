import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Relation } from "../../../classes/relation";
import { RequestService } from "../../../shared/request.service";
import { Table } from "../../../classes/table";

@Component({
	selector: 'app-relations',
	templateUrl: './relations.component.html',
	styleUrls: ['./relations.component.scss']
})
export class RelationsComponent implements OnInit {

	selectedServer?: Server;
	selectedDatabase?: Database;
	relations?: Relation[];

	constraints?: string[];
	actionColum = "##ACTION##";
	displayedColumns = ['name', 'table_source', 'column_source', 'table_dest', 'column_dest', 'update_rule', 'delete_rule', this.actionColum];
	dataSource!: MatTableDataSource<Relation>;

	constructor(private request: RequestService,
				private _snackBar: MatSnackBar) {
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		await this.refreshData(true);
	}

	async refreshData(pageLoad = false) {
		if (!pageLoad) {
			await this.request.reloadDbs();
		}

		this.constraints = this.selectedServer?.driver.constraints;
		this.relations = this.selectedServer?.relations.filter(relation => relation.database === this.selectedDatabase?.name);
		this.dataSource = new MatTableDataSource(this.relations);
	}

	tableComparison(t1: Table, t2?: Table): boolean {
		return t1.name === t2?.name;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	async delete(relation: Relation) {
		await this.request.post('relation/drop', {relation});

		this._snackBar.open(`Dropped ${relation.name}`, "╳", {duration: 3000});

		await this.refreshData();
	}

	async add(sourceTable: Table, sourceColumn: string, destTable: Table, destColumn: string, update_rule: string, delete_rule: string) {
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

		await this.request.post('relation/add', {relation});

		this._snackBar.open(`Added Relation ${relation.name}`, "╳", {duration: 3000});
		await this.refreshData();
	}
}
