import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
	/**
	 *
	 * @param sizeInOctet
	 * @returns {number}
	 */
	transform(sizeInOctet: number): number {
		return Math.floor(sizeInOctet / 1024 / 1024 * 100) / 100;
	}
}
