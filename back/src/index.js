import dotenv from "dotenv";
import {URL} from "url";
import express from "express";
import {} from "express-async-errors";
import cors from "cors";
import {promises as fsp} from "fs";
import bash from "./shared/bash.js";
import {join} from "path";
import Sentry from "@sentry/node";
import compression from "compression";
import mime from "mime";
import { createRequire } from "node:module";
import Log from "./shared/log.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});

const app = express();
const port = Number(process.env.API_PORT);

if (process.env.NODE_ENV === "production" && process.env.PRIVATE_MODE !== "true") {
	Sentry.init({
		dsn: "https://e843f879c58b6761baea7c081204bae4@o4507908014473216.ingest.de.sentry.io/4507908019388496",
		release: version,
		integrations: [
			new Sentry.Integrations.Http({tracing: true}),
			new Sentry.Integrations.Express({app}),
		],
		tracesSampleRate: 1
	});
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
	app.use(Sentry.Handlers.errorHandler());
}

app.use(compression());
app.use(cors({origin: "*"}));
app.use(express.json({limit: "50mb"}));
app.use(express.static(join(dirname, "../static/"), {
	setHeaders: function (res, path) {
		const cached = ["text/html", "text/css", "text/javascript", "image/svg+xml", "font/ttf", "font/woff2"];
		if (cached.indexOf(mime.getType(path)) >= 0) {
			res.setHeader("Cache-Control", "public, max-age=7200");
		}
	}
}));
app.use(function (req, res, next) {
	req.startTime = (new Date()).getTime();
	next();
});

(async () => {
	const endpointPath = join(dirname, "./endpoint/");
	const entries = await fsp.readdir(endpointPath);
	for (const entry of entries) {
		const router = await import(`${endpointPath}/${entry}/route.js`);
		app.use(`/api/${entry}`, router.default);
	}

	app.use((err, req, res, next) => {
		if (err) {
			res.send({ error: err.message });
		}
		next(err);
	});

	app.all("*", (req, res) => {
		res.status(404).send("Not Found");
	});

	app.listen(port, () => {
		bash.endCommand(bash.startCommand("WebDB App running", "database", 0), "rows", "ping_");
	});
})();

function exit() {
	console.info("Exiting WebDB");
	process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
process.on("uncaughtException", (error) => {
	Log.error(error);
	exit();
});
process.on("unhandledRejection", (error) => {
	Log.error(error);
	exit();
});
