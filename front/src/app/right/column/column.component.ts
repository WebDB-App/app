import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../../classes/column";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormArray, FormGroup } from "@angular/forms";

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

	constructor(
		public snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.formColumn = <FormArray>this.form.get('columns');
	}

	addColumn(column?: any) {
		this.formColumn.push(column || Column.getFormGroup());
	}
}
