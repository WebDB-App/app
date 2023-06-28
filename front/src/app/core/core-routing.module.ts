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
			reuseRouteId: 'explore'
		}
	}, {
		path: 'query',
		component: QueryComponent,
		data: {
			reuseRouteId: 'query'
		}
	}, {
		path: 'structure',
		component: StructureComponent,
		data: {
			reuseRouteId: 'structure'
		}
	}, {
		path: 'insert',
		component: InsertComponent,
		data: {
			reuseRouteId: 'insert'
		}
	}, {
		path: 'trigger',
		component: TriggerComponent,
		data: {
			reuseRouteId: 'trigger'
		}
	}, {
		path: 'advanced',
		component: TableAdvancedComponent,
		data: {
			reuseRouteId: 'advanced'
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CoreRoutingModule {
}

