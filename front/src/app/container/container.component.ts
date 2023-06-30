import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
export class ContainerComponent implements OnInit, AfterViewInit {

	@ViewChild("drawer") drawer!: MatDrawer;

	env = environment;
	packageJson = packageJson
	isLoading = true;
	selectedServer!: Server;
	selectedDatabase!: Database;

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
	}

	async ngOnInit() {
		const serverName = this.activatedRoute.snapshot.paramMap.get('server');
		const databaseName = this.activatedRoute.snapshot.paramMap.get('db');

		if (!serverName || !databaseName) {
			this.isLoading = false;
			return;
		}

		const local = Server.getAll().find(local => local.name === serverName);
		const server = await this.request.connectServer(local!);
		const database = server?.dbs.find(db => db.name === databaseName);

		if (!server || !database) {
			this._snackBar.open(`Can't connect to ${serverName}/${databaseName}, please check server availability`, "╳", {panelClass: 'snack-error'});
			return;
		}

		this.changeDatabase(server, database);
	}

	ngAfterViewInit(): void {
		this.drawerService.setDrawer(this.drawer);
	}

	showSubscription() {
		const dialogRef = this.dialog.open(SubscriptionDialog);

		dialogRef.afterClosed().subscribe(async () => {
			await this.reloadServer();
		});
	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	async reloadServer() {
		this.isLoading = true;
		await this.request.reloadServer();
		this.isLoading = false;
	}

	showConnection() {
		this.dialog.open(ConnectionInfoDialog, {
			data: this.selectedServer
		});
	}

	changeDatabase(server: Server, database: Database) {
		Server.setSelected(server);
		Database.setSelected(database);
		this.selectedServer = server;
		this.selectedDatabase = database;

		this.isLoading = false;
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
		this.str = JSON.stringify(Server.getShallow(server), null, 4)
	}
}



