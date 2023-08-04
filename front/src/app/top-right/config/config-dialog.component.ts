import { Component } from '@angular/core';
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";

@Component({
	templateUrl: './config-dialog.component.html',
	styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialog {

	configuration: Configuration = new Configuration();

	constructor(
		private request: RequestService
	) {
	}

	async update(name: string, value: string) {
		this.configuration.update(name, value);
		await this.request.reloadServer();
	}
}
