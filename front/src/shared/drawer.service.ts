import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
	providedIn: 'root'
})
export class DrawerService {
	drawer!: MatDrawer;
	private _lastData?: any;

	get lastData(): any {
		const l = this._lastData;
		this._lastData = undefined;
		return l;
	}

	setDrawer(sidenav: MatDrawer) {
		this.drawer = sidenav;
	}

	async close() {
		await this.drawer.close();
	}

	async open(data: any) {
		this._lastData = data;
		await this.drawer.open();
	}
}
