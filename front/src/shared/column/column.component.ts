import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../classes/column";
import { Server } from "../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormArray, FormGroup } from "@angular/forms";
import { isSQL } from "../helper";
import { Table } from "../../classes/table";
import { Group, TypeData, TypeGroup } from "../../classes/driver";
import { Database } from "../../classes/database";
import commonHelper from "../common-helper.mjs";

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
	typeGroups!: TypeGroup[];

	constructor(
		public snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedTable = Table.getSelected();
		this.typeGroups = this.selectedServer!.driver.language.typeGroups;

		const custom: TypeData[] = [];
		this.selectedServer.complexes?.map(complex => {
			if (Database.getSelected().name !== complex.database) {
				return;
			}
			if (['DOMAIN', 'CUSTOM_TYPE', 'SEQUENCE', 'ENUM'].indexOf(complex.type) >= 0) {
				custom.push({
					id: complex.name,
					bold: true,
					description: complex.type.charAt(0).toUpperCase() + complex.type.slice(1).toLowerCase()
				});
			}
		})
		if (custom.length) {
			this.typeGroups.push({
				name: Group.Custom,
				list: custom
			})
		}

		this.formColumn = <FormArray>this.form.get('columns');
	}

	copyColumn(column: Column) {
		this.formColumn.push(Column.getFormGroup(this.selectedTable!, column));
	}

	protected readonly isSQL = isSQL;
	protected readonly commonHelper = commonHelper;
}
