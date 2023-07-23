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
	'Complex' = 'Complex'
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
		disclaimerSsh?: string,
		acceptedExt: string[],
		nameDel: string,
		fileTypes: FileType[]
	}

	docs: {
		driver: string,
		types: string,
		language: string
	}

	language: {
		comparators: Comparator[]
		id: string
		keywords: string[];
		functions: { [key: string]: string | null };
		constraints: string[];
		typeGroups: TypeGroup[],
		extraAttributes: string[]
		defaultFilter: string;
	}

	nodeLib: (queryParams: QueryParams) => string;
	loadExtraLib: (http: HttpClient) => Promise<void>;

	extractEnum: (col: Column) => string[] | false;
	extractConditionParams: (query: string) => QueryParams;
	format?: (code: string) => string;
	generateSuggestions?: (textUntilPosition: string) => any[];

	getBaseSort: (field: string, direction: 'asc' | 'desc') => string;
	getBaseDelete: (table: Table) => string;
	getBaseUpdate: (table: Table) => string;
	getBaseSelect: (table: Table) => string;
	getBaseInsert: (table: Table) => string;
	getBaseFilter: (table: Table, condition: string[], operand: 'AND' | 'OR') => string;
	getBaseSelectWithRelations: (table: Table, relations: Relation[]) => string;
}
