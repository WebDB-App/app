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

async function runDocker(database, tag) {
	runBash(`docker rm -f $(docker container ls --format="{{.ID}}\t{{.Ports}}" | grep ${database.credentials.port} | awk '{print $1}') 2> /dev/null || echo`)
	runBash(`docker pull ${database.docker.name}:${tag} --quiet`);
	const id = runBash(`docker run -d -p ${database.credentials.port}:${database.internal_port} ${database.docker.env.map(env => ` -e ${env}`).join(' ')} ${database.docker.name}:${tag} ${database.docker.cmd || ''}`);
	await new Promise(resolve => {
		setTimeout(resolve, 15_000);
	});
	return id;
}

export async function changeServer(server, tag) {
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

	conf.docker.cname = await runDocker(conf, tag);
	if (!conf.docker.cname) {
		return false;
	}

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
