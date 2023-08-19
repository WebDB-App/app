export default class Helper {

	static validName = /^[a-zA-Z0-9-_]{2,50}$/;

	static parentheses = /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;

	static sql_isSelect(query) {
		query = query.trim().toLowerCase();
		query = query.replaceAll(Helper.parentheses, '').trim();
		return query.indexOf('select ') >= 0;
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
