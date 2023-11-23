import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: 'app-unreachable',
	templateUrl: './unreachable.component.html',
	styleUrls: ['./unreachable.component.scss']
})
export class UnreachableComponent {

	@Output() reloadPage = new EventEmitter<void>();

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public snackBar: MatSnackBar
	) {
	}
}
