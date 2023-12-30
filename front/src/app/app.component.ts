import { Component, HostListener } from '@angular/core';
import { environment } from "../environments/environment";
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

		for (const icon of ['gitlab', 'reddit', 'linkedin', 'webdb', 'chatgpt', 'google', 'perplexity', 'docker', 'faker', 'falso']) {
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

	@HostListener('window:beforeunload', ['$event'])
	beforeunloadHandler(e: MouseEvent) {
		if (!environment.production) {
			return
		}

		e.preventDefault();
		if (e) {
			e.returnValue = false;
		}
		return 'Sure?';
	}
}
