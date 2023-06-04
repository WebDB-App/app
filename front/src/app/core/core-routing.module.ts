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
		component: ExploreComponent,
		data: {
			reuseRoute: true
		}
	}, {
		path: 'query',
		component: QueryComponent,
		data: {
			reuseRoute: true
		}
	}, {
		path: 'structure',
		component: StructureComponent,
		data: {
			reuseRoute: true
		}
	}, {
		path: 'insert',
		component: InsertComponent,
		data: {
			reuseRoute: true
		}
	}, {
		path: 'trigger',
		component: TriggerComponent,
		data: {
			reuseRoute: true
		}
	}, {
		path: 'advanced',
		component: TableAdvancedComponent,
		data: {
			reuseRoute: true
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CoreRoutingModule {
}
