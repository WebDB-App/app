import { Driver, QueryParams, TypeName } from "../driver";
import { Column } from "../column";

export class MongoDB implements Driver {

	defaultParams = {
		serverSelectionTimeoutMS: 2000
	};

	nameDel = '"';
	docUrl = "https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/";
	extraAttributes: string[] = [];
	language = 'javascript';
	canRename = true;
	constraints = [];
	availableComparator = [
		{symbol: '>', example: ""}
	];
	typesList = [
		{
			name: TypeName.String,
			proposition: ["varchar(size)", 'longtext', 'longblob'],
			full: ["varchar", 'longtext', 'longblob', 'char', 'binary', 'varbinary', 'blob', 'text', 'mediumblob', 'tinyblob', 'mediumtext', 'tinytext'],
		}
	];
	acceptedExt = ['.csv', '.tsv'];
	functions = [];
	keywords = [];

	nodeLib = (query: QueryParams) => "";

	extractEnum(col: Column): string[] | false {
		return false;
	}

	generateSuggestions(textUntilPosition: string): string[] {
		return [];
	}

	format(code: string): string {
		return "";
	}

	highlight(query: string): string {
		return "";
	}

	extractConditionParams(query: string): QueryParams {
		return <QueryParams>{
			query
		};
	}
}
