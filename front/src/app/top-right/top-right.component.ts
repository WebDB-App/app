import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Server } from "../../classes/server";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { SubscriptionDialog } from "./subscription/subscription-dialog.component";
import { ConfigDialog } from "./config/config-dialog.component";
import { RequestService } from "../../shared/request.service";
import packageJson from '../../../package.json';

@Component({
	selector: 'app-top-right',
	templateUrl: './top-right.component.html',
	styleUrls: ['./top-right.component.scss']
})
export class TopRightComponent {

	protected readonly Server = Server;
	protected readonly packageJson = packageJson;
	protected readonly environment = environment;

	constructor(
		private dialog: MatDialog,
		private request: RequestService
	) { }

	showSubscription() {
		const dialogRef = this.dialog.open(SubscriptionDialog);

		dialogRef.afterClosed().subscribe(async () => {
			if (Server.getSelected()) {
				await this.request.reloadServer();
			}
		});
	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showConnection() {
		this.dialog.open(ConnectionInfoDialog, {
			data: Server.getSelected(),
			hasBackdrop: false
		});
	}

	showLogs(file: string) {
		this.dialog.open(LogsDialog, {
			data: file,
			hasBackdrop: false
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
		const {driver, ...rest} = {...this.server};
		this.str = JSON.stringify(rest, null, 4);
	}
}

@Component({
	templateUrl: 'logs-dialog.html',
})
export class LogsDialog implements OnDestroy {
	str: any = "";
	strFiltered: any = "";
	filter = "";
	interval?: NodeJS.Timer;

	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer,
		@Inject(MAT_DIALOG_DATA) public file: 'out.log' | 'err.log',
	) {
		this.load();
		this.toggleAutoRefresh();
	}

	toggleAutoRefresh() {
		if (this.interval) {
			clearInterval(this.interval);
			delete this.interval;
			return;
		}

		this.interval = setInterval(() => {
			this.load();
		}, 2000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	load() {
		const convert = new Convert({colors: {4: '#2196f3'}});

		this.http.get(`${environment.rootUrl}logs/${this.file}`, {responseType: 'text'}).subscribe(txt => {
			this.str = convert.toHtml(txt);
			this.filterChanged();
		});
	};

	filterChanged() {
		let str = this.str.split('\n').reverse();
		str = this.filter ? str.filter((s: string) => s.indexOf(this.filter) >= 0) : str;

		this.strFiltered = <string>this.sanitizer.bypassSecurityTrustHtml(str.join('\n'));
	}
}
