import * as fs from "fs";
import {Client} from "ssh2";
import {URL} from "url";
import net from "net";
import {createTunnel} from "tunnel-ssh";
import bash from "../../shared/bash.js";

const dirname = new URL(".", import.meta.url).pathname;
const frontPath = dirname + "../../front/";
const privateKeyPath = frontPath + "id_rsa";
const publicKeyPath = frontPath + "id_rsa.pub";

async function generate() {
	if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
		return;
	}

	bash.runBash(`ssh-keygen -C "main.webdb@gmail.com" -f ${privateKeyPath} -q -N ""`);
}

generate();

class Controller {

	pool = [];

	async getPortFree() {
		return new Promise(res => {
			const srv = net.createServer();
			srv.listen(0, () => {
				const port = srv.address().port;
				srv.close(() => res(port));
			});
		});
	}

	async handleSsh(connection, cache = true) {
		const makeHash = (ssh) => JSON.stringify(ssh);

		if (!connection.ssh || !connection.ssh.host) {
			return false;
		}

		if (cache && this.pool[makeHash(connection)]) {
			return this.pool[makeHash(connection)];
		}
		const forwardPort = await this.getPortFree();

		await this.newTunnel(connection, forwardPort);
		this.pool[makeHash(connection)] = forwardPort;
		return forwardPort;
	}

	async newTunnel(connection, rng_port) {
		const sshOptions = {
			host: connection.ssh.host,
			port: connection.ssh.port,
			username: connection.ssh.user,
			readyTimeout: 5000
		};
		if (connection.ssh.password) {
			sshOptions["password"] = connection.ssh.password;
		} else {
			sshOptions["privateKey"] = fs.readFileSync(privateKeyPath, "utf8");
		}
		const forwardOptions = {
			srcAddr: "0.0.0.0",
			srcPort: rng_port,
			dstAddr: connection.host,
			dstPort: connection.port
		};

		return await createTunnel(
			{autoClose: false},
			{host: "127.0.0.1", port: rng_port},
			sshOptions,
			forwardOptions);
	}

	async test(req, res) {
		const conn = new Client();
		const cfg = {
			host: req.body.ssh.host,
			port: req.body.ssh.port,
			username: req.body.ssh.user
		};
		if (req.body.ssh.password) {
			cfg["password"] = req.body.ssh.password;
		} else {
			cfg["privateKey"] = fs.readFileSync(privateKeyPath, "utf8");
		}

		conn.on("ready", () => {
			res.send({});
		}).on("error", (err) => {
			res.send({error: err.message});
		}).connect(cfg);
	}
}


export default new Controller();
