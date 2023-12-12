import {execSync} from "child_process";
import {writeFileSync, appendFileSync} from "fs";
import {randomUUID} from "crypto";
import {join} from "path";
import {URL} from "url";
import {singleLine} from "./helper.js";

const dirname = new URL(".", import.meta.url).pathname;
const finished = join(dirname, "../../static/logs/finished.log");

class Bash {
	commands = {};

	constructor() {
		writeFileSync(finished, "");
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

		appendFileSync(finished, `${port} ${ping} ${database} ${length} ${command}\n`);
		delete this.commands[cid];
	}

	runBash(cmd) {
		let lght = -1;
		let cid;

		try {
			cid = this.startCommand(cmd, "bash", "");
			const result = execSync(cmd, {shell: "/bin/bash"}).toString();
			lght = result.length;
			return {result};
		} catch (e) {
			console.error(e);
			return {error: e.stderr.toString() ? e.stderr.toString() : e.message};
		} finally {
			this.endCommand(cid, lght);
		}
	}
}

export default new Bash();
