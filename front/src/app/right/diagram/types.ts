export type Position = { x: number; y: number }

export type ParseResult = {
	table_list: Entity[]
	zoom?: number
	view?: Position
}

export type Entity = {
	name: string
	view: boolean
	field_list: Field[]
	position?: { x: number; y: number }
}

export type Field = {
	name: string
	type: string
	tags: [],
	references?: ForeignKeyReference
}
export type ForeignKeyReference = {
	type: RelationType
	table: string
	field: string
	name: string;
}

export type RelationType =
	| '|'
	| '-<'
	| '>-'
	| '>-<'
	| '-0'
	| '0-'
	| '0-0'
	| '-0<'
	| '>0-'
