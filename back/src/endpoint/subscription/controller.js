const fs = require("fs");
const {join} = require("path");
const NodeRSA = require("node-rsa");
const CryptoJS = require("crypto-js");

class Controller {

	constructor() {
		const pub = fs.readFileSync(join(__dirname, "./public_key.pub"), "utf8");
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
		} catch(e) {
			return {error: "Invalid data: Could not extract symmetric key."};
		}

		try {
			decrypteddata = CryptoJS.AES.decrypt(keyMsg[1], randomSymmetricKey).toString(CryptoJS.enc.Utf8);
		} catch (e) {
			return {error: "Invalid Data: Could not decrypt data with key found."};
		}

		if (this.key.verify(decrypteddata, signature, "utf8", "base64")) {
			const parsed = JSON.parse(decrypteddata);

			if (!parsed) {
				return {error: "Malformed Licence"};
			}

			if (parsed.expire * 1000 < Date.now()) {
				return {error: "Licence Expired"};
			}

			return parsed;
		} else {
			return {error: "License Key signature invalid. This license key may have been tampered with"};
		}
	}

	getPatchLimit(privateKey) {
		const licence = this.parseLicense(privateKey);

		return licence.error ? 10 : licence.versions;
	}

	getDbLimit(privateKey) {
		const licence = this.parseLicense(privateKey);
		if (licence.error) {
			licence.dbLimit = 2;
		}
		if (licence.dbLimit === 0) {
			licence.dbLimit = Infinity;
		}

		return licence.dbLimit;
	}
}

module.exports = new Controller();


