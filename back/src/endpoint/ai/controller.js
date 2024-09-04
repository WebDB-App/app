import http from "../../shared/http.js";

class Controller {

	async togetherModels(req, res) {
		const finals = [];

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000);

		try {
			const stream = await fetch("https://api.together.xyz/api/models", {
				method: "GET",
				signal: controller.signal,
				headers: {
					"content-type": "application/json",
					authorization: "Bearer " + req.body.key
				},
			});
			clearTimeout(timeoutId);
			let models = await stream.json();

			models = models.map(model => {
				model.shortName = model.name.split("/")[1];
				model.fullName = model.name;
				return model;
			});
			models.sort((a, b) => a.shortName?.toLowerCase().localeCompare(b.shortName?.toLowerCase()));

			for (const mod of models) {
				if (mod.display_type !== "chat" && mod.display_type !== "code") {
					continue;
				}
				if (!mod.instances) {
					continue;
				}
				finals.push({shortName: mod.shortName, fullName: mod.fullName});
			}
		} catch (e) { /* empty */ }

		res.send(finals);
	}

	async sample(req, res) {
		const [wrapper, database] = await http.getLoggedDriver(req);

		let txt = `I'm WebDB, a database IDE.
There is a database called "${database}" on a ${wrapper.constructor.name} server containing following entities:
`;

		const tables = await wrapper.sampleDatabase(database, req.body.preSent);
		for (const table of tables) {

			const indexes = Object.keys(table.data);
			for (const [index, row] of Object.entries(table.data)) {
				for (const [key, value] of Object.entries(row)) {

					if (Buffer.isBuffer(value)) {
						delete table.data[index][key];
						continue;
					}
					if (req.body.preSent.anonymize === 1) {
						table.data[indexes[Math.floor(Math.random() * indexes.length)]][key] = value;
					}
					if (req.body.preSent.anonymize === 2) {
						table.data[index][key] = value === null ? "null" : value.constructor.name;
					}
				}
			}
			txt += `— \`\`\`${table.structure}\`\`\``;
			if (table.data) {
				txt += `\n with this data: \`\`\`${JSON.stringify(table.data)}\`\`\``;
			}
			txt += ".\n\n";
		}

		txt += `So you are an expert in database and IT science. Your goal is to provide the most personalize answers.
Ask as many questions as need to provide the most accurate answer possible.
Don't make presumption, use only provided data.`;

		res.send({txt});
	}
}

export default new Controller();
