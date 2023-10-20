const SoftwareLicenseKey = require("software-license-key");
const fs = require("fs");
const {join} = require("path");
const publicKey = fs.readFileSync(join(__dirname, "./public_key.pub"), "utf8");
const validator = new SoftwareLicenseKey(publicKey);
const licencePath = join(__dirname, "./licence");

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
			request = (await fetch(process.env.LANDING_ADDR + "/client/" + email));
			request = await request.json();
		} catch (e) {
			throw new Error("Licence API unreachable");
		}

		if (request.length < 1) {
			throw new Error("You must subscribe before entering your email");
		}

		const client = request[0];
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
			console.error(e.message);
		}
	}
}

module.exports = new Controller();


