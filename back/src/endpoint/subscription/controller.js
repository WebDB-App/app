import fs from "fs";
import {join} from "path";
import NodeRSA from "node-rsa";
import CryptoJS from "crypto-js";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;

class Controller {

	constructor() {
		const pub = fs.readFileSync(join(dirname, "./public_key.pub"), "utf8");
		this.key = new NodeRSA(pub);
	}

	parseFromApi(req, res) {
		try {
			res.send(this.parseLicense(req.body.privateKey));
		} catch (e) {
			res.send({error: e.message});
		}
	}

	parseLicense(privateKey) {
		const lines = privateKey.split("\n");
		const keyMsg = lines[1].split("||");
		const signature = lines[2];

		let randomSymmetricKey, decrypteddata;

		try {
			randomSymmetricKey = this.key.decryptPublic(keyMsg[0], "utf8");
		} catch (e) {
			return {error: "Invalid data: could not extract symmetric key."};
		}

		try {
			decrypteddata = CryptoJS.AES.decrypt(keyMsg[1], randomSymmetricKey).toString(CryptoJS.enc.Utf8);
		} catch (e) {
			return {error: "Invalid data: could not decrypt data with key found."};
		}

		if (this.key.verify(decrypteddata, signature, "utf8", "base64")) {
			const parsed = JSON.parse(decrypteddata);

			if (!parsed) {
				return {error: "Malformed licence"};
			}

			if (parsed.expire * 1000 < Date.now()) {
				return {error: "Licence expired"};
			}

			return parsed;
		} else {
			return {error: "License key signature invalid. This license key may have been tampered with"};
		}
	}

	/*
	example pour plus tard

	getPatchLimit(privateKey) {
		let licence;
		if (privateKey) {
			licence = this.parseLicense(atob(privateKey));
		}

		return !licence || licence.error ? 10 : licence.versions;
	}
	getDbLimit(privateKey) {
		let licence, dbLimit;
		if (privateKey) {
			licence = this.parseLicense(atob(privateKey));

			if (licence.dbLimit === 0) {
				dbLimit = Infinity;
			}
		}

		if (!licence || licence.error) {
			dbLimit = 2;
		}

		return dbLimit;
	}
	 */
}

export default new Controller();


