import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Server } from "../../classes/server";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { ConfigDialog } from "./config/config-dialog.component";
import packageJson from '../../../package.json';
import { isSQL } from "../../shared/helper";

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
	) { }

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showLogs(file: string) {
		this.dialog.open(LogsDialog, {
			data: file,
			id: file,
			hasBackdrop: false
		});
	}

	protected readonly isSQL = isSQL;
}

@Component({
	templateUrl: 'logs-dialog.html',
})
export class LogsDialog implements OnDestroy {
	str: any = "";
	strFiltered: any = "";
	filter = "";
	interval?: NodeJS.Timer;
	isLoading = false;

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
		this.isLoading = true;

		this.http.get(`${environment.rootUrl}logs/${this.file}`, {responseType: 'text'}).subscribe(txt => {
			if (txt.length > 500_000 && this.interval) {
				this.toggleAutoRefresh();
			}console.log(txt.length);

			this.str = convert.toHtml(txt);
			this.filterChanged();
			this.isLoading = false;
		});
	};

	filterChanged() {
		let str = this.str.split('\n').reverse();
		str = this.filter ? str.filter((s: string) => s.indexOf(this.filter) >= 0) : str;

		this.strFiltered = <string>this.sanitizer.bypassSecurityTrustHtml(str.join('\n'));
	}
}
