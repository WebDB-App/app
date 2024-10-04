import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom, Subscription } from "rxjs";
import { Server } from "../../classes/server";
import { LoadingStatus, RequestService } from "../../shared/request.service";
import * as drivers from '../../drivers/index';
import { DomSanitizer, Title } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { ProcessDialogComponent } from "../process/process-dialog.component";
import { StatsDialogComponent } from "../stats/stats-dialog.component";
import { validName } from "../../shared/helper";
import { Database } from "../../classes/database";
import { Router } from "@angular/router";
import { VariableDialogComponent } from "../variable/variable-dialog.component";

enum ServerStatus {
	Connected = 'Connected',
	Discovered = 'Discovered',
	Problem = 'Problem'
}

@Component({
	selector: 'app-connection',
	templateUrl: './connection.component.html',
	styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit, OnDestroy {

	servers: Server[] = [];
	showPassword = false;
	loading: LoadingStatus = LoadingStatus.LOADING;
	sub!: Subscription;
	newServer = new Server();
	editServer?: Server;
	selectedIndex = 0;
	defaultPass = "";
	defaultUser = "";
	isComponentDestroyed = false;
	demo = window.location.hostname === "demo.webdb.app";

	protected readonly Status = ServerStatus;
	protected readonly Object = Object;
	protected readonly environment = environment;
	protected readonly LoadingStatus = LoadingStatus;

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private request: RequestService,
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private titleService: Title,
		private router: Router,
		private dialog: MatDialog) {

		if (this.demo) {
			this.defaultUser = "root";
			this.defaultPass = "pass#();";

			if (!localStorage.getItem("firstVisit")) {
				localStorage.setItem("firstVisit", "true");
				this.dialog.open(FirstVisitDialog);
			}
		}

		for (const driver of Object.keys(drivers)) {
			this.matIconRegistry.addSvgIcon(
				driver.toLowerCase(),
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/drivers/${driver.toLowerCase()}.svg`)
			);
		}

		this.sub = this.request.loadingServer.subscribe((progress) => {
			this.loading = progress;
		});
	}

	async ngOnInit(reload = false) {
		this.filterChanged('');
		Server.setSelected(undefined);
		this.titleService.setTitle("WebDB – Connections");
		this.loading = LoadingStatus.LOADING;
		let scans: Server[] = [];

		try {
			scans = (await firstValueFrom(this.http.get<Server[]>(environment.apiRootUrl + 'server/scan'))).map(scan => {
				scan.name = Server.setName(scan);
				scan.scanned = true
				return scan;
			});
		} catch (err) {
			this.loading = LoadingStatus.ERROR;
			return;
		}

		const locals = Server.getAll().map(local => {
			const scan = scans.find(sc => sc.name === local.name);
			if (scan) {
				local.scanned = scan.scanned;
			}
			return local;
		});

		const servers = await this.request.loadServers(await Promise.all(locals.map(server => this.request.initServer(server))), false);

		for (const scan of scans) {
			if (servers.findIndex(server => server.name === scan.name) < 0) {
				servers.push(await this.request.initServer(scan, false));
			}
		}

		this.servers = servers.sort((a, b) => {
			return Number(a.port) - Number(b.port)
		});

		if (!reload) {
			for (let i = 0; i < Object.values(ServerStatus).length; i++) {
				const found = this.getServerByStatus(Object.values(ServerStatus)[i]).length;

				if (found) {
					this.selectedIndex = i;
					break;
				}
			}
		}
	}

	ngOnDestroy(): void {
		this.isComponentDestroyed = true;
	}

	async postLogged(localServer: Server, remoteServer: Server) {
		Server.add(<Server>{...localServer, ...remoteServer});

		if (!this.isComponentDestroyed) {
			await this.ngOnInit();
		}
	}

	async guess(srv: Server, user: string, password: string) {
		const indexServer = this.servers.findIndex(server => server.name === srv.name);

		this.servers[indexServer].isLoading = true;
		const server = <Server>{...this.servers[indexServer], user, password};

		const guessed: any = await firstValueFrom(this.http.post(environment.apiRootUrl + 'server/guess', Server.getShallow(server)))
		if (guessed.error) {
			this.snackBar.open(guessed.error, "⨉", {panelClass: 'snack-error'})
		} else if (guessed.length) {
			this.snackBar.open("Credentials found: " + guessed.map((guess: Server) => `${guess.user} | ${guess.password}`).join(', '), "⨉", {duration: 3000})
			await this.postLogged(server, guessed[0]);
		} else {
			this.snackBar.open("Guess failed", "⨉", {duration: 3000});
		}

		this.servers[indexServer].isLoading = false;
	}

	async login(srv: Server, user: string, password: string) {
		const indexServer = this.servers.findIndex(server => server.name === srv.name);

		const server = <Server>{...this.servers[indexServer], user, password};
		const data = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));

		if (data.error) {
			this.snackBar.open(data.error, "⨉", {duration: 3000, panelClass: 'snack-error'});
			return;
		}
		await this.postLogged(server, data);
	}

	filterChanged(_value = '') {
		const value = _value.toLowerCase();

		for (const [indexServer, server] of this.servers.entries()) {
			let oneDisplayed = false
			this.servers[indexServer].hide = server.name.toLowerCase().indexOf(value) === -1;

			if (!server.dbs) {
				continue;
			}

			for (const [indexDatabase, database] of server.dbs.entries()) {
				this.servers[indexServer].dbs[indexDatabase].hide = database.name.toLowerCase().indexOf(value) === -1;
				if (this.servers[indexServer].dbs[indexDatabase].hide) {
					oneDisplayed = true;
				}
			}
			this.servers[indexServer].hide = this.servers[indexServer].hide && !oneDisplayed;
		}
	}

	addDatabase(server: Server) {
		const dialogRef = this.dialog.open(CreateDatabaseDialog, {
			data: server,
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result) {
				await this.ngOnInit();
			}
		});
	}

	processServer(server: Server) {
		this.dialog.open(ProcessDialogComponent, {
			hasBackdrop: false,
			id: 'process-' + server.name,
			data: server,
		});
	}

	statsServer(server: Server) {
		this.dialog.open(StatsDialogComponent, {
			hasBackdrop: false,
			id: 'stats-' + server.name,
			data: server,
		});
	}

	variableServer(server: Server) {
		this.dialog.open(VariableDialogComponent, {
			hasBackdrop: false,
			id: 'vars-' + server.name,
			data: JSON.parse(JSON.stringify(server)),
		});
	}

	getServerByStatus(status: string): Server[] {
		return this.servers.filter(server => {
			if (status === ServerStatus.Connected) {
				return server.connected;
			}
			if (status === ServerStatus.Discovered) {
				return !server.connected && server.scanned && !server.stored;
			}
			return !server.connected && (!server.scanned || server.stored);
		});
	}

	async finished(edition: boolean) {
		if (edition) {
			delete this.editServer;
		}
		await this.ngOnInit();
	}

	goTo(server: Server, database: Database) {
		this.router.navigateByUrl('/' + server.name + '/' + database.name);
	}
}

@Component({
	templateUrl: 'create-database-dialog.html',
})
export class CreateDatabaseDialog {

	isLoading = false;

	constructor(
		private dialogRef: MatDialogRef<CreateDatabaseDialog>,
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
	}

	async createDb(name: string) {
		this.isLoading = true;
		await this.request.post('database/create', {name}, undefined, undefined, this.server);
		this.dialogRef.close(name);
	}

	nameValid(value: string) {
		if (!value.match(validName)) {
			return false;
		}
		return !this.server.dbs.find(db => db.name === value);
	}
}


@Component({
	templateUrl: 'first-visit-dialog.html',
})
export class FirstVisitDialog {

	constructor() {
	}
}
