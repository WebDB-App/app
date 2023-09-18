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
			`declare module '${path}' { ${lib} }; `,
			`file://${path}`
		);
	}
}
