import { ElementRef, Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class HoverService {

	constructor() {
	}

	makeHover(container: ElementRef, name: string) {
		const elms = container.nativeElement.getElementsByClassName(name);
		const classHover = 'hoverClass';

		function toggleClass(add: boolean) {
			for (let i = 0; i < elms.length; i++) {
				if (add) {
					(elms[i] as HTMLElement).classList.add(classHover)
				} else {
					(elms[i] as HTMLElement).classList.remove(classHover)
				}
			}
		}

		for (let i = 0; i < elms.length; i++) {
			(elms[i] as HTMLElement).onmouseover = function () {
				toggleClass(true);
			};
			(elms[i] as HTMLElement).onmouseout = function () {
				toggleClass(false);
			};
		}
	}
}
