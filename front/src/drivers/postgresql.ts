import { SQL } from "./sql";
import { Group, QueryParams } from "../classes/driver";
import { Server } from "../classes/server";
import { Database } from "../classes/database";
import { format } from "sql-formatter";
import { Column } from "../classes/column";
import { Complex, EditableComplex } from "../classes/complex";

export class PostgreSQL extends SQL {

	override docs = {
		driver: "https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js",
		types: "https://www.postgresql.org/docs/current/datatype.html",
		language: "https://www.postgresql.org/docs/current/sql-commands.html",
		dump: "https://www.postgresql.org/docs/current/app-pgdump.html"
	}

	constructor() {
		super();

		this.language = {
			...this.language,
			fctAsDefault: ['now()', 'nextval()'],
			keywords: this.language.keywords.concat([
				'CREATE SCHEMA',
				'ALTER SCHEMA',
				'DROP SCHEMA',
				'CURRENT_USER',
				'RENAME TO',
				'OWNER TO',
				'ALTER DOMAIN',
				'CREATE DOMAIN',
				'DROP DOMAIN',
				'ALTER SEQUENCE',
				'CREATE SEQUENCE',
				'DROP SEQUENCE',
				'ALTER TYPE',
				'CREATE TYPE',
				'DROP TYPE',
			]),
			functions: {
				...this.language.functions, ...{
					'ARRAY_AGG': null,
					'ARRAY_CAT': '(anyarray, anyarray)',
					'ARRAY_UPPER': '(anyarray, int)',
					'ARRAY_REPLACE': '(anyarray, anyelement, anyelement)',
					'ARRAY_REMOVE': '(anyarray, anyelement)',
					'ARRAY_PREPEND': '(anyelement, anyarray)',
					'ARRAY_LOWER': '(anyarray, int)',
					'ARRAY_LENGTH': '(anyarray, int)',
					'ARRAY_FILL': '(anyelement, int[], [, int[]])',
					'ARRAY_APPEND': '(anyarray, anyelement)',
					'ARRAY_TO_STRING': '(anyarray, text [, text])',
					'UNNEST': '(anyarray)',
					'STRING_AGG': '(expression, delimiter)',
					'STRING_TO_ARRAY': '(text, text [, text])',
					'EVERY': '',
					'JSON_AGG': null,
					'JSON_OBJECT_AGG': '(name, value)',
					'JSON_ARRAY_LENGTH': '(json)',
					'JSON_OBJECT_KEYS': '(json)',
					'JSON_EACH': '(json)',
					'JSON_ARRAY_ELEMENTS': '(json)',
					'JSON_OBJECT': '([key, value[, key, value] ...])',
					'TO_JSON': '(anyelement)',
					'CRYPT': '(password text, salt text)',
					'GEN_RANDOM_UUID': '()'
				}
			},
			typeGroups: [
				{
					name: Group.String,
					list: [
						{
							id: "char(size)",
							description: 'Where size is the number of characters to store. Fixed-length strings. Space padded on right to equal size characters.'
						},
						{
							id: "character(size)",
							description: 'Where size is the number of characters to store. Fixed-length strings. Space padded on right to equal size characters.'
						},
						{
							id: "character varying(size)",
							description: 'Where size is the number of characters to store. Variable-length string.'
						},
						{
							id: "text",
							bold: true,
							description: 'Variable-length string.'
						},
						{
							id: "uuid",
							bold: true,
							description: 'Universally unique identifier'
						}
					]
				}, {
					name: Group.Numeric,
					list: [
						{
							id: "bigint",
							description: "Big integer value which is equivalent to int8.\n8-byte signed integer."
						},
						{
							id: "bigserial",
							description: "Big auto-incrementing integer value which is equivalent to serial8.\n8-byte signed integer that is auto-incrementing."
						},
						{
							id: "bit(size)",
							description: "Fixed-length bit string\nWhere size is the length of the bit string."
						},
						{
							id: "bit varying(size)",
							description: "Variable-length bit string\nWhere size is the length of the bit string."
						},
						{
							id: "bool",
							description: "Logical boolean data type - true or false"
						},
						{
							id: "boolean",
							bold: true,
							description: "Logical boolean data type - true or false"
						},
						{
							id: "double precision",
							description: "8 byte, double precision, floating-point number"
						},
						{
							id: "int",
							bold: true,
							description: "Equivalent to int4. \n4-byte signed integer."
						},
						{
							id: "integer",
							description: "Equivalent to int4. \n4-byte signed integer."
						},
						{
							id: "numeric(m,d)",
							bold: true,
							description: "Where m is the total digits and d is the number of digits after the decimal."
						},
						{
							id: "money",
							description: "Currency value."
						},
						{
							id: "real",
							description: "4-byte, single precision, floating-point number"
						},
						{
							id: "serial",
							bold: true,
							description: "Auto-incrementing integer value which is equivalent to serial4.\n4-byte signed integer that is auto-incrementing."
						},
						{
							id: "smallint",
							description: "Equivalent to int2.\n2-byte signed integer."
						},
						{
							id: "smallserial",
							description: "Small auto-incrementing integer value which is equivalent to serial2.\n2-byte signed integer that is auto-incrementing."
						},
						{
							id: "varbit(size)",
							description: "Variable-length bit string\nWhere size is the length of the bit string."
						},
					]
				}, {
					name: Group.Date,
					list: [
						{
							id: "date",
							description: "Displayed as 'YYYY-MM-DD'.",
							toTimestamp: (date: string) => { return new Date(date).toISOString().split('T')[0] }
						},
						{
							id: "time",
							description: "Displayed as 'HH:MM:SS' with no time zone."
						},
						{
							id: "time with time zone",
							description: "Displayed as 'HH:MM:SS-TZ' with time zone.\nEquivalent to timetz."
						},
						{
							id: "time without time zone",
							description: "Displayed as 'HH:MM:SS' with no time zone."
						},
						{
							id: "timestamp",
							description: "Displayed as 'YYYY-MM-DD HH:MM:SS'.",
							toTimestamp: (date: string) => { return new Date(date).toISOString().slice(0, 19).replace('T', ' ') }
						},
						{
							id: "timestamp with time zone",
							bold: true,
							description: "Displayed as 'YYYY-MM-DD HH:MM:SS-TZ'.\nEquivalent to timestamptz.",
							toTimestamp: (date: string) => { return new Date(date).toISOString().slice(0, 19).replace('T', ' ') }
						},
						{
							id: "timestamp without time zone",
							description: "Displayed as 'YYYY-MM-DD HH:MM:SS'.",
							toTimestamp: (date: string) => { return new Date(date).toISOString().slice(0, 19).replace('T', ' ') }
						},
					]
				}, {
					name: Group.Blob,
					list: [
						{
							id: "bytea",
							bold: true,
							description: "Binary data (“byte array”)"
						},
						{
							id: "jsonb",
							description: "Binary JSON data, decomposed"
						},
					]
				}, {
					name: Group.Complex,
					list: [
						{
							id: "xml",
							description: "An enumeration, which is a fancy term for list. When defining an ENUM, you are creating a list of items from which the value must be selected (or it can be NULL). For example, if you wanted your field to contain \"A\" or \"B\" or \"C\", you would define your ENUM as ENUM ('A', 'B', 'C') and only those values (or NULL) could ever populate that field."
						},
						{
							id: "json",
							bold: true,
							description: 'Textual JSON data'
						}
					]
				}, {
					name: Group.Network,
					list: [
						{
							id: "cidr",
							description: "IPv4 or IPv6 network address"
						},
						{
							id: "inet",
							description: 'IPv4 or IPv6 host address'
						},
						{
							id: "macaddr",
							description: 'MAC (Media Access Control) address'
						},
						{
							id: "macaddr8",
							description: 'MAC (Media Access Control) address (EUI-64 format)'
						}
					]
				}, {
					name: Group.Geo,
					list: [
						{
							id: "box",
							description: "Rectangular box on a plane"
						},
						{
							id: "circle",
							description: 'Circle on a plane'
						},
						{
							id: "line",
							description: 'Infinite line on a plane'
						},
						{
							id: "lseg",
							description: 'Line segment on a plane'
						},
						{
							id: "path",
							description: 'Geometric path on a plane'
						},
						{
							id: "point",
							description: 'Geometric point on a plane'
						},
						{
							id: "polygon",
							description: 'Closed geometric path on a plane\n'
						},
						{
							id: "macaddr8",
							description: 'MAC (Media Access Control) address (EUI-64 format)'
						}
					]
				}]
		};
	}

