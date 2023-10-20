const fs = require("fs");
const bash = require("../../shared/bash.js");
const {join} = require("path");
const frontPath = join(__dirname, "../../../static/");
const privateKeyPath = frontPath + "id_rsa";
const publicKeyPath = frontPath + "id_rsa.pub";
const { SshTunnel } = require("ssh-tunneling");

async function generate() {
	if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
		return;
	}

	bash.runBash(`ssh-keygen -C "main.webdb@gmail.com" -f ${privateKeyPath} -q -N ""`);
}

generate();

class Controller {

	pool = [];

	async handleSsh(connection, cache = true) {
		const makeHash = (ssh) => JSON.stringify(ssh);

		if (!connection.ssh || !connection.ssh.host || !connection.ssh.port || !connection.ssh.user) {
			return false;
		}

		if (cache && this.pool[makeHash(connection)]) {
			return this.pool[makeHash(connection)];
		}

		const sshOptions = {
			host: connection.ssh.host,
			port: connection.ssh.port,
			username: connection.ssh.user,
			readyTimeout: 1000
		};
		if (connection.ssh.password) {
			sshOptions["password"] = connection.ssh.password;
		} else {
			sshOptions["privateKey"] = fs.readFileSync(privateKeyPath, "utf8");
		}
		const client = new SshTunnel(sshOptions);
		const forwardInfo = await client.forwardOut(`${connection.port + 10}:${connection.host}:${connection.port}`);

		this.pool[makeHash(connection)] = forwardInfo.localPort;
		return forwardInfo.localPort;
	}

	async test(req, res) {
		try {
			await this.handleSsh(req.body, false);
			return res.send({ok: true});
		} catch (error) {
			return res.send({error: JSON.stringify(error)});
		}
	}
}


module.exports = new Controller();
