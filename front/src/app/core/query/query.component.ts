import { Component, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'app-query',
	templateUrl: './query.component.html',
	styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

	selectedTable?: Table;
	replayQuery: string = "";

	constructor(
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			this.selectedTable = Table.getSelected();
		});
	}
}
