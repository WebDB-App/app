import { Index } from "./index";
import { Relation } from "./relation";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { uniqueValidator } from "../shared/unique.validator";
import { Table } from "./table";
import { Server } from "./server";
import { isNested, isSQL, validName } from "../shared/helper";
import { Driver } from "./driver";

export class Column {
	name!: string;
	type!: string | Object | Array<any>;
	collation!: string;
	nullable!: boolean;
	defaut!: string;
	extra?: string[];

	static getTags(column: Column, tableIndexes: Index[], relation?: Relation) {
		const indexes = tableIndexes.filter(index => index.columns.indexOf(column.name) >= 0);
		const tags = Index.getSymbol(indexes);

		if (relation) {
			tags.push('🖇️');
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
				if (!control.value || isNested(control.value)) {
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

		const nameValidators = [Validators.required, Validators.pattern(validName)];
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

	static cleanColumnType(column: Column) {
		if (typeof column.type === "string") {
			const parenthese = column.type.indexOf('(');
			return parenthese >= 0 ? column.type.substring(0, parenthese) : column.type;
		} else {
			return typeof column.type;
		}
	}

	static isOfGroups(driver: Driver, column: Column, groups: string[]) {
		const columnType = Column.cleanColumnType(column);

		for (const group of groups) {
			const typeDatas = driver.language.typeGroups.find(type => type.name === group)!.list!;
			if (typeDatas.map(type => type.id.replace(/\([^)]*\)/g, "")).indexOf(columnType) >= 0) {
				return true;
			}
		}

		return false;
	}

	static isTimestamp(driver: Driver, column: Column) {
		const columnType = Column.cleanColumnType(column);

		for (const group of driver.language.typeGroups) {
			for (const type of group.list) {
				if (type.toTimestamp && columnType === type.id.replace(/\([^)]*\)/g, "")) {
					return type.toTimestamp;
				}
			}
		}
		return false;
	}
}
