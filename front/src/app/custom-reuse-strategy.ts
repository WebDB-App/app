import {
	ActivatedRouteSnapshot,
	DetachedRouteHandle,
	RouteReuseStrategy,
} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
	routesToCache: string[] = ['explore', 'query', 'structure', 'insert', 'trigger', 'advanced'];
	storedRouteHandles = new Map<string, DetachedRouteHandle>();

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return this.routesToCache.indexOf(route.routeConfig!.path!) > -1;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		this.storedRouteHandles.set(route.routeConfig!.path!, handle);
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		return this.storedRouteHandles.has(route.routeConfig!.path!);
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		return this.storedRouteHandles.get(route.routeConfig!.path!)!;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		return future.routeConfig === curr.routeConfig;
	}
}
