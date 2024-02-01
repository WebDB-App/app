import {finishedPath} from "../../shared/helper.js";
import fs from "fs";

class Controller {

	async finished(req, res) {
		let logs = fs.readFileSync(finishedPath);
		const limit = 1000;

		logs = logs.toString().split("\n");
		if (logs.length > limit) {
			logs = [logs[0], `Only ${limit} last lines are shown`, ...logs.slice(-limit)];
		}

		res.send(logs.join("\n"));
	}
}

export default new Controller();
