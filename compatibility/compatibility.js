import {describe} from "node:test";
import {loadConfig, runBash} from "./api.js";
import list from "./docker.js";
import {getScenarios, getTags, runWebDB} from "./helper.js";

const scenarios = await getScenarios();

async function runDocker(database, tag) {
	runBash(`docker rm -f $(docker container ls --format="{{.ID}}\t{{.Ports}}" | grep ${database.credentials.port} | awk '{print $1}') 2> /dev/null || echo`);
	runBash(`docker pull ${database.docker.name}:${tag} --quiet`);
	const id = runBash(`docker run -d -p ${database.credentials.port}:${database.internal_port} ${database.docker.env.map(env => ` -e ${env}`).join(" ")} ${database.docker.name}:${tag} ${database.docker.cmd || ""}`).trim();

	const maxTries = process.env.CI ? 40 : 15;
	let ready = "0";
	let tries = 0;
	do {
		ready = runBash(`sleep 1; docker exec ${id} ${database.waitCmd} 2> /dev/null && echo 1 || echo 0`);
	} while (ready?.trim() !== "1" && ++tries < maxTries);

	return id;
}

async function runScenarios(server) {
	const digests = await getTags(server.docker);

	for (const tags of digests) {
		runWebDB();

		const config = await loadConfig(server);
		if (!config) {
			continue;
		}

		/*if (tags[0] !== "16") {
			continue;
		}*/

		const cname = await runDocker(config, tags[0]);
		if (!cname) {
			continue;
		}

		for (const scenario of scenarios) {
			const r = await new Promise(async resolve => {
				await describe(config.docker.name + ":" + tags[0], {}, async () => {
					try {
						await scenario(config);
						resolve(true);
					} catch (e) {
						console.error(e);
						resolve(false);
					}
				});
			});
			if (!r) {
				break;
			}
		}
		runBash(`docker rm -f ${cname}`);
	}
}

for (const server of Object.values(list)) {
	await runScenarios(server);
}
