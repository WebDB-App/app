import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";

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
export class VersionComponent implements OnInit {

	selectedServer?: Server;
	selectedDatabase?: Database;

	filter = "";
	isLoading = true;
	isResetting = false;
	patches: Patch[] = [];
	editorOptions = {
		language: 'text',
		glyphMargin: true
	};

	constructor(
		private request: RequestService,
		public snackBar: MatSnackBar
	) {}

	async ngOnInit() {
		const loop = async () => {
			this.isLoading = true;

			try {
				const patches: Patch[] = await this.request.post('version/list', undefined);
				for (const patch of patches) {
					if (!this.patches.find(pa => pa.hash === patch.hash)) {
						this.patches.push(patch);
					}
				}
				this.patches.sort((a, b) => +b.time - +a.time);
			} catch (e) {
				console.error(e);
			}

			this.filterChanged();
			setTimeout(() => loop(), 5000);
			this.isLoading = false;
		};

		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		loop();
	}

	date(unix: string) {
		return (new Date(+unix)).toString();
	}

	identify(index: any, patch: Patch) {
		return patch.hash;
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

	async reset(patch: Patch) {
		patch.isLoading = this.isResetting = true;

		await this.request.post('version/reset', patch);
		await this.request.reloadServer();
		this.snackBar.open(`Database reset to ${patch.hash}`, '⨉', {duration: 3000});

		patch.isLoading = this.isResetting = false;
	}

	async loadDiff(patch: Patch) {
		patch.isLoading = true;

		const res = await this.request.post('version/diff', patch);
		patch.diff = res.diff;

		patch.isLoading = false;
	}

	async load10() {
		let count = 0;
		for (const patch of this.patches) {
			if (patch.diff) {
				continue;
			}
			await this.loadDiff(patch);
			if (++count >= 10) {
				break;
			}
		}
	}
}
