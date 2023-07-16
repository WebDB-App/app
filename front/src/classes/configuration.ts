const localStorageName = "configuration";

interface Config {
	name: string,
	description: string,
	values: any[]
}

export class Configuration {

	name!: string;
	value: any;

	configs: Config[] = [
		{
			name: 'operand',
			description: 'Which operand to use between filter (chips)',
			values: ['AND', 'OR']
		}, {
			name: 'openAIModel',
			description: 'Which OpenAI model to use',
			values: ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k']
		}, {
			name: 'reloadData',
			description: 'Time in second to reload data when activated',
			values: ['3', '5', '10', '20']
		}, {
			name: 'useNameDel',
			description: 'Use special char to enclose table and column name',
			values: [false, true]
		}
	];

	constructor() {
		for (const config of this.configs) {
			const value = this.getByName(config.name);
			if (value === undefined) {
				this.update(config.name, config.values[0]);
			}
		}
	}

	getByName(name: string): Configuration | null {
		const configs = JSON.parse(localStorage.getItem(localStorageName) || "[]");

		return configs.find((config: Configuration) => config.name === name);
	}

	update(name: string, value: any) {
		const configs = JSON.parse(localStorage.getItem(localStorageName) || "[]");

		if (!this.getByName(name)) {
			configs.push({name: name, value});
		} else {
			configs[configs.findIndex((conf: Configuration) => conf.name === name)] = {name: name, value};
		}

		localStorage.setItem(localStorageName, JSON.stringify(configs));
	}
}