	override extractEnum = (col: Column) => {
		const nums = Server.getSelected().complexes['ENUM'];
		for (const num of nums) {
			if (Database.getSelected().name !== num.database) {
				continue;
			}
			if (col.type !== num.name) {
				continue;
			}
			return num.value!.split(', ');
		}

		return false;
	}

	override format = (code: string) => {
		try {
			code = format(code, {
				language: 'postgresql',
				useTabs: true,
				identifierCase: this.configuration.getByName('identifierCase')?.value,
				keywordCase: this.configuration.getByName('keywordCase')?.value,
				functionCase: this.configuration.getByName('functionCase')?.value,
				dataTypeCase: this.configuration.getByName('dataTypeCase')?.value,
			});

			return code.replace(/\n/g, " \n");
		} catch (e) {
			return code;
		}
	}

	override wrapValue(type: any, value: string) {
		let hasBackslash = false;
		let escaped = "'";

		for (let i = 0; i < value.length; i++) {
			const c = value[i]
			if (c === "'") {
				escaped += c + c;
			} else if (c === '\\') {
				escaped += c + c;
				hasBackslash = true;
			} else {
				escaped += c;
			}
		}
		escaped += "'";
		if (hasBackslash) {
			escaped = ' E' + escaped;
		}
		return escaped;
	}

