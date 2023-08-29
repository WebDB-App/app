export class Fct {
	code: string;
	saved: boolean;
	name: string;
	hide?: boolean;
	changed?: boolean;

	constructor(code: string, saved = false, name: string, hide = false, changed = false) {
		this.code = code;
		this.saved = saved;
		this.name = name;
		this.hide = hide;
		this.changed = changed;
	}
}
