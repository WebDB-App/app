export class Trigger {
	name: string;
	code: string;
	timing?: string;
	event?: string;
	action?: string;
	level?: string;

	constructor(name: string, code: string, timing?: string, event?: string, action?: string, level?: string) {
		this.name = name;
		this.code = code;
		this.timing = timing;
		this.event = event;
		this.action = action;
		this.level = level;
	}
}
