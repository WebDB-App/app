import * as dotenv from "dotenv";
import {URL} from "url";
import express from "express";
import cors from "cors";
import {promises as fsp} from "fs";
import bash from "./shared/bash.js";

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});

const app = express();
const port = Number(process.env.API_PORT);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(dirname + "front"));

(async () => {
	const endpointPath = dirname + "endpoint";
	const entries = await fsp.readdir(endpointPath);

	for (const entry of entries) {
		const router = await import(`${endpointPath}/${entry}/route.js`);
		app.use(`/api/${entry}`, router.default);
	}

	app.all("*", (req, res) => {
		res.status(404).send("Not Found");
	});

	app.listen(port, () => {
		bash.logCommand("WebDB App running", "database", "ping_", port, "r_size");
	});
})();
