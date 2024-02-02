import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../classes/column";
import { Server } from "../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormArray, FormGroup } from "@angular/forms";
import { isNested, isSQL } from "../helper";
import { Table } from "../../classes/table";
import { Group, TypeData, TypeGroup } from "../../classes/driver";
import { Database } from "../../classes/database";

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
	protected readonly isSQL = isSQL;
	protected readonly isNested = isNested;

	constructor(
		public snackBar: MatSnackBar
	) {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedTable = Table.getSelected();
		this.typeGroups = this.selectedServer!.driver.language.typeGroups;

		const custom: TypeData[] = [];

		['DOMAIN', 'ENUM'].map(type => {
			this.selectedServer!.complexes[type].map(complex => {
				if (Database.getSelected().name !== complex.database) {
					return;
				}
				custom.push({
					id: complex.name,
					bold: true,
					description: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
				});
			});
		});

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
}
