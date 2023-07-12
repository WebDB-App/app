export const IndexSymbol = {
	PRIMARY: '🔑',
	UNIQUE: '➊',
	INDEX: '⚡️'
}

export class Index {
	database!: string;
	table!: string;
	columns!: string[];
	name!: string;
	primary!: boolean;
	cardinality?: number;
	unique!: boolean;

	static getSymbol(indexes: Index[]) {
		const tags = [];

		for (const index of indexes) {
			if (index.primary) {
				tags.push(IndexSymbol.PRIMARY);
			} else if (index.unique) {
				tags.push(IndexSymbol.UNIQUE);
			} else {
				tags.push(IndexSymbol.INDEX);
			}
		}

		return tags;
	}
}
