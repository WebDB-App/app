import { Comparator, Driver, QueryParams, TypeGroup } from "../classes/driver";
import { Column } from "../classes/column";
import { Database } from "../classes/database";
import { Table } from "../classes/table";
import { Server } from "../classes/server";
import { HistoryService } from "../shared/history.service";
import { Relation } from "../classes/relation";
import { Configuration } from "../classes/configuration";
import { HttpClient } from "@angular/common/http";
import { singleLine, sql_isSelect } from "../shared/helper";


//import * as monaco from 'monaco-editor'
declare var monaco: any;

const history = new HistoryService();

export class SQL implements Driver {

	configuration: Configuration = new Configuration();

	connection = {
		defaultParams: {},
		acceptedExt: [".sql", ".json"],
		fileTypes: [
			{extension: "sql", name: "SQL", native: true},
			{extension: "json", name: "JSON"},
		],
		defaultDumpOptions: ""
	}

	docs = {
		driver: "",
		types: "https://www.w3resource.com/sql/data-type.php",
		language: "https://www.w3schools.com/sql/sql_quickref.asp",
		dump: ""
	}

	language: {
		comparators: Comparator[],
		id: string,
		extension: string,
		keywords: string[],
		functions: { [key: string]: string | null },
		constraints: string[],
		typeGroups: TypeGroup[],
		extraAttributes: string[],
		arrayType: boolean,
		fctAsDefault: string[]
	} = {
		comparators: [
			{symbol: '>', example: "", definition: "More than"},
			{symbol: '<', example: "", definition: "Less than"},
			{symbol: '>=', example: "0", definition: "More or equal than"},
			{symbol: '<=', example: "0", definition: "Less or equal than"},
			{symbol: '=', example: "'0'", definition: "Strictly equal to"},
			{symbol: '!=', example: "'0'", definition: "Strictly different to"},
			{symbol: 'IN', example: "('0', '1')", definition: "Is in array of"},
			{symbol: 'BETWEEN', example: "'a' AND 'b'", definition: "If in the range of"},
			{symbol: 'REGEXP', example: "'[a-z]'", definition: "If match regex"},
			{symbol: 'LIKE', example: "'abc%'", definition: "Equal to"},
			{symbol: 'NOT IN', example: '("a", "z")', definition: "Is not in array of"},
			{symbol: 'NOT BETWEEN', example: "'a' AND 'z'", definition: "Is out of range of"},
			{symbol: 'NOT REGEXP', example: "'[a-z]'", definition: "If regex didn't match"},
			{symbol: 'NOT LIKE', example: "'abc%'", definition: "Not equal to"},
		],
		id: "sql",
		extension: "sql",
		keywords: [
			'SELECT',
			'INSERT INTO',
			'DELETE FROM',
			'UPDATE',
			'FROM',
			'WHERE',
			'GROUP BY',
			'HAVING',
			'LIMIT',
			'WITH',
			'AS',
			'ALL',
			'TO',
			'ANY',
			'SOME',
			'UNION',
			'CASE',
			'AND',
			'OR',
			'EXISTS',
			'IS NULL',
			'IS NOT NULL',
			'PRIVILEGES',
			'GRANT',
			'CHARACTER',
			'COLLATION',
			'OPTION',
			'COLLATE',
			'MODIFY',
			'CONVERT',
			'ORDER BY',
			'INNER JOIN',
			'CROSS JOIN',
			'LEFT JOIN',
			'RIGHT JOIN',
			'FULL JOIN',
			'SELF JOIN',
			'NATURAL JOIN',
			'BEGIN',
			'DECLARE',
			'END;',
			'SET',
			'IF',
			'ELSEIF',
			'END IF;',
			'DESCRIBE',
			'PRIMARY KEY',
			'FOREIGN KEY',
			'CONSTRAINT',
			'REFERENCES',
			'ON DELETE',
			'ON UPDATE',
			'ALTER FUNCTION',
			'CREATE OR REPLACE FUNCTION',
			'DROP FUNCTION',
			'CREATE OR REPLACE TRIGGER',
			'ALTER TRIGGER',
			'DROP TRIGGER',
			'BEFORE',
			'AFTER',
			'FOR EACH ROW'
		],
		functions: {
			'ABS': '(number)',
			'ACOS': '(number)',
			'ASIN': '(number)',
			'ATAN': '(number)',
			'ATAN2': '(number)',
			'CEIL': '(number)',
			'CEILING': '(number)',
			'COS': '(number)',
			'COT': '(number)',
			'CHECK': null,
			'DEGREES': '(number)',
			'DIV': '(number) DIV (number)',
			'EXP': null,
			'EXPLAIN ANALYZE': null,
			'FLOOR': '(number)',
			'GREATEST': '(arg1, arg2, arg3, ...)',
			'LEAST': '(number)',
			'LN': '(number)',
			'LOG': '(number)',
			'LOG10': '(number)',
			'LOG2': '(number)',
			'MOD': '(x, y)',
			'PI': '()',
			'POW': '(x, y)',
			'POWER': '(x, y)',
			'RADIANS': '(number)',
			'RAND': '([seed])',
			'SIGN': '(number)',
			'SIN': '(number)',
			'SQRT': '(number)',
			'TAN': '(number)',
			'TRUNCATE': '(number, decimals)',
			'SUM': null,
			'MIN': null,
			'MAX': null,
			'AVG': null,
			'COUNT': null,
			'CONCAT': null,
			'LENGTH': null,
			'REPLACE': '(string, old_string, new_string)',
			'SUBSTRING': '(string, start, length)',
			'LEFT': '(string, number_of_chars)',
			'RIGHT': '(string, number_of_chars)',
			'REVERSE': null,
			'TRIM': null,
			'LTRIM': null,
			'RTRIM': null,
			'UPPER': null,
			'LOWER': null,
			'UCASE': null,
			'LCASE': null,
			'LOCATE': '(substring, string, [start])',
			'REPEAT': '(string, number)',
			'ROUND': '(number, [decimals])',
			'DATE_FORMAT': '(date, format)',
			'DATEDIFF': '(date1, date2)',
			'DAYOFWEEK': null,
			'MONTH': '(date)',
			'NOW': '',
			'TIMEDIFF': '(time1, time2)',
			'TIMESTAMP': '(time | date)',
			'YEAR': '(date | datetime)',
			'MD5': null,
			'SHA1': null,
			'SHA256': null,
			'SHA512': null,
			'CAST': null,
			'ISNULL': null,
			'CONVERT': '(value, type)',
			'WHEN': ''
		},
		constraints: [
			'CASCADE',
			'RESTRICT',
			'SET NULL',
			'NO ACTION'
		],
		extraAttributes: [],
		typeGroups: [],
		arrayType: true,
		fctAsDefault: []
	}
	queryTemplates = {
		"select": (table: Table) => {
			const cols = this.getColForSelect(table.columns).join(', ');
			const where = this.getColForWhere(table.columns).join(" AND ");
			return `SELECT ${cols} FROM ${this.wrapStructure(table.name)} WHERE ${where}`;
		},
		"delete": (table: Table) => {
			const cols = table.columns.map(column => `${this.wrapStructure(column.name)} = '${column.type}'`);
			return `DELETE FROM ${this.wrapStructure(table.name)} WHERE ${cols.join(" AND ")}`;
		},
		"insert": (table: Table) => {
			const cols = this.getColForSelect(table.columns).join(', ');
			const values = this.getColForInsert(table.columns).join(', ');
			return `INSERT INTO ${this.wrapStructure(table.name)} (${cols}) VALUES (${values})`;
		},
		"update": (table: Table) => {
			const cols = this.getColForSelect(table.columns).map(col => `${col} = ''`);
			const where = this.getColForWhere(table.columns).join(" AND ");
			return `UPDATE ${this.wrapStructure(table.name)} SET ${cols} WHERE ${where}`;
		},
		"select join group": (table: Table, relations: Relation[]) => {
			const columns = table.columns.map(column => `${table.name}.${column.name}`).join(', ');

			const joins: string[] = [];
			for (const relation of relations) {
				joins.push(`JOIN ${relation.table_dest} ON ${relation.table_dest}.${relation.column_dest} = ${relation.table_source}.${relation.column_source}`)
			}

			return `SELECT ${columns} FROM ${table.name} ${joins.join("\n")} GROUP BY ${columns} HAVING 1 = 1`;
		},
	};

