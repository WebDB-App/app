import {execSync} from "child_process";
import helper from "./shared-helper.mjs";

class Bash {

	logCommand(command, database, ping, port, length) {
		database = database ? `\x1B[36m${database.padStart(20, " ")}\x1b[0m` : " ".padStart(20, " ");
		command = helper.singleLine(command).trim();
		port = `\x1b[34m${port.toString().padStart(5, " ")}\x1b[0m`;
		ping = `\x1b[35m${ping.toString().padStart(4, " ")}ms\x1b[0m`;
		length = `\x1b[33m${length.toString().padStart(6, " ")}\x1b[0m`;

		console.info(`${port} ${ping} ${database} ${length} ${command}`);
	}

	runBash(cmd) {
		const start = Date.now();
		let lght = -1;

		try {
			const result = execSync(cmd, {shell: "/bin/bash"}).toString();
			lght = result.length;
			return {result};
		} catch (e) {
			console.error(e);
			return {error: e.stderr.toString() ? e.stderr.toString() : e.message};
		} finally {
			this.logCommand(cmd, "bash", Date.now() - start, 0, lght);
		}
	}
}

export default new Bash();
