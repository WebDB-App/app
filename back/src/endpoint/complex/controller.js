import http from "../../shared/http.js";

class Controller {

	async drop(req, res) {
		const [driver, database] = await http.getLoggedDriver(req);

		res.send(await driver.dropComplex(req.body.complex, req.body.type, database));
	}
}

export default new Controller();