	nodeLib = (query: QueryParams) => "";

	async loadExtraLib(http: HttpClient) {
	}

	extractForView(query: string) {
		if (!sql_isSelect(query)) {
			return false;
		}
		return query;
	}

	wrapValue(type: string, value: string) {
		return `'${value}'`;
	}

	wrapStructure(structure: string) {
		if (structure.match(/^[a-z]+$/)) {
			return structure;
		}
		return `"${structure}"`;
	}

	quickSearch(driver: Driver, column: Column, value: string) {
		let chip = this.wrapStructure(column.name) + ' ';
		if (driver.language.comparators.find((comparator) => {
			return value.toLowerCase().startsWith(comparator.symbol.toLowerCase() + ' ')
		})) {
			chip += `${value}`;
		} else {
			const del = "'";
			if (!value.startsWith(del)) {
				value = `${del + value + del}`;
			}
			chip += `= ${value}`;
		}

		return chip;
	}

	format(code: string) {
		return code;
	}

	extractEnum(col: Column) {
		if (col.type.startsWith("enum(")) {
			return col.type.slice(5, -1).split(',').map(str => str.replace(/['"]+/g, ''));
		}

		return false
	}

	extractConditionParams(query: string): QueryParams {
		if (query.toLowerCase().indexOf("where") < 0) {
			return <QueryParams>{
				query,
				params: []
			};
		}

		const result = <QueryParams>{
			query: singleLine(query.toLowerCase()),
			params: []
		};

		const availableComparator = this.language.comparators.map(comp => comp.symbol.toLowerCase()).sort((a, b) => b.length - a.length)
		let condition = result.query.substring(result.query.indexOf("where") + "where".length).trim();

		availableComparator.map(comparator => {
			const nextValue = [
				comparator + " ([(].*?[)])",
				comparator + ` \'(.*?)\'`,
				comparator + ` \"(.*?)\"`,
				comparator + ` ([0-9.]+) `,
			];

			nextValue.map(nextV => {
				const reg = new RegExp(nextV, "g");
				const array = [...condition.matchAll(reg)];

				array.map(match => {
					if (match[1] && match[1].length > 0 && match.index) {
						condition = condition.replaceAll(reg, `${comparator} ?`)
						result.params[match.index] = +match[1] ? match[1] : `"${match[1]}"`;
					}
				});
			});
		});

		result.query = result.query.substring(0, result.query.indexOf("where"));
		result.query = result.query.replaceAll('`', '');
		result.query += " WHERE " + condition
		result.query = "\n" + this.format(result.query);
		result.params = Object.values(result.params);
		return result;
	}

	basicSuggestions() {
		const suggestions: any[] = [];

		this.language.keywords.map(keyword => {
			suggestions.push({
				label: keyword,
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: `${keyword} `
			})
		});

		Object.keys(this.language.functions).map(fct => {
			const detail = this.language.functions[fct] || '(expression)';
			suggestions.push({
				label: fct,
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: `${fct}()`,
				detail
			})
		});

		this.language.constraints.map(constraint => {
			suggestions.push({
				label: constraint,
				kind: monaco.languages.CompletionItemKind.Reference,
				insertText: `${constraint}`
			})
		});

		this.language.typeGroups.map(types => {
			types.list.map(type => {
				suggestions.push({
					label: type.id,
					kind: monaco.languages.CompletionItemKind.TypeParameter,
					insertText: `${type.id}`,
					detail: type.description
				})
			})
		});

		this.language.comparators.map(comparator => {
			suggestions.push({
				label: comparator.symbol,
				kind: monaco.languages.CompletionItemKind.Operator,
				insertText: `${comparator.symbol} ${comparator.example}`
			});
		});

		suggestions.push({
			label: `*`,
			kind: monaco.languages.CompletionItemKind.Class,
			insertText: `* `
		});

		Server.getSelected().complexes?.map(complex => {
			if (Database.getSelected().name !== complex.database) {
				return;
			}

			suggestions.push({
				label: complex.name,
				// @ts-ignore
				kind: monaco.languages.CompletionItemKind[complex[complex.type]],
				insertText: complex.name
			});
		});

		return suggestions;
	}

	dotSuggestions(textUntilPosition: string) {
		const suggestions: any[] = [];

		textUntilPosition = textUntilPosition.trim();
		const lastEscaped = Math.max(
			textUntilPosition.lastIndexOf(' '),
			textUntilPosition.lastIndexOf('\t'),
			textUntilPosition.lastIndexOf('`'),
			textUntilPosition.lastIndexOf('"'),
			textUntilPosition.slice(0, -1).lastIndexOf('.')
		);
		const previousToken = textUntilPosition.slice(lastEscaped + 1).slice(0, -1);

		Server.getSelected().dbs.map(db => {
			if (previousToken !== db.name.toLowerCase()) {
				return;
			}
			db.tables?.map(table => {
				suggestions.push({
					label: `${table.name}`,
					kind: monaco.languages.CompletionItemKind.Struct,
					insertText: `${table.name} `
				});
			});
		});

		if (suggestions.length) {
			return suggestions;
		}

		Database.getSelected()?.tables?.map(table => {
			if (previousToken !== table.name.toLowerCase()) {
				return;
			}

			const indexes = Table.getIndexes(table).filter(index => index.table === table.name);
			table.columns.map(column => {
				suggestions.push({
					label: `${column.name}`,
					kind: monaco.languages.CompletionItemKind.Class,
					insertText: `${column.name}`,
					detail: Column.displayTags(column, indexes)
				});
			})
		});

		return suggestions;
	}

	generateSuggestions(textUntilPosition: string) {
		textUntilPosition = textUntilPosition.toLowerCase();

		if (textUntilPosition.lastIndexOf('.') === textUntilPosition.length - 1) {
			return this.dotSuggestions(textUntilPosition);
		}

		const suggestions = this.basicSuggestions();

		const indexes = Table.getIndexes().filter(index => index.table === Table.getSelected()?.name);
		Table.getSelected()?.columns.map(column => {
			suggestions.push({
				label: `${column.name}`,
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: `${column.name}`,
				detail: Column.displayTags(column, indexes)
			});
		});

		Database.getSelected()?.tables?.map(table => {
			const indexes = Table.getIndexes(table);
			const relations = Table.getRelations(table);

			suggestions.push({
				label: `${table.name}`,
				kind: monaco.languages.CompletionItemKind.Struct,
				insertText: `${table.name}`
			});

			table.columns.map(column => {
				suggestions.push({
					label: `${table.name}.${column.name}`,
					kind: monaco.languages.CompletionItemKind.Class,
					insertText: `${table.name}.${column.name}`,
					detail: Column.displayTags(column, indexes)
				});
			});

			relations.map(relation => {
				suggestions.push({
					label: `JOIN ${relation.table_source} ON ${relation.table_source}.${relation.column_source} = ${relation.table_dest}.${relation.column_dest}`,
					kind: monaco.languages.CompletionItemKind.Reference,
					insertText: `JOIN ${relation.table_source} ON ${relation.table_source}.${relation.column_source} = ${relation.table_dest}.${relation.column_dest}`,
				});
			});
		});

		Server.getSelected()?.dbs.map(db => {
			suggestions.push({
				label: db.name,
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: `${db.name}`
			});
		});

		return this.preselectNext(suggestions, textUntilPosition);
	}

	getLastWord(sentence: string) {
		const n = sentence.trim().split(" ");
		return n[n.length - 1];
	}

	getNextWord(sentence: string) {
		const n = sentence.trim().split(" ");
		if (!n[1]) {
			return false;
		}

		return n[1].replaceAll(/(,|  +)/gm, " ").trim();
	}

	cleanSentence(sentence: string) {
		return sentence.replaceAll(/(\r|\n|\t|,)/gm, " ").replaceAll(/  +/gm, " ");
	}

	preselectNext(suggestions: any[], previousToken: string): any[] {
		if (previousToken.length < 1) {
			return suggestions;
		}

		let tokens: any = [];
		previousToken = this.getLastWord(this.cleanSentence(previousToken));

		const locals = history.getLocal().flatMap(local => local.query.split(";"));
		for (const local of locals) {
			const cleaned = this.cleanSentence(local.toLowerCase()).trim();

			const pos = cleaned.indexOf(previousToken);
			if (pos < 0) {
				continue;
			}

			let cutted = cleaned.substring(pos).trim();
			if (previousToken.at(-1) === ' ') {
				cutted = cutted.substring(cutted.indexOf(' ')).trim();
			}

			const next = this.getNextWord(cutted);
			if (!next || next.length < 1) {
				continue;
			}
			tokens[next] = tokens[next] ? tokens[next] + 1 : 1;
		}

		tokens = Object.keys(tokens).sort((a: any, b: any) => tokens[b] - tokens[a]);

		for (const token of tokens) {
			for (const [key, sug] of Object.entries(suggestions)) {
				if (sug.label.toLowerCase() !== token) {
					continue;
				}
				suggestions[<any>key].preselect = true;
				return suggestions;
			}
		}

		return suggestions;
	}

	basicFilter(table: Table, condition: string[], operand: 'AND' | 'OR') {
		const cols = table.columns.map(column => this.wrapStructure(column.name));
		const select = `SELECT ${cols.join(', ')} FROM ` + this.wrapStructure(table.name);
		if (condition.length < 1) {
			return select;
		}

		return select + ' WHERE ' + condition.join(` ${operand} `);
	}

	basicSort(query: string, field: string, direction: 'asc' | 'desc') {
		return `${query} ORDER BY ${field} ${direction}`;
	}

	getColForSelect(columns: Column[]) {
		return columns.map(column => this.wrapStructure(column.name));
	}

	getColForWhere(columns: Column[]) {
		return columns.map(column => `${this.wrapStructure(column.name)} = '${column.type.replaceAll("'", '"')}'`);
	}

	getColForInsert(columns: Column[]) {
		return columns.map(column => `'${column.type.replaceAll("'", '"')}'`);
	}
}
