import { Driver, QueryParams } from "../driver";
import { Column } from "../column";
import { Table } from "../table";
import { Relation } from "../relation";
import { HttpClient } from "@angular/common/http";
import { Database } from "../database";
import { loadLibAsset } from "../../shared/helper";
import { Server } from "../server";
import { Configuration } from "../configuration";
import helper from "../../shared/shared-helper.mjs";

declare var monaco: any;

export class MongoDB implements Driver {

	configuration: Configuration = new Configuration();

	connection = {
		defaultParams: {
			serverSelectionTimeoutMS: 2000,
			authSource: 'admin'
		},
		acceptedExt: ['.csv', '.tsv', '.json', '.gz'],
		nameDel: this.configuration.getByName("useNameDel")?.value ? '"' : '',
		fileTypes: [
			{extension: "json", name: "JSON"},
			{extension: "bson", name: "BSON"},
		]
	}

	docs = {
		driver: "https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/",
		types: "https://www.mongodb.com/docs/manual/reference/bson-types/",
		language: "https://www.mongodb.com/docs/drivers/node/current/quick-reference/"
	}

	trigger = {
		base: `{
	"$jsonSchema": {
		"bsonType": "object",
		"description": "Document describing a mountain peak",
		"required": ["name"],
		"properties": {
			"name": {
				"bsonType": "string",
				"description": "Name must be a string and is required"
			}
		}
	}
}`,
		language: "json"
	}

	language = {
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
			{symbol: '$regexMatch', example: '/[a-z]/', definition: "If match regex"},
			{symbol: '$text', example: ': { $search: "abc" }', definition: "Search text"},
			{symbol: '$nin', example: '["a", "b"]', definition: "Is not in array of"},
		],
		id: "javascript",
		ownType: true,
		arrayType: true,
		fctAsDefault: [],
		keywords: [],
		functions: {},
		constraints: [],
		typeGroups: [
			/*{
				name: Group.String,
				proposition: ["String"],
				full: ["String"],
			}*/
		],
		extraAttributes: []
	}

	nodeLib(query: QueryParams) {
		return `import {MongoClient} from "mongodb";

async function main() {
	const db = (await new MongoClient(
		"mongodb://${Server.getSelected().user}:${Server.getSelected().password}@${Server.getSelected().host}:${Server.getSelected().port}}/"
	)).db("${Database.getSelected().name}");

	${query.query}
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

	quickSearch(driver: Driver, column: Column, value: string) {
		const wrapValue = (value: string) => {
			switch (column.type) {
				case 'ObjectId':
					return `new bson.ObjectId("${value}")`;
				case "Date":
					return `new Date("${value}")`;
				case "String":
					return `"${value}"`;
				default:
					return value;
			}
		}

		let chip = `{${column.name}: { `;
		const comp = driver.language.comparators.find((comparator) => {
			return value.toLowerCase().startsWith(comparator.symbol + ' ')
		});
		if (comp) {
			chip += `${comp.symbol}: ${value.replace(comp.symbol, '')}`;
		} else {
			chip += `$eq: ${wrapValue(value)}`;
		}

		return chip + '}}';
	}

	getBaseFilter(table: Table, conditions: string[], operand: 'AND' | 'OR') {
		let filter = '';

		if (conditions.length > 0) {
			filter = `{$${operand.toLowerCase()}: [${conditions.map(cond => cond)}]}`;
		}

		return `db.collection("${table.name}").find(${filter}).toArray()`;
	}

	extractForView(query: string) {
		if (query.indexOf(".aggregate(") < 0) {
			return false;
		}
		const r = /\.aggregate\(([^)]+)\)/.exec(query);
		return r ? r[0] : "[]";
	}

	extractEnum(col: Column): string[] | false {
		return false;
	}

	getBaseDelete(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: "${column.type}"`);
		return `db.collection("${table.name}").deleteOne({${cols.join(",\n")}})`;
	}

	getBaseInsert(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: "${column.type}"`);
		return `db.collection("${table.name}").insertOne({${cols.join(",\n")}})`;
	}

	getBaseUpdate(table: Table) {
		const cols = table.columns.map(column => `${column.name}: "${column.type}"`);
		return `db.collection("${table.name}").updateOne(
	{${cols.join(", ")}},
	{${cols.join(", ")}}
)`;
	}

	getBaseSelect(table: Table) {
		const cols = table.columns?.map(column => `${this.connection.nameDel + column.name + this.connection.nameDel}: "${column.type}"`);
		return `/*
const db = (await new MongoClient()).db("${Database.getSelected().name}");
const bson = require("bson");
*/

db.collection("${table.name}").find({
	${cols.join(",\n\t")}
}).toArray();`;
	}

	getBaseSelectWithRelations(table: Table, relations: Relation[]) {
		return "";
	}

	getBaseAggregate(table: Table) {
		return `/*
const db = (await new MongoClient()).db("${Database.getSelected().name}");
const bson = require("bson");
*/
db.collection("${table.name}").aggregate([
	{
		$match: { ${table.columns[0].name}: "${table.columns[0].type}" }
	},
	{
		$group: { _id: "$${table.columns[0].name}" }
	}
]).toArray()`;
	}

	getBaseSort(query: string, field: string, direction: 'asc' | 'desc') {
		if (query.indexOf(".aggregate(") >= 0) {
			const s: any = {$sort : {}};
			s.$sort[field] = direction === "asc" ? 1 : -1;
			query = helper.mongo_injectAggregate(query, s);
		}

		if (query.indexOf(".find(") > 0) {
			query = query.replace(".toArray()", "");
			query = `${query}.sort({${field}: ${direction === "asc" ? 1 : -1}}).toArray()`;
		}

		return query;
	}
}
