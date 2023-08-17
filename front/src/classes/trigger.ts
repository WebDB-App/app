export class Trigger {
	code: string;
	name?: string;
	timing?: string;
	event?: string;
	action?: string;
	level?: string;

	constructor(code: string, name?: string, timing?: string, event?: string, action?: string, level?: string) {
		this.code = code;
		this.name = name;
		this.timing = timing;
		this.event = event;
		this.action = action;
		this.level = level;
	}
}
