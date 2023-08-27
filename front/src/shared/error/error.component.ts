import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { DrawerService } from "../drawer.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

	constructor(
		private drawer: DrawerService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public bottomSheetRef: MatBottomSheetRef<ErrorComponent>,
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: {
			error: any,
			context: any
		}
	) {}

	async assistant() {
		this.bottomSheetRef.dismiss();
		await this.router.navigate(
			[{outlets: {right: ['assistant']}}])
		await this.drawer.open('When running a request with the context: ```' + JSON.stringify(this.data.context) + '``` , I got this error: ```' + JSON.stringify(this.data.error.error || this.data.error) + '```, can you fix it for me');
	}
}
