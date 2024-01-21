import { Driver, Group, QueryParams } from "../classes/driver";
import { Column } from "../classes/column";
import { Table } from "../classes/table";
import { Relation } from "../classes/relation";
import { HttpClient } from "@angular/common/http";
import { Database } from "../classes/database";
import { loadLibAsset, mongo_injectAggregate } from "../shared/helper";
import { Server } from "../classes/server";
import { Configuration } from "../classes/configuration";
import * as bson from "bson";
import jsbeautifier from "js-beautify";

declare var monaco: any;

export class MongoDB implements Driver {

	configuration: Configuration = new Configuration();

	connection = {
		defaultParams: {
			serverSelectionTimeoutMS: 2000,
			authSource: 'admin'
		},
		acceptedExt: ['.csv', '.tsv', '.json', '.gz', '.bson'],
		fileTypes: [
			{extension: "bson", name: "BSON", native: true},
			{extension: "json", name: "JSON"},
		],
		defaultDumpOptions: "--gzip"
	}

	docs = {
		driver: "https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/",
		types: "https://www.mongodb.com/docs/manual/reference/bson-types/",
		language: "https://www.mongodb.com/docs/drivers/node/current/quick-reference/",
		dump: "https://www.mongodb.com/docs/database-tools/mongodump/#options"
	}

	language = {
		extendedJSONDoc: "https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#examples",
		comparators: [
			{symbol: '$gt', example: "", definition: "More than"},
			{symbol: '$lt', example: "", definition: "Less than"},
			{symbol: '$gte', example: "0", definition: "More or equal than"},
			{symbol: '$lte', example: "0", definition: "Less or equal than"},
			{symbol: '$eq', example: '"abc"', definition: "Strictly equal to"},
			{symbol: '$ne', example: "'abc'", definition: "Strictly different to"},
			{symbol: '$in', example: '["a", "b"]', definition: "If the array contain a least one match"},
			{symbol: '$all', example: '["a", "b"]', definition: "If the array contains all elements"},
			{symbol: '$exists', example: 'true', definition: "If the property exist"},
			{symbol: '$range', example: '"a" AND "z"', definition: "If in the range of"},
			{symbol: '$regex', example: '/[a-z]/', definition: "If match regex"},
			{symbol: '$text', example: '{ $search: "abc" }', definition: "Search text"},
			{symbol: '$nin', example: '["a", "b"]', definition: "Is not in array of"},
		],
		id: "javascript",
		extension: "js",
		arrayType: true,
		fctAsDefault: [],
		keywords: [],
		functions: {},
		constraints: [],
		typeGroups: [
			{
				name: Group.String,
				list: [{
					id: "String",
					bold: true,
					description: "BSON strings are UTF-8"
				}, {
					id: "UUID",
					bold: false,
					description: "Specify a 36 character string to convert to a UUID BSON object"
				}, {
					id: "ObjectId",
					bold: true,
					description: "ObjectIds are small, likely unique, fast to generate, and ordered"
				}]
			},
			{
				name: Group.Numeric,
				list: [{
					id: "Number",
					bold: true,
					description: "Represent floating-point numbers"
				}, {
					id: "Boolean",
					bold: true,
					description: ""
				}]
			},
			{
				name: Group.Blob,
				list: [{
					id: "Binary",
					bold: false,
					description: "A BSON binary binData value is a byte array"
				}]
			},
			{
				name: Group.Date,
				list: [{
					id: "Timestamp",
					bold: true,
					description: "BSON has a special timestamp type for internal MongoDB"
				}, {
					id: "Date",
					bold: true,
					description: "64-bit integer that represents the number of milliseconds since the Unix epoch"
				}]
			},
			{
				name: Group.Complex,
				list: [{
					id: "Code",
					bold: false,
					description: "JavaScript code"
				}, {
					id: "MinKey",
					bold: false,
					description: "MinKey and MaxKey are used in comparison operations and exist primarily for internal use"
				}, {
					id: "MaxKey",
					bold: false,
					description: "MinKey and MaxKey are used in comparison operations and exist primarily for internal use"
				}, {
					id: "RegExp",
					bold: false,
					description: "Regular expression - The first cstring is the regex pattern, the second is the regex options string"
				}]
			}
		],
		extraAttributes: []
	}
	queryTemplates = {
		"find": (table: Table) => {
			return `/*
const db = (await new MongoClient()).db("${Database.getSelected().name}");
const bson from "bson");
*/

db.collection("${table.name}").find({
	${this.getColumns(table).join(",\n\t")}
}).toArray();`;
		},
		"deleteOne": (table: Table) => {
			return `db.collection("${table.name}").deleteOne({${this.getColumns(table).join(",\n")}})`;
		},
		"insertOne": (table: Table) => {
			return `db.collection("${table.name}").insertOne({${this.getColumns(table).join(",\n")}})`;
		},
		"updateOne": (table: Table) => {
			const cols = this.getColumns(table);
			return `db.collection("${table.name}").updateOne(
				{${cols.join(", ")}},
				{${cols.join(", ")}}
			)`;
		},
		"lookup": (table: Table, relations: Relation[]) => {
			return `db.collection("${table.name}").aggregate([
	{
		${relations.map(rel => `$lookup: {
			from: "${rel.table_dest}",
			localField: "${rel.column_source}",
			foreignField: "${rel.column_dest}",
			as: "fks"
		}`)}
	}]).toArray();
		`;
		},
		"aggregate": (table: Table) => {
			return `/*
const db = (await new MongoClient()).db("${Database.getSelected().name}");
const bson from "bson");
*/
db.collection("${table.name}").aggregate([
	{
		$match: { ${table.columns[0].name}: "${table.columns[0].type}" }
	},
	{
		$group: { _id: "$${table.columns[0].name}" }
	}
]).toArray()`;
		},
		"command (shell)": () => {
			return `db.command({
    dbStats: 1,
});`;
		},
	};

