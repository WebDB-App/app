import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import * as Sentry from "@sentry/angular";
import packageJson from "../../package.json";
import { Configuration } from "../classes/configuration";

@Component({
	selector: 'app-root',
	template: `
		<router-outlet></router-outlet>`
})
export class AppComponent {

	configuration: Configuration = new Configuration();

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

		if (this.configuration.getByName('sentry')?.value) {
			Sentry.init({
				dsn: "https://954e737cc190477288dcf04938b42877@o4507908014473216.ingest.de.sentry.io/4507910411780176",
				release: packageJson.version,
				integrations: [
					Sentry.browserTracingIntegration(),
					Sentry.replayIntegration(),
				],
				tracesSampleRate: 1.0,
				replaysOnErrorSampleRate: 1.0,
			});
		}
	}
}
