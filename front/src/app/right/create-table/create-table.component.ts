import { Component } from '@angular/core';
import { Column } from "../../../classes/column";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { DrawerService } from "../../../shared/drawer.service";

@Component({
	selector: 'app-create-table',
	templateUrl: './create-table.component.html',
	styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent {

	form = {
		name: '',
		columns: [<Column>{}, <Column>{}, <Column>{}, <Column>{}]
	};

	constructor(
		private snackBar: MatSnackBar,
		private router: Router,
		private drawer: DrawerService,
		private request: RequestService
	) {
	}

	async create() {
		await this.request.post('table/create', this.form);

		this.snackBar.open(`Table ${this.form.name} Created`, "╳", {duration: 3000});
		await this.request.reloadServer();

		await this.router.navigate([
			Server.getSelected().name,
			Database.getSelected().name,
			this.form.name,
			'structure']);

		await this.drawer.toggle();
	}
}
