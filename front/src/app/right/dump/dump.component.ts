import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { RequestService } from "../../../shared/request.service";
import { environment } from "../../../environments/environment";
import { saveAs } from "file-saver-es";
import { isSQL } from "../../../shared/helper";

export class ItemTree {
	name?: string;
	children?: ItemTree[];
}

@Component({
	selector: 'app-dump',
	templateUrl: './dump.component.html',
	styleUrls: ['./dump.component.scss']
})
export class DumpComponent implements OnInit {

	selectedServer?: Server;
	selectedDatabase?: Database;

	isLoading = false;
	includeData = true;
	checklistSelection = new SelectionModel<ItemTree>(true);
	treeControl = new NestedTreeControl<ItemTree>(node => node.children);
	dataSource = new MatTreeNestedDataSource<ItemTree>();
	protected readonly isSQL = isSQL;

	constructor(private request: RequestService) {
	}

	ngOnInit(): void {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		const tree = new ItemTree();

		tree.name = this.selectedDatabase?.name;
		tree.children = this.selectedDatabase?.tables!.map(table => {
			return {name: table.name}
		});

		this.dataSource.data = [tree];

		this.treeControl.dataNodes = [tree];
		this.treeControl.expandAll()
		this.itemSelectionToggle(tree);
	}

	hasChild = (_: number, node: ItemTree) => !!node.children && node.children.length;

	descendantsAllSelected(node: ItemTree): boolean {
		const descendants = this.treeControl.getDescendants(node);
		return descendants.every(child => this.checklistSelection.isSelected(child));
	}

	descendantsPartiallySelected(node: ItemTree): boolean {
		const descendants = this.treeControl.getDescendants(node);
		const result = descendants.some(child => this.checklistSelection.isSelected(child));
		return result && !this.descendantsAllSelected(node);
	}

	itemSelectionToggle(node: ItemTree): void {
		this.checklistSelection.toggle(node);
		const descendants = this.treeControl.getDescendants(node);
		this.checklistSelection.isSelected(node)
			? this.checklistSelection.select(...descendants)
			: this.checklistSelection.deselect(...descendants);
	}

	async dump(type: string) {
		this.isLoading = true;
		try {
			const result = await this.request.post('server/dump', {
				exportType: type,
				tables: this.checklistSelection.selected.filter(select => !select.children).map(select => select.name),
				includeData: this.includeData
			});
			saveAs(environment.rootUrl + result.path, result.path.split('/')[1]);
		} catch (e) {}
		this.isLoading = false;
	}
}
