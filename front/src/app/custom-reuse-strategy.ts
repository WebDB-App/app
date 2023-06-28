import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, UrlSegment, } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
	storedHandles: { [key: string]: DetachedRouteHandle } = {};

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return route.data['reuseRouteId'] || false;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		if (route.data['reuseRouteId']) {
			this.storedHandles[route.data['reuseRouteId']] = handle;
		}
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const handle = this.storedHandles[route.data['reuseRouteId']];
		return !!route.routeConfig && !!handle;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		if (!route.routeConfig || !this.storedHandles[route.data['reuseRouteId']]) {
			return null;
		}
		return this.storedHandles[route.data['reuseRouteId']];
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		return future.routeConfig === curr.routeConfig;
	}
}
