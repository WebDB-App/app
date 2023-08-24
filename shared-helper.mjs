export default class Helper {

	static validName = /^[a-zA-Z0-9-_]{2,50}$/;

	static parentheses = /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;

	static mongo_injectAggregate(query, toInject) {
		const reg = /\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;
		let agg = query.match(reg);
		agg = agg[0];
		agg = agg.slice(".aggregate(".length, -1).trim();
		if (agg.length < 1) {
			agg = `[${JSON.stringify(toInject)}]`;
		} else if (agg.endsWith(']')) {
			agg = agg.slice(0, -1) + ', ' + JSON.stringify(toInject) + ']';
		} else {
			return query;
		}
		agg = `.aggregate(${agg})`;
		return query.replace(reg, agg);
	}

	static sql_isSelect(query) {
		query = query.trim().toLowerCase();
		query = query.replaceAll(Helper.parentheses, '').trim();
		return query.indexOf('select ') >= 0;
	}

	static singleLine(code, keepLength = false) {
		code = code.replaceAll(/(\r|\n|\t)/gm, " ");
		if (!keepLength) {
			code = code.replaceAll(/  +/gm, " ");
		}
		return code;
	}

	static isNested(data) {
		return ["Object", "Array"].indexOf(data?.constructor.name) >= 0;
	}

	static removeComment(query) {
		return query.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();
	}
}
