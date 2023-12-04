import MySQL from "./mysql.js";
import Driver from "../shared/driver.js";

export default class TiDB extends MySQL {
	commonUser = ["mysql", "maria", "mariadb"];
	commonPass = ["mysql", "my-secret-pw", "maria", "mariadb", "mypass"];
	systemDbs = ["information_schema", "mysql", "performance_schema", "sys"];

	async scan() {
		return Driver.prototype.scan.call(this, this.host, 4000, 4020);
	}
};
