import { Component, HostBinding, HostListener } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { isSQL } from "../../../shared/helper";

class Loads {
	name: string;
	text: string;
	file: File;
	editorOptions: {};

	constructor(name: string, text: string, file: File) {
		this.name = name;
		this.text = text;
		this.file = file;
		this.editorOptions = {
			language: this.name.toLowerCase().split('.')[1],
			readOnly: true,
			minimap: {enabled: true}
		}
	}
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
	folder = false;

	@HostBinding('class.blur') blur = false;

	constructor(
		private request: RequestService,
		private snackBar: MatSnackBar,
	) {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		this.acceptedExt = this.selectedServer?.driver.connection.acceptedExt!;
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

	async importFiles(database: string) {
		this.isLoading = true;

		const formData: FormData = new FormData();
		for (const file of this.files) {
			formData.append("files[]", file.file, file.name);
		}

		try {
			await this.request.post('server/load?folder=' + this.folder, formData, undefined, <Database>{name: database});
		} catch (err: unknown) {
			this.isLoading = false;
			return;
		}

		this.snackBar.open("Import succeed", "╳", {duration: 3000})
		await this.request.reloadServer();
		this.isLoading = false;
	}

	async setImport(files: any[]) {
		this.files = this.files.concat(await Promise.all(files.filter(file => {
			const end = this.acceptedExt.some(name => {
				return file.name.toLowerCase().endsWith(name);
			});
			if (!end) {
				this.snackBar.open("File format not supported", "╳", {panelClass: 'snack-error'})
				return false;
			}
			return file;
		}).map(async file => {
			return new Loads(file.name, await file.text(), file);
		})));
	}

	async inputChange(fileInputEvent: any) {
		if (!fileInputEvent.target.files) {
			return;
		}
		await this.setImport(Array.from(fileInputEvent.target.files));
	}

	arrayMove(arr: any[], fromIndex: number, toIndex: number) {
		const element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
	}

	protected readonly isSQL = isSQL;
}
