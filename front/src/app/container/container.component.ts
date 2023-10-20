import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";
import { DrawerService } from "../../shared/drawer.service";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { environment } from "../../environments/environment";
import { RequestService } from "../../shared/request.service";
import { Subscription } from "rxjs";
import { LogsDialog } from "../top-right/top-right.component";
import { MatDialog } from "@angular/material/dialog";

class Panel {
	link!: string
	icon!: string
}

@Component({
	selector: 'app-container',
	templateUrl: './container.component.html',
	styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild("drawer") drawer!: MatDrawer;
	sub!: Subscription;
	env = environment;
	loading = 0;
	selectedServer!: Server;
	selectedDatabase!: Database;
	panels: Panel[] = [
		{link: "relations", icon: "attach_file"},
		{link: "diagram", icon: "polyline"},
		{link: "history", icon: "schedule_send"},
		{link: "assistant", icon: "support_agent"},
		{link: "load", icon: "input"},
		{link: "dump", icon: "ios_share"},
		{link: "advanced", icon: "instant_mix"},
	];
	protected readonly environment = environment;

	constructor(
		public activatedRoute: ActivatedRoute,
		public request: RequestService,
		private drawerService: DrawerService,
		private dialog: MatDialog
	) {
		this.sub = this.request.loadingServer.subscribe((progress) => {
			this.loading = progress;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	async ngOnInit() {
		this.loading = 0;
		let server, database;
		const local = Server.getAll().find(local => local.name === this.activatedRoute.snapshot.paramMap.get('server'));

		try {
			server = (await this.request.connectServers([local!]))[0];
			database = server?.dbs.find(db => db.name === this.activatedRoute.snapshot.paramMap.get('database'))!;
		} catch (e) {
		}

		if (!server || !database) {
			this.loading = -1;
			return;
		}

		Server.setSelected(server);
		Database.setSelected(database);
		this.selectedServer = server;
		this.selectedDatabase = database;
	}

	ngAfterViewInit(): void {
		this.drawerService.setDrawer(this.drawer);
	}

	showError() {
		this.dialog.open(LogsDialog, {
			data: 'error.log',
			hasBackdrop: false
		});
	}
}



