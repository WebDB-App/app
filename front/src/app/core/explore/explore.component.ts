import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Server } from "../../../classes/server";
import { ActivatedRoute, Router } from "@angular/router";
import { Table } from "../../../classes/table";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import { UpdateDataDialog } from "../../../shared/update-data-dialog/update-data-dialog";
import { ExportResultDialog } from "../../../shared/export-result-dialog/export-result-dialog";
import { BatchUpdateDialog } from "../../../shared/batch-update-dialog/batch-update-dialog";

@Component({
	selector: 'app-explore',
	styleUrls: ['explore.component.scss'],
	templateUrl: 'explore.component.html',
})
export class ExploreComponent implements OnInit, OnDestroy {

	configuration: Configuration = new Configuration();
	selectedTable?: Table;
	selectedServer?: Server;
	interval!: NodeJS.Timer;

	querySize = 0;
	params = {
		chips: "",
		field: "",
		direction: "",
		page: 0,
		pageSize: 50
	}
	filter: { [key: string]: string } = {};
	autoUp: boolean | NodeJS.Timer = false;
	query = "";
	isLoading = false;
	actionColum = "##ACTION##";
	displayedColumns: string[] = [];
	dataSource!: MatTableDataSource<any>;
	selection = new SelectionModel<any>(true, []);
	stringify = this.configuration.getByName('stringifyData')?.value;

	protected readonly Math = Math;

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService,
		private router: Router,
		private dialog: MatDialog,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnDestroy(): void {
		clearInterval(this.interval);
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		}
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();

		this.activatedRoute?.paramMap!.subscribe(async (params) => {
			if (this.selectedTable && this.selectedTable?.name !== Table.getSelected().name) {
				this.changePage(0);
				this.params.field = "";
				this.params.direction = "";
				this.params.chips = params.get("chips") || "";
			} else {
				this.params.page = +(params.get("page") || 0);
				this.params.pageSize = +(params.get("pageSize") || 50);
				this.params.field = params.get("field") || "";
				this.params.direction = params.get("direction") || "";
				this.params.chips = params.get("chips") || "";
			}

			this.selectedTable = Table.getSelected();
			this.selection.clear();
			await this.refreshData(true);
		});

		this.interval = setInterval(() => {
			this.router.navigate([this.params], {
				relativeTo: this.activatedRoute,
			});
		}, 1000);
	}

	changePage(page: any, pageSize: number = 50) {
		page = +page;
		if ((page * pageSize) > this.querySize) {
			page = 0;
		}

		this.params.pageSize = pageSize;
		this.params.page = +page;
		return event;
	}

	async refreshData(cache = false) {
		const newQuery = this.filterToWhere();
		if (cache && newQuery === this.query) {
			return;
		}

		this.isLoading = true;
		this.query = newQuery;

		try {
			await Promise.all([this.getQueryData(), this.getQuerySize()]);
		} catch (HttpErrorResponse) {
		} finally {
			this.isLoading = false;
		}
	}

	async getQueryData() {
		let query = this.query;

		if (this.params.direction && this.params.field) {
			query = this.selectedServer?.driver.basicSort(query, this.params.field, <"asc" | "desc">this.params.direction)!;
		}

		const result: any[] = await this.request.post('database/query', {
			query,
			pageSize: this.params.pageSize,
			page: this.params.page
		});

		this.dataSource = new MatTableDataSource<any>(result);

		this.displayedColumns = this.selectedTable!.columns.map(column => column.name)
		if (result.length) {
			this.displayedColumns = [...new Set(this.displayedColumns.concat(result.flatMap(res => Object.keys(res))))]
		}
		this.displayedColumns = this.displayedColumns.concat([this.actionColum]);
	}

	async getQuerySize() {
		this.querySize = await this.request.post('database/querySize', {query: this.query});
	}

	filterToWhere(): string {
		if (!this.selectedTable) {
			return "";
		}
		const condition = this.params.chips.split(';').filter(e => e);
		const operand = this.configuration.getByName('operand')?.value;

		return this.selectedServer!.driver.basicFilter(this.selectedTable, condition, operand);
	}

	async addChips(column: string, event: MatChipInputEvent) {
		let value = event.value.trim();
		if (!value) {
			return;
		}

		this.params.chips += this.selectedServer?.driver.quickSearch(
			this.selectedServer!.driver,
			this.selectedTable?.columns.find(col => col.name === column)!,
			value) + ';';
		this.params.page = 0;
		event.chipInput!.clear();
		await this.refreshData();
	}

	async removeChips(chips: string) {
		this.params.chips = this.params.chips.replace(`${chips};`, '');
		await this.refreshData();
	}

	async removeRows() {
		const nb = await this.request.post('data/delete', this.selection.selected);

		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});
		this.selection.clear();

		this.snackBar.open(`${nb} rows deleted`, "⨉", {duration: 3000});
	}

	editRow(i: number, row: any) {
		const dialogRef = this.dialog.open(UpdateDataDialog, {
			data: {
				row,
				updateInPlace: true
			},
			id: (this.params.pageSize * this.params.page + i).toString(),
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(async result => {
			if (result) {
				this.refreshData();
			}
		});
	}

	shiftCheckBox(event: MouseEvent, row: any) {
		if (!event || !event.shiftKey || this.selection.isEmpty()) {
			return;
		}

		const indexRow = this.dataSource.data.findIndex(da => JSON.stringify(da) === JSON.stringify(row));
		const indexFirst = this.dataSource.data.findIndex(da => this.selection.isSelected(da));

		for (const [index, line] of this.dataSource.data.entries()) {
			if (index <= Math.min(indexRow, indexFirst)) {
				continue;
			}
			if (index >= Math.max(indexRow, indexFirst)) {
				continue;
			}
			this.selection.toggle(line);
		}
	}

	setAutoUp() {
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		} else {
			this.autoUp = setInterval(async () => {
				await this.refreshData();
			}, this.configuration.getByName('reloadData')?.value * 1000);
		}
	}

	isAllSelected() {
		return this.selection.selected.length === this.dataSource.data.length;
	}

	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}
		this.selection.select(...this.dataSource.data);
	}

	batchUpdate() {
		const dialogRef = this.dialog.open(BatchUpdateDialog, {
			data: this.selection.selected,
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(async (result) => {
			if (!result) {
				return;
			}
			this.selection.clear();
			await this.refreshData();
		});
	}

	async duplicateRows() {
		await this.router.navigate(['..', 'insert', JSON.stringify(this.selection.selected)],
			{relativeTo: this.activatedRoute});
	}

	exportRows() {
		this.dialog.open(ExportResultDialog, {
			data: this.selection.selected,
			hasBackdrop: false
		});
	}
}
