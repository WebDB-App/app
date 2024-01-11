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

	complexes: Complex[] = [];
	selectedServer?: Server;
	selectedDatabase?: Database;

	protected readonly Object = Object;

	constructor() {
	}

	ngOnInit(): void {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();

		this.complexes = this.selectedServer.complexes.filter(complex => {
			return this.selectedDatabase!.name === complex.database;
		});
	}

	filterChanged(_value: string) {
		const value = _value.toLowerCase();

		for (const [index, complex] of this.complexes.entries()) {
			this.complexes[index].hide = complex.name.indexOf(value) < 0;
			if (this.complexes[index].hide && complex.table) {
				this.complexes[index].hide = complex.table.indexOf(value) < 0;
			}
		}
	}

	protected readonly complex = complex;
}
