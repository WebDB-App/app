import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { ConfigDialog } from "./config/config-dialog.component";
import { isSQL } from "../../shared/helper";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";

@Component({
	selector: 'app-top-right',
	templateUrl: './top-right.component.html',
	styleUrls: ['./top-right.component.scss']
})
export class TopRightComponent {

	@HostListener('window:beforeinstallprompt', ['$event'])
	onbeforeinstallprompt(e: any) {
		e.preventDefault();
		this.promptEvent = e;
	}

	public promptEvent: any;
	protected readonly isSQL = isSQL;

	constructor(
		private dialog: MatDialog,
		public router: Router
	) {	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showLogs() {
		this.dialog.open(LogsDialog, {
			id: "logs",
			hasBackdrop: false
		});
	}

	public installPWA() {
		this.promptEvent.prompt();
	}

	public shouldInstall(): boolean {
		return !this.isRunningStandalone() && this.promptEvent;
	}

	public isRunningStandalone(): boolean {
		return (window.matchMedia('(display-mode: standalone)').matches);
	}

	protected readonly environment = environment;
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
	file: 'finished.log' | 'error.log' = "finished.log";

	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer,
	) {
	}

	async ngOnInit() {
		await this.load();
		this.scrollToBottom();

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
		const str = await firstValueFrom(this.http.get(`${environment.rootUrl}logs/${this.file}`, {responseType: 'text'}));
		if (this.str.length === str.length) {
			return;
		}
		this.str = str;
		this.filterChanged();
	};

	filterChanged() {
		const convert = new Convert({colors: {4: '#2196f3'}});
		let str= convert.toHtml(this.str).split('\n');

		if (this.filter) {
			str = str.filter((s: string) => s.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0);
		} else {
			str = str.slice(-1000);
			if (str.length === 1000) {
				str.unshift("<h4>Only 1000 last lines are shown, full logs are still available from backend</h4>");
			}
		}

		this.strFiltered = <string>this.sanitizer.bypassSecurityTrustHtml(str.join('\n'));
	}
}
