import { Component, OnInit } from '@angular/core';
import { Complex } from "../../../classes/complex";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { complex } from "../../../shared/helper";
import { Table } from "../../../classes/table";
import { MatDrawer } from "@angular/material/sidenav";
import { Router } from "@angular/router";

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
	protected readonly complex = complex;

	constructor(
		private drawer: MatDrawer,
		private router: Router,
	) {
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

	alter(complex: Complex, type: string) {
		const query = this.selectedServer?.driver.alterComplex(complex, type);
		this.router.navigate([Server.getSelected().name, Database.getSelected().name, Table.getSelected().name, 'query', query]);
		this.drawer.close();
	}
}
