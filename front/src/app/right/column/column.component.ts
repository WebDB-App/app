import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../../classes/column";
import { Server } from "../../../classes/server";
import { isSQL } from "../../../shared/helper";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: 'app-column',
	templateUrl: './column.component.html',
	styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

	@Input() form!: { columns: Column[] };
	@Input() to_update = true;

	fullType = false;
	extraAttributes = Server.getSelected().driver.language.extraAttributes;
	selectedServer?: Server;
	protected readonly isSQL = isSQL;

	constructor(
		public snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
	}

	addColumn() {
		this.form?.columns.push(<Column>{});
	}
}
