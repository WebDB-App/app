import { Component, HostBinding, HostListener } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { ActivatedRoute } from "@angular/router";

interface Loads {
	name: string;
	text: string;
	file: File;
	progress: number;
}

@Component({
	selector: 'app-load',
	templateUrl: './load.component.html',
	styleUrls: ['./load.component.scss']
})
export class LoadComponent {

	isLoading = false;
	selectedDatabase!: Database;
	selectedServer!: Server;
	files: Loads[] = [];
	acceptedExt!: string[];
	editorOptions = {
		language: '',
		readOnly: true,
		minimap: {enabled: true}
	};
	@HostBinding('class.blur') blur = false;

	constructor(
		private request: RequestService,
		private route: ActivatedRoute,
		private _snackBar: MatSnackBar,
	) {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		this.editorOptions.language = this.selectedServer?.driver?.language!;
		this.acceptedExt = this.selectedServer?.driver?.acceptedExt!;
	}

	@HostListener('dragover', ['$event'])
	dragOver(event: any) {
		event.preventDefault();
		event.stopPropagation();
		this.blur = true;
	}

	@HostListener('dragleave', ['$event'])
	public dragLeave(event: any) {
		event.preventDefault();
		event.stopPropagation();
		this.blur = false;
	}

	@HostListener('drop', ['$event'])
	public async drop(event: any) {
		event.preventDefault();
		event.stopPropagation();
		this.blur = false;

		if (!event.dataTransfer.files) {
			return;
		}

		await this.setImport(Array.from(event.dataTransfer.files));
	}

	async importFiles() {
		this.isLoading = true;

		for (const file of this.files) {
			if (file.progress === 100) {
				continue;
			}

			const formData: FormData = new FormData();
			formData.append('file', file.file, file.name);

			file.progress = 30;

			try {
				await this.request.post('server/load', formData,
					undefined, undefined, undefined,
				);
			} catch (err: unknown) {
				file.progress = -1;
				this.isLoading = false;
				return;
			}

			file.progress = 100;
		}

		this._snackBar.open("Import Succeed", "╳", {duration: 3000})
		await this.request.reloadDbs();
		this.isLoading = false;
	}

	async setImport(files: any[]) {
		this.files = this.files.concat(await Promise.all(files.filter(file => {
			const end = this.acceptedExt.some(name => {
				return file.name.endsWith(name);
			});
			if (!end) {
				this._snackBar.open("File format not supported", "╳", {panelClass: 'snack-error'})
				return false;
			}
			return file;
		}).map(async file => {
			return <Loads>{
				name: file.name,
				text: await file.text(),
				file: file,
				progress: 0,
			}
		})));
	}

	async inputChange(fileInputEvent: any) {
		if (!fileInputEvent.target.files) {
			return;
		}
		await this.setImport(Array.from(fileInputEvent.target.files));
	}
}
