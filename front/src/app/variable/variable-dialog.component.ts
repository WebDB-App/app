import { Component, Inject } from '@angular/core';
import { Server } from "../../classes/server";
import { RequestService } from "../../shared/request.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

@Component({
	selector: 'app-variable',
	templateUrl: './variable-dialog.component.html',
	styleUrls: ['./variable-dialog.component.scss']
})
export class VariableDialogComponent {

	displayedColumns = ['name', 'value'];
	variableList = new MatTableDataSource();

	//description si dispo
	//action -> save / reset

	constructor(
		private request: RequestService,
		@Inject(MAT_DIALOG_DATA) public server: Server,
	) {

	}

	filterChanged(_value = '') {
		this.variableList.filter = _value.trim().toLowerCase();
	}

	identify(index: any, rom: any) {
		return rom.name;
	}
}
