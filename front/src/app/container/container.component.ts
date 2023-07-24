import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import packageJson from '../../../package.json';
import { MatDrawer } from "@angular/material/sidenav";
import { DrawerService } from "../../shared/drawer.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { SubscriptionDialog } from "./subscription/subscription-dialog.component";
import { ConfigDialog } from "./config/config-dialog.component";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { environment } from "../../environments/environment";
import { RequestService } from "../../shared/request.service";
import { Subscription } from "rxjs";

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
	packageJson = packageJson
	loading = 0;
	selectedServer!: Server;
	selectedDatabase!: Database;
	panels: Panel[] = [
		{link: "relations", icon: "attach_file"},
		{link: "diagram", icon: "polyline"},
		{link: "history", icon: "history"},
		{link: "assistant", icon: "support_agent"},
		{link: "load", icon: "exit_to_app"},
		{link: "dump", icon: "ios_share"},
		{link: "advanced", icon: "settings"},
	];

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private drawerService: DrawerService,
		public request: RequestService,
		public activatedRoute: ActivatedRoute,
		public dialog: MatDialog
	) {
		for (const icon of ['gitlab', 'twitter', 'docker', 'webdb', 'chatgpt']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}

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

	showSubscription() {
		const dialogRef = this.dialog.open(SubscriptionDialog);

		dialogRef.afterClosed().subscribe(async () => {
			if (this.selectedServer) {
				await this.request.reloadServer();
			}
		});
	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showConnection() {
		this.dialog.open(ConnectionInfoDialog, {
			data: this.selectedServer
		});
	}
}

@Component({
	templateUrl: 'connection-dialog.html',
})
export class ConnectionInfoDialog {
	str = "";
	editorOptions = {
		language: 'json',
		readOnly: true
	};

	constructor(
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
		this.str = JSON.stringify(server, null, 4)
	}
}

