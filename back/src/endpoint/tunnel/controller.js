import net from "net";
import bash from "../../shared/bash.js";
import os from "os";
import fs from "fs";
import nodePortScanner from "node-port-scanner";

class Controller {

	pool = [];

	makeHash = (ssh) => JSON.stringify(ssh);

	async handleSsh(connection) {
		if (!connection.ssh || !connection.ssh.host || !connection.ssh.port || !connection.ssh.user) {
			return false;
		}

		const hash = this.makeHash(connection.ssh);
		if (this.pool[hash] && await this.checkPort(this.pool[hash])) {
			return this.pool[hash];
		}

		const tunnel = await this.newTunnel(connection);
		if (tunnel.error) {
			return tunnel;
		}

		this.pool[hash] = tunnel;
		return tunnel;
	}

	async newTunnel(connection, test = false) {
		const uri = `-p ${connection.ssh.port} ${bash.shellEscape(connection.ssh.user)}@${bash.shellEscape(connection.ssh.host)}`;
		let common = "ssh -F /dev/null -o ConnectTimeout=2000 -o BatchMode=true -o StrictHostKeyChecking=no ";

		const privateKey = os.tmpdir() + "/" + connection.ssh.host;
		if (connection.ssh.privateKey) {
			const pk = connection.ssh.privateKey.trim() + "\n";
			fs.writeFileSync(privateKey, pk);
			fs.chmodSync(privateKey, 0o700);
		}

		if (test) {
			if (connection.ssh.password) {
				return await bash.runBash(`sshpass -p "${bash.shellEscape(connection.ssh.password, true)}" ${common} ${uri} true`);
			} else {
				return await bash.runBash(common + `-i ${privateKey} ${uri} true`);
			}
		}

		const freePort = await new Promise(res => {
			const srv = net.createServer();
			srv.listen(0, () => {
				const port = srv.address().port;
				srv.close(() => res(port));
			});
		});

		let forward;
		common += `-f -N -L ${freePort}:${bash.shellEscape(connection.host)}:${connection.port} `;
		if (connection.ssh.password) {
			forward = await bash.runBash(`sshpass -p "${bash.shellEscape(connection.ssh.password, true)}" ${common} ${uri}`);
		} else {
			forward = await bash.runBash(common + `-i ${privateKey} ${uri}`);
		}
		if (forward.error) {
			return forward;
		}

		return freePort;
	}

	async test(req, res) {
		if (process.env.PROTECTED_MODE === "true") {
			return res.send({error: "Dump is disable by backend configuration"});
		}

		const tunnel = await this.newTunnel(req.body, true);
		if (tunnel.error) {
			return res.send(tunnel);
		}
		return res.send({ok: true});
	}

	async checkPort(port) {
		const scanned = await nodePortScanner("localhost", [port]);
		return scanned.ports.open.length > 0;
	}
}


export default new Controller();
