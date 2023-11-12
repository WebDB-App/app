import { Component, OnInit } from '@angular/core';
import { Configuration } from "../../../classes/configuration";
import { RequestService } from "../../../shared/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Server } from "../../../classes/server";
import { FormControl, Validators } from "@angular/forms";
import { Licence } from "../../../classes/licence";
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
	licence?: Licence;
	env = environment
	currentYear = new Date().getFullYear();
	protected readonly packageJson = packageJson;

	constructor(
		public dialogRef: MatDialogRef<ConfigDialog>,
		private snackBar: MatSnackBar,
		private http: HttpClient,
		private request: RequestService
	) {
	}

	async ngOnInit() {
		this.loadLicence();
		this.checkUptoDate();
	}

	async loadLicence() {
		this.licence = await Licence.get(false);
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

	async save(email: string) {
		try {
			await Licence.add(email);
			this.snackBar.open(`Account successfully registered `, "╳", {duration: 3000});
			await this.loadLicence();

			if (Server.getSelected()) {
				await this.request.reloadServer();
			}
		} catch (err: any) {
			this.snackBar.open(err + ". Contact us at: main.webdb@gmail.com", "╳", {panelClass: 'snack-error'});
		}
	}

	async update(name: string, value: string) {
		this.configuration.update(name, value);
		if (Server.getSelected()) {
			await this.request.reloadServer();
		}
	}
}
