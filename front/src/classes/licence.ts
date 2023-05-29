import { RequestService } from "../shared/request.service";

let selected: Licence;

export class Licence {
	dbLimit: number
	valid: boolean
	expire: number
	email: string
	plan: string;

	constructor(dbLimit: number,
				valid: boolean,
				expire: number,
				email: string,
				plan: string) {
		this.dbLimit = dbLimit === 0 ? Infinity : dbLimit;
		this.valid = expire === 0 || expire * 1000 >= Date.now();
		this.expire = expire;
		this.email = email;
		this.plan = plan;
	}

	static set(licence: Licence) {
		selected = new Licence(licence.dbLimit, licence.valid, licence.expire, licence.email, licence.plan);
	}

	static async get(request: RequestService): Promise<Licence> {
		if (!selected) {
			Licence.set(await request.post('subscription/list', null));
		}

		return selected;
	}
}
