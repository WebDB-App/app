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
	) { }

	async ngOnInit() {
		this.processList = await this.request.post('process/list', {}, undefined, undefined, this.server);
		this.interval = setInterval(async () => {
			this.processList = await this.request.post('process/list', {}, undefined, undefined, this.server);
		}, 2000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
