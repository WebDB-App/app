import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as drivers from "../../../drivers";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Server, SSH } from "../../../classes/server";
import { environment } from "../../../environments/environment";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss']
})
export class EditConnectionComponent implements OnChanges {

	@Input() server!: Server;
	@Output() edited = new EventEmitter<void>();

	newConnection = false;
	connectionStatus : 'notConnected' | 'loading' | 'connected' = "notConnected";
	sshStatus: 'notConnected' | 'loading' | 'connected' = "notConnected";
	showPassword = false;
	driverNames = Object.keys(drivers);
	editorOptions = {
		language: 'json'
	};
	params = "{}";

	constructor(
		public snackBar: MatSnackBar,
		private http: HttpClient,
	) {	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['server']) {
			this.server.ssh = this.server.ssh || new SSH();
			if (!this.server.wrapper) {
				this.newConnection = true;
			}
			this.params = JSON.stringify(this.server.params, null, "\t");
		}
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
		this.connectionStatus = 'loading';
		this.saveParams();
		const data = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(this.server)));

		if (data.error) {
			this.connectionStatus = 'notConnected';
			this.snackBar.open(data.error, "╳", {duration: 3000});
			return;
		}
		this.snackBar.open("Connection Valid", "╳", {duration: 3000});
		this.connectionStatus = 'connected';
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
		this.edited.emit();
	}

	saveConnection() {
		this.saveParams();
		Server.remove(this.server.name);
		this.edited.emit();
	}
}
