//@ts-nocheck

export function clearAllSelection() {
	if (window.getSelection) {
		if (window.getSelection()?.empty) {
			window.getSelection()?.empty();
		} else if (window.getSelection()?.removeAllRanges) {
			window.getSelection()?.removeAllRanges();
		}
	} else if (document.selection) {
		document.selection.empty();
	}
}
