import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
	providedIn: 'root'
})
export class DrawerService {
	drawer!: MatDrawer;

	public setDrawer(sidenav: MatDrawer) {
		this.drawer = sidenav;
	}

	public toggle(): void {
		this.drawer.toggle();
	}
}
