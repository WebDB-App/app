declare var monaco: any;

export function isNested (data: any) {
	const type = typeof data;
	return Array.isArray(data) || (type === 'object' && data !== null);
}

export function initBaseEditor(editor: any) {
	editor.trigger("editor", "editor.action.formatDocument");
	editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Space,
		() => {
			editor.trigger('', 'editor.action.triggerSuggest', '');
		},
		'editorTextFocus && !editorHasSelection && ' +
		'!editorHasMultipleSelections && !editorTabMovesFocus && ' +
		'!hasQuickSuggest');
}
