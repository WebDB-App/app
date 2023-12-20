import { environment } from "../environments/environment";

const localStorageName = "licence";
const defaultLicence = "====BEGIN LICENSE KEY====\ntVSIfKTzC26pHc8HTAK0QxAtVslNE4FTL8EjCPTMPMrR/PX2k58ukjsz/L+qeSBjkp8snCemuuIv7xyk+/brNpoNOrBhUvaNgfTsXJvSotYGeAW1JDQ/682zuNh7BmOkiavWTykFh0GovJrZlKBTkHZq7QN8VVmE6Qzpm+FUAVe41akGEiCj1/9E5BBnT8FQ58E0UuBOkh8kfEQ2JAe335Qao3TTismZioEohF/JFqZk1rmBIlfKTVXUPH60EbnS16J0hsjtVy61tHPOWLXNkftUs6sdLpr9V2VEdgAYi2298LWgtWf5jKs8fneyubTp2nlzlULsaYf8Qmg9ya7+3w==||U2FsdGVkX1+2JAbRHqqZ+/6deuWU78Ky2rnFT577GC1Xya3vXrvBNOmWr6RJ7M34szui80G3/7Koh5/NOg2p4reYWEg0KiK+SKVnrUU+Z9uhs59S3bxa/VCkUjqw3s4R\ndqckdzsmW46/bjqYN82jqcbCSQmCcdgopbgwLl7CcvtbKHhWK9aEua88e/B7pzBzPoLn7P6u8U3EopV6uLb2jLhhFIOA5PyIfEuv3kXmJv9jA0UDAXgB+VmJAjWz2JqxcZcFw9PF63iQBRjbPO5dofT4tx4TJSc/D/GyqR3rdjeN5oWdDfSeGbtuaLpdv9AqPs/z28fYYoaBc5ZSB688r4MbVXja/2nTAIDDyIAabf3hfAmbzaUonaycPywfNHmDVhrQlSq4EatSTMiOMWqZrQkezZ3a8IqXv++PxS8VHp0GPDXFUzB4Buk6sVK4Zd3svHwnBKQ50o4JsscnMhsZLw==\n====END LICENSE KEY====";

let selected: Licence;

async function parseLicence(privateKey: string) {
	const request = (await fetch(environment.apiRootUrl + "subscription/parse", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({privateKey})
	}));
	return await request.json();
}

async function download(email: string) {
	let request: any = (await fetch(environment.landingApi + "client/" + email));
	request = await request.json();

	if (request.length < 1) {
		throw new Error("email not registered");
	}
	return request[0].licence;
}

export class Licence {
	valid: boolean
	expire: number
	email: string
	plan: string;
	privateKey: string;
	error?: string;

	constructor(
		expire: number,
		email: string,
		plan: string,
		privateKey: string,
		error?: string) {

		this.valid = expire === 0 || expire * 1000 >= Date.now();
		this.expire = expire;
		this.email = email;
		this.plan = plan;
		this.privateKey = privateKey;
		this.error = error;
	}

	static set(licence: Licence, privateKey: string) {
		selected = new Licence(licence.expire, licence.email, licence.plan, privateKey, licence.error);
	}

	static async getCached(): Promise<Licence> {
		if (!selected) {
			const privateKey = localStorage.getItem(localStorageName) || defaultLicence;
			Licence.set(await parseLicence(privateKey), privateKey);
		}

		return selected;
	}

	static async renew(email: string | false = false): Promise<Licence> {
		if (!email) {
			const currentPrivateKey = localStorage.getItem(localStorageName) || defaultLicence;
			const current = await parseLicence(currentPrivateKey);
			email = current.email;

			if (!current.email) {
				return current;
			}
		}

		const newPrivateKey = await download(<string>email);
		const newLicence = await parseLicence(newPrivateKey);

		Licence.set(newLicence, newPrivateKey);
		localStorage.setItem(localStorageName, newPrivateKey);

		return selected;
	}
}
