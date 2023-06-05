import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { Table } from "../../../classes/table";
import { DrawerService } from "../../../shared/drawer.service";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { RequestService } from "../../../shared/request.service";
import { Column } from "../../../classes/column";
import { Title } from "@angular/platform-browser";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

class Tab {
	link!: string
	icon!: string
}

export const Tabs: Tab[] = [
	{link: "Explore", icon: "quick_reference_all"},
	{link: "Query", icon: "code_blocks"},
	{link: "Structure", icon: "view_week"},
	{link: "Insert", icon: "note_add"},
	{link: "Trigger", icon: "device_hub"},
	{link: "Advanced", icon: "settings_applications"},
];

@Component({
	selector: 'app-tables',
	templateUrl: './tables.component.html',
	styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit, OnDestroy {

	obs?: Subscription;
	selectedDatabase?: Database;
	selectedServer?: Server;
	selectedTable?: Table;

	extend = true;
	tooltips: any = {};
	tabs = Tabs;

	constructor(
		private router: Router,
		private titleService: Title,
		private drawer: DrawerService,
		private request: RequestService,
		public breakpointObserver: BreakpointObserver,
		public activatedRoute: ActivatedRoute) {
	}

	async ngOnInit() {
		this.breakpointObserver
			.observe(['(min-width: 900px)'])
			.subscribe((state: BreakpointState) => this.extend = state.matches);

		this.obs = combineLatest([this.activatedRoute.paramMap, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.selectedDatabase = Database.getSelected();
			this.selectedServer = Server.getSelected();

			if (!this.selectedDatabase || !this.selectedDatabase.tables?.length) {
				return;
			}

			const tableName = _params[0].get('table') || this.selectedDatabase.tables[0].name;

			this.titleService.setTitle(tableName + " – " + this.selectedDatabase.name + " – " + this.selectedServer.port);

			this.selectedTable = this.selectedDatabase.tables.find(table => table.name === tableName);
			Table.setSelected(this.selectedTable!);

			if (!_params[0].get('table')) {
				await this.router.navigate([
					this.selectedServer.name,
					this.selectedDatabase.name,
					tableName]);
			}

			for (const table of this.selectedDatabase?.tables!) {
				this.tooltips[table.name] = this.getTooltip(table);
			}
		});
	}

	ngOnDestroy(): void {
		this.obs?.unsubscribe();
	}

	filterChanged(_value: string) {
		if (!this.selectedDatabase) {
			return;
		}

		const value = _value.toLowerCase();

		for (const [index, table] of this.selectedDatabase.tables!.entries()) {
			let match = table.name.toLowerCase().indexOf(value) > -1;
			match = match || (table.columns.findIndex(col => col.name.toLowerCase().indexOf(value) > -1) > -1);

			this.selectedDatabase.tables![index].hide = !match;
		}
	}

	getTooltip(table: Table) {
		const columns: string[] = [];
		const indexes = Table.getIndexes(table);
		const relations = Table.getRelations(table);

		for (const col of table.columns) {
			const relation = relations.find(relation => relation.column_source === col.name);
			const tags = Column.getTags(col, indexes, relation);

			let line = col.name
			line += tags.length ? (' | ' + tags.join(' ')) : '';

			columns.push(line);
		}

		table.columns.map(col => +' ' + (col.nullable ? ' ?' : ''))

		return columns.join("\n")
	}

	async addTable() {
		this.drawer.toggle();
		await this.router.navigate(
			[{outlets: {right: ['table', 'create']}}],
			{relativeTo: this.activatedRoute.parent})
	}

	async changeTable(name: string) {
		await this.router.navigateByUrl(this.router.url.replace(this.selectedTable!.name, name));
	}
}
