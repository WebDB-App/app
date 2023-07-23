import { Component } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Column } from "../../../classes/column";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DrawerService } from "../../../shared/drawer.service";

@Component({
	selector: 'app-update-column',
	templateUrl: './update-column.component.html',
	styleUrls: ['./update-column.component.scss']
})
export class UpdateColumnComponent {

	form!: FormGroup;
	protected readonly JSON = JSON;

	constructor(
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private request: RequestService,
		private drawer: DrawerService
	) {
		this.activatedRoute.paramMap.subscribe(paramMap => {
			if (!Table.getSelected()) {
				return;
			}

			const col = Table.getSelected().columns.find(col => col.name === paramMap.get('column'))!;
			const old = Column.getFormGroup(col);
			old.disable();

			this.form = fb.group({
				old,
				columns: fb.array([
					Column.getFormGroup(col)
				])
			});
		});
	}

	async update() {
		await this.request.post('column/modify', this.form.getRawValue());
		await this.request.reloadServer();

		this.drawer.toggle();
		this.snackBar.open(`Columns Altered`, "╳", {duration: 3000});
	}
}
