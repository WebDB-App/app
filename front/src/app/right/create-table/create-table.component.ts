import { Component } from '@angular/core';
import { Column } from "../../../classes/column";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { DrawerService } from "../../../shared/drawer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'app-create-table',
	templateUrl: './create-table.component.html',
	styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent {

	form!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private router: Router,
		private drawer: DrawerService,
		private request: RequestService
	) {
		this.form = fb.group({
			name: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_]{2,50}$/)]],
			columns: fb.array([
				Column.getFormGroup(),
			])
		});
	}

	async create() {
		await this.request.post('table/create', this.form.value);

		this.snackBar.open(`Table ${this.form.get('name')?.value} Created`, "╳", {duration: 3000});
		await this.request.reloadServer();

		await this.router.navigate([
			Server.getSelected().name,
			Database.getSelected().name,
			this.form.get('name')?.value,
			'structure']);

		await this.drawer.toggle();
	}
}
