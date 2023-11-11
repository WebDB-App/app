const NodeRSA = require("node-rsa");
const CryptoJS = require("crypto-js");

class SoftwareLicenseKey {

	constructor(cert= null) {
		if (cert === null) {
			this.key = new NodeRSA();
			this.key.generateKeyPair();
		} else {
			this.key = new NodeRSA(cert);
		}
	}

	validateLicense(licenseKey) {
		const lines = licenseKey.split("\n");
		const keyMsg = lines[1].split("||");
		const signature = lines[2];

		let randomSymmetricKey, decrypteddata;

		try {
			randomSymmetricKey = this.key.decryptPublic(keyMsg[0], "utf8");
		} catch(e) {
			throw "Invalid data: Could not extract symmetric key.";
		}

		try {
			decrypteddata = CryptoJS.AES.decrypt(keyMsg[1], randomSymmetricKey).toString(CryptoJS.enc.Utf8);
		} catch (e) {
			throw "Invalid Data: Could not decrypt data with key found.";
		}

		if (this.key.verify(decrypteddata, signature, "utf8", "base64")) {
			return JSON.parse(decrypteddata);
		} else {
			throw "License Key signature invalid. This license key may have been tampered with";
		}
	}
}

module.exports = SoftwareLicenseKey;
