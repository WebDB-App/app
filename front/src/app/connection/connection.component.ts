import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Server, SSH } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import * as drivers from '../../classes/drivers';
import { DomSanitizer, Title } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import helper from "../../shared/common-helper.mjs";

@Component({
	selector: 'app-connection',
	templateUrl: './connection.component.html',
	styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

	servers: Server[] = [];
	showPassword = false;
	loading = 0;
	driverNames = Object.keys(drivers);
	sub!: Subscription;

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private router: Router,
		private request: RequestService,
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private titleService: Title,
		private dialog: MatDialog) {

		for (const driver of this.driverNames) {
			this.matIconRegistry.addSvgIcon(
				driver.toLowerCase(),
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/drivers/${driver.toLowerCase()}.svg`)
			);
		}

		this.sub = this.request.loadingServer.subscribe((progress) => {
			this.loading = progress;
		});
	}

	async ngOnInit() {
		this.filterChanged('');
		Server.setSelected(undefined);
		this.titleService.setTitle("WebDB – App");
		this.loading = 0;
		let scans: Server[] = [];

		try {
			scans = (await firstValueFrom(this.http.get<Server[]>(environment.apiRootUrl + 'server/scan'))).map(scan => {
				scan.name = Server.setName(scan);
				scan.scanned = true
				return scan;
			});
		} catch (err) {
			this.loading = -1;
			return;
		}

		let servers = [];
		this.loading = 10;

		const locals = Server.getAll().map(local => {
			const scan = scans.find(sc => sc.name === local.name);
			if (scan) {
				local.scanned = scan.scanned;
			}
			return local;
		});
		for (const scan of scans) {
			if (locals.findIndex(server => server.name === scan.name) < 0) {
				locals.push(scan);
			}
		}

		servers = await this.request.connectServers(locals, false);
		this.servers = servers.sort((a, b) => {
			return Number(b.connected) - Number(a.connected)
		});
	}

	async postLogged(localServer: Server, remoteServer: Server) {
		Server.add(<Server>{...localServer, ...remoteServer});
		await this.ngOnInit();
	}

	async guess(srv: Server, user: string, password: string) {
		const indexServer = this.servers.findIndex(server => server.name === srv.name);

		this.servers[indexServer].isLoading = true;
		const server = <Server>{...this.servers[indexServer], user, password};

		const guessed = await firstValueFrom(this.http.post<Server[]>(environment.apiRootUrl + 'server/guess', Server.getShallow(server)))

		if (guessed.length) {
			this.snackBar.open("Combination found : " + guessed.map(guess => `${guess.user} | ${guess.password}`).join(', '), "╳", {duration: 3000})
			await this.postLogged(server, guessed[0]);
		} else {
			this.snackBar.open("Guess Failed", "╳", {duration: 3000})
		}
		this.servers[indexServer].isLoading = false;
	}

	async login(srv: Server, user: string, password: string) {
		const indexServer = this.servers.findIndex(server => server.name === srv.name);

		const server = <Server>{...this.servers[indexServer], user, password};
		const data = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));

		if (data.error) {
			this.snackBar.open(data.error, "╳", {duration: 3000});
			return;
		}
		await this.postLogged(server, data);
	}

	filterChanged(_value = '') {
		const value = _value.toLowerCase();

		for (const [indexServer, server] of this.servers.entries()) {
			const nbDb = 0;
			let oneDisplayed = false

			this.servers[indexServer].hide = server.name.toLowerCase().indexOf(value) === -1;

			if (!server.dbs) {
				continue;
			}

			for (const [indexDatabase, database] of server.dbs.entries()) {

				this.servers[indexServer].dbs[indexDatabase].hide = database.name.toLowerCase().indexOf(value) === -1;
				if (this.servers[indexServer].dbs[indexDatabase].hide) {
					oneDisplayed = true
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

	editConnection(server: Server) {
		const dialogRef = this.dialog.open(AddConnectionDialog, {
			data: server,
		});

		dialogRef.afterClosed().subscribe(async (result: Server) => {
			if (result) {
				this.snackBar.open(result.name + " Saved", "╳", {duration: 3000});
			}
			await this.ngOnInit();
		});
	}

	addServer() {
		const dialogRef = this.dialog.open(AddConnectionDialog, {
			data: new Server(),
			disableClose: true
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result) {
				this.snackBar.open(result.name + " Added", "╳", {duration: 3000});
				await this.ngOnInit();
			}
		});
	}

	getDetails(server: Server) {
		if (server.connected) {
			return {icon: 'signal_wifi_4_bar', txt: 'Connected'};
		}
		if (server.scanned) {
			if (server.stored) {
				return {icon: 'signal_wifi_bad', txt: 'Bad credentials'};
			}
			return {icon: 'network_wifi', txt: 'Discovered'};
		}
		return {icon: 'signal_wifi_off', txt: 'Unreachable'};
	}

	getServerByDriver(driver: string): Server[] {
		return this.servers.filter(server => server.wrapper === driver);
	}

	protected readonly environment = environment;
}

@Component({
	templateUrl: 'add-connection-dialog.html',
})
export class AddConnectionDialog {

	pubRsa!: string;
	newConnection = false;
	connected = false;
	sshStatus: 'notConnected' | 'loading' | 'connected' = "notConnected";
	showPassword = false;
	showPasswordSSH = false;
	driverNames = Object.keys(drivers);
	editorOptions = {
		language: 'json'
	};
	params = "{}";

	constructor(
		public snackBar: MatSnackBar,
		private http: HttpClient,
		private dialogRef: MatDialogRef<AddConnectionDialog>,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
		this.http.get(environment.rootUrl + 'id_rsa.pub', {responseType: 'text'}).subscribe((res) => {
			this.pubRsa = res;
		});

		this.server.ssh = this.server.ssh || new SSH();
		if (!this.server.wrapper) {
			this.newConnection = true;
		}
		this.params = JSON.stringify(this.server.params, null, "\t");
	}

	changeWrapper(wrapper: string) {
		//@ts-ignore
		this.server.driver = new drivers[wrapper];
		this.server.wrapper = wrapper;
		this.server.params = this.server.driver.connection.defaultParams;
		this.params = JSON.stringify(this.server.params, null, "\t");
	}

	saveParams() {
		this.server.params = JSON.parse(this.params);
	}

	useDefault() {
		this.params = JSON.stringify(this.server.driver.connection.defaultParams, null, "\t");
	}

	async testServer() {
		this.connected = false;
		this.saveParams();
		const data = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(this.server)));

		if (data.error) {
			this.snackBar.open(data.error, "╳", {duration: 3000});
			return;
		}
		this.snackBar.open("Connection Valid", "╳", {duration: 3000});
		this.connected = true;
	}

	async testSSH() {
		this.sshStatus = 'loading';
		this.saveParams();
		const data = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'tunnel/test', Server.getShallow(this.server)));

		if (data.error) {
			this.sshStatus = 'notConnected';
			this.snackBar.open(data.error, "╳", {panelClass: 'snack-error'});
			return;
		}
		this.snackBar.open("SSH Connection Valid", "╳", {duration: 3000});
		this.sshStatus = 'connected';
	}

	forget() {
		Server.remove(this.server!.name);
		this.snackBar.open(this.server!.name + " Forgot", "╳", {duration: 3000});
		this.dialogRef.close(false);
	}

	saveConnection() {
		this.saveParams();
		Server.remove(this.server.name);
		this.dialogRef.close(Server.add(this.server));
	}
}

@Component({
	templateUrl: 'create-database-dialog.html',
})
export class CreateDatabaseDialog {

	constructor(
		private dialogRef: MatDialogRef<CreateDatabaseDialog>,
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
	}

	async createDb(name: string) {
		await this.request.post('database/create', {name}, undefined, undefined, this.server);
		this.dialogRef.close(name);
	}

	nameValid(value: string) {
		if (!value.match(helper.validName)) {
			return false;
		}
		return !this.server.dbs.find(db => db.name === value);
	}
}
