import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedComponent } from "./advanced/advanced.component";
import { RelationsComponent } from "./relations/relations.component";
import { LoadComponent } from "./load/load.component";
import { DumpComponent } from "./dump/dump.component";
import { DiagramComponent } from "./diagram/diagram.component";
import { AiComponent } from "./ai/ai.component";
import { HistoryComponent } from "./history/history.component";
import { TypesComponent } from "./types/types.component";

const routes: Routes = [
	{
		path: 'types',
		component: TypesComponent
	}, {
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
		path: 'history',
		component: HistoryComponent
	}, {
		path: 'advanced',
		component: AdvancedComponent
	}, {
		path: 'assistant',
		component: AiComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RightRoutingModule {
}
