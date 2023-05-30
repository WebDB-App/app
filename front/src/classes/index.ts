export const TypeSymbol = {
	PRIMARY: '🔑',
	UNIQUE: '①',
	INDEX: '⚡️'
}

export class Index {
	database!: string;
	table!: string;
	columns!: string[];
	name!: string;
	type!: string
	cardinality!: number;
	unique!: boolean;
}
