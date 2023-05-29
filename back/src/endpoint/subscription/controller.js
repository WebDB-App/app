import SoftwareLicenseKey from "software-license-key";
import * as fs from "fs";
import {URL} from "url";
import axios from "axios";

const dirname = new URL(".", import.meta.url).pathname;
const publicKey = fs.readFileSync(dirname + "public_key.pub", "utf8");
const validator = new SoftwareLicenseKey(publicKey);
const licencePath = dirname + "licence";

class Controller {

	constructor() {
		setInterval(async () => {
			await this.renew();
		}, 1000 * 3600);

		if (process.env.NODE_ENV !== "production") {
			return;
		}

		this.renew();
	}

	async save(req, res) {
		try {
			res.send(await this.getRemote(req.body.email));
		} catch (e) {
			res.send({error: e.message});
		}
	}

	async list(req, res) {
		const file = this.getLocal();
		const licence = validator.validateLicense(file);

		res.send(licence);
	}

	async getRemote(email) {
		let request;
		try {
			request = (await axios.get(process.env.LANDING_ADDR + "/client/" + email));
		} catch (e) {
			throw new Error("Licence API unreachable");
		}

		if (request.data.length < 1) {
			throw new Error("You must subscribe before entering your email");
		}

		const client = request.data[0];
		const licence = validator.validateLicense(client.licence);
		if (!licence) {
			throw new Error("Malformed Licence");
		}

		if (licence.expire * 1000 < Date.now()) {
			throw new Error("Licence Expired");
		}

		fs.writeFileSync(licencePath, client.licence, "utf8");
		return true;
	}

	getLocal() {
		return fs.readFileSync(licencePath, "utf8");
	}

	getLimit() {
		const licence = validator.validateLicense(this.getLocal());
		if (licence.expire * 1000 < Date.now()) {
			licence.dbLimit = 2;
		}
		if (licence.dbLimit === 0) {
			licence.dbLimit = Infinity;
		}

		return licence.dbLimit;
	}

	async renew() {
		const licence = validator.validateLicense(this.getLocal());
		if (!licence.email) {
			return;
		}

		try {
			await this.getRemote(licence.email);
		} catch (e) {
			console.log(e.message);
		}
	}
}

export default new Controller();
