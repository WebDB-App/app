import http from "../../shared/http.js";

class Controller {

	async run(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);
		let rows = await driver.runPagedQuery(req.body.query, req.body.page, req.body.pageSize, database);

		if (Array.isArray(rows)) {
			if (!req.body.noLimit) {
				rows = rows.slice(0, process.env.RESULT_LIMIT || 50_000);
			}

			rows.map(row => {
				for (const [key, col] of Object.entries(row)) {
					if (Buffer.isBuffer(col)) {
						row[key] = col.toString();
					}
				}
				return row;
			});
		}

		res.send(rows);
	}

	async size(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.querySize(req.body.query, database));
	}
}

export default new Controller();
