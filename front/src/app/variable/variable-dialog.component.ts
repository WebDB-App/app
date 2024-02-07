import { Component, Inject } from '@angular/core';
import { Server } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Variable } from "../../classes/variable";

@Component({
	selector: 'app-variable',
	templateUrl: './variable-dialog.component.html',
	styleUrls: ['./variable-dialog.component.scss']
})
export class VariableDialogComponent {

	displayedColumns = ['name', 'value', 'description'];
	variableList = new MatTableDataSource<Variable>();
	toUpdate: any = {};
	filter = '';

	protected readonly environment = environment;

	constructor(
		private request: RequestService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {
		this.refreshData();
	}

	async refreshData() {
		let list = <Variable[]>(await this.request.post('variable/list', {}, undefined, undefined, this.server));
		list = list.map((l: any) => {
			l.original = l.value;
			return l;
		});
		this.variableList = new MatTableDataSource(list);
		this.filterChanged();
	}

	filterChanged() {
		this.variableList.filter = this.filter.trim().toLowerCase();
	}

	identify(index: any, rom: Variable) {
		return rom.name;
	}

	async kill(pid: string) {
		await this.request.post('process/kill', {pid}, undefined, undefined, this.server);
		await this.refreshData();
	}

	async setVariable(element: Variable) {
		try {
			await this.request.post('variable/set', element, undefined, undefined, this.server);
			this.snackBar.open(`Set ${element.name} to ${element.value}`, "⨉", {duration: 3000});
			this.toUpdate[element.name] = undefined;
		} catch (e: any) {
		}

		await this.refreshData();
	}
}
