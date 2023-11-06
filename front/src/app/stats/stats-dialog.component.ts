import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Server } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import { Chart, ChartOptions } from "chart.js";
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
		plugins: {
			legend: {
				position: 'right',
				display: true,
				labels: {
					boxWidth: 2,
					color: 'white'
				}
			}
		},
		animation: false,
		scales: {
			x: {
				display: true,
				grid: {
					display: false
				}
			},
			y: {
				display: true,
				type: 'logarithmic',
			}
		}
	};
	showLive = false;

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

	triggerTooltip() {
		if (!this.chart || !this.chart.chart || !this.chart.chart.tooltip) {
			return;
		}

		const tooltip = this.chart.chart.tooltip;
		const chartArea = this.chart.chart.chartArea;
		const index = this.datasets[0].data.length - 1;
		const actives = this.datasets.map((val, ind) => {
			return {datasetIndex: ind, index: index};
		});

		tooltip.setActiveElements(actives, {
			x: (chartArea.left + chartArea.right) / 2,
			y: (chartArea.top + chartArea.bottom) / 2,
		});
		this.chart.update();
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
					borderWidth: 2,
					radius: 1,
				});
			}
		}
		this.labels.push('');
		this.chart?.update();
		if (this.showLive) {
			this.triggerTooltip();
		}
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
