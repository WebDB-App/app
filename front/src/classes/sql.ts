import { Driver, QueryParams, TypeGroup, TypeName } from "./driver";
import { Column } from "./column";
import { Database } from "./database";
import { Table } from "./table";
import { Server } from "./server";
import { format } from "sql-formatter";
import { HistoryService } from "../shared/history.service";
import { Index } from ".";
import { Relation } from "./relation";
import { Configuration } from "./configuration";
import { HttpClient } from "@angular/common/http";

//import * as monaco from 'monaco-editor'
declare var monaco: any;

const history = new HistoryService();

export class SQL implements Driver {

	configuration: Configuration = new Configuration();
	useNameDel: boolean = this.configuration.getByName("useNameDel")?.value;

	languageDocumentation = "https://www.w3schools.com/sql/sql_quickref.asp";
	nameDel = this.useNameDel ? '"' : '';
	defaultParams = {};
	driverDocumentation = "";
	disclaimerSsh = "";
	extraAttributes: string[] = [];
	language = 'sql';
	constraints = [
		'CASCADE',
		'RESTRICT',
		'SET NULL',
		'NO ACTION'
	];
	acceptedExt = [".sql", ".js"];
	availableComparator = [
		{symbol: '>', example: "", definition: "More than"},
		{symbol: '<', example: "", definition: "Less than"},
		{symbol: '>=', example: "0", definition: "More or equal than"},
		{symbol: '<=', example: "0", definition: "Less or equal than"},
		{symbol: '=', example: "'0'", definition: "Strictly equal to"},
		{symbol: '!=', example: "'0'", definition: "Strictly different to"},
		{symbol: 'IN', example: '("0", "1")', definition: "Is in array of"},
		{symbol: 'BETWEEN', example: "'a' AND 'b'", definition: "If in the range of"},
		{symbol: 'REGEXP', example: "'[a-z]'", definition: "If match regex"},
		{symbol: 'LIKE', example: "'abc%'", definition: "Equal to"},
		{symbol: 'NOT IN', example: '("a", "z")', definition: "Is not in array of"},
		{symbol: 'NOT BETWEEN', example: "'a' AND 'z'", definition: "Is out of range of"},
		{symbol: 'NOT REGEXP', example: "'[a-z]'", definition: "If regex didn't match"},
		{symbol: 'NOT LIKE', example: "'abc%'", definition: "Not equal to"},
	];
	typesList: TypeGroup[] = [
		{
			name: TypeName.String,
			proposition: ["varchar(size)"],
			full: ["varchar", 'char', 'binary', 'varbinary'],
		}, {
			name: TypeName.Numeric,
			proposition: ['boolean', 'integer(size)', 'bigint(size)', 'decimal(size)', 'float(size)'],
			full: ['boolean', 'integer', 'bigint', 'decimal', 'float', 'bit', 'double', 'numeric']
		}, {
			name: TypeName.Date,
			proposition: ['date', 'datetime(precision?)', 'timestamp(precision?)', 'time(precision?)'],
			full: ['date', 'datetime', 'timestamp', 'time']
		}, {
			name: TypeName.Other,
			proposition: ['enum("val1", "val2", "val3")', 'json'],
			full: ['enum', 'json']
		}
	];
	keywords = [
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
		'END',
		'SET',
		'IF',
		'ELSEIF',
		'END IF',
		'DESCRIBE',
		'PRIMARY KEY',
		'FOREIGN KEY',
		'CONSTRAINT',
		'REFERENCES',
		'ON DELETE',
		'ON UPDATE',
	];
	functions = {
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
		'RAND': '',
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
	}
	defaultFilter = "LIKE"

	nodeLib = (query: QueryParams) => "";

	async loadExtraLib(http: HttpClient) {}

	format(code: string) {
		code = format(code, {
			language: 'sql',
			useTabs: true,
			keywordCase: "upper"
		});

		return code.replace(/\n/g, " \n");
	}

