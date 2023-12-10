import axios from "axios";
import {execSync} from "child_process";

export const basicConf = {
	api: "http://127.0.0.1:22070/api/"
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

export async function loadConfig(server) {
	const conf = {...basicConf, ...server};
	conf.database = "sakila";
	conf.table = "tableTest01";
	conf.name = "";
	conf.credentials = {
		wrapper: conf.wrapper,
		host: process.env.CI ? "host.docker.internal" : "127.0.0.1",
		port: conf.external_port,
		params: conf.params || {},
		user: "root",
		password: "notSecureChangeMe",
	};

	axios.defaults.headers.common['Server'] = JSON.stringify(conf.credentials);
	axios.defaults.headers.common['Database'] = conf.database;
	axios.defaults.headers.common['Table'] = conf.table;

	return conf;
}

if (process.env.CI) {
	axios.defaults.timeout = 15000;
}
axios.interceptors.request.use(request => {
	if (!process.env.CI) {
		console.log(request.url);
	}
	return request;
});

axios.defaults.headers.common['Content-Type'] = 'application/json';
