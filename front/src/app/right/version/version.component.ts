import { Component, OnDestroy, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";

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
export class VersionComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;

	filter = "";
	isLoading = false;
	interval?: NodeJS.Timer;
	patches: Patch[] = [];
	editorOptions = {
		language: 'text',
		glyphMargin: true
	};

	constructor(
		private request: RequestService,
		public snackBar: MatSnackBar
	) {	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		const loop = async () => {
			await this.refreshData();
			setTimeout(() => loop(), 2000);
		};
		loop();
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	date(unix: string) {
		return (new Date(+unix)).toString();
	}

	identify(index: any, patch: Patch){
		return patch.sha1;
	}

	async refreshData() {
		this.patches = await this.request.post('version/list', undefined);
		this.filterChanged();
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
