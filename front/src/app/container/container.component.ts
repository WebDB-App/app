import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { isSQL } from "../../shared/helper";
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
		{link: "load", icon: "exit_to_app"},
		{link: "dump", icon: "ios_share"},
		{link: "diagram", icon: "polyline"},
		{link: "code", icon: "code"},
		{link: "assistant", icon: "support_agent"},
		{link: "advanced", icon: "settings"},
	];
	protected readonly isSQL = isSQL;

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private drawerService: DrawerService,
		private snackBar: MatSnackBar,
		private request: RequestService,
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public dialog: MatDialog
	) {
		for (const icon of ['gitlab', 'twitter', 'docker', 'webdb', 'chatgpt']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}

		this.sub = this.request.loadingServer.subscribe(() => this.loading += 33);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	async ngOnInit() {
		const serverName = this.activatedRoute.snapshot.paramMap.get('server');
		const databaseName = this.activatedRoute.snapshot.paramMap.get('database');

		if (!serverName || !databaseName) {
			this.loading = 100;
			return;
		}

		let server, database;
		const local = Server.getAll().find(local => local.name === serverName);

		if (local) {
			server = await this.request.connectServer(local);
			database = server?.dbs.find(db => db.name === databaseName)!;
		}

		if (!server || !database) {
			this.loading = -1;
			return;
		}

		Server.setSelected(server);
		Database.setSelected(database);
		this.selectedServer = server;
		this.selectedDatabase = database;
		this.loading = 100;
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
		this.loading = 0;
		await this.request.reloadServer();
		this.loading = 100;
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

