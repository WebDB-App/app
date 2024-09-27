import {join} from "path";
import {promises as fsp} from "fs";
import {URL} from "url";
import {runBash} from "./api.js";

export function runWebDB() {
	if (!process.env.CI) {
		return;
	}
	runBash("docker rm -f webdb_comp; docker run --name webdb_comp -d --restart=always --add-host=\"host.docker.internal:host-gateway\" -p 22070:22071 webdb_local");
	runBash("sleep 1");
}

export function getDatabase(dbs, dbName) {
	return dbs.find(db => db.name === dbName);
}

export async function iterateDir(dir) {
	const dirname = new URL(".", import.meta.url).pathname;
	const endpointPath = join(dirname, dir);
	const entries = (await fsp.readdir(endpointPath)).filter(entry => !entry.startsWith("."));
	entries.sort((a, b) => {
		return +a.split("-")[0] - +b.split("-")[0];
	});

	return entries.map(entry => join(endpointPath, entry));
}

export async function getScenarios() {
	const files = await iterateDir("scenarios");

	const loaded = [];
	for (const file of files) {
		const test = await import(file);
		if (test.default) {
			loaded.push(test.default);
		}
	}
	return loaded;
}

export async function getTags(docker) {
	const tags = await (await fetch(`https://registry.hub.docker.com/v2/repositories/${docker.name}/tags?page_size=150`)).json();
	let digests = [];
	tags.results.map(tag => {
		if (docker.exclusions && docker.exclusions.find(exclusion => tag.name.indexOf(exclusion) >= 0)) {
			return;
		}
		if (!tag.images.find(image => image.architecture === "amd64")) {
			return;
		}
		if (!digests[tag.digest]) {
			digests[tag.digest] = [];
		}
		digests[tag.digest].push(tag.name);
	});

	return Object.values(digests).slice(0, process.env.CI_PIPELINE_SOURCE === "schedule" ? 8 : 1).map(values => {
		return values.sort();
	});
}
