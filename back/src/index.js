import dotenv from "dotenv";
import {URL} from "url";
import express from "express";
import cors from "cors";
import {promises as fsp} from "fs";
import bash from "./shared/bash.js";
import {join} from "path";
import Sentry from "@sentry/node";
import {nodeProfilingIntegration} from "@sentry/profiling-node";
import compression from "compression";
import mime from "mime";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});

const app = express();
const port = Number(process.env.API_PORT);

if (process.env.NODE_ENV === "production") {
	Sentry.init({
		dsn: "https://e843f879c58b6761baea7c081204bae4@o4507908014473216.ingest.de.sentry.io/4507908019388496",
		release: version,
		integrations: [
			new Sentry.Integrations.Http({tracing: true}),
			new Sentry.Integrations.Express({app}),
			nodeProfilingIntegration()
		],
		tracesSampleRate: 1,
		profilesSampleRate: 1
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
			res.set("Document-Policy", "js-profiling");
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

	app.all("*", (req, res) => {
		res.status(404).send("Not Found");
	});

	app.listen(port, () => {
		bash.endCommand(bash.startCommand("WebDB App running", "database", port), "rows", "ping_");
	});
})();

function exit() {
	console.info("Exiting WebDB");
	process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
process.on("uncaughtException", (error) => {
	console.error(error);
	exit();
});
process.on("unhandledRejection", (error) => {
	console.error(error);
	exit();
});
