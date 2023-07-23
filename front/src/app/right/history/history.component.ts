import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { HistoryService, Query } from "../../../shared/history.service";
import { Configuration } from "../../../classes/configuration";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DrawerService } from "../../../shared/drawer.service";

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

	configuration: Configuration = new Configuration();
	selectedServer!: Server;
	queryHistory: Query[] = [];
	filter = "";

	constructor(
		public history: HistoryService,
		public snackBar: MatSnackBar,
		private drawer: DrawerService
	) {
		this.drawer.drawer.openedChange.subscribe((state) => {
			this.queryHistory = this.history.getLocal();
		});
	}

	ngOnInit() {
		this.selectedServer = Server.getSelected();
	}

	changeStar(query: Query) {
		query.star = !query.star;
		this.history.saveLocal(this.queryHistory);
	}
}
