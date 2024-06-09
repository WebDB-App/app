import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
	selector: 'app-root',
	template: `
		<router-outlet></router-outlet>`
})
export class AppComponent {

	constructor(
		private domSanitizer: DomSanitizer,
		private matIconRegistry: MatIconRegistry
	) {
		for (const icon of ['github', 'patreon', 'linkedin', 'webdb', 'openai', 'google', 'gemini', 'huggingface', 'together', 'gorq', 'docker', 'faker', 'falso']) {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/${icon}.svg`)
			);
		}
	}
}
