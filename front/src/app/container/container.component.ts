import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";
import { DrawerService } from "../../shared/drawer.service";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { environment } from "../../environments/environment";
import { LoadingStatus, RequestService } from "../../shared/request.service";
import { Subscription } from "rxjs";
import { Table } from "../../classes/table";

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
	loading = LoadingStatus.LOADING;
	selectedServer!: Server;
	selectedDatabase!: Database;
	panels: Panel[] = [
		{link: "history", icon: "schedule_send"},
		{link: "diagram", icon: "polyline"},
		{link: "relations", icon: "attach_file"},
		{link: "version", icon: "difference"},
		{link: "assistant", icon: "support_agent"},
		{link: "load", icon: "input"},
		{link: "dump", icon: "ios_share"},
		{link: "complex", icon: "device_hub"},
		{link: "advanced", icon: "database"},
	];

	protected readonly environment = environment;
	protected readonly LoadingStatus = LoadingStatus;

	constructor(
		public activatedRoute: ActivatedRoute,
		public request: RequestService,
		private drawerService: DrawerService
	) {
		this.sub = this.request.loadingServer.subscribe((progress) => {
			this.loading = progress;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	async ngOnInit() {
		this.loading = LoadingStatus.LOADING;

		const local = Server.getAll().find(local => local.name === this.activatedRoute.snapshot.paramMap.get('server'));
		let server;

		try {
			server = (await this.request.loadServers([await this.request.initServer(local!)], true))[0];
		} catch (e) {
			this.loading = LoadingStatus.ERROR;
			return;
		}

		const database = server?.dbs.find(db => db.name === this.activatedRoute.snapshot.paramMap.get('database'))!;

		if (!server || !database) {
			this.loading = LoadingStatus.ERROR;
			return;
		}

		Server.setSelected(server);
		Database.setSelected(database);
		Table.setSelected(<Table><unknown>undefined);
		this.selectedServer = server;
		this.selectedDatabase = database;
	}

	ngAfterViewInit(): void {
		this.drawerService.setDrawer(this.drawer);
	}
}



