export default class Helper {

	static validName = /^[a-zA-Z0-9-_]{2,50}$/;

	static sql_isSelect(query) {
		//TODO with, rm parenthese
		query = query.trim().toLowerCase();
		//if (["update", "delete"] query.indexOf(" "))

		return true;
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
