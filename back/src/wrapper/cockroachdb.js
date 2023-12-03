const PostgreSQL = require("./postgre.js");
const Driver = require("../shared/driver.js");

module.exports = class CockroachDB extends PostgreSQL {
	commonUser = ["", "postgres", "postgre"];
	commonPass = ["", "postgres", "postgre", "mysecretpassword"];
	systemDbs = ["information_schema", "pg_catalog", "pg_toast", "pg_extension", "crdb_internal"];

	async scan() {
		return Driver.prototype.scan.call(this, this.host, 26257, 26277);
	}

	// eslint-disable-next-line no-unused-vars
	async dump(dbSchema, exportType = "sql", tables, options = "") {
		return {error: "Feature not available due to the incompatibility of CockroachDB with pg_dump"};
	}

	async statsDatabase() {
		return undefined;
	}
};
