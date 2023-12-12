import { Index } from "./index";
import { Relation } from "./relation";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import commonHelper from  "../shared/common-helper.mjs";
import { uniqueValidator } from "../shared/unique.validator";
import { Table } from "./table";
import { Server } from "./server";
import { isSQL } from "../shared/helper";
import { Driver } from "./driver";

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
		const allTypes = Server.getSelected().driver.language.typeGroups.map(tg => tg.list.map(li => li.id)).flat(1);

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

		const typeUnknown = () => {
			return (control: AbstractControl): ValidationErrors | null => {
				if (!control.value || commonHelper.isNested(control.value)) {
					return null;
				}
				const val = control.value.split("(")[0].trim().toLowerCase();
				for (const type of allTypes) {
					if (val === type.split("(")[0].trim().toLowerCase()) {
						return null;
					}
				}
				return {typeUnknown: true};
			}
		}

		const nameValidators = [Validators.required, Validators.pattern(commonHelper.validName)];
		if (table) {
			nameValidators.push(uniqueValidator('name', table.columns.filter(col => col.name !== from?.name).map(col => col.name)));
		}

		return new FormGroup({
			name: new FormControl(from?.name || null, nameValidators),
			type: new FormControl(from?.type || null, [Validators.required, checkParams(), typeUnknown()]),
			nullable: new FormControl(from?.nullable !== undefined ? from?.nullable : !isSQL()),
			defaut: new FormControl(from?.defaut || null),
			extra: new FormControl(from?.extra || []),
		});
	}

	static isOfGroups(driver: Driver, column: Column, groups: string[]) {
		const parenthese = column.type.indexOf('(');
		const columnType = parenthese >= 0 ? column.type.substring(0, parenthese) : column.type;

		for (const group of groups) {
			const typeDatas = driver.language.typeGroups.find(type => type.name === group)!.list!;
			if (typeDatas.map(type => type.id.replace(/\([^)]*\)/g, "")).indexOf(columnType) >= 0) {
				return true;
			}
		}

		return false;
	}
}
