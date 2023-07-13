import { Column } from "./column";
import { Relation } from "./relation";
import { Table } from "./table";
import { HttpClient } from "@angular/common/http";

export interface Comparator {
	symbol: string
	example: string
	definition: string
}

export interface TypeGroup {
	name: TypeName
	proposition: string[];
	full: string[];
}

export enum TypeName {
	'String' = 'String',
	'Numeric' = 'Numeric',
	'Date' = 'Date',
	'Other' = 'Other'
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
	defaultParams: {};
	driverDocumentation: string;
	disclaimerSsh?: string;
	extraAttributes: string[];
	nodeLib: (queryParams: QueryParams) => string;
	loadExtraLib: (http: HttpClient) => Promise<void>;
	fileTypes: FileType[];

	nameDel: string;
	acceptedExt: string[];
	availableComparator: Comparator[];
	typesList: TypeGroup[];
	extractEnum: (col: Column) => string[] | false;
	extractConditionParams: (query: string) => QueryParams;

	language: string;
	languageDocumentation: string;
	keywords: string[];
	functions: { [key: string]: string | null };
	constraints: string[];
	format?: (code: string) => string;
	generateSuggestions?: (textUntilPosition: string) => any[];

	getBaseSort: (field: string, direction: 'asc' | 'desc') => string;
	defaultFilter: string;
	getBaseDelete: (table: Table) => string;
	getBaseUpdate: (table: Table) => string;
	getBaseSelect: (table: Table) => string;
	getBaseInsert: (table: Table) => string;
	getBaseFilter: (table: Table, condition: string[], operand: 'AND' | 'OR') => string;
	getBaseSelectWithRelations: (table: Table, relations: Relation[]) => string;
}
