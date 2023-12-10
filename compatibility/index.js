import {describe} from "node:test"
import {changeServer, runBash} from "./config.js";
import list from "./servers.js";
import {getScenarios, getTags} from "./helper.js"

const scenarios = await getScenarios();

async function runScenarios(server) {
	const digests = await getTags(server.docker);

	for (const tags of digests) {
		const config = await changeServer(server, tags[0]);
		if (!config) {
			continue;
		}

		for (const scenario of scenarios) {
			const r = await new Promise(async resolve => {
				await describe(config.docker.name + ':' + tags[0], {}, async (context, t) => {
					try {
						await scenario(config);
						resolve(true);
					} catch (e) {
						console.error(e.message);
						resolve(false);
					}
				});
			});
			if (!r) {
				break;
			}
		}
		runBash(`docker rm -f ${config.docker.cname}`);
	}
}

if (process.env.CI) {
	for (const server of Object.values(list)) {
		await runScenarios(server);
	}
} else {
	await runScenarios(list.postgres);
	process.exit();
}
