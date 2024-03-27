import { Component, OnInit } from '@angular/core';
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";
import { Server } from "../../../classes/server";
import { FormControl, Validators } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { MatDialogRef } from "@angular/material/dialog";
import packageJson from '../../../../package.json';
import { firstValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
	templateUrl: './config-dialog.component.html',
	styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialog implements OnInit {

	upToDate!: boolean;
	configuration: Configuration = new Configuration();
	email = new FormControl('', [Validators.required, Validators.email]);
	env = environment
	currentYear = new Date().getFullYear();
	protected readonly packageJson = packageJson;
	protected readonly Object = Object;

	shortcuts: { [key: string]: {[key: string]: string[]} } = {
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

	constructor(
		public dialogRef: MatDialogRef<ConfigDialog>,
		private http: HttpClient,
		private request: RequestService
	) {
	}

	async ngOnInit() {
		this.checkUptoDate();
	}

	async checkUptoDate() {
		try {
			const local = await firstValueFrom(this.http.get(`${environment.rootUrl}changelog.html`, {responseType: 'text'}))
			const remote = await firstValueFrom(this.http.get(`https://demo.webdb.app/changelog.html`, {responseType: 'text'}));
			this.upToDate = local.length >= remote.length;
		} catch (e) {
			console.error(e);
		}
	}

	async update(name: string, value: string) {
		this.configuration.update(name, value);
		if (Server.getSelected()) {
			await this.request.reloadServer();
		}
	}
}
