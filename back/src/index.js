import * as dotenv from "dotenv";
import {URL} from "url";
import express from "express";
import cors from "cors";
import {promises as fsp} from "fs";
import bash from "./shared/bash.js";
import * as Sentry from "@sentry/node";

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});

const app = express();
const port = Number(process.env.API_PORT);

if (process.env.NODE_ENV === "production") {
	Sentry.init({
		dsn: "https://glet_4aa313505f2ab7f4bb992102d99bbc1b@observe.gitlab.com:443/errortracking/api/v1/projects/42963773",
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Sentry.Integrations.Express({ app }),
		],
		tracesSampleRate: 0.2,
		profilesSampleRate: 0.2,
	});
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
	app.use(Sentry.Handlers.errorHandler());
}

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(dirname + "front"));

const endpointPath = dirname + "endpoint";
const entries = await fsp.readdir(endpointPath);

for (const entry of entries) {
	const router = await import(`${endpointPath}/${entry}/route.js`);
	app.use(`/api/${entry}`, router.default);
}

app.all("*", (req, res) => {
	res.status(404).send("Not Found");
});

export const server = app.listen(port, () => {
	const cid = bash.startCommand("WebDB App running", "database", port);
	bash.endCommand(cid,  "rows", "ping_");
});

throw new Error("lol");
