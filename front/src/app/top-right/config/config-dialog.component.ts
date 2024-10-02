import { Component, Inject } from '@angular/core';
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";
import { Server } from "../../../classes/server";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import packageJson from '../../../../package.json';

@Component({
	templateUrl: './config-dialog.component.html',
	styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialog {

	configuration: Configuration = new Configuration();
	currentYear = new Date().getFullYear();
	shortcuts: { [key: string]: { [key: string]: string[] } } = {
		'Query Editor': {
			'Trigger autocomplete': ['Alt + Space'],
			'Run query': ['Ctrl + Enter', '⌘ + Enter'],
			'Find and / or replace': ['Ctrl + f', '⌘ + f'],
			'Format query': ['Alt + Maj + f']
		},
		'Table': {
			'Copy one cell to clipboard': ['⇧ + click'],
			'Copy cell range to clipboard': ['⇧ + drag over cells'],
		}
	}
	protected readonly packageJson = packageJson;
	protected readonly Object = Object;

	constructor(
		public dialogRef: MatDialogRef<ConfigDialog>,
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public data: {
			upToDate: boolean
		}
	) {
	}

	async update(name: string, value: string) {
		this.configuration.update(name, value);
		if (Server.getSelected()) {
			await this.request.reloadServer();
		}
	}
}
