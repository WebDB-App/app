import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from "./explore/explore.component";
import { QueryComponent } from "./query/query.component";
import { InsertComponent } from "./insert/insert.component";
import { TableAdvancedComponent } from "./advanced/advanced.component";
import { StructureComponent } from "./structure/structure.component";
import { TriggerComponent } from "./trigger/trigger.component";

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'explore',
	}, {
		path: 'explore',
		component: ExploreComponent
	}, {
		path: 'query/:code',
		component: QueryComponent,
	}, {
		path: 'query',
		pathMatch: 'full',
		redirectTo: 'query/'
	}, {
		path: 'structure',
		component: StructureComponent
	}, {
		path: 'insert',
		component: InsertComponent
	}, {
		path: 'trigger',
		component: TriggerComponent
	}, {
		path: 'advanced',
		component: TableAdvancedComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CoreRoutingModule {
}

