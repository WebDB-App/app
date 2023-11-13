import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LogsDialog } from "../../app/top-right/top-right.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-unreachable',
  templateUrl: './unreachable.component.html',
  styleUrls: ['./unreachable.component.scss']
})
export class UnreachableComponent implements OnInit {

	@Output() reloadPage = new EventEmitter<void>();

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
	}
}
