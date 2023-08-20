import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../classes/column";
import { Server } from "../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormArray, FormGroup } from "@angular/forms";
import { isSQL } from "../helper";
import { Table } from "../../classes/table";

@Component({
	selector: 'app-column',
	templateUrl: './column.component.html',
	styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

	@Input() form!: FormGroup;

	formColumn!: FormArray;
	extraAttributes = Server.getSelected().driver.language.extraAttributes;
	selectedServer?: Server;
	selectedTable?: Table;

	constructor(
		public snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedTable = Table.getSelected();
		this.formColumn = <FormArray>this.form.get('columns');
	}

	copyColumn(column: Column) {
		this.formColumn.push(Column.getFormGroup(this.selectedTable!, column));
	}

	protected readonly isSQL = isSQL;
}
