export default class Helper {

	static validName = /^[a-zA-Z0-9-_]{2,50}$/;

	static parentheses = /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;

	static mongo_injectAggregate(query, toInject) {
		let agg = query.match(/\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g);
		agg = agg[0];
		agg = agg.slice(".aggregate(".length, -1);
		agg = agg ? eval(agg) : [];
		agg.push(toInject);
		agg = `.aggregate(${JSON.stringify(agg)})`;
		return query.replace(/\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g, agg);
	}

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
