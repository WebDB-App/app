import { Component, HostListener } from '@angular/core';
import { environment } from "../environments/environment";

@Component({
	selector: 'app-root',
	template: `
		<router-outlet></router-outlet>

		<div style="position: fixed; bottom: 12px; right: 12px; z-index: 10000000000">
			<a href="https://gitlab.com/web-db/landing/-/issues/new"
			   target="_blank"
			   style="color: white"
			   matTooltip="Create Issue"
			   mat-icon-button>
				<span class="material-symbols-outlined notranslate">
					bug_report
				</span>
			</a>
		</div>
	`
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
