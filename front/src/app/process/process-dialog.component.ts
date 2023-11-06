import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Server } from "../../classes/server";
import { MatTableDataSource } from "@angular/material/table";
import { RequestService } from "../../shared/request.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: 'app-activity',
	templateUrl: './process-dialog.component.html',
	styleUrls: ['./process-dialog.component.scss']
})
export class ProcessDialogComponent implements OnInit, OnDestroy {

	displayedColumns = ['pid', 'duration', 'query', 'kill'];
	processList = new MatTableDataSource();
	interval!: NodeJS.Timer;

	constructor(
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
	}

	async ngOnInit() {
		await this.refreshData();
		this.interval = setInterval(async () => {
			await this.refreshData();
		}, 2000);
	}

	async refreshData() {
		const list = await this.request.post('process/list', {}, undefined, undefined, this.server);
		this.processList.data = list.sort((a: { pid: number; }, b: { pid: number; }) => a.pid - b.pid);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	async kill(pid: string) {
		await this.request.post('process/kill', {pid}, undefined, undefined, this.server);
		await this.refreshData();
	}

	filterChanged(_value = '') {
		this.processList.filter = _value.trim().toLowerCase();
	}
}
