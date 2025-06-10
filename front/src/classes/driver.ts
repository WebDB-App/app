import { Column } from "./column";
import { Relation } from "./relation";
import { Table } from "./table";
import { HttpClient } from "@angular/common/http";
import { Complex } from "./complex";

export interface Comparator {
	symbol: string
	example: string
	definition: string
}

export class TypeData {
	id!: string;
	bold? = false;
	description?: string;
	toTimestamp?: (date: string) => any;
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
	native? = false;
}

export interface Driver {

	connection: {
		defaultParams: {},
		acceptedExt: string[],
		fileTypes: FileType[],
		defaultDumpOptions: string
	}

	docs: {
		driver: string,
		types: string,
		language: string
		dump: string
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
		fctAsDefault: string[],
		extendedJSONDoc: string
	}

	loadExtraLib: (http: HttpClient) => Promise<void>;
	terminalCmd: () => string;

	validName: RegExp;

	extractForView: (query: string) => string | false;
	extractEnum: (col: Column) => string[] | false;
	format: (code: string) => string;
	wrapValue: (type: any, value: string) => string;
	quickSearch: (driver: Driver, column: Column, value: string) => string;
	generateSuggestions?: (textUntilPosition: string, colUntilPosition: string, allText: string) => any[];

	alterComplex: (complex: Complex, type: string) => string;
	renameComplex: (complex: Complex, type: string, database: string) => string | false;

	basicSort: (query: string, field: string, direction: 'asc' | 'desc') => string;
	basicFilter: (table: Table, condition: string[], operand: 'AND' | 'OR') => string;
	queryTemplates: { [fct: string]: (table: Table, relations: Relation[]) => string };
}
