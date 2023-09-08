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
import { MatPaginatorIntl } from "@angular/material/paginator";
import { REMOVED_LABELS } from "../../../shared/helper";

@Component({
	selector: 'app-explore',
	styleUrls: ['explore.component.scss'],
	templateUrl: 'explore.component.html',
	providers: [{provide: MatPaginatorIntl, useValue: new REMOVED_LABELS()} ]
})
export class ExploreComponent implements OnInit, OnDestroy {

	configuration: Configuration = new Configuration();
	selectedTable?: Table;
	selectedServer?: Server;
	querySize = 0;
	pageSize = this.configuration.getByName("pageSize")?.value;
	params = {
		chips: "",
		sortField: "",
		sortDirection: "",
		page: 0
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
		if (this.autoUp && typeof this.autoUp === "number") {
			clearInterval(this.autoUp);
			this.autoUp = false
		}
	}

	ngOnInit() {
		this.selectedServer = Server.getSelected();

		this.activatedRoute.parent?.params!.subscribe(async () => {
			this.selectedTable = Table.getSelected();
			this.changePage(0, false);
			this.params.sortField = "";
			this.params.sortDirection = "";
			this.params.chips = "";
			this.selection.clear();

			await this.refreshData();
		});
		this.activatedRoute?.queryParams.subscribe(async (params) => {
			this.changePage(params["page"] || 0, false);
			this.params.sortField = params["sortField"] || "";
			this.params.sortDirection = params["sortDirection"] || "";
			this.params.chips = params["chips"] || "";
			this.selection.clear();

			await this.refreshData();
		});
	}

	changePage(page: any, navigate = true) {
		page = +page;
		if ((page * this.pageSize) > this.querySize) {
			page = 0;
			navigate = true;
		}

		this.params.page = +page;

		if (navigate) {
			this.navigateWithParams()
		}
		return event;
	}

	navigateWithParams() {
		this.router.navigate([], {
			relativeTo: this.activatedRoute,
			queryParams: this.params,
			queryParamsHandling: 'merge',
		});
	}

	async refreshData() {
		this.isLoading = true;
		this.query = this.filterToWhere();

		try {
			await Promise.all([this.getQueryData(), this.getQuerySize()]);
		} catch (HttpErrorResponse) {
		} finally {
			this.isLoading = false;
		}
	}

	async getQueryData() {
		let query = this.query;

		if (this.params.sortDirection && this.params.sortField) {
			query = this.selectedServer?.driver.getBaseSort(query, this.params.sortField, <"asc" | "desc">this.params.sortDirection)!;
		}

		const result = await this.request.post('database/query', {
			query,
			pageSize: this.pageSize,
			page: this.params.page
		});

		this.dataSource = new MatTableDataSource<any>(result);
		this.displayedColumns = result.length ? this.selectedTable!.columns.map(column => column.name).concat([this.actionColum]) : [];
	}

	async getQuerySize() {
		this.querySize = await this.request.post('database/querySize', {query: this.query});
	}

	filterToWhere(): string {
		const condition = this.params.chips.split(';').filter(e => e);
		const operand = this.configuration.getByName('operand')?.value;

		return this.selectedServer!.driver.getBaseFilter(this.selectedTable!, condition, operand);
	}

	addChips(column: string, event: MatChipInputEvent): void {
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
		this.navigateWithParams();
	}

	removeChips(chips: string): void {
		this.params.chips = this.params.chips.replace(`${chips};`, '');

		this.navigateWithParams();
	}

	async removeRows() {
		const nb = await this.request.post('data/delete', this.selection.selected);

		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});
		this.selection.clear();

		this.snackBar.open(`${nb} rows deleted`, "╳", {duration: 3000});
	}

	editRow(i: number, row: any) {
		const dialogRef = this.dialog.open(UpdateDataDialog, {
			data: {
				row,
				updateInPlace: true
			},
			id: (this.pageSize * this.params.page + i).toString(),
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

	exportRows() {
		this.dialog.open(ExportResultDialog, {
			data: this.selection.selected,
			hasBackdrop: false
		});
	}
}
