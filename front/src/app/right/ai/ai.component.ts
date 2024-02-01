import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { Licence } from "../../../classes/licence";
import { RequestService } from "../../../shared/request.service";
import { OpenAI } from "openai";
import { Configuration } from "../../../classes/configuration";
import { marked } from 'marked';
import { DrawerService } from "../../../shared/drawer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getStorageKey, isSQL, scrollToBottom } from "../../../shared/helper";
import { Subscription } from "rxjs";
import { Table } from "../../../classes/table";
import { Router } from "@angular/router";
import { ChatCompletionCreateParamsStreaming } from "openai/src/resources/chat/completions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const localKeyConfig = 'ia-config';

enum Provider {
	openai = "OpenAI",
	gemini = "Gemini",
	together = "TogetherAI",
}

enum Role {
	System = 'system',
	User = 'user',
	Assistant = 'assistant',
}

class Msg {
	user!: Role;
	error = false;
	marked?: { code?: string, html?: string }[];
	txt!: string;
	hide?: boolean;
	config?: {};

	constructor(txt: string, user: Role, error = false, config: any = {}) {
		this.txt = txt;
		this.user = user;
		this.error = error;
		this.marked = [];
		this.hide = false;

		if (config) {
			this.config = {
				model: config.model,
				temperature: config.temperature,
				top_p: config.top_p,
			};
		}

		const parser = new DOMParser();
		const mark = marked(txt, {mangle: false, headerIds: false});
		const htmlDoc = parser.parseFromString(mark, 'text/html');

		for (const child of htmlDoc.body.children) {
			if ((child.innerHTML.startsWith("<code") || child.innerHTML.startsWith("<pre")) && user === Role.Assistant) {
				this.marked.push({code: child.getElementsByTagName('code')[0].outerText});
			} else {
				this.marked.push({html: child.innerHTML});
			}
		}
	}
}

@Component({
	selector: 'app-ai',
	templateUrl: './ai.component.html',
	styleUrls: ['./ai.component.scss']
})
export class AiComponent implements OnInit, OnDestroy {

	drawerObs!: Subscription
	selectedServer?: Server;
	selectedDatabase?: Database;
	licence?: Licence;
	configuration: Configuration = new Configuration();
	initialized = false
	models: { [key: string]: { shortName: string; fullName: string }[] } = {};
	Role = Role;
	examples = [
		'Adapt this query to retrieve "registering_date" : `SELECT email, password FROM users WHERE email LIKE ?`',
		'I need to store a new entity called licence, with "1,1" relation with user, give me the plan to do it',
		'Give me, in SQL, the CRUD queries for user',
		'Explain me the purpose of my database',
		'How to find the last inserted row in Entity Framework ?', 'Can you optimize : `SELECT * FROM users WHERE email LIKE ?`',
		'Create a trigger checking password strength before inserting',
		'Here is, with PDO, the query to insert ... can you help me fixing it',
		'Give me, with Mongoose the listing of all user',
		'Optimize the performance of my server, you can asked me query or command to run for this'
	]
	localKeyChatHistory!: string;
	localKeyPreSent!: string;
	chat: Msg[] = [];
	openai?: OpenAI;
	gemini?: GoogleGenerativeAI;
	isLoading = true;
	editorOptions = {
		language: "plaintext"
	};
	sample = "";
	config = {
		model: "gpt-3.5-turbo-16k",
		openAI: '',
		gemini: '',
		together: '',
		temperature: 1,
		top_p: 1
	};
	preSent = {
		tables: [""],
		deep: 2,
		count: 5,
		anonymize: 0
	}
	stream?: string;
	abort = false;
	showPrompt = false;
	atBottom = true;

	@ViewChild('scrollContainer') public scrollContainer!: ElementRef;
	protected readonly Math = Math;
	protected readonly Object = Object;
	protected readonly isSQL = isSQL;
	protected readonly JSON = JSON;

