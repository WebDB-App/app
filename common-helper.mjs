const helper = {
	validName: /^[a-zA-Z0-9-_]{2,50}$/,
	parentheses: /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g,
	complex: {
		"FUNCTION": "Method",
		"PROCEDURE": "Method",
		"DOMAIN": "Module",
		"CUSTOM_TYPE": "Property",
		"SEQUENCE": "Constant",
		"ENUM": "Enum",
		"TRIGGER": "Event",
		"CHECK": "Interface",
		"VALIDATOR": "VALIDATOR"
	},
	mongo_injectAggregate: (query, toInject) => {
		const reg = /\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;
		let agg = query.match(reg);
		agg = agg[0];
		agg = agg.slice(".aggregate(".length, -1).trim();
		if (agg.length < 1) {
			agg = `[${JSON.stringify(toInject)}]`;
		} else if (agg.endsWith("]")) {
			agg = agg.slice(0, -1) + ", " + JSON.stringify(toInject) + "]";
		} else {
			return query;
		}
		agg = `.aggregate(${agg})`;
		return query.replace(reg, agg);
	},
	sql_isSelect: (query) => {
		query = query.trim().toLowerCase();
		query = query.replaceAll(helper.parentheses, "").trim();
		return query.indexOf("select ") >= 0;
	},
	singleLine: (code, keepLength = false) => {
		code = code.replaceAll(/(\r|\n|\t)/gm, " ");
		if (!keepLength) {
			code = code.replaceAll(/  +/gm, " ");
		}
		return code;
	},
	isNested: (data) => {
		return ["Object", "Array"].indexOf(data?.constructor.name) >= 0;
	},
	removeComment: (query) => {
		return query.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();
	}
};

export const commonHelper = helper;
