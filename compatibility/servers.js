const columns01 = {
	sql: [
		{name: "cId", type: "int", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "varchar(200)", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "json", nullable: false, defaut: null, extra: []}
	],
	nosql: [
		{name: "cId", type: "Number", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "String", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "Date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "Object", nullable: false, defaut: null, extra: []}
	]
}

export const mostPopularCurrencyPerContinent = {
	PostgreSQL: "SELECT c.name AS continent, STRING_AGG(subquery.currency, ', ') AS top_currencies FROM continent AS c JOIN ( SELECT co.continent_id, cu.name AS currency, COUNT(*) AS COUNT, ROW_NUMBER() OVER ( PARTITION BY co.continent_id ORDER BY COUNT(*) DESC ) AS RANK FROM country AS co JOIN currency_country AS cc ON co.id = cc.id_country JOIN currency AS cu ON cc.id_currency = cu.id GROUP BY co.continent_id, cu.name ) AS subquery ON c.id = subquery.continent_id WHERE subquery.rank <= 3 GROUP BY c.id, c.name",
	MySQL: "SELECT c.name AS continent, ( SELECT GROUP_CONCAT(subquery.currency ORDER BY subquery.count DESC SEPARATOR ', ') FROM ( SELECT cu.name AS currency, COUNT(*) AS count FROM country AS co JOIN currency_country AS cc ON co.id = cc.id_country JOIN currency AS cu ON cc.id_currency = cu.id WHERE co.continent_id = c.id GROUP BY cu.name ORDER BY COUNT(*) DESC LIMIT 3 ) AS subquery ) AS top_currencies FROM continent AS c",
	MongoDB: "db.collection(\"continent\").aggregate([ { $lookup: { from: \"country\", localField: \"_id\", foreignField: \"continent_id\", as: \"countries\" } }, { $unwind: \"$countries\" }, { $lookup: { from: \"currency_country\", localField: \"countries._id\", foreignField: \"id_country\", as: \"currency_countries\" } }, { $lookup: { from: \"currency\", localField: \"currency_countries.id_currency\", foreignField: \"_id\", as: \"currencies\" } }, { $unwind: \"$currencies\" }, { $group: { _id: \"$_id\", continent: { $first: \"$name\" }, currency: { $addToSet: \"$currencies.name\" }, count: { $sum: 1 } } }, { $project: { _id: 0, continent: \"$continent\", top_currencies: { $slice: [\"$currency\", 3] } } } ]).toArray()"
}

export default {
	mysql: {
		internal_port: 3306,
		external_port: 3307,
		columns: columns01.sql,
		docker: {
			name: "library/mysql",
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
			cmd: "mysqld --default-authentication-plugin=mysql_native_password"
		},
		wrapper: "MySQL",
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
		columns: columns01.sql,
		docker: {
			name: "library/mariadb",
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
		},
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
		columns: columns01.sql,
		docker: {
			exclusions: ["psmdb-"],
			name: "library/percona",
			env: ["MYSQL_ROOT_PASSWORD=notSecureChangeMe"],
		},
		wrapper: "MySQL",
		params: {
			dateStrings: true,
			multipleStatements: true,
			supportBigNumbers: true,
			bigNumberStrings: true
		}
	},
	mongo: {
		internal_port: 27017,
		external_port: 27017,
		columns: columns01.nosql,
		docker: {
			exclusions: ["windowsservercore", "nanoserver"],
			name: "library/mongo",
			env: ["MONGO_INITDB_ROOT_USERNAME=root", "MONGO_INITDB_ROOT_PASSWORD=notSecureChangeMe"],
		},
		wrapper: "MongoDB",
		params: {
			serverSelectionTimeoutMS: 2000,
			authSource: 'admin'
		}
	},
	postgres: {
		internal_port: 5432,
		external_port: 5432,
		columns: columns01.sql,
		wrapper: "PostgreSQL",
		docker: {
			name: "library/postgres",
			env: ["POSTGRES_USER=root", "POSTGRES_PASSWORD=notSecureChangeMe"]
		},
	},
	cockroachdb: {
		internal_port: 26257,
		external_port: 26257,
		columns: columns01.sql,
		wrapper: "PostgreSQL",
		docker: {
			name: "cockroachdb/cockroach",
			env: ["COCKROACH_USER=root", "COCKROACH_PASSWORD=notSecureChangeMe"],
			cmd: "start-single-node --insecure"
		}
	},
	yugabyte: {
		internal_port: 5433,
		external_port: 5433,
		columns: columns01.sql,
		wrapper: "PostgreSQL",
		docker: {
			name: "yugabytedb/yugabyte",
			env: ["YSQL_USER=root", "YSQL_PASSWORD=notSecureChangeMe"],
			cmd: "bin/yugabyted start --daemon=false"
		}
	}
}


