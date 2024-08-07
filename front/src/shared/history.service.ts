import { Injectable } from "@angular/core";
import { getStorageKey, singleLine } from "./helper";

const maxHistory = 100;

export class Query {
	query: string;
	nbResult: number;
	star: boolean
	date: number;
	occurrence: number

	constructor(query: string, nbResult: number, star = false, date = Date.now(), occurrence = 1) {
		this.query = query;
		this.nbResult = nbResult;
		this.star = star;
		this.date = date;
		this.occurrence = occurrence;
	}
}

@Injectable({
	providedIn: 'root'
})
export class HistoryService {

	constructor() {
	}

	getLocal(): Query[] {
		const queries: Query[] = JSON.parse(localStorage.getItem(getStorageKey("queries")) || "[]");
		return queries.sort((q1, q2) => q1.star ? -1 : 1);
	}

	saveLocal(queries: Query[]) {
		queries = queries.slice(0, maxHistory);
		localStorage.setItem(getStorageKey("queries"), JSON.stringify(queries))
	}

	addLocal(query: Query) {
		let queryHistory = this.getLocal();
		const single = singleLine(query.query);
		const index = queryHistory.findIndex(query => singleLine(query.query) === single);

		if (index < 0) {
			queryHistory = [query].concat(queryHistory);
		} else {
			queryHistory[index].occurrence++;
			queryHistory[index].date = Date.now();
			queryHistory[index].nbResult = query.nbResult;
		}

		this.saveLocal(queryHistory);
	}
}
