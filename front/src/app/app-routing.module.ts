import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from "./container/container.component";
import { environment } from "../environments/environment";
import { TablesComponent } from "./core/tables/tables.component";
import { ServersComponent } from "./container/servers/servers.component";

const appRoutes: Routes = [
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
	}, {
		path: '',
		component: ContainerComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: ServersComponent
			}
		]
	}
];

if (environment.production) {
	appRoutes.push({path: '**', redirectTo: '/'});
}

@NgModule({
	imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
