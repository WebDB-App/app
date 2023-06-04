import { Column } from "./column";

export interface Comparator {
	symbol: string
	example: string
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

export interface Driver {
	nameDel: string;
	nodeLib: (queryParams: QueryParams) => string;
	availableComparator: Comparator[];
	typesList: TypeGroup[];
	extractEnum: (col: Column) => string[] | false;
	extractConditionParams: (query: string) => QueryParams;
	generateSuggestions: (textUntilPosition: string) => string[];
	keywords: string[];
	functions: {[key: string]: string | null};
	constraints: string[];
	acceptedExt: string[];
	language: string;
	format: (code: string) => string;
	highlight: (query: string) => string;
	canRename: boolean;
	defaultParams: {};
	docUrl: string;
	disclaimerSsh?: string
	extraAttributes: string[];
}
