import { Server } from "../classes/server";
import { SQL } from "../classes/sql";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

declare var monaco: any;

export function singleLine(code: string) {
	return code.replaceAll(/(\r|\n|\t)/gm, " ").replaceAll(/  +/gm, " ").trim();
}

export function isNested(data: any) {
	return ['Object', 'Array'].indexOf(data?.constructor.name) >= 0;
}

export function isSQL(server = Server.getSelected()): boolean {
	return server.driver instanceof SQL;
}

export function initBaseEditor(editor: any) {
	setTimeout(() => editor.trigger("editor", "editor.action.formatDocument"));
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