	constructor(
		private request: RequestService,
		private drawer: DrawerService,
		private router: Router,
		public snackBar: MatSnackBar
	) {
		const local = localStorage.getItem(localKeyConfig);
		if (local) {
			this.config = JSON.parse(local);
		}
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

		this.drawerObs = this.drawer.drawer.openedChange.subscribe(async (state: boolean) => {
			if (state && !this.initialized) {
				this.initialized = true;
				scrollToBottom(this.scrollContainer);
			}

			const question = this.drawer.lastData;
			if (question) {
				await this.sendMessage(question);
			}
		});

		this.localKeyChatHistory = getStorageKey("chat");
		this.localKeyPreSent = getStorageKey("preSent");

		const msgs = JSON.parse(localStorage.getItem(this.localKeyChatHistory) || '[]');
		this.chat = msgs.map((msg: Msg) => new Msg(msg.txt, msg.user, msg.error, msg.config));

		const pre = localStorage.getItem(this.localKeyPreSent);
		if (pre) {
			this.preSent = JSON.parse(pre);
		}

		await Promise.all([
			(this.licence = await Licence.getCached()),
			this.configChange(false),
			this.preSentChange(),
		]);

		this.isLoading = false;
	}

	ngOnDestroy() {
		this.drawerObs.unsubscribe();
	}

