export class Trigger {
	code: string;
	saved: boolean;
	name?: string;
	timing?: string;
	event?: string;
	action?: string;
	level?: string;

	constructor(code: string, saved = false, name?: string, timing?: string, event?: string, action?: string, level?: string) {
		this.code = code;
		this.saved = saved;
		this.name = name;
		this.timing = timing;
		this.event = event;
		this.action = action;
		this.level = level;
	}
}
