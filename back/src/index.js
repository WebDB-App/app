const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const fsp = require("fs").promises;
const bash = require("./shared/bash.js");
const {join} = require("path");
const Sentry = require("@sentry/node");
const compression = require("compression");

dotenv.config({path: join(__dirname, "../.env")});

const app = express();
const port = Number(process.env.API_PORT);

if (process.env.NODE_ENV === "production") {
	Sentry.init({
		dsn: "https://glet_4aa313505f2ab7f4bb992102d99bbc1b@observe.gitlab.com:443/errortracking/api/v1/projects/42963773",
		integrations: [
			new Sentry.Integrations.Http({tracing: true}),
			new Sentry.Integrations.Express({app}),
		],
		tracesSampleRate: 0.2,
		profilesSampleRate: 0.2,
	});
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
	app.use(Sentry.Handlers.errorHandler());
}

app.use(compression());
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(join(__dirname, "../static/")));

(async () => {
	const endpointPath = join(__dirname, "./endpoint/");
	const entries = await fsp.readdir(endpointPath);
	for (const entry of entries) {
		const router = await require(`${endpointPath}/${entry}/route.js`);
		app.use(`/api/${entry}`, router);
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
