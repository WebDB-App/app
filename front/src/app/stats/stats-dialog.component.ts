import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Server } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import { Chart, ChartOptions, LegendItem } from "chart.js";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BaseChartDirective } from "ng2-charts";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

@Component({
	selector: 'app-activity',
	templateUrl: './stats-dialog.component.html',
	styleUrls: ['./stats-dialog.component.scss']
})
export class StatsDialogComponent implements OnDestroy {

	@ViewChild(BaseChartDirective) public chart!: BaseChartDirective;

	interval!: NodeJS.Timer;
	pause = false;
	valSize = 1000;
	labels: string[] = [];
	datasets: any[] = [];
	times: { [key: string]: number[] } = {};
	mode: 'raw' | 'difference' | 'sinceOpen' = 'sinceOpen';
	lineChartOptions: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		layout: {
			padding: {
				left: 10,
				right: 50,
				top: 25,
				bottom: 0
			}
		},
		plugins: {
			tooltip: {
				borderColor: 'rgba(255, 255, 255, 0.12)',
				borderWidth: 1,
				backgroundColor: 'rgba(30, 30, 30, 0.9)',
				padding: 10,
				bodySpacing: 5,
				bodyFont: {
					family: 'Roboto',
				}
			},
			datalabels: {
				display: function (context) {
					return context.dataIndex === context.dataset.data.length - 1;
				},
				color: 'white',
				align: 'right',
				font: {
					family: 'Roboto',
				}
			},
			zoom: {
				pan: {
					enabled: true,
					mode: 'x',
					modifierKey: 'ctrl',
				},
				zoom: {
					drag: {
						enabled: true
					},
					mode: 'x',
				},
			},
			legend: {
				position: 'left',
				display: true,
				labels: {
					boxWidth: 2,
					color: 'white',
					font: {
						family: 'Roboto',
					}
				},
				onHover: (evt, legendItem: LegendItem) => {
					this.chart.chart!.setActiveElements(
						this.chart.chart!.getDatasetMeta(
							legendItem.datasetIndex!
						).data!.map((x, i) => ({
							datasetIndex: legendItem.datasetIndex!,
							index: i,
						}))
					);

					this.chart.update();
				},
			},
		},
		interaction: {
			mode: 'index',
			intersect: false,
		},
		animation: {
			easing: 'linear',
			duration: 10,
		},
		scales: {
			x: {
				display: true,
				grid: {
					display: false
				}
			},
			y: {
				ticks: {
					display: false
				}
			}
		},
	};

	constructor(
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
		this.interval = setInterval(() => {
			if (!this.pause) {
				this.refreshData();
			}
		}, 500);
		this.refreshData();
	}

	async refreshData() {
		let newVals;

		try {
			newVals = await this.request.post('stats/server', {}, undefined, undefined, this.server);
		} catch (e) {
			this.pause = true;
			return;
		}

		newVals.map((newVal: { Variable_name: any; Value: any; }) => {
			if (!this.times[newVal.Variable_name]) {
				this.times[newVal.Variable_name] = [];
			}
			this.times[newVal.Variable_name].push(+newVal.Value);
		});

		for (const [Variable_name, _Values] of Object.entries(this.times)) {
			let datas = [0];
			const Values = _Values.slice(-this.valSize);

			if (this.mode === 'difference') {
				for (let i = 1; i < Values.length; i++) {
					datas.push(Values[i] - Values[i - 1]);
				}
			} else if (this.mode === 'sinceOpen') {
				for (let i = 1; i < Values.length; i++) {
					datas.push(Values[i] - Values[0]);
				}
			} else {
				datas = Values;
			}

			const datasetIndex = this.datasets.findIndex(dataset => dataset.label === Variable_name);
			if (datasetIndex >= 0) {
				this.datasets[datasetIndex].data = datas
			} else {
				this.datasets.push({
					data: datas,
					label: Variable_name,
					borderWidth: 2,
					tension: 0,
					radius: 0,
				});
			}
		}
		if (this.labels.length < this.valSize) {
			this.labels.push('');
		}
		this.chart.update();
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
