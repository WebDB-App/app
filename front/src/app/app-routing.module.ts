import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from "./container/container.component";
import { environment } from "../environments/environment";
import { ConnectionComponent } from "./connection/connection.component";
import { TablesComponent } from "./tables/tables.component";

const appRoutes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: ConnectionComponent,
	},
	{
		path: ':server/:database',
		component: ContainerComponent,
		children: [
			{
				path: '',
				outlet: 'right',
				loadChildren: () => import('./right/right.module').then(m => m.RightModule)
			}, {
				path: ':table',
				component: TablesComponent,
				loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
			}, {
				path: '',
				component: TablesComponent,
			}
		]
	}
];

if (environment.production) {
	appRoutes.push({path: '**', redirectTo: '/'});
}

@NgModule({
	imports: [RouterModule.forRoot(appRoutes, {
		useHash: true,
		//enableTracing: true
	})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
