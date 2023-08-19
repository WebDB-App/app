import {execSync} from "child_process";
import helper from "./shared-helper.mjs";

class Bash {

	logCommand(command, database, ping, port = 0) {
		database = database ? `\x1B[36m${database.padStart(20, " ")}\x1b[0m` : " ".padStart(20, " ");
		command = helper.singleLine(command).trim();

		console.info(`\x1b[34m${port.toString().padStart(5, " ")}\x1b[0m \x1b[35m${ping.toString().padStart(4, " ")}ms\x1b[0m ${database} ${command}`);
	}

	runBash(cmd) {
		const start = Date.now();

		try {
			return {result: execSync(cmd, {shell: "/bin/bash"}).toString()};
		} catch (e) {
			console.error(e);
			return {error: e.stderr.toString() ? e.stderr.toString() : e.message};
		} finally {
			this.logCommand(cmd, "bash", Date.now() - start);
		}
	}
}

export default new Bash();
