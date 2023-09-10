import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { ConfigDialog } from "./config/config-dialog.component";
import { isSQL } from "../../shared/helper";

@Component({
	selector: 'app-top-right',
	templateUrl: './top-right.component.html',
	styleUrls: ['./top-right.component.scss']
})
export class TopRightComponent {

	constructor(
		private dialog: MatDialog,
	) { }

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showLogs() {
		this.dialog.open(LogsDialog, {
			id: "logs",
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
	file: 'out.log' | 'err.log' = "out.log";

	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer,
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
			}

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
