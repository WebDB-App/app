export class Trigger {
	name: string;
	code: string;
	timing: string;
	event: string;

	constructor(name: string, code: string, timing: string, event: string) {
		this.name = name;
		this.code = code;
		this.timing = timing;
		this.event = event;
	}
}
