import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Licence } from "../classes/licence";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: 'app-root',
	template: `
		<router-outlet></router-outlet>`
})
export class AppComponent {

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry,
		private snackBar: MatSnackBar) {

		for (const icon of ['github', 'linkedin', 'webdb', 'openai', 'google', 'gemini', 'together', 'docker', 'faker', 'falso']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}

		setInterval(async () => {
			await this.checkLicence();
		}, 1000 * 3600);
		this.checkLicence();
	}

	async checkLicence() {
		try {
			const licence = await Licence.renew();
			if (licence.error) {
				this.snackBar.open(licence.error, "⨉", {panelClass: 'snack-error'});
			}
		} catch (e) {
			console.error(e);
		}
	}
}
