import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import Convert from "ansi-to-html";
import { environment } from "../../environments/environment";
import { ConfigDialog } from "./config/config-dialog.component";
import { isSQL, scrollToBottom } from "../../shared/helper";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";
import { Server } from "../../classes/server";
import { ProcessDialogComponent } from "../process/process-dialog.component";
import { StatsDialogComponent } from "../stats/stats-dialog.component";
import { RequestService } from "../../shared/request.service";
import { VariableDialogComponent } from "../variable/variable-dialog.component";

@Component({
	selector: 'app-top-right',
	templateUrl: './top-right.component.html',
	styleUrls: ['./top-right.component.scss']
})
export class TopRightComponent {

	protected readonly isSQL = isSQL;
	protected readonly environment = environment;
	protected readonly Server = Server;

	constructor(
		private dialog: MatDialog,
		public router: Router,
		public request: RequestService
	) {
	}

	showSettings() {
		this.dialog.open(ConfigDialog);
	}

	showLogs() {
		this.dialog.open(LogsDialog, {
			id: "logs",
			hasBackdrop: false
		});
	}

	showProcess() {
		this.dialog.open(ProcessDialogComponent, {
			hasBackdrop: false,
			id: 'process',
			data: JSON.parse(JSON.stringify(Server.getSelected())),
		});
	}

	showStats() {
		this.dialog.open(StatsDialogComponent, {
			hasBackdrop: false,
			id: 'stats',
			data: JSON.parse(JSON.stringify(Server.getSelected())),
		});
	}

	showVariables() {
		this.dialog.open(VariableDialogComponent, {
			hasBackdrop: false,
			id: 'variable',
			data: JSON.parse(JSON.stringify(Server.getSelected())),
		});
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
	atBottom = true;
	protected readonly environment = environment;
	@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

	constructor(
		private http: HttpClient,
		private sanitizer: DomSanitizer,
	) {
	}

	async ngOnInit() {
		await this.load();

		this.interval = setInterval(() => {
			this.load();
		}, 2000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	async load() {
		const str = await firstValueFrom(this.http.get(`${environment.apiRootUrl}logs/finished`, {responseType: 'text'}));
		if (this.str.length === str.length) {
			return;
		}
		this.str = str;
		this.filterChanged();

		if (this.atBottom) {
			scrollToBottom(this.scrollContainer);
		}
	};

	filterChanged() {
		const convert = new Convert({colors: {4: '#2196f3'}});
		let str = convert.toHtml(this.str).split('\n');

		if (this.filter) {
			str = str.filter((s: string) => s.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0);
		}

		this.strFiltered = <string>this.sanitizer.bypassSecurityTrustHtml(str.join('\n'));
	}

	onScroll(event: any) {
		this.atBottom = event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight;
	}
}
