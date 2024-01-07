import {describe} from "node:test"
import {loadConfig, runBash} from "./config.js";
import list from "./servers.js";
import {getScenarios, getTags, runWebDB} from "./helper.js"

const scenarios = await getScenarios();
runWebDB();

async function runDocker(database, tag) {
	runBash(`docker rm -f $(docker container ls --format="{{.ID}}\t{{.Ports}}" | grep ${database.credentials.port} | awk '{print $1}') 2> /dev/null || echo`)
	runBash(`docker pull ${database.docker.name}:${tag} --quiet`);
	const id = runBash(`docker run -d -p ${database.credentials.port}:${database.internal_port} ${database.docker.env.map(env => ` -e ${env}`).join(' ')} ${database.docker.name}:${tag} ${database.docker.cmd || ''}`);
	runBash(`sleep 15`);
	return id;
}

async function runScenarios(server) {
	const digests = await getTags(server.docker);

	for (const tags of digests) {
		const config = await loadConfig(server);
		if (!config) {
			continue;
		}

		/*if (tags[0] !== "5") {
			continue;
		}*/

		const cname = await runDocker(config, tags[0]);
		if (!cname) {
			continue;
		}

		for (const scenario of scenarios) {
			const r = await new Promise(async resolve => {
				await describe(config.docker.name + ':' + tags[0], {}, async (context, t) => {
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

if (process.env.CI) {
	for (const server of Object.values(list)) {
		await runScenarios(server);
	}
} else {
	await runScenarios(list.mysql);
	process.exit();
}
