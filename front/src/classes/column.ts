import { Index, TypeSymbol } from "./index";
import { Relation } from "./relation";

export class Column {
	name!: string;
	type!: string;
	collation!: string;
	nullable!: boolean;
	defaut!: string;
	comment!: string;
	extra?: string[];
	ordinal!: number;

	static getTags(column: Column, indexes: Index[], relation?: Relation) {
		let tags: string[] = [];

		for (const index of indexes) {
			if (index.name === "PRIMARY") {
				tags.push(TypeSymbol.PRIMARY);
			} else if (index.unique) {
				tags.push(TypeSymbol.UNIQUE);
			} else {
				tags.push(TypeSymbol.INDEX);
			}
		}
		if (relation) {
			tags.push('📎');
		}
		if (column.nullable) {
			tags.push('❓');
		}

		return tags;
	}
}
