import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import packageJson from '../package.json';

if (environment.production) {
	enableProdMode();

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

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
