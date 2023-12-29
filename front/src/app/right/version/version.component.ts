import { Component, OnDestroy } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { DrawerService } from "../../../shared/drawer.service";
import { Subscription } from "rxjs";

class Patch {
	diff?: string;
	hash!: string;
	time!: string;
	isLoading = false;
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
	isLoading = true;
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
		return patch.hash;
	}

	async refreshData() {
		const loop = async () => {
			if (!this.drawer.drawer.opened || !Database.getSelected()) {
				return;
			}
			this.isLoading = true;

			const patches: Patch[] = await this.request.post('version/list', undefined);
			for (const patch of patches) {
				if (!this.patches.find(pa => pa.hash === patch.hash)) {
					this.patches.push(patch);
				}
			}
			this.patches.sort((a, b) => +b.time - +a.time);

			this.filterChanged();
			setTimeout(() => loop(), 5000);
			this.isLoading = false;
		};

		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		loop();
	}

	filterChanged() {
		const value = this.filter.toLowerCase();
		for (const [index, patch] of this.patches.entries()) {
			if (!patch.diff) {
				continue;
			}
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

	reset(patch: Patch) {
		patch.isLoading = true;

		patch.isLoading = false;
	}

	async loadDiff(patch: Patch) {
		patch.isLoading = true;
		const res = await this.request.post('version/diff', patch);
		patch.diff = res.diff;
		patch.isLoading = false;
	}

	async load10() {
		for (const patch of this.patches.slice(0, 10)) {
			await this.loadDiff(patch);
		}
	}
}

/*
for remote, construct url from front
attetion si url accessible publiquement
tester avec docker image
 */
