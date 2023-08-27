import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	constructor(
		public bottomSheetRef: MatBottomSheetRef<ErrorComponent>,
		@Inject(MAT_BOTTOM_SHEET_DATA) public error: any
	) {}

	ngOnInit() {

	}

	async assistant() {
		// search on internet (new tab with error) + check logs

		/*this.drawer.toggle();
		const question = 'When running this query "' + helper.removeComment(this.query) + '" , I got this : ' + JSON.stringify(row) + ', can you fix it for me';
		await this.router.navigate(
			[{outlets: {right: ['assistant', {question}]}}],
			{relativeTo: this.activatedRoute.parent?.parent})*/
	}
}
