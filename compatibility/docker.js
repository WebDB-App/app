export const base = {
	MySQL: "MySQL",
	MongoDB: "MongoDB",
	PostgreSQL: "PostgreSQL"
};

export default {
	mariadb: {
		internal_port: 3306,
		external_port: 3308,
		docker: {
			name: "library/mariadb",
			env: ["MYSQL_ROOT_PASSWORD=\"pass#();\""],
		},
		waitCmd: "mariadb --user=\"root\" --password=\"pass#();\" --host=\"127.0.0.1\" --port=\"3306\"",
		base: base.MySQL,
		wrapper: "MySQL",
		params: {
			dateStrings: true,
			multipleStatements: true,
			supportBigNumbers: true,
			bigNumberStrings: true
		}
	},
	mysql: {
		internal_port: 3306,
		external_port: 3307,
		docker: {
			name: "library/mysql",
			env: ["MYSQL_ROOT_PASSWORD=\"pass#();\""],
			cmd: "mysqld"
		},
		waitCmd: "mysql --user=\"root\" --password=\"pass#();\" --host=\"127.0.0.1\" --port=\"3306\"",
		base: base.MySQL,
		wrapper: "MySQL",
		params: {
			dateStrings: true,
			multipleStatements: true,
			supportBigNumbers: true,
			bigNumberStrings: true
		}
	},
	percona: {
		internal_port: 3306,
		external_port: 3309,
		docker: {
			exclusions: ["psmdb-"],
			name: "library/percona",
			env: ["MYSQL_ROOT_PASSWORD=\"pass#();\""],
		},
		waitCmd: "mysql --user=\"root\" --password=\"pass#();\" --host=\"127.0.0.1\" --port=\"3306\"",
		base: base.MySQL,
		wrapper: "MySQL",
		params: {
			dateStrings: true,
			multipleStatements: true,
			supportBigNumbers: true,
			bigNumberStrings: true
		}
	},
	/*yugabyte: {
		internal_port: 5433,
		external_port: 5433,
		base: "PostgreSQL",
		docker: {
			name: "yugabytedb/yugabyte",
			env: ["YSQL_USER=root", "YSQL_PASSWORD=\"pass#();\""],
			cmd: "bin/yugabyted start --daemon=false"
		}
	},*/
	mongo: {
		internal_port: 27017,
		external_port: 27018,
		docker: {
			exclusions: ["windowsservercore", "nanoserver"],
			name: "library/mongo",
			env: ["MONGO_INITDB_ROOT_USERNAME=root", "MONGO_INITDB_ROOT_PASSWORD=\"pass#();\""],
		},
		waitCmd: "mongosh \"mongodb://root:pass%23()%3B@127.0.0.1:27017\"",
		base: base.MongoDB,
		wrapper: "MongoDB",
		params: {
			serverSelectionTimeoutMS: 2000,
			authSource: "admin"
		}
	},
	postgres: {
		internal_port: 5432,
		external_port: 5433,
		base: base.PostgreSQL,
		wrapper: "PostgreSQL",
		waitCmd: "psql \"postgresql://root:pass%23()%3B@127.0.0.3:5432\"",
		docker: {
			name: "library/postgres",
			env: ["POSTGRES_USER=root", "POSTGRES_PASSWORD=\"pass#();\""]
		},
	},
	cockroachdb: {
		internal_port: 26257,
		external_port: 26258,
		base: base.PostgreSQL,
		wrapper: "CockroachDB",
		waitCmd: "psql \"postgresql://root:pass%23()%3B@127.0.0.3:5432\"",
		docker: {
			name: "cockroachdb/cockroach",
			env: ["COCKROACH_USER=root", "COCKROACH_PASSWORD=\"pass#();\""],
			cmd: "start-single-node --insecure"
		}
	}
};


