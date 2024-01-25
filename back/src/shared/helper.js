export const parentheses = /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;

export const complex = {
	"CHECK": "Interface",
	"CUSTOM_TYPE": "Property",
	"DOMAIN": "Module",
	"ENUM": "Enum",
	"FUNCTION": "Method",
	"MATERIALIZED_VIEW": "File",
	"PROCEDURE": "Method",
	"SEQUENCE": "Constant",
	"TRIGGER": "Event",
	"VALIDATOR": "VALIDATOR"
};

export function mongo_injectAggregate(query, toInject) {
	const reg = /\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;
	let agg = query.match(reg)[0];
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
}

export function sql_isSelect(query) {
	query = query.trim().toLowerCase();
	query = query.replaceAll(parentheses, "").trim();

	if ([" procedure ", " event ", " function "].some(v => query.includes(v))) {
		return false;
	}

	return query.indexOf("select ") >= 0;
}

export function singleLine(code, keepLength = false) {
	code = code.replaceAll(/(\r|\n|\t)/gm, " ");
	if (!keepLength) {
		code = code.replaceAll(/  +/gm, " ");
	}
	return code;
}

export function removeComment(query) {
	return query.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*|--.*/g, "").trim();
}

export function alterStructure(command) {
	return [
		"updateone", "updatemany", "update ",
		"deleteone", "deletemany", "delete ",
		"insertone", "insertmany", "insert ",
		"drop", "alter ", "add ", "create", "rename", "replace", "truncate"].some(v => command.includes(v));
}


