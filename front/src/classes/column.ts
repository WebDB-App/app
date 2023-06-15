import { Index, IndexSymbol } from "./index";
import { Relation } from "./relation";

export class Column {
	name!: string;
	type!: string;
	collation!: string;
	nullable!: boolean;
	defaut!: string;
	comment!: string;
	extra?: string[];

	static getTags(column: Column, tableIndexes: Index[], relation?: Relation) {
		const indexes = tableIndexes.filter(index => index.columns.indexOf(column.name) >= 0);
		const tags = Index.getSymbol(indexes);

		if (relation) {
			tags.push('📎');
		}
		if (column.nullable) {
			tags.push('❔');
		}

		return tags;
	}
}
