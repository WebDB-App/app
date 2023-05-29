import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedComponent } from "./advanced/advanced.component";
import { RelationsComponent } from "./relations/relations.component";
import { LoadComponent } from "./load/load.component";
import { DumpComponent } from "./dump/dump.component";
import { DiagramComponent } from "./diagram/diagram.component";
import { CodeComponent } from "../../shared/code/code.component";
import { UpdateColumnComponent } from "./update-column/update-column.component";
import { AddColumnComponent } from "./add-column/add-column.component";
import { CreateTableComponent } from "./create-table/create-table.component";
import { AiComponent } from "./ai/ai.component";

const routes: Routes = [
	{
		path: 'relations',
		component: RelationsComponent
	}, {
		path: 'load',
		component: LoadComponent
	}, {
		path: 'dump',
		component: DumpComponent
	}, {
		path: 'diagram',
		component: DiagramComponent
	}, {
		path: 'code',
		component: CodeComponent
	}, {
		path: 'advanced',
		component: AdvancedComponent
	}, {
		path: 'assistant',
		component: AiComponent
	}, {
		path: 'column/update/:column',
		component: UpdateColumnComponent
	}, {
		path: 'column/add/:table',
		component: AddColumnComponent
	}, {
		path: 'table/create',
		component: CreateTableComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RightRoutingModule {
}