	nodeLib(query: QueryParams) {
		return `import {MongoClient} from "mongodb";

async function main() {
	const db = (await new MongoClient(
		"mongodb://${Server.getSelected().user}:${Server.getSelected().password}@${Server.getSelected().host}:${Server.getSelected().port}}/"
	)).db("${Database.getSelected().name}");

	await ${query.query}
}`;
	};

	extractConditionParams(query: string): QueryParams {
		return <QueryParams>{
			query
		};
	}

	async loadExtraLib(http: HttpClient) {
		await loadLibAsset(http, ['mongo.d.ts', 'bson.d.ts']);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			`import * as bsonModule from "bson.d.ts";
			import * as mongoModule from "mongo.d.ts";

			declare global {
				var mongo: typeof mongoModule;
				var bson: typeof bsonModule;
				var db: mongoModule.Db;
			}`,
			`file:///main.tsx`
		);
	}

	wrapValue(type: any, value: string) {
		if (Object.keys(bson).indexOf(type) >= 0) {
			return `new bson.${type}("${value}")`;
		}
		if (type === 'Date') {
			return `new Date("${value}")`;
		}
		return `"${value}"`;
	}

	quickSearch(driver: Driver, column: Column, value: string) {
		let chip = `{${column.name}: { `;
		const comp = driver.language.comparators.find((comparator) => {
			return value.toLowerCase().startsWith(comparator.symbol + ' ')
		});
		if (comp) {
			chip += `${comp.symbol}: ${value.replace(comp.symbol, '')}`;
		} else {
			chip += `$eq: ${this.wrapValue(column.type, value)}`;
		}

		return chip + '}}';
	}

	basicFilter(table: Table, conditions: string[], operand: 'AND' | 'OR') {
		let filter = '';

		if (conditions.length > 0) {
			filter = `{$${operand.toLowerCase()}: [${conditions.map(cond => cond)}]}`;
		}

		return `db.collection("${table.name}").find(${filter}).toArray()`;
	}

	basicSort(query: string, field: string, direction: 'asc' | 'desc') {
		if (query.indexOf(".aggregate(") >= 0) {
			const s: any = {$sort: {}};
			s.$sort[field] = direction === "asc" ? 1 : -1;
			query = mongo_injectAggregate(query, s);
		}

		if (query.indexOf(".find(") > 0) {
			query = query.replace(".toArray()", "");
			query = `${query}.sort({${field}: ${direction === "asc" ? 1 : -1}}).toArray()`;
		}

		return query;
	}

	extractForView(query: string) {
		if (query.indexOf(".aggregate(") < 0) {
			return false;
		}
		const r = /\.aggregate\(([^)]+)\)/.exec(query);
		return r ? r[1] : "[]";
	}

	extractEnum(col: Column): string[] | false {
		return false;
	}

	getColumns(table: Table) {
		const cols = [];
		for (const column of table.columns) {
			let col = `"${column.name}": `;
			if (Array.isArray(column.type)) {
				col += JSON.stringify(column.type);
			} else {
				col += `"${column.type}"`;
			}
			cols.push(col);
		}
		return cols;
	}

	format(code: string) {
		return jsbeautifier.js_beautify(code);
	}
}
