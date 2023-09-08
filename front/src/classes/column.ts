import { Index } from "./index";
import { Relation } from "./relation";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import helper from "../shared/common-helper.mjs";
import { uniqueValidator } from "../shared/unique.validator";
import { Table } from "./table";

export class Column {
	name!: string;
	type!: string;
	collation!: string;
	nullable!: boolean;
	defaut!: string;
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

	static getFormGroup(table?: Table, from?: Column) {
		const checkParams = () => {
			return (control: AbstractControl): ValidationErrors | null => {
				if (!control.value) {
					return null;
				}
				const par = /\(([^)]+)\)/.exec(control.value);
				if (!par) {
					return null;
				}

				try {
					new Function(par[1])();
					return null;
				} catch (e) {
					return {checkParams: true};
				}
			}
		}

		const nameValidators = [Validators.required, Validators.pattern(helper.validName)];
		if (table) {
			nameValidators.push(uniqueValidator('name', table.columns.filter(col => col.name !== from?.name).map(col => col.name)));
		}

		return new FormGroup({
			name: new FormControl(from?.name || null, nameValidators),
			type: new FormControl(from?.type || null, [Validators.required, checkParams()]),
			nullable: new FormControl(from?.nullable || false),
			defaut: new FormControl(from?.defaut || null),
			extra: new FormControl(from?.extra || null),
		});

	}
}
