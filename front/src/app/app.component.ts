import { Component, HostListener } from '@angular/core';
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

		for (const icon of ['gitlab', 'stackoverflow', 'docker', 'webdb', 'chatgpt']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}
	}

	@HostListener('window:beforeunload', ['$event'])
	beforeunloadHandler(e: MouseEvent) {
		e.preventDefault();
		if (e) {
			e.returnValue = false;
		}
		return 'Sure?';
	}
}
