import { SQL } from "../sql";
import { Group, QueryParams } from "../driver";
import { Server } from "../server";
import { Database } from "../database";
import { format } from "sql-formatter";

export class PostgreSQL extends SQL {

	constructor() {
		super();

		this.docs = {
			driver: "https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js",
			types: "https://www.postgresql.org/docs/current/datatype.html",
			language: "https://www.postgresql.org/docs/current/sql-commands.html"
		}

		this.language = {
			...this.language,
			keywords: this.language.keywords.concat([
				'CREATE SCHEMA',
				'ALTER SCHEMA',
				'DROP SCHEMA',
				'CURRENT_USER',
				'RENAME TO',
				'OWNER TO',
				'CREATE DOMAIN'
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
					'CRYPT': '(password text, salt text)'
				}
			},
			typeGroups: [
				{
				name: Group.String,
				list: [
					{
						id: "Binary(size)",
						description: 'Where size is the number of binary characters to store. Fixed-length strings. Space padded on right to equal size characters.'
					},
					{
						id: "Char(size)",
						description: 'Where size is the number of characters to store. Fixed-length strings. Space padded on right to equal size characters.'
					},
					{
						id: "MediumText",
						description: 'Where size is the number of characters to store.'
					},
					{
						id: "LongText",
						bold: true,
						description: 'Where size is the number of characters to store.'
					},
					{
						id: "Text",
						description: 'Where size is the number of characters to store.'
					},
					{
						id: "TinyText",
						description: 'Where size is the number of characters to store.'
					},
					{
						id: "VarChar(size!)",
						bold: true,
						description: 'Where size is the number of characters to store. Variable-length string.'
					},
					{
						id: "VarBinary(size!)",
						description: 'Where size is the number of characters to store. Variable-length string'
					}
				]
			}, {
				name: Group.Numeric,
				list: [
					{
						id: "BigInt",
						description: "Big integer value.\nValues range from -9223372036854775808 to 9223372036854775807."
					},
					{
						id: "BigInt Unsigned",
						description: "Big integer value.\nValues range from 0 to 18446744073709551615."
					},
					{
						id: "BigInt ZeroFill",
						description: "Big integer value.\nValues range from 0 to 18446744073709551615."
					},
					{
						id: "Bit",
						description: "Very small integer value that is equivalent to TINYINT(1).\nSigned values range from -128 to 127. Unsigned values range from 0 to 255."
					},
					{
						id: "Decimal(m, d)",
						bold: true,
						description: 'Unpacked fixed point number.\nm defaults to 10, if not specified.\nd defaults to 0, if not specified.\nWhere m is the total digits and d is the number of digits after the decimal.'
					},
					{
						id: "Double(m, d)",
						bold: true,
						description: "Double precision floating point number.\nWhere m is the total digits and d is the number of digits after the decimal."
					},
					{
						id: "Float(m, d)",
						description: "Single precision floating point number.\nWhere m is the total digits and d is the number of digits after the decimal."
					},
					{
						id: "Float(precision)",
						description: "Floating point number.\nWhere p is the precision."
					},
					{
						id: "Int",
						bold: true,
						description: "A normal-sized integer that can be signed or unsigned. Allowable range is from -2147483648 to 2147483647"
					},
					{
						id: "Int Unsigned",
						bold: true,
						description: "A normal-sized integer that can be signed or unsigned. Allowable range is from 0 to 4294967295"
					},
					{
						id: "Int ZeroFill",
						bold: true,
						description: "A normal-sized integer that can be signed or unsigned. Allowable range is from 0 to 4294967295"
					},
					{
						id: "MediumInt",
						description: "Medium integer value.\nValues range from -8388608 to 8388607."
					},
					{
						id: "MediumInt Unsigned",
						description: "Medium integer value.\nValues range from 0 to 16777215."
					},
					{
						id: "MediumInt ZeroFill",
						description: "Medium integer value.\nVnsigned values range from 0 to 16777215."
					},
					{
						id: "SmallInt",
						description: "Small integer value.\nValues range from -32768 to 32767."
					},
					{
						id: "SmallInt Unsigned",
						description: "Small integer value.\nValues range from 0 to 65535."
					},
					{
						id: "SmallInt ZeroFill",
						description: "Small integer value.\nValues range from 0 to 65535."
					},
					{
						id: "TinyInt",
						description: "Very small integer value.\nValues range from -128 to 127"
					},
					{
						id: "TinyInt Unsigned",
						description: "Very small integer value.\nValues range from 0 to 255."
					},
					{
						id: "TinyInt ZeroFill",
						description: "Very small integer value.\nValues range from 0 to 255."
					}
				]


			}, {
				name: Group.Date,
				list: [
					{
						id: "Date",
						description: "Values range from '1000-01-01' to '9999-12-31'.\nDisplayed as 'YYYY-MM-DD'."
					},
					{
						id: "DateTime(precision)",
						description: "Values range from '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.\nDisplayed as 'YYYY-MM-DD HH:MM:SS'."
					},
					{
						id: "Time",
						description: "Values range from '-838:59:59' to '838:59:59'.\nDisplayed as 'HH:MM:SS'."
					},
					{
						id: "Timestamp(precision)",
						bold: true,
						description: "Values range from '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.\nDisplayed as 'YYYY-MM-DD HH:MM:SS'."
					},
					{
						id: "Year(2|4)",
						description: 'Year value as 2 digits or 4 digits.\nDefault is 4 digits.'
					}
				]
			}, {
				name: Group.Blob,
				list: [
					{
						id: "Blob(size)",
						description: "Maximum size of 65,535 bytes.\nWhere size is the number of characters to store"
					},
					{
						id: "LongBlob",
						bold: true,
						description: "Maximum size of 4GB or 4,294,967,295 characters."
					},
					{
						id: "MediumBlob",
						description: "Maximum size of 16,777,215 bytes."
					},
					{
						id: 'TinyBlob',
						description: 'Maximum size of 255 bytes.'
					}
				]
			}, {
				name: Group.Complex,
				list: [
					{
						id: "Enum('a', 'b', 'c')",
						bold: true,
						description: " An enumeration, which is a fancy term for list. When defining an ENUM, you are creating a list of items from which the value must be selected (or it can be NULL). For example, if you wanted your field to contain \"A\" or \"B\" or \"C\", you would define your ENUM as ENUM ('A', 'B', 'C') and only those values (or NULL) could ever populate that field."
					},
					{
						id: "Json",
						bold: true,
					},
					{
						id: "Set('a', 'b', 'c')",
					}
				]
			}
				/*{
					name: Group.String,
					proposition: ["varchar(size)", 'uuid', 'tsquery'],
					full: ["character", 'char', 'character varying', 'varchar', 'uuid', 'tsquery', 'text'],
				}, {
					name: Group.Numeric,
					proposition: ['boolean', 'integer(size)', 'serial', 'decimal(size)', 'numeric(size)'],
					full: ['bigint', 'bigserial', 'bit', 'bit varying', 'varbit', 'boolean', 'bytea', 'real', 'float4', 'smallint', 'int2', 'smallserial', 'serial2', 'serial', 'serial4', 'numeric', 'decimal', 'double precision', 'float8', 'integer', 'int', 'int4', 'interval']
				}, {
					name: Group.Date,
					proposition: ['date', 'timestamp(precision?)', 'time(precision?)'],
					full: ['date', 'timestamp', 'time', 'timetz', 'timestamptz']
				}, {
					name: Group.Other,
					proposition: ['json', 'xml', 'cidr', 'macaddr'],
					full: ['xml', 'json', 'jsonb', 'money', 'tsvector', 'macaddr', 'macaddr8', 'inet', 'cidr']
				}*/
			]
		};

		this.nodeLib = (query: QueryParams) => {
			return `//with pg lib
const { Pool, Client } = require('pg')

const pool = new Pool({
	user: '${Server.getSelected().user}',
	host: '${Server.getSelected().host}',
	password: '${Server.getSelected().password}',
	port: '${Server.getSelected().port}',
	database: '${Database.getSelected().name.split(', ')[0]}'
})

async function main() {
	const {rows} = await pool.query(\`${query.query}\`, [${query.params.join(', ')}])
}`;
		};

		this.format = (code: string) => {
			code = format(code, {
				language: 'postgresql',
				useTabs: true,
				keywordCase: "upper"
			});

			return code.replace(/\n/g, " \n");
		}
	}
}
