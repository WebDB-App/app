import { Pipe, PipeTransform } from "@angular/core";
import { isSQL } from "./helper";
import { Server } from "../classes/server";

@Pipe({name: 'is_sql'})
export class IsSQLPipe implements PipeTransform {
	/**
	 *
	 * @param server
	 * @returns {boolean}
	 */
	transform(server: Server): boolean {
		return isSQL(server);
	}
}
