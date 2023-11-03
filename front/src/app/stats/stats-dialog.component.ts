import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Server } from "../../classes/server";
import { MatTableDataSource } from "@angular/material/table";
import { RequestService } from "../../shared/request.service";
import { ChartConfiguration, ChartOptions } from "chart.js";

@Component({
  selector: 'app-activity',
  templateUrl: './stats-dialog.component.html',
  styleUrls: ['./stats-dialog.component.scss']
})
export class StatsDialogComponent implements OnInit, OnDestroy {

	processList = new MatTableDataSource();
	interval!: NodeJS.Timer;
	public lineChartData: ChartConfiguration<'line'>['data'] = {
		labels: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July'
		],
		datasets: [
			{
				data: [ 65, 59, 80, 81, 56, 55, 40 ],
				label: 'Series A',
				fill: true,
				tension: 0.5,
				borderColor: 'grey',
				backgroundColor: 'rgba(255,0,0,0.3)'
			}
		]
	};
	public lineChartOptions: ChartOptions<'line'> = {
		responsive: false
	};
	public lineChartLegend = true;

	@Input() server!: Server;

	constructor(
		private request: RequestService
	) { }

	ngOnInit(): void {
		this.interval = setInterval(async () => {
			this.processList = await this.request.post('server/process', {}, undefined, undefined, this.server);
		}, 2000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
