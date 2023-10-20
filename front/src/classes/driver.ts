import { Column } from "./column";
import { Relation } from "./relation";
import { Table } from "./table";
import { HttpClient } from "@angular/common/http";

export interface Comparator {
	symbol: string
	example: string
	definition: string
}

export class TypeData {
	id!: string;
	bold? = false;
	description?: string;
}

export class TypeGroup {
	name!: Group
	list!: TypeData[]
}

export enum Group {
	'String' = 'String',
	'Numeric' = 'Numeric',
	'Date' = 'Date',
	'Blob' = 'Blob',
	'Complex' = 'Complex',
	'Network' = 'Network',
	'Geo' = 'Geo',
	'Custom' = 'Custom'
}

export class QueryParams {
	query!: string;
	params: any[] = [];
}

export class FileType {
	extension!: string;
	name!: string;
}

export interface Driver {

	connection: {
		defaultParams: {},
		acceptedExt: string[],
		fileTypes: FileType[]
	}

	docs: {
		driver: string,
		types: string,
		language: string
	}

	language: {
		comparators: Comparator[],
		id: string,
		extension: string,
		keywords: string[],
		functions: { [key: string]: string | null },
		constraints: string[],
		typeGroups: TypeGroup[],
		extraAttributes: string[],
		arrayType: boolean,
		fctAsDefault: string[]
	}

	nodeLib: (queryParams: QueryParams) => string;
	loadExtraLib: (http: HttpClient) => Promise<void>;

	extractForView: (query: string) => string | false;
	extractEnum: (col: Column) => string[] | false;
	extractConditionParams: (query: string) => QueryParams;
	format?: (code: string) => string;
	wrapValue: (type: string, value: string) => string;
	quickSearch: (driver: Driver, column: Column, value: string) => string;
	generateSuggestions?: (textUntilPosition: string) => any[];

	basicSort: (query: string, field: string, direction: 'asc' | 'desc') => string;
	basicFilter: (table: Table, condition: string[], operand: 'AND' | 'OR') => string;
	queryTemplates: { [fct: string]: (table: Table, relations: Relation[]) => string };
}
