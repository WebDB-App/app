import { Injectable } from "@angular/core";
import { Database } from "../classes/database";
import commonHelper from  "./common-helper.mjs";

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
		const single = commonHelper.singleLine(query.query);
		const index = queryHistory.findIndex(query => commonHelper.singleLine(query.query) === single);

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
