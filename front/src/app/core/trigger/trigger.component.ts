import { Component, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../shared/request.service";
import { Trigger } from "../../../classes/trigger";
import { Server } from "../../../classes/server";
import { initBaseEditor, isSQL } from "../../../shared/helper";

@Component({
	selector: 'app-trigger',
	templateUrl: './trigger.component.html',
	styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit {

	selectedTable?: Table;
	triggers?: Trigger[];
	editorOptions = {
		language: ''
	};
	levels = [
		'strict',
		'moderate',
		'off'
	];
	actions = [
		'error',
		'warn'
	];
	timings = [
		'BEFORE',
		'AFTER'
	];
	events = [
		'INSERT',
		'UPDATE',
		'DELETE'
	];

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService,
		private activatedRoute: ActivatedRoute
	) {
		this.editorOptions.language = Server.getSelected()?.driver.trigger.language!;
	}

	async ngOnInit() {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			await this.loadData()
		});
	}

	async loadData() {
		this.selectedTable = Table.getSelected();
		this.triggers = await this.request.post('trigger/list', undefined);
	}

	add() {
		this.triggers?.push(new Trigger("", Server.getSelected()?.driver.trigger.base));
	}

	async delete(trigger: Trigger) {
		await this.request.post('trigger/drop', trigger);
		await this.loadData();
		this.snackBar.open(`Trigger deleted`, "╳", {duration: 3000});
	}

	async replace(trigger: Trigger) {
		await this.request.post('trigger/replace', trigger);
		await this.loadData();
		this.snackBar.open(`Trigger saved`, "╳", {duration: 3000});
	}

	protected readonly isSQL = isSQL;
	protected readonly initBaseEditor = initBaseEditor;
}
