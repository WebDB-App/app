import { Component, OnDestroy, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { Router } from "@angular/router";
import { DiffEditorModel } from "ngx-monaco-editor-v2";

class Patch {
	hash!: string;
	time!: number;
	ago!: string;
	isLoading = false;
	left!: DiffEditorModel;
	right!: DiffEditorModel;

	timeSince(date: Date) {
		const seconds = Math.floor(((new Date()).getTime() - date.getTime()) / 1000);

		let interval = seconds / 31536000;
		if (interval > 1) {
			return Math.floor(interval) + " years";
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return Math.floor(interval) + " months";
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return Math.floor(interval) + " days";
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return Math.floor(interval) + " hours";
		}
		interval = seconds / 60;
		if (interval > 1) {
			return Math.floor(interval) + " minutes";
		}
		return Math.floor(seconds) + " seconds";
	}

	constructor(hash: string, time: number) {
		this.hash = hash;
		this.time = +time;
		this.ago = this.timeSince(new Date(this.time));
		this.left = {
			code: '',
			language: Server.getSelected().driver.language.id
		};
		this.right = {
			code: '',
			language: Server.getSelected().driver.language.id
		};
	}
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

	selectedPatch?: Patch;
	filter = "";
	isLoading = true;
	isResetting = false;
	isDestroyed = false;
	patches: Patch[] = [];
	editorOptions = {
		readOnly: true,
		language: ''
	};

	constructor(
		private request: RequestService,
		private router: Router,
		public snackBar: MatSnackBar
	) {
	}

	async ngOnInit() {
		const loop = async () => {
			if (this.isDestroyed || this.isResetting) {
				return;
			}
			this.isLoading = true;

			try {
				const patches: Patch[] = await this.request.post('version/list', undefined);
				for (const patch of patches) {
					if (!this.patches.find(pa => pa.hash === patch.hash)) {
						this.patches.push(new Patch(patch.hash, patch.time));
					}
				}
				this.patches.sort((a, b) => b.time - a.time);
			} catch (e) {
				console.error(e);
			}

			setTimeout(() => loop(), 5000);
			this.isLoading = false;
		};

		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		await loop();
	}

	ngOnDestroy() {
		this.isDestroyed = true;
	}

	date(unix: string) {
		return (new Date(+unix)).toString();
	}

	identify(index: any, patch: Patch) {
		return patch.hash;
	}

	async reset(patch: Patch) {
		patch.isLoading = this.isResetting = true;

		await this.request.post('version/reset', patch);
		await this.request.reloadServer();
		await this.router.navigate([
			'/',
			this.selectedServer?.name,
			this.selectedDatabase?.name
		]);
		this.snackBar.open(`Database reset to ${patch.hash}`, '⨉', {duration: 3000});

		patch.isLoading = this.isResetting = false;
	}

	async loadDiff(patch = this.selectedPatch) {
		if (!patch) {
			return;
		}
		if (patch.left.code || patch.right.code) {
			return;
		}

		patch.isLoading = true;

		const res = await this.request.post('version/diff', patch);
		for (const row of res.diff) {
			if (row[0] === '-' && row[1] !== '-') {
				patch.left.code += row.substring(1) + '\n';
			} else if (row[0] === '+' && row[1] !== '+') {
				patch.right.code += row.substring(1) + '\n';
			} else {
				patch.right.code += row + '\n';
				patch.left.code += row + '\n';
			}
		}

		patch.right.code = patch.right.code.replaceAll("),", "),\n");
		patch.left.code = patch.left.code.replaceAll("),", "),\n");

		patch.isLoading = false;
	}
}
