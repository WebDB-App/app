import { Driver, QueryParams, TypeName } from "../driver";
import { Column } from "../column";
import { Table } from "../table";
import { Relation } from "../relation";

export class MongoDB implements Driver {

	defaultParams = {
		serverSelectionTimeoutMS: 2000
	};

	languageDocumentation = "https://www.mongodb.com/docs/drivers/node/current/quick-reference/";
	nameDel = '"';
	driverDocumentation = "https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/";
	extraAttributes: string[] = [];
	language = 'javascript';
	canRename = true;
	constraints = [];
	availableComparator = [
		{symbol: '$gt', example: "", definition: "More than"},
		{symbol: '$lt', example: "", definition: "Less than"},
		{symbol: '$gte', example: "0", definition: "More or equal than"},
		{symbol: '$lte', example: "0", definition: "Less or equal than"},
		{symbol: '$eq', example: '"0"', definition: "Strictly equal to"},
		{symbol: '$ne', example: "'0'", definition: "Strictly different to"},
		{symbol: '$in', example: '("0", "1")', definition: "Is in array of"},
		{symbol: '$all', example: '("0", "1")', definition: "If the array contains all elements"},
		{symbol: '$range', example: '"0" AND "1"', definition: "If in the range of"},
		{symbol: '$regexMatch', example: '"[a-z]"', definition: "If match regex"},
		{symbol: '$text', example: '"0%"', definition: "Search text"},
		{symbol: '$nin', example: '("0", "1")', definition: "Is not in array of"},
	];
	typesList = [
		{
			name: TypeName.String,
			proposition: ["varchar(size)", 'longtext', 'longblob'],
			full: ["varchar", 'longtext', 'longblob', 'char', 'binary', 'varbinary', 'blob', 'text', 'mediumblob', 'tinyblob', 'mediumtext', 'tinytext'],
		}
	];
	acceptedExt = ['.csv', '.tsv'];
	functions = {};
	keywords = [];
	defaultFilter = "$eq";

	nodeLib = (query: QueryParams) => "";

	extractEnum(col: Column): string[] | false {
		return false;
	}

	generateSuggestions(textUntilPosition: string): string[] {
		return [];
	}

	format(code: string): string {
		return code;
	}

	extractConditionParams(query: string): QueryParams {
		return <QueryParams>{
			query
		};
	}

	getBaseDelete(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: ""`);
		return `db.collection("${table.name}").deleteOne({${cols.join(", ")}})`;
	}

	getBaseInsert(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: ""`);
		return `db.collection("${table.name}").insertOne({${cols.join(", ")}})`;
	}

	getBaseUpdate(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: ""`);
		return `db.collection("${table.name}").updateOne({${cols.join(", ")}})`;
	}

	getBaseSelect(table: Table) {
		return `db.collection("${table.name}").find({})`;
	}

	getBaseSelectWithRelations(table: Table, relations: Relation[]) {
		const columns = table.columns?.map(column => `${table.name}.${column.name}`).join(', ');

		const joins: string[] = [];
		for (const relation of relations) {
			joins.push(`INNER JOIN ${relation.table_dest} ON ${relation.table_dest}.${relation.column_dest} = ${relation.table_source}.${relation.column_source}`)
		}

		return `SELECT ${columns} FROM ${table.name} ${joins.join("\n")} GROUP BY ${columns} HAVING 1 = 1`;
	}

	getBaseFilter(table: Table, condition: string[], operand: 'AND' | 'OR') {
		const cond = {};

		return `db.collection("${table.name}").find(${JSON.stringify(cond)})`;
	}

	getBaseSort(field: string, direction: 'asc' | 'desc') {
		return `.sort({${field}: ${direction === "asc" ? 1 : -1})`;
	}
}
