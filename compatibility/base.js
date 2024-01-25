import {base} from "./docker.js";
import {post} from "./api.js";

export const tableForStruct = {
	Table: "tableTest01"
}
export const tableCity = {
	Table: "city"
}

export const columnsForTests = {
	[base.MySQL]: [
		{name: "cId", type: "int", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "varchar(200)", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "json", nullable: false, defaut: null, extra: []}
	],
	[base.PostgreSQL]: [
		{name: "cId", type: "int", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "character varying(200)", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "json", nullable: false, defaut: null, extra: []}
	],
	[base.MongoDB]: [
		{name: "cId", type: "Number", nullable: false, defaut: null, extra: []},
		{name: "cName", type: "String", nullable: false, defaut: "name", extra: []},
		{name: "cDate", type: "Date", nullable: false, defaut: null, extra: []},
		{name: "cBinary", type: "Object", nullable: false, defaut: null, extra: []}
	]
}

export const selectCitiesNumber = {
	[base.PostgreSQL]: `SELECT
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
	[base.MySQL]: `SELECT
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
	[base.MongoDB]: `db.collection("city").aggregate([
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

export let cityNumber = {};

export function initCityNumber() {
	cityNumber = {
		AF: 5541,
		AN: 3,
		AS: 30205,
		EU: 64779,
		NA: 29785,
		OC: 4714,
		SA: 6737
	}
}

export async function checkCityNumber(config) {
	const query = await post(`database/query`, {
		query: selectCitiesNumber[config.base],
		page: 0,
		pageSize: 100,
	});
	for (const [continent, nb] of Object.entries(cityNumber)) {
		const q = query.find(data => data.continent_name === continent);
		if (+q.city_count !== nb) {
			return false;
		}
	}
	return true;
}
