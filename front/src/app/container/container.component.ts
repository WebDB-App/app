import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import packageJson from '../../../package.json';
import { MatDrawer } from "@angular/material/sidenav";
import { DrawerService } from "../../shared/drawer.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { SubscriptionDialog } from "./subscription/subscription-dialog.component";
import { ConfigDialog } from "./config/config-dialog.component";
import { ServerService } from "../../shared/server.service";
import { Server } from "../../classes/server";
import { Database } from "../../classes/database";
import { environment } from "../../environments/environment";
import { RequestService } from "../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";

class Panel {
	link!: string
	icon!: string
}

@Component({
	selector: 'app-container',
	templateUrl: './container.component.html',
	styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements AfterViewInit {

	@ViewChild("drawer") drawer!: MatDrawer;

	env = environment;
	packageJson = packageJson
	isLoading = true;
	servers!: Server[];
	server!: Server;
	database!: Database;

	panels: Panel[] = [
		{link: "relations", icon: "join"},
		{link: "load", icon: "exit_to_app"},
		{link: "dump", icon: "ios_share"},
		{link: "diagram", icon: "polyline"},
		{link: "code", icon: "code"},
		{link: "assistant", icon: "support_agent"},
		{link: "advanced", icon: "settings"},
	];

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private drawerService: DrawerService,
		private activatedRoute: ActivatedRoute,
		private _snackBar: MatSnackBar,
		private serverService: ServerService,
		private request: RequestService,
		public router: Router,
		public dialog: MatDialog
	) {
		for (const icon of ['gitlab', 'twitter', 'docker', 'webdb', 'chatgpt']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}

		this.serverService.scanServer.subscribe((servers => {
			this.servers = servers;
		}));

		if (router.url === '/') {
			this.syncParams();
			return;
		}

		this.serverService.scan().then(() => {
			this.syncParams();
		});
	}

	syncParams() {
		this.activatedRoute.paramMap.subscribe(async paramMap => {
			const serverName = paramMap.get('server');
			const dbName = paramMap.get('db');

			if (!serverName || !dbName) {
				return;
			}

			const server = this.servers.find(srv => srv.name === serverName);
			const database = server?.dbs.find(db => db.name === dbName);

			if (!server || !database) {
				this._snackBar.open(`Can't connect to ${serverName}/${dbName}, please check server availability`, undefined, {panelClass: 'snack-error'});
				return;
			}

			this.server = server;
			this.database = database;
			Server.setSelected(server);
			Database.setSelected(database);
			this.isLoading = false;
		});
	}

	ngAfterViewInit(): void {
		this.drawerService.setDrawer(this.drawer);
	}

	showSubscription() {
		const dialogRef = this.dialog.open(SubscriptionDialog);

		dialogRef.afterClosed().subscribe(async () => {
			this.isLoading = true;
			await this.serverService.scan();
			setTimeout(() => {
				this.isLoading = false
			});
		});
	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	async reloadDbs() {
		this.isLoading = true;
		await this.request.reloadDbs();
		this.isLoading = false;
	}

	displayParams() {
		return JSON.stringify(this.server.params, null, 2);
	}
}
