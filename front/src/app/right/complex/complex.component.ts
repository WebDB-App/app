import { Component, OnInit } from '@angular/core';
import { Complex } from "../../../classes/complex";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { complex } from "../../../shared/helper";

@Component({
	selector: 'app-complex',
	templateUrl: './complex.component.html',
	styleUrls: ['./complex.component.scss']
})
export class ComplexComponent implements OnInit {

	complexes: { [type: string]: Complex[] } = {};
	selectedServer?: Server;
	selectedDatabase?: Database;
	protected readonly Object = Object;

	constructor() {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();

		for (const [type, complexes] of Object.entries(this.selectedServer.complexes)) {
			this.complexes[type] = complexes.filter(complex => this.selectedDatabase!.name === complex.database);
		}
	}

	filterChanged(_value: string) {
		const value = _value.toLowerCase();

		for (const [type, complexes] of Object.entries(this.complexes)) {
			this.complexes[type] = complexes.filter(complex => {
				complex.hide = complex.name.indexOf(value) < 0;
				if (complex.hide && complex.table) {
					complex.hide = complex.table.indexOf(value) < 0;
				}
				return complex;
			});
		}
	}

	protected readonly complex = complex;
}
