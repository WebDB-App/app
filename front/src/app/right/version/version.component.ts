import { Component, OnDestroy } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { DrawerService } from "../../../shared/drawer.service";
import { Subscription } from "rxjs";

class Patch {
	diff!: string;
	sha1!: string;
	time!: string;
	hide = false;
}

declare var monaco: any;

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;

	drawerObs!: Subscription;
	filter = "";
	isLoading = false;
	patches: Patch[] = [];
	editorOptions = {
		language: 'text',
		glyphMargin: true
	};

	constructor(
		private request: RequestService,
		private drawer: DrawerService,
		public snackBar: MatSnackBar
	) {
		this.drawerObs = this.drawer.drawer.openedChange.subscribe(async (state) => {
			if (!state) {
				return;
			}
			await this.refreshData();
		});
	}

	ngOnDestroy() {
		this.drawerObs.unsubscribe();
	}

	date(unix: string) {
		return (new Date(+unix)).toString();
	}

	identify(index: any, patch: Patch) {
		return patch.sha1;
	}

	async refreshData() {
		const loop = async () => {
			if (!this.drawer.drawer.opened || !Database.getSelected()) {
				return;
			}
			this.patches = await this.request.post('version/list', undefined);
			this.filterChanged();
			setTimeout(() => loop(), 2000);
		};

		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		loop();
	}

	filterChanged() {
		const value = this.filter.toLowerCase();
		for (const [index, patch] of this.patches.entries()) {
			this.patches[index].hide = patch.diff.indexOf(value) < 0;
		}
	}

	initEditor(editor: any, diff: string) {
		const decos: any[] = [];
		let lid = 0;
		diff.split('\n').map(line => {
			lid++;
			if (line[0] !== "+" && line[0] !== "-") {
				return;
			}
			decos.push({
				range: new monaco.Range(lid, 1, lid, 1),
				options: {
					isWholeLine: true,
					className: "glyph",
					glyphMarginClassName: line[0] === "+" ? "addGlyph" : "removeGlyph",
				},
			});
		})
		setTimeout(() => editor.createDecorationsCollection(decos), 100);
	}
}
