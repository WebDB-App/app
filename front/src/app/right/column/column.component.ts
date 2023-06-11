import { Component, Input, OnInit } from '@angular/core';
import { Column } from "../../../classes/column";
import { Server } from "../../../classes/server";
import { Configuration } from "../../../classes/configuration";

@Component({
	selector: 'app-column',
	templateUrl: './column.component.html',
	styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

	@Input() form!: { columns: Column[] };
	@Input() to_update = true;

	configuration: Configuration = new Configuration();
	extraAttributes = Server.getSelected().driver.extraAttributes;
	selectedServer?: Server;

	constructor() {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
	}

	addColumn() {
		this.form?.columns.push(<Column>{});
	}
}