import { Driver, QueryParams, TypeName } from "../driver";
import { Column } from "../column";
import { Table } from "../table";
import { Relation } from "../relation";

export class MongoDB implements Driver {

	defaultParams = {
		serverSelectionTimeoutMS: 2000
	};

	nameDel = '"';
	docUrl = "https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/";
	extraAttributes: string[] = [];
	language = 'javascript';
	canRename = true;
	constraints = [];
	availableComparator = [
		{symbol: '>', example: ""}
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
		return `DELETE FROM ${table.name} WHERE 1 = 0`;
	}

	getBaseInsert(table: Table) {
		const cols = table.columns?.map(column => `${column.name}: ""`);
		return `db.${table.name}.insertOne({${cols.join(", ")}})`;
	}

	getBaseUpdate(table: Table) {
		const cols = table.columns?.map(column => `${column.name}`);
		return `UPDATE ${table.name} SET ${cols!.map(col => `${col} = ""`)} WHERE 1 = 0`;
	}

	//TODO " depend of column type (enum, json, array, nested, etc)

	getBaseSelect(table: Table) {
		return `db.${table.name}.find({})`;
	}

	getBaseSelectWithRelations(table: Table, relations: Relation[]) {
		const columns = table.columns?.map(column => `${table.name}.${column.name}`).join(', ');

		const joins: string[] = [];
		for (const relation of relations) {
			joins.push(`INNER JOIN ${relation.table_dest} ON ${relation.table_dest}.${relation.column_dest} = ${relation.table_source}.${relation.column_source}`)
		}

		return `SELECT ${columns} FROM ${table.name} ${joins.join("\n")} GROUP BY (${columns}) HAVING 1 = 1`;
	}
}
