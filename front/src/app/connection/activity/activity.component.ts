import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { MatTableDataSource } from "@angular/material/table";
import { RequestService } from "../../../shared/request.service";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {

	displayedColumns = ['pid', 'query'];
	dataSource = new MatTableDataSource();
	interval!: NodeJS.Timer;

	@Input() server!: Server;

	constructor(
		private request: RequestService
	) { }

	ngOnInit(): void {
		this.interval = setInterval(async () => {
			this.dataSource = await this.request.post('server/process', {}, undefined, undefined, this.server);
		}, 2000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
