import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Server } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import { ChartOptions } from "chart.js";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BaseChartDirective } from "ng2-charts";

@Component({
	selector: 'app-activity',
	templateUrl: './stats-dialog.component.html',
	styleUrls: ['./stats-dialog.component.scss']
})
export class StatsDialogComponent implements OnInit, OnDestroy {

	@ViewChild(BaseChartDirective) public chart?: BaseChartDirective;

	interval!: NodeJS.Timer;
	public labels: string[] = [];
	public datasets: any[] = [];
	public lineChartOptions: ChartOptions<'line'> = {
		responsive: false,
		plugins: {
			legend: {
				display: true,
				labels: {
					color: 'white'
				}
			},
		},

	};

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
		const stats = await this.request.post('stats/server', {}, undefined, undefined, this.server);
		for (const stat of stats) {
			const index = this.datasets.findIndex(dataset => dataset.label === stat.Variable_name);
			if (index >= 0) {
				this.datasets[index].data.push(stat.Value);
			} else {
				this.datasets.push({
					data: [+stat.Value],
					label: stat.Variable_name,
					fill: false,
					tension: 0.2,
					backgroundColor: 'transparent'
				});
			}
		}
		this.labels.push('');
		this.chart?.update();
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
