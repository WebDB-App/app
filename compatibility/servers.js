const columns01 = {
	mysql: [
		{name: "cId", type: "int", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "varchar(200)", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "json", nullable: false, defaut: null, extra: []}
	],
	postgre: [
		{name: "cId", type: "int", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "character varying(200)", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "json", nullable: false, defaut: null, extra: []}
	],
	mongo: [
		{name: "cId", type: "Number", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "String", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "Date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "Object", nullable: false, defaut: null, extra: []}
	]
}

export const citiesPerContinent = {
	PostgreSQL: `SELECT
	c.name AS continent_name,
	COUNT(ct.name) AS city_count
FROM
	continent c
	LEFT JOIN country cn ON c.id = cn.continent_id
	LEFT JOIN city ct ON cn.id = ct.country_id
GROUP BY
	continent_name
ORDER BY
	continent_name;`,
	MySQL: `SELECT
	c.name AS continent_name,
	COUNT(ct.name) AS city_count
FROM
	continent c
	LEFT JOIN country cn ON c.id = cn.continent_id
	LEFT JOIN city ct ON cn.id = ct.country_id
GROUP BY
	continent_name
ORDER BY
	continent_name;`,
	MongoDB: `db.collection("city").aggregate([
    {
        $lookup: {
            from: "country",
            localField: "country_id",
            foreignField: "_id",
            as: "country"
        }
    },
    {
        $lookup: {
            from: "continent",
            localField: "country.continent_id",
            foreignField: "_id",
            as: "continent"
        }
    },
    {
        $group: {
            _id: "$continent.name",
            city_count: { $sum: 1 }
        }
    },
    {
        $project: {
            continent_name: { $arrayElemAt: ["$_id", 0] },
            city_count: 1,
            _id: 0
        }
    },
    {
        $sort: {
            continent_name: 1
        }
    }
]).toArray()`
}

export default {
	mysql: {
		internal_port: 3306,
		external_port: 3307,
		columns: columns01.mysql,
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
		columns: columns01.mysql,
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
		columns: columns01.mysql,
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
	/*yugabyte: {
		internal_port: 5433,
		external_port: 5433,
		columns: columns01.sql,
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
		columns: columns01.mongo,
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
		columns: columns01.postgre,
		wrapper: "PostgreSQL",
		docker: {
			name: "library/postgres",
			env: ["POSTGRES_USER=root", "POSTGRES_PASSWORD=notSecureChangeMe"]
		},
	},
	cockroachdb: {
		internal_port: 26257,
		external_port: 26257,
		columns: columns01.postgre,
		wrapper: "PostgreSQL",
		docker: {
			name: "cockroachdb/cockroach",
			env: ["COCKROACH_USER=root", "COCKROACH_PASSWORD=notSecureChangeMe"],
			cmd: "start-single-node --insecure"
		}
	}
}


