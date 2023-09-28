import PostgreSQL from "./postgre.js";
import Driver from "../shared/driver.js";

export default class CockroachDB extends PostgreSQL {
	commonUser = ["", "postgres", "postgre"];
	commonPass = ["", "postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast", "pg_extension", "crdb_internal"];

	async scan() {
		return Driver.prototype.scan.call(this, this.host, 26257, 26297);
	}
}
