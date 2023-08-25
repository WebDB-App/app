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

	selectedServer?: Server;
	selectedTable?: Table;
	templates!: string[];
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

	protected readonly isSQL = isSQL;
	protected readonly initBaseEditor = initBaseEditor;

	constructor(
		private snackBar: MatSnackBar,
		private request: RequestService,
		private activatedRoute: ActivatedRoute
	) {
		this.editorOptions.language = Server.getSelected()?.driver.trigger.language!;
	}

	async ngOnInit() {
		this.activatedRoute.parent?.params.subscribe(async (_params) => {
			await this.loadData();
		});
	}

	async loadData() {
		this.selectedTable = Table.getSelected();
		this.selectedServer = Server.getSelected();

		//enum for postgre
		//revoir base ?
		//this.templates =
		this.triggers = (await this.request.post('trigger/list', undefined)).map((trg: Trigger) => {trg.saved = true; return trg})
	}

	add() {
		this.triggers?.push(new Trigger(Server.getSelected()?.driver.trigger.base));
	}

	async delete(trigger: Trigger) {
		if (trigger.saved) {
			await this.request.post('trigger/drop', trigger);
			await this.loadData();
			this.snackBar.open(`Trigger deleted`, "╳", {duration: 3000});
		} else {
			this.triggers?.splice(this.triggers.findIndex(trg => JSON.stringify(trg) === JSON.stringify(trigger)))
		}
	}

	async replace(trigger: Trigger) {
		await this.request.post('trigger/replace', trigger);
		await this.loadData();
		this.snackBar.open(`Trigger saved`, "╳", {duration: 3000});
	}

	filterChanged(_value: string) {
		const value = _value.toLowerCase();
		this.triggers = this.triggers?.map(trg => {
			if (trg.name) {
				trg.hide = trg.name.toLowerCase().indexOf(value) < 0 && trg.code.toLowerCase().indexOf(value) < 0;
			} else {
				trg.hide = trg.code.toLowerCase().indexOf(value) < 0;
			}
			return trg;
		});
	}

	loadTemplate(name: string, trigger: Trigger) {
		switch (value) {
			case "delete":
				trigger.code = this.selectedServer!.driver.getTrigge(this.selectedTable!);
				break;
			case "insert":
				this.query = this.selectedServer!.driver.getBaseInsert(this.selectedTable!);
				break;
			case "update":
				this.query = this.selectedServer!.driver.getBaseUpdate(this.selectedTable!);
				break;
			case "select":
				this.query = this.selectedServer!.driver.getBaseSelect(this.selectedTable!);
				break;
			case "select_join":
				this.query = this.selectedServer!.driver.getBaseSelectWithRelations(this.selectedTable!, this.relations!);
				break;
			case "aggregate":
				this.query = this.selectedServer!.driver.getBaseAggregate!(this.selectedTable!);
				break;
		}
		setTimeout(() => this.editors.map(editor => editor.trigger("editor", "editor.action.formatDocument")), 1);
	}
}
