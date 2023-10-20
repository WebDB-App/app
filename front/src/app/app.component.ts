import { Component, HostListener } from '@angular/core';
import { environment } from "../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
	selector: 'app-root',
	template: `<router-outlet></router-outlet>`
})
export class AppComponent {

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry) {

		for (const icon of ['gitlab', 'reddit', 'linkedin', 'webdb', 'chatgpt', 'docker', 'stackoverflow']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
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
