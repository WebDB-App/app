import { Index } from "./index";
import { Relation } from "./relation";
import { Driver, Group } from "./driver";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { isSQL } from "../shared/helper";

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

	static isOfGroup(driver: Driver, column: Column, group: Group) {
		const parenthese = column.type.indexOf('(');
		const stringTypes = driver.language.typeGroups.find(type => type.name === group)!.list!;
		const columnType = parenthese >= 0 ? column.type.substring(0, parenthese) : column.type;

		//TODO
		return stringTypes.map(type => type.id).indexOf(columnType) >= 0;
	}

	static getFormGroup(from?: Column) {
		const setLength = () => {
			return (control: AbstractControl) : ValidationErrors | null => {
				if (!control.value) {
					return null;
				}
				return ["(size", "(precision"].find(str => control.value.indexOf(str) >= 0) ? {setLength: true} : null;
			}
		}

		return new FormGroup({
			name: new FormControl(from?.name || null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_]{2,50}$/)]),
			type: new FormControl(from?.type || null, [Validators.required, setLength()]),
			nullable: new FormControl(from?.nullable || false),
			defaut: new FormControl(from?.defaut || null),
			extra: new FormControl(from?.extra || null),
		});;
	}
}
