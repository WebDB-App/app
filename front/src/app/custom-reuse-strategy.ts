import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, UrlSegment, } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
	storedHandles: { [key: string]: DetachedRouteHandle } = {};

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return route.data['reuseRoute'] || false;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		const id = this.createIdentifier(route);
		if (route.data['reuseRoute']) {
			this.storedHandles[id] = handle;
		}
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const id = this.createIdentifier(route);
		const handle = this.storedHandles[id];
		return !!route.routeConfig && !!handle;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		const id = this.createIdentifier(route);
		if (!route.routeConfig || !this.storedHandles[id]) {
			return null;
		}
		return this.storedHandles[id];
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		return future.routeConfig === curr.routeConfig;
	}

	private createIdentifier(route: ActivatedRouteSnapshot) {
		const segments: UrlSegment[][] = route.pathFromRoot.map(r => r.url);
		const subpaths = ([] as UrlSegment[]).concat(...segments).map(segment => segment.path);
		return segments.length + '-' + subpaths.join('/');
	}
}
