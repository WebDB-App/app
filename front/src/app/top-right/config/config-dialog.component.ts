import { Component } from '@angular/core';
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Server } from "../../../classes/server";

@Component({
	templateUrl: './config-dialog.component.html',
	styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialog {

	configuration: Configuration = new Configuration();

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService
	) {
	}

	async update(name: string, value: string) {
		this.configuration.update(name, value);
		if (Server.getSelected()) {
			await this.request.reloadServer();
		}
	}
}
