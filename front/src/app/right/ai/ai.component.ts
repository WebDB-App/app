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
import { isSQL } from "../../../shared/helper";
import { Subscription } from "rxjs";
import { Table } from "../../../classes/table";
import { Router } from "@angular/router";
import { ChatCompletionCreateParamsStreaming } from "openai/src/resources/chat/completions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const localKeyConfig = 'ia-config';

enum Provider {
	openai = "OpenAI",
	gemini = "Gemini",
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

	constructor(txt: string, user: Role, error = false, hide = false) {
		this.txt = txt;
		this.user = user;
		this.error = error;
		this.marked = [];
		this.hide = hide;

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
	models: { [key: string]: { name: string; bold?: boolean }[] } = {};
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

	@ViewChild('scrollContainer') public scrollContainer!: ElementRef;
	protected readonly Math = Math;
	protected readonly Object = Object;
	protected readonly isSQL = isSQL;

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
				this.scrollToBottom();
			}

			const question = this.drawer.lastData;
			if (question) {
				await this.sendMessage(question);
			}
		});

		this.localKeyChatHistory = 'chat-' + this.selectedDatabase.name.split(' ¦ ')[0];
		this.localKeyPreSent = 'preSent-' + this.selectedDatabase.name.split(' ¦ ')[0];

		const msgs = JSON.parse(localStorage.getItem(this.localKeyChatHistory) || '[]');
		this.chat = msgs.map((msg: Msg) => new Msg(msg.txt, msg.user, msg.error));

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

	scrollToBottom() {
		setTimeout(() => {
			if (!this.scrollContainer) {
				return;
			}
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
		}, 10);
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
				{name: "gpt-4", bold: true},
				{name: "gpt-4-1106-preview", bold: false},
				{name: "gpt-4-vision-preview", bold: false},
				{name: "gpt-4-32k", bold: true},
				{name: "gpt-3.5-turbo", bold: false},
				{name: "gpt-3.5-turbo-16k", bold: true},
			];
		}

		if (this.config.gemini) {
			this.gemini = new GoogleGenerativeAI(this.config.gemini);
			this.models[Provider.gemini] = [
				{name: "gemini-pro", bold: true},
				{name: "gemini-ultra", bold: false},
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
		this.sample = (await this.request.post('database/sample', {
			preSent: this.preSent,
			language: navigator.language
		}, undefined)).txt;
	}

	saveChat() {
		const copy = JSON.parse(JSON.stringify(this.chat));
		localStorage.setItem(this.localKeyChatHistory, JSON.stringify(copy.map((ch: Msg) => {
			delete ch.marked;
			return ch;
		})));
	}

	async sendMessage(txt: string) {
		txt = txt.trim();
		if (!txt) {
			return;
		}

		this.chat.push(new Msg(txt, Role.User));
		this.scrollToBottom();

		let provider = "";
		for (const [pro, models] of Object.entries(this.models)) {
			if (models.map(model => model.name).indexOf(this.config.model) >= 0) {
				provider = pro;
				break;
			}
		}

		this.stream = "Sending prompt ...";
		const rBody = {
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

		if (provider === Provider.openai) {
			const stream = this.openai!.chat.completions.create(<ChatCompletionCreateParamsStreaming>rBody);

			this.chat.push(await new Promise<Msg>(resolve => {
				stream.then(async str => {
					this.stream = "";
					for await (const part of str) {
						if (this.abort) {
							this.abort = false;
							str.controller.abort();
						}

						this.stream += part.choices[0]?.delta?.content || '';
						this.scrollToBottom();
					}
					resolve(new Msg(this.stream!, Role.Assistant));
				}).catch(error => {
					resolve(new Msg(error.message || `An error occurred during OpenAI request: ` + error, Role.Assistant, true))
				});
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
					this.stream = "";
					for await (const chunk of result.stream) {
						if (this.abort) {
							this.abort = false;
							break;
						}
						this.stream += chunk.text();
						this.scrollToBottom();
					}
					resolve(new Msg(this.stream!, Role.Assistant));
				} catch (error: any) {
					resolve(new Msg(error.error?.message || `An error occurred during Google request: ` + error, Role.Assistant, true))
				}
			}));
		}

		this.stream = undefined;
		this.scrollToBottom();
		this.saveChat();
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
}
