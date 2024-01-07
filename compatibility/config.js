import {execSync} from "child_process";

export const basicConf = {
	credentials: {
		user: "root",
		password: "notSecureChangeMe"
	}
}

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

const apiAddr = "http://127.0.0.1:22070/api/";
const globalHeaders = {
	'Content-Type': 'application/json'
};

export async function loadConfig(server) {
	const conf = {...basicConf, ...server};
	conf.database = "world";
	conf.table = "tableTest01";
	conf.name = "";
	conf.credentials.wrapper = conf.wrapper;
	conf.credentials.host = process.env.CI ? "host.docker.internal" : "127.0.0.1";
	conf.credentials.port = conf.external_port;
	conf.credentials.params = conf.params || {};

	globalHeaders['Server'] = JSON.stringify(conf.credentials);
	globalHeaders['Database'] = conf.database;
	globalHeaders['Table'] = conf.table;

	return conf;
}

export async function get(url) {
	if (!process.env.CI) {
		console.log(url);
	}
	const response = await fetch(apiAddr + url, {
		headers: globalHeaders,
		method: 'GET'
	});
	return await response.json();
}

export async function post(url, body, _headers) {
	if (!process.env.CI) {
		console.log(url);
	}

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), process.env.CI ? 60_000 : 600_000);
	const headers = {...globalHeaders, ..._headers};

	const response = await fetch(apiAddr + url, {
		body: JSON.stringify(body),
		headers,
		method: 'POST',
		signal: controller.signal
	});
	clearTimeout(id);

	return await response.json();
}

export async function multipart(url, body, _headers) {
	if (!process.env.CI) {
		console.log(url);
	}

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), process.env.CI ? 60_000 : 600_000);

	const headers = {...globalHeaders, ..._headers};
	delete headers["Content-Type"];

	const response = await fetch(apiAddr + url, {
		body,
		headers,
		method: 'POST',
		signal: controller.signal
	});
	clearTimeout(id);
	return await response.json();
}


