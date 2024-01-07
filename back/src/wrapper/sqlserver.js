import SQL from "../shared/sql.js";
import {Connection} from "tedious";
/*
import {writeFileSync} from "fs";
import bash from "../shared/bash.js";
import {loadData} from "../shared/buffer.js";
import {join} from "path";
import version from "../shared/version.js";
import {URL} from "url";


const dirname = new URL(".", import.meta.url).pathname;*/

export default class SQLServer extends SQL {

	stringEscape = "'";
	commonUser = ["sa"];
	commonPass = ["yourStrong(!)Password", "password_01", "<YourNewStrong!Passw0rd>"];
	systemDbs = [];

	async scan() {
		return super.scan(this.host, 1433, 1453);
	}

	async establish() {
		try {
			const creds = {
				server: this.host,
				authentication: {
					type: "default",
					options: {
						userName: this.user,
						password: this.password
					}
				},
				options: {
					database: "master",
					port: this.port,
					trustServerCertificate: true,
					encrypt: true,
					...this.params
				}
			};

			const pool = await new Connection(creds);
			const connection = await pool.connect();
			connection.release();

			return pool;
		} catch (e) {
			return {error: e.message};
		}
	}
}
