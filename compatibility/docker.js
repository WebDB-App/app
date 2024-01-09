export const wrapper = {
	MySQL: "MySQL",
	MongoDB: "MongoDB",
	PostgreSQL: "PostgreSQL"
}

export default {
	mysql: {
		internal_port: 3306,
		external_port: 3307,
		docker: {
			name: "library/mysql",
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
			cmd: "mysqld --default-authentication-plugin=mysql_native_password"
		},
		wrapper: wrapper.MySQL,
		params: {
			dateStrings: true,
			multipleStatements: true,
			supportBigNumbers: true,
			bigNumberStrings: true
		}
	},
	mariadb: {
		internal_port: 3306,
		external_port: 3308,
		docker: {
			name: "library/mariadb",
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
		},
		wrapper: wrapper.MySQL,
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
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
		},
		wrapper: wrapper.MySQL,
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
		wrapper: "PostgreSQL",
		docker: {
			name: "yugabytedb/yugabyte",
			env: ["YSQL_USER=root", "YSQL_PASSWORD=notSecureChangeMe"],
			cmd: "bin/yugabyted start --daemon=false"
		}
	},*/
	mongo: {
		internal_port: 27017,
		external_port: 27017,
		docker: {
			exclusions: ["windowsservercore", "nanoserver"],
			name: "library/mongo",
			env: ["MONGO_INITDB_ROOT_USERNAME=root", "MONGO_INITDB_ROOT_PASSWORD=notSecureChangeMe"],
		},
		wrapper: wrapper.MongoDB,
		params: {
			serverSelectionTimeoutMS: 2000,
			authSource: 'admin'
		}
	},
	postgres: {
		internal_port: 5432,
		external_port: 5432,
		wrapper: wrapper.PostgreSQL,
		docker: {
			name: "library/postgres",
			env: ["POSTGRES_USER=root", "POSTGRES_PASSWORD=notSecureChangeMe"]
		},
	},
	cockroachdb: {
		internal_port: 26257,
		external_port: 26257,
		wrapper: wrapper.PostgreSQL,
		docker: {
			name: "cockroachdb/cockroach",
			env: ["COCKROACH_USER=root", "COCKROACH_PASSWORD=notSecureChangeMe"],
			cmd: "start-single-node --insecure"
		}
	}
}


