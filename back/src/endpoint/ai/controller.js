class Controller {

	async togetherModels(req, res) {
		const finals = [];

		try {
			const stream = await fetch("https://api.together.xyz/api/models", {
				method: "GET",
				headers: {
					"content-type": "application/json",
					authorization: "Bearer " + req.body.key
				},
			});
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
		} catch (e) {}

		res.send(finals);
	}
}

export default new Controller();
