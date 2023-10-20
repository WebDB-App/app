import { MySQL } from "./mysql";

export class TiDB extends MySQL {

	constructor() {
		super();

		this.docs = {
			driver: "https://github.com/sidorares/node-mysql2/blob/master/typings/mysql/lib/Connection.d.ts",
			types: "https://docs.pingcap.com/tidb/stable/data-type-overview",
			language: "https://docs.pingcap.com/tidb/stable/expression-syntax"
		}
	}
}
