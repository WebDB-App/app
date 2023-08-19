export default class Helper {

	static validName = /^[a-zA-Z0-9-_]{2,50}$/;

	static parentheses = /\(([^()]|(?R))*\)/g;

	static sql_isSelect(query) {
		query = query.trim().toLowerCase();
		query = query.replaceAll(/with.*\(([^()]|(?R))*\)/, '').trim();

		if (query.startsWith('(')) {
			query = Helper.parentheses.exec(query)[0].trim();
		}
		//extractEnum

		return query.startsWith('select ');
	}

	static singleLine(code) {
		return code.replaceAll(/(\r|\n|\t)/gm, " ").replaceAll(/  +/gm, " ");
	}

	static isNested(data) {
		return ["Object", "Array"].indexOf(data?.constructor.name) >= 0;
	}

	static removeComment(query) {
		return query.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();
	}
}
