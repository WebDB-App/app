import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { ConfigDialog } from "./config/config-dialog.component";
import { isSQL } from "../../shared/helper";
import { firstValueFrom } from "rxjs";

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

	@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

	str: any = "";
	strFiltered: any = "";
	filter = "";
	interval?: NodeJS.Timer;
	file: 'out.log' | 'err.log' = "out.log";

	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer,
	) {
	}

	async ngOnInit() {
		await this.load();
		this.scrollToBottom();
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

	scrollToBottom() {
		setTimeout(() => {
			if (!this.scrollContainer) {
				return;
			}
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
		}, 10);
	}

	async load() {
		const convert = new Convert({colors: {4: '#2196f3'}});

		const txt = await firstValueFrom(this.http.get(`${environment.rootUrl}logs/${this.file}`, {responseType: 'text'}));
		this.str = convert.toHtml(txt);
		this.filterChanged();
	};

	filterChanged() {
		let str = this.str.split('\n').slice(-1000);
		str = this.filter ? str.filter((s: string) => s.indexOf(this.filter) >= 0) : str;

		this.strFiltered = <string>this.sanitizer.bypassSecurityTrustHtml(str.join('\n'));
	}
}