	extractEnum(col: Column) {
		if (col.type.startsWith("enum(")) {
			return (col.type.match(/\(([^)]+)\)/)![1]).split(',').map(str => str.replace(/['"]+/g, ''));
		}

		return false
	}

	extractConditionParams(query: string): QueryParams {
		const result = <QueryParams>{
			query: query.toLowerCase().replaceAll(/(\r|\n|\r|\t)/gm, " ").replaceAll(/  +/gm, " "),
			params: []
		};
		if (result.query.indexOf("where") < 0) {
			return result;
		}

		const availableComparator = this.availableComparator.map(comp => comp.symbol.toLowerCase()).sort((a, b) => b.length - a.length)
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

		result.query = result.query.substring(0, result.query.indexOf("where")) + " WHERE " + condition;
		result.query = "\n" + this.format(result.query);
		result.params = Object.values(result.params);
		return result;
	}

	basicSuggestions() {
		const suggestions: any[] = [];

		this.keywords.map(keyword => {
			suggestions.push({
				label: keyword,
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: `${keyword} `
			})
		});

		Object.keys(this.functions).map(fct => {
			// @ts-ignore
			const detail = this.functions[fct] || '(expression)';
			suggestions.push({
				label: fct,
				kind: monaco.languages.CompletionItemKind.Module,
				insertText: `${fct}()`,
				detail
			})
		});

		this.constraints.map(constraint => {
			suggestions.push({
				label: constraint,
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: `${constraint}`
			})
		});

		this.typesList.map(types => {
			types.full.map(type => {
				suggestions.push({
					label: type.toUpperCase(),
					kind: monaco.languages.CompletionItemKind.TypeParameter,
					insertText: `${type.toUpperCase()}`
				})
			})
		});

		this.availableComparator.map(comparator => {
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

		return suggestions;
	}

	dotSuggestions(textUntilPosition: string) {
		textUntilPosition = textUntilPosition.trim();

		const space = textUntilPosition.lastIndexOf(' ');
		const tab = textUntilPosition.lastIndexOf('\t');
		const previousToken = textUntilPosition.slice(Math.max(space, tab) + 1).slice(0, -1);
		const suggestions: any[] = [];

		Server.getSelected().dbs.map(db => {
			if (previousToken === db.name.toLowerCase()) {
				db.tables?.map(table => {
					suggestions.push({
						label: `${table.name}`,
						kind: monaco.languages.CompletionItemKind.Struct,
						insertText: `${table.name} `
					});
				});
			}
		});

		if (suggestions.length) {
			return suggestions;
		}

		Database.getSelected()?.tables?.map(table => {
			const indexes = Table.getIndexes(table).filter(index => index.table === table.name);
			if (previousToken !== table.name.toLowerCase()) {
				return;
			}

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

		if (Table.getSelected()) {
			const indexes = Table.getIndexes().filter(index => index.table === Table.getSelected()?.name);

			Table.getSelected()?.columns.map(column => {
				suggestions.push({
					label: `${column.name}`,
					kind: monaco.languages.CompletionItemKind.Class,
					insertText: `${column.name}`,
					detail: Column.displayTags(column, indexes)
				});
			});
		} else {
			Server.getSelected()?.dbs.map(db => {
				suggestions.push({
					label: db.name,
					kind: monaco.languages.CompletionItemKind.Module,
					insertText: `${db.name} `
				});

				db.tables?.map(table => {
					const indexes = Table.getIndexes(table, db).filter(index => index.table === table.name);

					suggestions.push({
						label: `${db.name}.${table.name}`,
						kind: monaco.languages.CompletionItemKind.Struct,
						insertText: `${db.name}.${table.name} `
					});

					table.columns.map(column => {
						suggestions.push({
							label: `${db.name}.${table.name}.${column.name}`,
							kind: monaco.languages.CompletionItemKind.Class,
							insertText: `${db.name}.${table.name}.${column.name}`,
							detail: Column.displayTags(column, indexes)
						});
					})
				});
			});
		}

		Database.getSelected()?.tables?.map(table => {
			const indexes = Table.getIndexes(table).filter(index => index.table === table.name);

			suggestions.push({
				label: `${table.name}`,
				kind: monaco.languages.CompletionItemKind.Struct,
				insertText: `${table.name} `
			});

			table.columns.map(column => {
				suggestions.push({
					label: `${table.name}.${column.name}`,
					kind: monaco.languages.CompletionItemKind.Class,
					insertText: `${table.name}.${column.name}`,
					detail: Column.displayTags(column, indexes)
				});
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
		return sentence.replaceAll(/(\r|\n|\r|\t|,)/gm, " ").replaceAll(/  +/gm, " ");
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

	getBaseDelete(table: Table) {
		const cols = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel} = '${column.type}'`);
		return `DELETE FROM ${this.nameDel}${table.name}${this.nameDel} WHERE ${cols.join(" AND ")}`;
	}

	getBaseInsert(table: Table) {
		const cols = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel}`);
		const colWithType = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel} = '${column.type}'`);
		return `INSERT INTO ${this.nameDel}${table.name}${this.nameDel} (${cols.join(', ')}) VALUES (${colWithType.join(', ')})`;
	}

	getBaseUpdate(table: Table) {
		const cols = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel}`);
		const colWithType = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel} = '${column.type}'`);
		return `UPDATE ${this.nameDel}${table.name}${this.nameDel} SET ${cols!.map(col => `${col} = ''`)} WHERE ${colWithType.join(" AND ")}`;
	}

	getBaseSelect(table: Table) {
		const cols = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel}`);
		const colWithType = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel} = '${column.type}'`);
		return `SELECT ${cols.join(', ')} FROM ${this.nameDel}${table.name}${this.nameDel} WHERE ${colWithType.join(" AND ")}`;
	}

	getBaseSelectWithRelations(table: Table, relations: Relation[]) {
		const columns = table.columns.map(column => `${table.name}.${column.name}`).join(', ');

		const joins: string[] = [];
		for (const relation of relations) {
			joins.push(`INNER JOIN ${relation.table_dest} ON ${relation.table_dest}.${relation.column_dest} = ${relation.table_source}.${relation.column_source}`)
		}

		return `SELECT ${columns} FROM ${table.name} ${joins.join("\n")} GROUP BY ${columns} HAVING 1 = 1`;
	}

	getBaseFilter(table: Table, condition: string[], operand: 'AND' | 'OR') {
		const cols = table.columns.map(column => `${this.nameDel}${column.name}${this.nameDel}`);
		const select = `SELECT ${cols.join(', ')} FROM ${this.nameDel}${table.name}${this.nameDel}`;
		if (condition.length < 1) {
			return select;
		}

		return select + ' WHERE ' + condition.join(` ${operand} `);
	}

	getBaseSort(field: string, direction: 'asc' | 'desc') {
		return ` ORDER BY ${field} ${direction}`;
	}
}
