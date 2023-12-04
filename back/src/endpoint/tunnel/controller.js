import net from "net";
import {Client} from "ssh2";

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

		const forwardPort = await this.newTunnel(connection);
		this.pool[makeHash(connection)] = forwardPort;
		return forwardPort;
	}

	async newTunnel(connection, test = false) {
		const client = new Client();
		const cfg = {
			host: connection.ssh.host,
			port: connection.ssh.port,
			username: connection.ssh.user,
			readyTimeout: 10000
		};
		if (connection.ssh.password) {
			cfg["password"] = connection.ssh.password;
		} else {
			cfg["privateKey"] = connection.ssh.privateKey;
		}

		await new Promise((resolve, reject) => {
			client.on("ready", () => {
				resolve();
			}).on("error", (err) => {
				reject(err);
			}).connect(cfg);
		});

		if (test) {
			return client.end();
		}

		const freePort = await new Promise(res => {
			const srv = net.createServer();
			srv.listen(0, () => {
				const port = srv.address().port;
				srv.close(() => res(port));
			});
		});

		await new Promise((resolve, reject) => {
			client.forwardOut("127.0.0.1", freePort, connection.host, connection.port, (err) => {
				if (err) {
					client.end();
					console.error(err);
					reject(err);
				}
				resolve(true);
			});
		});

		return freePort;
	}

	async test(req, res) {
		try {
			await this.newTunnel(req.body, true);
			return res.send({ok: true});
		} catch (error) {
			return res.send({error: error.message});
		}
	}
}


export default new Controller();
