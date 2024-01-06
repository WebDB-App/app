import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import * as htmlToImage from 'html-to-image';
import { saveAs } from "file-saver-es";
import { DiagramController } from "./diagram";
import { Relation } from "../../../classes/relation";
import { Entity, Field, RelationType } from "./types";
import { Column } from "../../../classes/column";
import { DrawerService } from "../../../shared/drawer.service";
import { HoverService } from "../../../shared/hover.service";
import { Subscription } from "rxjs";

@Component({
	selector: 'app-diagram',
	templateUrl: './diagram.component.html',
	styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnDestroy {

	@ViewChild('container') container!: ElementRef;
	@ViewChild('scrollable') scrollable!: ElementRef;
	@ViewChild('fullScreen') fullScreen!: ElementRef;

	interval?: NodeJS.Timer;
	drawerObs!: Subscription;

	selectedServer!: Server;
	selectedDatabase!: Database;
	relations!: Relation[];

	initialized = false
	showDetails = true;
	diagramController?: DiagramController;
	zoom = 1;
	full = false;

	constructor(
		private hoverService: HoverService,
		private drawer: DrawerService
	) {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		this.relations = this.selectedServer.relations.filter(relation => relation.database === this.selectedDatabase.name);

		this.drawerObs = this.drawer.drawer.openedChange.subscribe((state) => {
			if (state && !this.initialized) {
				this.initialized = true
				this.prepareTables();
			}
		})
	}

	ngOnDestroy(): void {
		this.drawerObs.unsubscribe();
		clearInterval(this.interval);
	}

	/*
	Legend: Put real icon and SQL equivalent
	 */

	/*
	https://loopback.io/doc/en/lb4/HasManyThrough-relation.html

	 test if FK can be null, etc
	 create all relation possible :

	 FK non null -> PK
	 FK null -> PK
	 PK multi -> PK
	 FK to index


	 uml + hover PK multi FK : relations must be multiple
	 right click to change relation type ?
	*/

	prepareTables() {
		const positions = JSON.parse(localStorage.getItem('diagram-' + this.selectedDatabase.name) || '[]');
		const entities: Entity[] = [];
		const db_indexes = this.selectedServer.indexes.filter(index => index.database === this.selectedDatabase.name);

		for (const table of this.selectedDatabase.tables!) {
			if (!table.columns) {
				continue;
			}

			const indexes = db_indexes.filter(index => index.table === table.name);
			const entity = <Entity>{
				name: table.name,
				view: table.view,
				field_list: (new Array<Field>())
			};

			const position = positions.find((pos: any) => pos.table === table.name);
			if (position) {
				entity.position = {x: position.x, y: position.y}
			}

			for (const col of table.columns) {
				const relation = this.relations.find(relation => relation.table_source === table.name && relation.column_source === col.name);
				const ent = <Field>{
					name: col.name,
					type: col.type,
					tags: Column.getTags(col, indexes, relation)
				}

				if (relation) {
					let relationType: RelationType = ">-";
					const dest_col = this.selectedDatabase.tables!.find(table => relation.table_dest === table.name)!.columns.find(column => column.name === relation.column_dest)!;
					const dest_indexes = db_indexes.filter(index => index.table === relation.table_dest && index.columns.indexOf(dest_col.name) >= 0);

					if (col.nullable) {
						relationType = "0-"
					}

					ent.references = {
						table: relation.table_dest,
						field: relation.column_dest,
						name: relation.name,
						type: relationType!
					}

					/*if (relationDest) {
						ent.references = {
							table: relationDest.table_source,
							field: relationDest.column_source,
							name: relationDest.name,
							type: relationType!
						}
					}*/
				}

				this.zoom -= 0.002;
				entity.field_list.push(ent);
			}
			entities.push(entity)
		}

		this.zoom = this.zoom < 0.2 ? 0.2 : this.zoom;

		this.initDiagram(entities);
	}

	initDiagram(entities: Entity[]) {
		this.diagramController = new DiagramController(
			this.container.nativeElement,
			this.scrollable.nativeElement
		);

		this.interval = setInterval(() => {
			const positions: any[] = [];
			this.diagramController?.tableMap.forEach(table => {
				positions.push({table: table.data.name, x: table.translateX, y: table.translateY});
			})
			localStorage.setItem('diagram-' + this.selectedDatabase.name, JSON.stringify(positions));
		}, 2000);

		this.diagramController.render({
			table_list: entities,
			view: {x: 0, y: 0},
			zoom: this.zoom
		});

		for (const relation of this.relations) {
			this.hoverService.makeHover(this.container, relation.name);
		}
	}

	toggleDetail() {
		this.showDetails = !this.showDetails
		setTimeout(() => {
			this.diagramController!.applyFontSize()
		});
	}

	async openFullscreen() {
		const elem = this.fullScreen.nativeElement;

		if (document.fullscreenElement) {
			await document.exitFullscreen();
			this.full = false
		} else if (elem.requestFullscreen) {
			await elem.requestFullscreen();
			this.full = true
		}
	}

	async exportPng() {
		const blob = await htmlToImage.toBlob(this.container.nativeElement);
		saveAs(blob!, this.selectedDatabase.name + '.png');
	}

	async exportSvg() {
		const blob = await htmlToImage.toSvg(this.container.nativeElement);
		saveAs(blob!, this.selectedDatabase.name + '.svg');
	}

	protected readonly Math = Math;
}
