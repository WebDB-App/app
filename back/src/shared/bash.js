import {appendFileSync, writeFileSync} from "fs";
import {randomUUID} from "crypto";
import {finishedPath, singleLine} from "./helper.js";
import {exec} from "child_process";
import Log from "./log.js";

class Bash {
	commands = {};

	constructor() {
		writeFileSync(finishedPath, "");
	}

	startCommand(command, database, port) {
		const cid = randomUUID();

		database = database ? `\x1B[36m${database.padStart(20, " ")}\x1b[0m` : " ".padStart(20, " ");
		command = singleLine(command).trim();
		port = `\x1b[33m${port.toString().padStart(5, " ")}\x1b[0m`;

		this.commands[cid] = {
			start: new Date(),
			command,
			database,
			port
		};
		console.info(`${port} ${database} ${command}`);
		return cid;
	}

	endCommand(cid, length = "", ping = false) {
		const {port, database, command, start} = this.commands[cid];

		ping = ping || ((new Date()) - start);
		ping = `\x1b[32m${ping.toString().padStart(5, " ")}ms\x1b[0m`;
		length = `\x1b[34m${length.toString().padStart(6, " ")}\x1b[0m`;

		appendFileSync(finishedPath, `${port} ${ping} ${database} ${length} ${command}\n`);
		delete this.commands[cid];
	}

	shellEscape(arg, doubleQuoted = false) {
		if (doubleQuoted) {
			return arg.replace(/(["])/g, "\\$1");
		}
		return arg.replace(/([$!'"();`*?{}[\]<>&%#~@\\])/g, "\\$1");
	}

	async runBash(cmd) {
		const cid = this.startCommand(cmd, "", "sh");

		return new Promise(async (resolve) => {
			exec(cmd, {shell: "/bin/bash"}, (err, stdout, stderr) => {
				const lght = stdout.length || -1;
				if (err) {
					if (process.env.PRIVATE_MODE === "true") {
						Log.error(err, cmd);
					} else {
						console.error(err);
					}
					resolve({error: err.message ? err.message : err});
				} else {
					if (stderr) {
						console.info(stderr);
					}
					resolve({result: stdout});
				}
				this.endCommand(cid, lght);
			});
		});
	}
}

export default new Bash();