	async configChange(snack = true) {
		localStorage.setItem(localKeyConfig, JSON.stringify(this.config));
		this.models = {};

		if (this.config.openAI) {
			this.openai = new OpenAI({
				apiKey: this.config.openAI,
				dangerouslyAllowBrowser: true
			});
			this.models[Provider.openai] = [
				{shortName: "gpt-4", fullName: "gpt-4"},
				{shortName: "gpt-4-32k", fullName: "gpt-4-32k"},
				{shortName: "gpt-4-32k-0613", fullName: "gpt-4-32k-0613"},
				{shortName: "gpt-4-1106-preview", fullName: "gpt-4-1106-preview"},
				{shortName: "gpt-4-turbo-preview", fullName: "gpt-4-turbo-preview"},
				{shortName: "gpt-4-vision-preview", fullName: "gpt-4-vision-preview"},
				{shortName: "gpt-3.5-turbo", fullName: "gpt-3.5-turbo"},
				{shortName: "gpt-3.5-turbo-16k", fullName: "gpt-3.5-turbo-16k"},
				{shortName: "gpt-3.5-turbo-1106", fullName: "gpt-3.5-turbo-1106"},
				{shortName: "gpt-3.5-turbo-instruct", fullName: "gpt-3.5-turbo-instruct"},

			];
		}

		if (this.config.together) {
			this.models[Provider.together] = [
				{shortName: "alpaca-7b", fullName: "togethercomputer/alpaca-7b"},
				{shortName: "chronos-hermes-13b", fullName: "Austism/chronos-hermes-13b"},
				{shortName: "CodeLlama-13b", fullName: "togethercomputer/CodeLlama-13b"},
				{shortName: "CodeLlama-13b-Instruct", fullName: "togethercomputer/CodeLlama-13b-Instruct"},
				{shortName: "CodeLlama-13b-Python", fullName: "togethercomputer/CodeLlama-13b-Python"},
				{shortName: "CodeLlama-34b", fullName: "togethercomputer/CodeLlama-34b"},
				{shortName: "CodeLlama-34b-Instruct", fullName: "togethercomputer/CodeLlama-34b-Instruct"},
				{shortName: "CodeLlama-34b-Python", fullName: "togethercomputer/CodeLlama-34b-Python"},
				{shortName: "CodeLlama-7b", fullName: "togethercomputer/CodeLlama-7b"},
				{shortName: "CodeLlama-7b-Instruct", fullName: "togethercomputer/CodeLlama-7b-Instruct"},
				{shortName: "CodeLlama-7b-Python", fullName: "togethercomputer/CodeLlama-7b-Python"},
				{shortName: "DiscoLM-mixtral-8x7b-v2", fullName: "DiscoResearch/DiscoLM-mixtral-8x7b-v2"},
				{shortName: "falcon-40b-instruct", fullName: "togethercomputer/falcon-40b-instruct"},
				{shortName: "falcon-7b-instruct", fullName: "togethercomputer/falcon-7b-instruct"},
				{shortName: "GPT-NeoXT-Chat-Base-20B", fullName: "togethercomputer/GPT-NeoXT-Chat-Base-20B"},
				{shortName: "llama-2-13b-chat", fullName: "togethercomputer/llama-2-13b-chat"},
				{shortName: "llama-2-70b-chat", fullName: "togethercomputer/llama-2-70b-chat"},
				{shortName: "Llama-2-7B-32K-Instruct", fullName: "togethercomputer/Llama-2-7B-32K-Instruct"},
				{shortName: "llama-2-7b-chat", fullName: "togethercomputer/llama-2-7b-chat"},
				{shortName: "Mistral-7B-Instruct-v0.1", fullName: "mistralai/Mistral-7B-Instruct-v0.1"},
				{shortName: "Mistral-7B-Instruct-v0.2", fullName: "mistralai/Mistral-7B-Instruct-v0.2"},
				{shortName: "Mistral-7B-OpenOrca", fullName: "Open-Orca/Mistral-7B-OpenOrca"},
				{shortName: "Mixtral-8x7B-Instruct-v0.1", fullName: "mistralai/Mixtral-8x7B-Instruct-v0.1"},
				{shortName: "MythoMax-L2-13b", fullName: "Gryphe/MythoMax-L2-13b"},
				{shortName: "Nous-Capybara-7B-V1p9", fullName: "NousResearch/Nous-Capybara-7B-V1p9"},
				{shortName: "Nous-Hermes-2-Mixtral-8x7B-DPO", fullName: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO"},
				{shortName: "Nous-Hermes-2-Mixtral-8x7B-SFT", fullName: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT"},
				{shortName: "Nous-Hermes-2-Yi-34B", fullName: "NousResearch/Nous-Hermes-2-Yi-34B"},
				{shortName: "Nous-Hermes-llama-2-7b", fullName: "NousResearch/Nous-Hermes-llama-2-7b"},
				{shortName: "Nous-Hermes-Llama2-13b", fullName: "NousResearch/Nous-Hermes-Llama2-13b"},
				{shortName: "Nous-Hermes-Llama2-70b", fullName: "NousResearch/Nous-Hermes-Llama2-70b"},
				{shortName: "openchat-3.5-1210", fullName: "openchat/openchat-3.5-1210"},
				{shortName: "OpenHermes-2-Mistral-7B", fullName: "teknium/OpenHermes-2-Mistral-7B"},
				{shortName: "OpenHermes-2p5-Mistral-7B", fullName: "teknium/OpenHermes-2p5-Mistral-7B"},
				{shortName: "Phind-CodeLlama-34B-Python-v1", fullName: "Phind/Phind-CodeLlama-34B-Python-v1"},
				{shortName: "Phind-CodeLlama-34B-v2", fullName: "Phind/Phind-CodeLlama-34B-v2"},
				{shortName: "Platypus2-70B-instruct", fullName: "garage-bAInd/Platypus2-70B-instruct"},
				{shortName: "Pythia-Chat-Base-7B-v0.16", fullName: "togethercomputer/Pythia-Chat-Base-7B-v0.16"},
				{shortName: "Qwen-7B-Chat", fullName: "togethercomputer/Qwen-7B-Chat"},
				{shortName: "RedPajama-INCITE-7B-Chat", fullName: "togethercomputer/RedPajama-INCITE-7B-Chat"},
				{shortName: "RedPajama-INCITE-Chat-3B-v1", fullName: "togethercomputer/RedPajama-INCITE-Chat-3B-v1"},
				{shortName: "ReMM-SLERP-L2-13B", fullName: "Undi95/ReMM-SLERP-L2-13B"},
				{shortName: "Snorkel-Mistral-PairRM-DPO", fullName: "snorkelai/Snorkel-Mistral-PairRM-DPO"},
				{shortName: "SOLAR-0-70b-16bit", fullName: "upstage/SOLAR-0-70b-16bit"},
				{shortName: "SOLAR-10.7B-Instruct-v1.0", fullName: "upstage/SOLAR-10.7B-Instruct-v1.0"},
				{shortName: "StripedHyena-Nous-7B", fullName: "togethercomputer/StripedHyena-Nous-7B"},
				{shortName: "Toppy-M-7B", fullName: "Undi95/Toppy-M-7B"},
				{shortName: "vicuna-13b-v1.5", fullName: "lmsys/vicuna-13b-v1.5"},
				{shortName: "vicuna-13b-v1.5-16k", fullName: "lmsys/vicuna-13b-v1.5-16k"},
				{shortName: "vicuna-7b-v1.5", fullName: "lmsys/vicuna-7b-v1.5"},
				{shortName: "WizardCoder-15B-V1.0", fullName: "WizardLM/WizardCoder-15B-V1.0"},
				{shortName: "WizardCoder-Python-34B-V1.0", fullName: "WizardLM/WizardCoder-Python-34B-V1.0"},
				{shortName: "WizardLM-13B-V1.2", fullName: "WizardLM/WizardLM-13B-V1.2"},
				{shortName: "Yi-34B-Chat", fullName: "zero-one-ai/Yi-34B-Chat"},
			];
		}

		if (this.config.gemini) {
			this.gemini = new GoogleGenerativeAI(this.config.gemini);
			this.models[Provider.gemini] = [
				{shortName: "gemini-pro", fullName: "gemini-pro"},
				{shortName: "gemini-ultra", fullName: "gemini-ultra"},
			];
		}

		if (snack) {
			this.snackBar.open("Settings saved", "⨉", {duration: 3000});
		}
	}

	async preSentChange() {
		localStorage.setItem(this.localKeyPreSent, JSON.stringify(this.preSent));
		if (this.preSent.tables[0] === "") {
			this.preSent.tables = this.selectedDatabase?.tables?.map(table => table.name)!;
		}
		this.sample = (await this.request.post('database/sample', {preSent: this.preSent}, undefined)).txt;
	}

	saveChat() {
		const copy = JSON.parse(JSON.stringify(this.chat));
		localStorage.setItem(this.localKeyChatHistory, JSON.stringify(copy.map((ch: Msg) => {
			delete ch.marked;
			return ch;
		})));
	}

	readChunks(reader: ReadableStreamDefaultReader) {
		return {
			async* [Symbol.asyncIterator]() {
				let readResult = await reader.read();
				while (!readResult.done) {
					yield readResult.value;
					readResult = await reader.read();
				}
			},
		};
	}

	async sendMessage(txt: string) {
		txt = txt.trim();
		if (!txt) {
			return;
		}

		this.chat.push(new Msg(txt, Role.User));
		scrollToBottom(this.scrollContainer);

		let provider = "";
		for (const [pro, models] of Object.entries(this.models)) {
			if (models.map(model => model.fullName).indexOf(this.config.model) >= 0) {
				provider = pro;
				break;
			}
		}

		this.stream = "Sending prompt ...";
		const body = {
			model: this.config.model,
			messages: [
				{role: Role.System, content: this.sample},
				...(this.chat.map(ch => { return {role: ch.user, content: ch.txt}
				}))
			],
			stream: true,
			temperature: this.config.temperature,
			top_p: this.config.top_p
		};

		await this.askLLM(provider, body);

		this.stream = undefined;
		scrollToBottom(this.scrollContainer);
		this.saveChat();
	}

	async askLLM(provider: string, body: any) {
		const streamReady = () => {
			return this.stream = '';
		}

		if (provider === Provider.openai) {
			const stream = this.openai!.chat.completions.create(<ChatCompletionCreateParamsStreaming>body);

			this.chat.push(await new Promise<Msg>(resolve => {
				stream.then(async str => {
					streamReady();
					for await (const part of str) {
						if (this.abort) {
							this.abort = false;
							str.controller.abort();
						}

						this.stream += part.choices[0]?.delta?.content || '';

						if (this.atBottom) {
							scrollToBottom(this.scrollContainer);
						}
					}
					resolve(new Msg(this.stream!, Role.Assistant, false, body));
				}).catch(error => {
					resolve(new Msg(error.message || `An error occurred during OpenAI request: ` + error, Role.Assistant, true));
				});
			}));
		} else if (provider === Provider.together) {
			this.chat.push(await new Promise<Msg>(async resolve => {
				const decoder = new TextDecoder();
				const options = {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						authorization: 'Bearer ' + this.config.together
					},
					body: JSON.stringify(body)
				};

				try {
					const stream = await fetch('https://api.together.xyz/api/inference', options);
					const reader = stream.body!.getReader();
					if (!stream.ok) {
						throw decoder.decode((await reader.read()).value);
					}

					streamReady();
					for await (let chunks of this.readChunks(reader)) {
						for (let chunk of decoder.decode(chunks).split('data: ')) {
							try {
								const msg = JSON.parse(chunk);
								this.stream += msg.choices[0]?.text || '';
								if (this.atBottom) {
									scrollToBottom(this.scrollContainer);
								}
							} catch (e) {
							}
						}
						if (this.abort) {
							this.abort = false;
							break;
						}
					}

					resolve(new Msg(this.stream!, Role.Assistant, false, body));
				} catch (error: any) {
					resolve(new Msg(error.error || `An error occurred during Together request: ` + error, Role.Assistant, true));
				}
			}));
		} else if (provider === Provider.gemini) {
			const model = this.gemini!.getGenerativeModel({
				model: this.config.model,
				generationConfig: {
					topP: this.config.top_p,
					temperature: this.config.temperature,
				}
			});

			this.chat.push(await new Promise<Msg>(async resolve => {
				try {
					const result = await model.generateContentStream([
						this.sample,
						...(this.chat.map(ch => {
							return ch.txt;
						}))
					]);
					streamReady();
					for await (const chunk of result.stream) {
						if (this.abort) {
							this.abort = false;
							break;
						}
						this.stream += chunk.text();
						if (this.atBottom) {
							scrollToBottom(this.scrollContainer);
						}
					}
					resolve(new Msg(this.stream!, Role.Assistant, false, body));
				} catch (error: any) {
					resolve(new Msg(error.error?.message || `An error occurred during Google request: ` + error, Role.Assistant, true));
				}
			}));
		}
	}

	async runQuery(query: string) {
		try {
			const result = await this.request.post('database/query', {
				query: query,
				pageSize: 15,
				page: 0
			}, undefined, undefined, undefined, undefined, false);
			await this.sendMessage("Here is the result of the query `" + query + "` : " + JSON.stringify(result));
		} catch (err: any) {
			await this.sendMessage("There is an error : " + err.error);
		}
	}

	goToQuery(query: string) {
		this.router.navigate([Server.getSelected().name, Database.getSelected().name, Table.getSelected().name, 'query', query]);
		this.drawer.close();
	}

	filterChanged(_value = '') {
		const value = _value.toLowerCase();
		for (const [index, msg] of this.chat.entries()) {
			let founded = msg.txt.toLowerCase().indexOf(value) >= 0;
			if (!founded && msg.marked) {
				founded = msg.marked?.findIndex(mark => {
					return mark.code ? mark.code.toLowerCase().indexOf(value) >= 0 : false;
				}) >= 0;
			}

			this.chat[index].hide = !founded;
		}
	}

	alternative() {
		this.sendMessage(this.chat.reverse().find(chat => chat.user === Role.User)!.txt);
	}

	goodOpenAIKey() {
		if (!this.config.openAI) {
			return true;
		}
		return !!this.config.openAI.match(/^sk-[a-zA-Z0-9]{32,}$/);
	}

	goodGemini() {
		if (!this.config.gemini) {
			return true;
		}
		return !!this.config.gemini.match(/^[a-zA-Z0-9-_]{39,}$/);
	}

	goodTogetherKey() {
		if (!this.config.together) {
			return true;
		}
		return !!this.config.together.match(/^[a-zA-Z0-9]{64,}$/);
	}

	onScroll(event: any) {
		this.atBottom = event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight;
	}
}
