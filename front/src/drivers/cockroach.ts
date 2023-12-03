import { PostgreSQL } from "./postgresql";

export class CockroachDB extends PostgreSQL {

	constructor() {
		super();

		this.docs = {
			driver: "https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js",
			types: "https://www.postgresql.org/docs/current/datatype.html",
			language: "https://www.postgresql.org/docs/current/sql-commands.html",
			dump: ""
		}
	}
}