	override wrapStructure(structure: string) {
		return '"' + structure.replace(/"/g, '""') + '"'
	}

	override terminalCmd = () => {
		return `docker exec -it $(docker ps -a -q --filter ancestor=webdb/app) psql "${Server.getSelected().uri}"`;
	}

	override alterComplex(complex: Complex, type: string) {
		switch (type) {
			case "SEQUENCE":
				return `ALTER SEQUENCE ${complex.name}\n${complex.value};`
			case "ENUM":
				return `DROP TYPE ${complex.name};\nCREATE TYPE ${complex.name} AS ENUM(${complex.value});`
			case "PROCEDURE":
				return `DROP PROCEDURE ${complex.name};\n${complex.value};`
			case "TRIGGER":
				return `DROP TRIGGER ${complex.name};\nCREATE TRIGGER ${complex.name} ${complex.value};`
		}
		return super.alterComplex(complex, type);
	}

	override renameComplex(complex: EditableComplex, type: string, database: string): string | false {
		if (type === "CHECK" && complex.table) {
			return `ALTER TABLE ${this.wrapStructure(complex.table)} RENAME CONSTRAINT ${this.wrapStructure(complex.name)} TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "ENUM" || type === "CUSTOM_TYPE") {
			return `ALTER TYPE ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "DOMAIN") {
			return `ALTER DOMAIN ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "FUNCTION") {
			return `ALTER FUNCTION ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "PROCEDURE") {
			return `ALTER PROCEDURE ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "MATERIALIZED_VIEW") {
			return `ALTER MATERIALIZED VIEW ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		if (type === "TRIGGER" && complex.table) {
			return `ALTER TRIGGER ${this.wrapStructure(complex.name)} ON ${this.wrapStructure(complex.table)} RENAME TO ${this.wrapStructure(complex.newName!)}`;
		}
		if (type === "SEQUENCE") {
			return `ALTER SEQUENCE ${this.wrapStructure(complex.name)} RENAME TO ${this.wrapStructure(complex.newName!)};`;
		}
		return false;
	}
}
