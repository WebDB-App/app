import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { init } from '@sentry/angular-ivy';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

init({
	dsn: 'https://glet_4aa313505f2ab7f4bb992102d99bbc1b@observe.gitlab.com:443/errortracking/api/v1/projects/42963773',
});

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
