import { Injectable } from "@angular/core";
import { Database } from "../classes/database";

export const maxHistory = 200;

export class Query {
	query: string;
	nbResult: number;
	star: boolean
	date: number;

	constructor(query: string, nbResult: number, star = false, date = Date.now()) {
		this.query = query;
		this.nbResult = nbResult;
		this.star = star;
		this.date = date;
	}
}

@Injectable({
	providedIn: 'root'
})
export class HistoryService {

	constructor() {
	}

	getLocal(database = Database.getSelected()): Query[] {
		const queries: Query[] = JSON.parse(localStorage.getItem("queries-" + database.name) || "[]");
		return queries.sort((q1, q2) => q1.star ? -1 : 1);
	}

	saveLocal(queries: Query[], database = Database.getSelected()) {
		queries = queries.slice(0, maxHistory);
		localStorage.setItem("queries-" + database.name, JSON.stringify(queries))
	}

	addLocal(query: Query) {
		let queryHistory = this.getLocal();
		if (queryHistory[0]?.query === query.query) {
			return;
		}
		this.saveLocal([query].concat(queryHistory));
	}
}
