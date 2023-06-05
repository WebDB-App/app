import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'boolean'})
export class BooleanPipe implements PipeTransform {
	/**
	 *
	 * @param data
	 * @returns {string}
	 */
	transform(data: any): string {
		if (data === "true" || data === true) {
			return '✅';
		}
		if (data === "false" || data === false) {
			return '❌';
		}

		return data;
	}
}
