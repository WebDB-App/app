import { Component } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Column } from "../../../classes/column";

@Component({
	selector: 'app-update-column',
	templateUrl: './update-column.component.html',
	styleUrls: ['./update-column.component.scss']
})
export class UpdateColumnComponent {

	form: { columns: Column[], old: Column } = {columns: [<Column>{}], old: <Column>{}};

	constructor(
		private activatedRoute: ActivatedRoute,
		private _snackBar: MatSnackBar,
		private request: RequestService,
	) {
		this.activatedRoute.paramMap.subscribe(paramMap => {
			if (!Table.getSelected()) {
				return;
			}

			this.form.old = Table.getSelected().columns.find(col => col.name === paramMap.get('column'))!
			this.form.columns = [
				{...this.form.old}
			];
		});
	}

	async update() {
		await this.request.post('column/modify', this.form);

		this.form.old = this.form.columns[0];
		this._snackBar.open(`Columns Changed`, "╳", {duration: 3000});

		await this.request.reloadDbs();
	}

}
