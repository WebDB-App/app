import { Component, OnDestroy, OnInit } from '@angular/core';
import { Table } from "../../../classes/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../shared/request.service";
import { Trigger } from "../../../classes/trigger";
import { Server } from "../../../classes/server";

@Component({
	selector: 'app-trigger',
	templateUrl: './trigger.component.html',
	styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit, OnDestroy {

	selectedTable?: Table;
	obs!: Subscription;
	triggers?: Trigger[];
	editorOptions = {
		language: ''
	};
	timings = [
		'BEFORE',
		'AFTER'
	]
	events = [
		'INSERT',
		'UPDATE',
		'DELETE'
	]

	constructor(
		private _snackBar: MatSnackBar,
		private request: RequestService,
		private activatedRoute: ActivatedRoute
	) {
		this.editorOptions.language = Server.getSelected()?.driver?.language!;
	}

	async ngOnInit() {
		this.obs = combineLatest([this.activatedRoute.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			await this.loadData()
		});
	}

	ngOnDestroy(): void {
		this.obs.unsubscribe();
	}

	async loadData() {
		this.selectedTable = Table.getSelected();
		this.triggers = await this.request.post('trigger/list', undefined);
	}

	add() {
		this.triggers?.push(<Trigger>{});
	}

	async delete(trigger: Trigger) {
		if (trigger.name) {
			await this.request.post('trigger/drop', trigger);
		}
		await this.loadData();
		this._snackBar.open(`Trigger deleted`, "╳", {duration: 3000});
	}

	async replace(trigger: Trigger) {
		await this.request.post('trigger/replace', trigger);
		await this.loadData();
		this._snackBar.open(`Trigger saved`, "╳", {duration: 3000});
	}
}
