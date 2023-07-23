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
