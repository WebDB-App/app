import { Component } from '@angular/core';
import { Column } from "../../../classes/column";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { ActivatedRoute } from "@angular/router";
import { Database } from "../../../classes/database";
import { Table } from "../../../classes/table";

@Component({
	selector: 'app-add-column',
	templateUrl: './add-column.component.html',
	styleUrls: ['./add-column.component.scss']
})
export class AddColumnComponent {

	table?: Table;
	form = {
		columns: [<Column>{}, <Column>{}]
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private _snackBar: MatSnackBar,
		private request: RequestService
	) {
		this.activatedRoute.paramMap.subscribe(paramMap => {
			this.table = Database.getSelected().tables!.find(table => table.name === paramMap.get('table'))
		});
	}

	async add() {
		await this.request.post('column/add', this.form);

		this._snackBar.open(`Columns Added`, "╳", {duration: 3000});
		await this.request.reloadDbs();
	}
}
