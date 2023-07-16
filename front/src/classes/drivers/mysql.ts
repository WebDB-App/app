import { SQL } from "../sql";
import { QueryParams, TypeName } from "../driver";
import { Server } from "../server";
import { Database } from "../database";

export class MySQL extends SQL {

	constructor() {
		super();

		this.docs = {
			driver: "https://github.com/sidorares/node-mysql2/blob/master/typings/mysql/lib/Connection.d.ts",
			types: "https://dev.mysql.com/doc/refman/8.0/en/data-types.html",
			language: "https://dev.mysql.com/doc/refman/8.0/en/sql-statements.html"
		}

		this.connection = {
			...this.connection,
			nameDel: this.configuration.getByName("useNameDel")?.value ? "\`" : '',
			disclaimerSsh: "MySQL require password for remote connection",
			defaultParams: {
				dateStrings: true,
				multipleStatements: true,
				supportBigNumbers: true,
				bigNumberStrings: true
			}
		}

		this.language = {
			...this.language,
			// @ts-ignore
			extraAttributes: ['auto_increment', 'on update CURRENT_TIMESTAMP'],
			keywords: this.language.keywords.concat([
				'AUTO_INCREMENT',
				'FOR EACH ROW'
			]),
			functions: { ...this.language.functions, ...{
				'LPAD': '(string, length, lpad_string)',
				'INSTR': '(string1, string2)',
				'GROUP_CONCAT': null,
				'JSON_KEYS': '(json_doc[, path])',
				'JSON_LENGTH': '(json_doc[, path])',
				'JSON_SET': '(json_doc, path, val[, path, val] ...)',
				'JSON_INSERT': '(json_doc, path, val[, path, val] ...)',
				'JSON_APPEND': '(json_doc, path, val[, path, val] ...)',
				'JSON_MERGE': '(json_doc, json_doc[, json_doc] ...)',
				'JSON_QUOTE': '(string)',
				'JSON_OBJECT': '([key, val[, key, val] ...])',
				'JSON_OBJECTAGG': '(key, value) [over_clause]',
				'JSON_CONTAINS': '(target, candidate[, path])',
				'JSON_ARRAY': '([val[, val] ...])',
				'JSON_ARRAY_APPEND': '(json_doc, path, val[, path, val] ...)',
				'JSON_ARRAYAGG': null,
				'UUID': '',
				'AES_ENCRYPT': '(str, key_str)',
				'AES_DECRYPT': '(crypt_str, key_str)'
			}},
			typeGroups: [
				{
					name: TypeName.String,
					proposition: ["varchar(size)", 'longtext', 'longblob'],
					full: ["varchar", 'longtext', 'longblob', 'char', 'binary', 'varbinary', 'blob', 'text', 'mediumblob', 'tinyblob', 'mediumtext', 'tinytext'],
				}, {
					name: TypeName.Numeric,
					proposition: ['boolean', 'integer(size)', 'bigint(size)', 'decimal(size)', 'float(size)'],
					full: ['boolean', 'integer', 'bigint', 'decimal', 'float', 'bit', 'tinyint', 'smallint', 'mediumint', 'int', 'int unsigned', 'int zerofill', 'int unsigned zerofill', 'double', 'year']
				}, {
					name: TypeName.Date,
					proposition: ['date', 'datetime(precision?)', 'timestamp(precision?)', 'time(precision?)'],
					full: ['date', 'datetime', 'timestamp', 'time']
				}, {
					name: TypeName.Other,
					proposition: ['enum("val1", "val2", "val3")', 'json'],
					full: ['enum', 'json']
				}
			]
		}

		this.nodeLib = (query: QueryParams) => {
			return `//with mysql2 lib
import mysql from "mysql2";

async function main() {
	const connection = await mysql.createConnection({
		user: '${Server.getSelected().user}',
		host: '${Server.getSelected().host}',
		password: '${Server.getSelected().password}',
		port: '${Server.getSelected().port}',
		database: '${Database.getSelected().name}'
	});
	const [rows, fields] = await connection.execute(\`${query.query}\`, [${query.params.join(', ')}]);
}`;
		};
	}
}
