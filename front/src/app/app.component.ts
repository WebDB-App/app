import { Component, HostListener } from '@angular/core';
import { environment } from "../environments/environment";

@Component({
	selector: 'app-root',
	template: `<router-outlet></router-outlet>`
})
export class AppComponent {

	constructor() {
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
