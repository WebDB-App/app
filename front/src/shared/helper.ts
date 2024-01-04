import { Server } from "../classes/server";
import { SQL } from "../drivers/sql";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { MatPaginatorIntl } from "@angular/material/paginator";

declare var monaco: any;

export class REMOVED_LABELS extends MatPaginatorIntl {
	override nextPageLabel: string = '';
	override previousPageLabel: string = '';
}

export function isSQL(server = Server.getSelected()): boolean | undefined {
	if (!server) {
		return undefined;
	}
	return server.driver instanceof SQL;
}

export function addMonacoError(query: string, editor: any, error: any) {
	const pos = +error.position || 0;
	const startLineNumber = query.substring(0, pos).split(/\r\n|\r|\n/).length;

	monaco.editor.setModelMarkers(editor.getModel(), "owner", [{
		startLineNumber: startLineNumber,
		startColumn: 0,
		endLineNumber: +error.position ? startLineNumber : Infinity,
		endColumn: Infinity,
		message: error.error,
		severity: monaco.MarkerSeverity.Error
	}]);
}

export function initBaseEditor(editor: any) {
	setTimeout(() => editor.trigger("editor", "editor.action.formatDocument"), 100);
}

export async function loadLibAsset(http: HttpClient, paths: string[]) {
	for (const path of paths) {
		if (monaco.languages.typescript.javascriptDefaults._extraLibs[`file://${path}`]) {
			continue;
		}

		const lib = await firstValueFrom(http.get('assets/libs/' + path, {responseType: 'text' as 'json'}))
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			`declare module '${path}' { ${lib} }; `
		);
	}
}

export const validName = /^[a-zA-Z0-9-_]{2,50}$/;

export const parentheses = /\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;

export const complex = {
	"FUNCTION": "Method",
	"PROCEDURE": "Method",
	"DOMAIN": "Module",
	"CUSTOM_TYPE": "Property",
	"SEQUENCE": "Constant",
	"ENUM": "Enum",
	"TRIGGER": "Event",
	"CHECK": "Interface",
	"VALIDATOR": "VALIDATOR"
};

export function mongo_injectAggregate(query: string, toInject: any) {
	const reg = /\.aggregate\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/g;
	let agg = query.match(reg)![0];
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

export function sql_isSelect(query: string) {
	query = query.trim().toLowerCase();
	query = query.replaceAll(parentheses, "").trim();

	if ([" procedure ", " event ", " function "].some(v => query.includes(v))) {
		return false;
	}

	return query.indexOf("select ") >= 0;
}

export function singleLine(code: string, keepLength = false) {
	code = code.replaceAll(/(\r|\n|\t)/gm, " ");
	if (!keepLength) {
		code = code.replaceAll(/  +/gm, " ");
	}
	return code;
}

export function isNested(data: any) {
	return ["Object", "Array"].indexOf(data?.constructor.name) >= 0;
}

export function removeComment(query: string) {
	return query.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();
}

export function alterStructure(command: string) {
	return [
		"updateone", "updatemany", "update ",
		"deleteone", "deletemany", "delete ",
		"insertone", "insertmany", "insert ",
		"drop", "alter ", "add ", "create", "rename", "replace"].some(v => command.includes(v));
}

