import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
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
import { ChatCompletionCreateParamsStreaming } from "openai/src/resources/chat";
import { GoogleGenerativeAI } from "@google/generative-ai";

const localKeyConfig = 'ia-config';

enum Provider {
	openai = "OpenAI",
	gemini = "Gemini",
	together = "TogetherAI",
	gorq = "Gorq"
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

	showSettings = false;
	drawerObs!: Subscription
	selectedServer?: Server;
	selectedDatabase?: Database;
	configuration: Configuration = new Configuration();
	initialized = false
	models: { [key: string]: { shortName: string; fullName: string }[] } = {};
	Role = Role;
	examples = [
		'Adapt this query to retrieve "registering_date" : `SELECT email, password FROM users WHERE email LIKE ?`',
		'I need to store a new entity called licence, with "1,1" relation with user, give me the plan to do it',
		'Give me, in SQL, the CRUD queries for user',
		'Explain me the purpose of my database',
		'How to find the last inserted row in Entity Framework ?',
		'Can you optimize : `SELECT * FROM users WHERE email LIKE ?`',
		'Create a trigger checking password strength before inserting',
		'Give me lines to populate my database',
		'Give me, with Mongoose the listing of all user',
		'Optimize the performance of my server, you can asked me query or command to run for this'
	]
	localKeyChatHistory!: string;
	localKeyPreSent!: string;
	chat: Msg[] = [];
	openai?: OpenAI;
	gorq?: OpenAI;
	gemini?: GoogleGenerativeAI;
	loadingCount = 0;
	editorOptions = {
		language: "plaintext"
	};
	sample = "";
	config = {
		model: "",
		openAI: '',
		gemini: '',
		together: '',
		gorq: '',
		temperature: 1,
		top_p: 1
	};
	preSent = {
		tables: [""],
		deep: 2,
		count: 5,
		anonymize: 0
	}
	stream?: string | null;
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
			this.configChange(false),
			this.preSentChange(),
		]);
	}

	ngOnDestroy() {
		this.drawerObs.unsubscribe();
	}

	async configChange(snack = true) {
		this.loadingCount++;

		localStorage.setItem(localKeyConfig, JSON.stringify(this.config));
		this.models = {};
		const promises = [];

		if (this.config.openAI) {
			promises.push(new Promise(resolve => {
				this.openai = new OpenAI({
					apiKey: this.config.openAI,
					dangerouslyAllowBrowser: true
				});
				this.models[Provider.openai] = [];
				this.openai!.models.list().then(models => {
					models.data.map(model => {
						if (model.id.startsWith('gpt-')) {
							this.models[Provider.openai].push({shortName: model.id, fullName: model.id});
						}
					});
					this.models[Provider.openai].sort((a, b) => a.shortName?.toLowerCase().localeCompare(b.shortName?.toLowerCase()));
					resolve(true);
				});
			}));
		}
		if (this.config.gorq) {
			promises.push(new Promise(resolve => {
				this.gorq = new OpenAI({
					baseURL: "https://api.groq.com/openai/v1/",
					apiKey: this.config.gorq,
					dangerouslyAllowBrowser: true,
				});
				this.models[Provider.gorq] = [];
				this.gorq!.models.list().then(models => {
					models.data.map(model => {
						this.models[Provider.gorq].push({shortName: model.id, fullName: model.id});
					});
					this.models[Provider.gorq].sort((a, b) => a.shortName?.toLowerCase().localeCompare(b.shortName?.toLowerCase()));
					resolve(true);
				});
			}));
		}
		if (this.config.together) {
			promises.push(new Promise(async resolve => {
				this.models[Provider.together] = await this.request.post('ai/togetherModels', {key: this.config.together});
				resolve(true);
			}));
		}
		if (this.config.gemini) {
			promises.push(new Promise(resolve => {
				this.gemini = new GoogleGenerativeAI(this.config.gemini);
				this.models[Provider.gemini] = [
					{shortName: "gemini-1.0-pro", fullName: "gemini-1.0-pro"},
					{shortName: "gemini-1.5-pro-latest", fullName: "gemini-1.5-pro-latest"},
				];
				resolve(true);
			}));
		}
		await Promise.any(promises);
		if (snack) {
			this.snackBar.open("Settings saved", "⨉", {duration: 3000});
		}
		this.loadingCount--;
	}

	async preSentChange() {
		this.loadingCount++;

		localStorage.setItem(this.localKeyPreSent, JSON.stringify(this.preSent));
		if (this.preSent.tables[0] === "") {
			this.preSent.tables = this.selectedDatabase?.tables.map(table => table.name)!;
		}
		this.sample = (await this.request.post('ai/sample', {preSent: this.preSent}, undefined)).txt;

		this.loadingCount--;
	}

	saveChat() {
		const copy = structuredClone(this.chat);
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
		if (!provider) {
			this.chat.push(new Msg('No model selected or unavailable', Role.System, true));
			return;
		}

		this.stream = null;
		const body = {
			model: this.config.model,
			messages: [
				{role: Role.System, content: this.sample},
				...(this.chat.map(ch => {
					return {role: ch.user, content: ch.txt}
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
			this.stream = '';
		}

		const askOpenAI = async (stream: any) => {
			this.chat.push(await new Promise<Msg>(resolve => {
				stream.then(async (str: any) => {
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
				}).catch((error: any) => {
					resolve(new Msg(error.message || `An error occurred during request: ` + error, Role.Assistant, true));
				});
			}));
		}

		if (provider === Provider.openai) {
			const stream = this.openai!.chat.completions.create(<ChatCompletionCreateParamsStreaming>body);
			await askOpenAI(stream);
		} else if (provider === Provider.gorq) {
			const stream = this.gorq!.chat.completions.create(<ChatCompletionCreateParamsStreaming>body);
			await askOpenAI(stream);
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
			const result = await this.request.post('query/run', {
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

	goodGorqKey() {
		if (!this.config.gorq) {
			return true;
		}
		return !!this.config.gorq.match(/^gsk_[a-zA-Z0-9]{52}$/);
	}

	onScroll(event: any) {
		this.atBottom = (event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight;
	}

	resetInput(message: HTMLTextAreaElement) {
		setTimeout(() => {
			message.value = '';
		}, 10);
	}
}
