import { SQL } from "../sql";
import { Group, QueryParams } from "../driver";
import { Server } from "../server";
import { Database } from "../database";
import { format } from "sql-formatter";

export class MySQL extends SQL {

	constructor() {
		super();

		this.docs = {
			trigger: "https://dev.mysql.com/doc/refman/8.0/en/triggers.html",
			driver: "https://github.com/sidorares/node-mysql2/blob/master/typings/mysql/lib/Connection.d.ts",
			types: "https://dev.mysql.com/doc/refman/8.0/en/data-types.html",
			language: "https://dev.mysql.com/doc/refman/8.0/en/sql-statements.html"
		}

		this.connection = {
			...this.connection,
			disclaimerSsh: "MySQL require password for remote connection",
			defaultParams: {
				dateStrings: true,
				multipleStatements: true,
				supportBigNumbers: true,
				bigNumberStrings: true
			}
		}

		this.trigger.base = `FOR EACH ROW
BEGIN

END`;
		this.trigger.templates = {
			adult_and_good_email: `IF age < 18 THEN
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Age must be gte 18';
END IF;
IF NOT (SELECT email REGEXP '$[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$') THEN
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wrong email';
END IF;`,
			add_to_reminders: `IF NEW.birthDate IS NULL THEN
	INSERT INTO reminders(memberId, message)
	VALUES(new.id,CONCAT('Hi ', NEW.name, ', please update your date of birth.'));
END IF;`,
			calculated_field: `UPDATE average_age SET average = (SELECT AVG(age) FROM person);`,
			archive_user: `INSERT INTO person_archive (name, age) VALUES (OLD.name, OLD.age);`,
			check_geo: `FOR EACH ROW
BEGIN
    IF NEW.gps_lat < -90 OR NEW.gps_lat > 90 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La latitude doit être entre -90 et 90'
    END IF;

    IF NEW.gps_lng < -180 OR NEW.gps_lng > 180 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La longitude doit être entre -180 et 180'
    END IF;
END`
		};

		this.language = {
			...this.language,
			arrayType: false,
			fctAsDefault: [],
			extraAttributes: ['auto_increment', 'on update CURRENT_TIMESTAMP'],
			keywords: this.language.keywords.concat([
				'AUTO_INCREMENT',
				'FOR EACH ROW'
			]),
			functions: {
				...this.language.functions, ...{
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
				}
			},
			typeGroups: [
				{
					name: Group.String,
					list: [
						{
							id: "binary(size)",
							description: 'Where size is the number of binary characters to store. Fixed-length strings. Space padded on right to equal size characters.'
						},
						{
							id: "char(size)",
							description: 'Where size is the number of characters to store. Fixed-length strings. Space padded on right to equal size characters.'
						},
						{
							id: "mediumtext",
							description: 'Where size is the number of characters to store.'
						},
						{
							id: "longtext",
							bold: true,
							description: 'Where size is the number of characters to store.'
						},
						{
							id: "text",
							description: 'Where size is the number of characters to store.'
						},
						{
							id: "tinytext",
							description: 'Where size is the number of characters to store.'
						},
						{
							id: "varchar(size!)",
							bold: true,
							description: 'Where size is the number of characters to store. Variable-length string.'
						},
						{
							id: "varbinary(size!)",
							description: 'Where size is the number of characters to store. Variable-length string'
						}
					]
				}, {
					name: Group.Numeric,
					list: [
						{
							id: "bingint",
							description: "Big integer value.\nValues range from -9223372036854775808 to 9223372036854775807."
						},
						{
							id: "bigint unsigned",
							description: "Big integer value.\nValues range from 0 to 18446744073709551615."
						},
						{
							id: "bigint zerofill",
							description: "Big integer value.\nValues range from 0 to 18446744073709551615."
						},
						{
							id: "bit",
							description: "Very small integer value that is equivalent to TINYINT(1).\nSigned values range from -128 to 127. unsigned values range from 0 to 255."
						},
						{
							id: "decimal(m, d)",
							bold: true,
							description: 'Unpacked fixed point number.\nm defaults to 10, if not specified.\nd defaults to 0, if not specified.\nWhere m is the total digits and d is the number of digits after the decimal.'
						},
						{
							id: "double(m, d)",
							bold: true,
							description: "Double precision floating point number.\nWhere m is the total digits and d is the number of digits after the decimal."
						},
						{
							id: "float(m, d)",
							description: "Single precision floating point number.\nWhere m is the total digits and d is the number of digits after the decimal."
						},
						{
							id: "float(precision)",
							description: "Floating point number.\nWhere p is the precision."
						},
						{
							id: "int",
							bold: true,
							description: "A normal-sized integer that can be signed or unsigned. Allowable range is from -2147483648 to 2147483647"
						},
						{
							id: "int unsigned",
							bold: true,
							description: "A normal-sized integer that can be signed or unsigned. Allowable range is from 0 to 4294967295"
						},
						{
							id: "int zerofill",
							bold: true,
							description: "A normal-sized integer that can be signed or unsigned. Allowable range is from 0 to 4294967295"
						},
						{
							id: "mediumint",
							description: "Medium integer value.\nValues range from -8388608 to 8388607."
						},
						{
							id: "mediumint unsigned",
							description: "Medium integer value.\nValues range from 0 to 16777215."
						},
						{
							id: "mediumint zerofill",
							description: "Medium integer value.\nVnsigned values range from 0 to 16777215."
						},
						{
							id: "smallint",
							description: "Small integer value.\nValues range from -32768 to 32767."
						},
						{
							id: "smallint unsigned",
							description: "Small integer value.\nValues range from 0 to 65535."
						},
						{
							id: "smallint zerofill",
							description: "Small integer value.\nValues range from 0 to 65535."
						},
						{
							id: "tinyint",
							description: "Very small integer value.\nValues range from -128 to 127"
						},
						{
							id: "tinyint unsigned",
							description: "Very small integer value.\nValues range from 0 to 255."
						},
						{
							id: "tinyint zerofill",
							description: "Very small integer value.\nValues range from 0 to 255."
						}
					]


				}, {
					name: Group.Date,
					list: [
						{
							id: "date",
							description: "Values range from '1000-01-01' to '9999-12-31'.\nDisplayed as 'YYYY-MM-DD'."
						},
						{
							id: "datetime(precision)",
							description: "Values range from '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.\nDisplayed as 'YYYY-MM-DD HH:MM:SS'."
						},
						{
							id: "time",
							description: "Values range from '-838:59:59' to '838:59:59'.\nDisplayed as 'HH:MM:SS'."
						},
						{
							id: "timestamp(precision)",
							bold: true,
							description: "Values range from '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.\nDisplayed as 'YYYY-MM-DD HH:MM:SS'."
						},
						{
							id: "year(2|4)",
							description: 'Year value as 2 digits or 4 digits.\nDefault is 4 digits.'
						}
					]
				}, {
					name: Group.Blob,
					list: [
						{
							id: "blob(size)",
							description: "Maximum size of 65,535 bytes.\nWhere size is the number of characters to store"
						},
						{
							id: "longblob",
							bold: true,
							description: "Maximum size of 4GB or 4,294,967,295 characters."
						},
						{
							id: "mediumblob",
							description: "Maximum size of 16,777,215 bytes."
						},
						{
							id: 'tinyblob',
							description: 'Maximum size of 255 bytes.'
						}
					]
				}, {
					name: Group.Complex,
					list: [
						{
							id: "enum('a', 'b', 'c')",
							bold: true,
							description: " An enumeration, which is a fancy term for list. When defining an ENUM, you are creating a list of items from which the value must be selected (or it can be NULL). For example, if you wanted your field to contain \"A\" or \"B\" or \"C\", you would define your ENUM as ENUM ('A', 'B', 'C') and only those values (or NULL) could ever populate that field."
						},
						{
							id: "json",
							bold: true,
						},
						{
							id: "set('a', 'b', 'c')",
						}
					]
				}, {
					name: Group.Geo,
					list: [
						{
							id: "geometry",
						},
						{
							id: "linestring",
						},
						{
							id: "point",
						},
						{
							id: "polygon",
						},
						{
							id: "multipoint",
						},
						{
							id: "multilinestring",
						},
						{
							id: "multipolygon",
						},
						{
							id: "geometrycollection",
						}
					]
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

		this.format = (code: string) => {
			code = format(code, {
				language: 'mariadb',
				useTabs: true,
				keywordCase: "upper"
			});

			return code.replace(/\n/g, " \n");
		}
	}
}
