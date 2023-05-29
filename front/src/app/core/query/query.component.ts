import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Server } from "../../../classes/server";
import { Table } from "../../../classes/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Database } from "../../../classes/database";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../shared/request.service";
import { HistoryService, Query } from "../../../shared/history.service";

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	obs!: Subscription;

	loading = true;
	replayQuery: string = "";
	queryHistory!: MatTableDataSource<Query>;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private _snackBar: MatSnackBar,
		private request: RequestService,
		private route: ActivatedRoute,
		private history: HistoryService
	) {
	}

	ngOnInit() {
		this.obs = combineLatest([this.route.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.loading = true;

			setTimeout(() => {
				this.selectedServer = Server.getSelected();
				this.selectedDatabase = Database.getSelected();
				this.selectedTable = Table.getSelected();

				this.queryHistory = new MatTableDataSource(this.history.getLocal());
				this.loading = false;
			})
		});
	}

	ngOnDestroy(): void {
		this.obs.unsubscribe();
	}

	addHistory(event: { query: string, nbResult: number }) {
		if (this.queryHistory.data[0]?.query === event.query) {
			return;
		}

		this.queryHistory.data = [event].concat(this.queryHistory.data);
		this.history.saveLocal(this.queryHistory.data);
	}

	changeStar(query: Query) {
		query.star = !query.star;
		this.history.saveLocal(this.queryHistory.data);
	}

	filterHistory(event: KeyboardEvent) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.queryHistory.filter = filterValue.trim().toLowerCase();
	}

	replay(query: string, scrollAnchor: HTMLElement) {
		this.replayQuery = query;
		setTimeout(() => {
			scrollAnchor.scrollIntoView({behavior: 'smooth'})
		}, 300);
	}

	highlight(query: string) {
		return this.selectedServer?.driver?.highlight(query);
	}
}
