import { Component } from '@angular/core';
import { Column } from "../../../classes/column";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { ActivatedRoute } from "@angular/router";
import { Database } from "../../../classes/database";
import { Table } from "../../../classes/table";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
	selector: 'app-add-column',
	templateUrl: './add-column.component.html',
	styleUrls: ['./add-column.component.scss']
})
export class AddColumnComponent {

	table?: Table;
	form!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private request: RequestService
	) {
		this.form = fb.group({
			columns: fb.array([
				Column.getFormGroup(),
			])
		});
		this.activatedRoute.paramMap.subscribe(paramMap => {
			this.table = Database.getSelected().tables!.find(table => table.name === paramMap.get('table'))
		});
	}

	async add() {
		await this.request.post('column/add', this.form);

		this.snackBar.open(`Columns Added`, "╳", {duration: 3000});
		await this.request.reloadServer();
	}
}
