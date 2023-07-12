import { Server } from "../classes/server";
import { SQL } from "../classes/sql";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

declare var monaco: any;

export function isNested (data: any) {
	return ['Object', 'Array'].indexOf(data?.constructor.name) >= 0;
}

export function isSQL (server: Server): boolean {
	return server.driver instanceof SQL;
}

export function initBaseEditor(editor: any) {
	editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Space,
		() => {
			editor.trigger('', 'editor.action.triggerSuggest', '');
		},
		'editorTextFocus && !editorHasSelection && ' +
		'!editorHasMultipleSelections && !editorTabMovesFocus && ' +
		'!hasQuickSuggest');

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
