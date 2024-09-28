import {execSync} from "child_process";
import {fetchToCurl} from "fetch-to-curl";
import {base} from "./docker.js";

export const basicConf = {
	credentials: {
		user: "root",
		password: "pass#();"
	}
};

export function runBash(cmd) {
	if (!process.env.CI) {
		console.log(cmd);
	}
	try {
		return execSync(cmd).toString();
	} catch (e) {
		console.error(e);
	}
}

export const listenAddr = "http://127.0.0.1:22070/";
const apiAddr = listenAddr + "api/";
const globalHeaders = {
	"Content-Type": "application/json"
};

export async function loadConfig(server) {
	const conf = {...basicConf, ...server};
	conf.database = "world" + (conf.base === base.PostgreSQL ? " | public" : "");
	conf.credentials.wrapper = conf.wrapper;
	conf.credentials.port = conf.external_port;
	conf.credentials.params = conf.params || {};

	conf.credentials.host = "127.0.0.1";
	if (process.env.DEV_DOCKER === "true") {
		conf.credentials.host = "host.docker.internal";
	} else if (process.env.DEV_LOCAL === "true") {
		conf.credentials.host = "127.0.0.1";
	} else if (process.env.CI) {
		conf.credentials.host = "host.docker.internal";
	}

	globalHeaders["Server"] = JSON.stringify(conf.credentials);
	globalHeaders["Database"] = conf.database;

	return conf;
}

async function runFetch(url, init) {
	url = apiAddr + url;
	if (!process.env.CI) {
		console.log(fetchToCurl(url, init));
	}

	/*
	const response = await fetch(url, init);
	return await response.json();
	 */
	//TODO fix when node ready
	let succeed = false;
	let tries = 0;
	do {
		try {
			const response = await fetch(url, init);
			succeed = true;
			return await response.json();
		} catch (e) { /* empty */ }
	} while (++tries < 3 && !succeed);
}

export async function get(url) {
	return await runFetch(url, {
		headers: globalHeaders,
		method: "GET"
	});
}

export async function post(url, body, _headers) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), process.env.CI ? 60_000 : 600_000);
	const headers = {...globalHeaders, ..._headers};

	const r = await runFetch(url, {
		body: JSON.stringify(body),
		headers,
		method: "POST",
		signal: controller.signal
	});
	clearTimeout(id);
	return r;
}

export async function multipart(url, body, _headers) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), process.env.CI ? 60_000 : 600_000);

	const headers = {...globalHeaders, ..._headers};
	delete headers["Content-Type"];

	const r = await runFetch(url, {
		body,
		headers,
		method: "POST",
		signal: controller.signal
	});
	clearTimeout(id);
	return r;
}


