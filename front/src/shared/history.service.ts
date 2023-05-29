import { Injectable } from "@angular/core";
import { Database } from "../classes/database";

export class Query {
	query!: string;
	nbResult!: number;
	star? = false;
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
		queries = queries.slice(0, 500);
		localStorage.setItem("queries-" + database.name, JSON.stringify(queries))
	}
}
