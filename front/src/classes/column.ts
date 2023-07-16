import { Index } from "./index";
import { Relation } from "./relation";
import { Driver, TypeName } from "./driver";

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

	static displayTags(column: Column, indexes: Index[]) {
		const tags = Column.getTags(column, indexes).join(' | ');
		let str = column.type;
		if (tags.length) {
			str += ' | ' + tags;
		}

		return str;
	}

	static isOfCategory(driver: Driver, column: Column, category: TypeName) {
		const parenthese = column.type.indexOf('(');
		const stringTypes = driver.language.typeGroups.find(type => type.name === category)!.full!;
		const columnType = parenthese >= 0 ? column.type.substring(0, parenthese) : column.type;

		return stringTypes.indexOf(columnType) >= 0;
	}
}
