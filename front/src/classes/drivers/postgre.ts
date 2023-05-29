import { SQL } from "../sql";
import { QueryParams, TypeName } from "../driver";
import { Server } from "../server";
import { Database } from "../database";

export class Postgre extends SQL {

	constructor() {
		super();

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

		this.docUrl = "https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js";

		this.keywords = this.keywords.concat([
			'CREATE SCHEMA',
			'ALTER SCHEMA',
			'DROP SCHEMA',
			'CURRENT_USER',
			'RENAME TO',
			'OWNER TO',
			'CREATE DOMAIN'
		]);

		this.functions = this.functions.concat([
			'CHECK'
		]);

		this.typesList = [
			{
				name: TypeName.String,
				proposition: ["varchar(size)", 'uuid', 'tsquery'],
				full: ["character", 'char', 'character varying', 'varchar', 'uuid', 'tsquery'],
			}, {
				name: TypeName.Numeric,
				proposition: ['boolean', 'integer(size)', 'serial', 'decimal(size)', 'numeric(size)'],
				full: ['bigint', 'bigserial', 'bit', 'bit varying', 'varbit', 'boolean', 'bytea', 'real', 'float4', 'smallint', 'int2', 'smallserial', 'serial2', 'serial', 'serial4', 'numeric', 'decimal', 'double precision', 'float8', 'integer', 'int', 'int4', 'interval']
			}, {
				name: TypeName.Date,
				proposition: ['date', 'timestamp(precision?)', 'time(precision?)'],
				full: ['date', 'timestamp', 'time', 'timetz', 'timestamptz']
			}, {
				name: TypeName.Other,
				proposition: ['json', 'xml', 'cidr', 'macaddr'],
				full: ['xml', 'json', 'jsonb', 'money', 'tsvector', 'macaddr', 'macaddr8', 'inet', 'cidr']
			}
		];
	}
}
