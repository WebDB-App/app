import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { Licence } from "../../../classes/licence";
import { RequestService } from "../../../shared/request.service";
import { Configuration, OpenAIApi } from "openai";
import { Configuration as WebConfig } from "../../../classes/configuration";
import { marked } from 'marked';
import { DrawerService } from "../../../shared/drawer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { isSQL } from "../../../shared/helper";

const localKeyConfig = 'ia-config';

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

	constructor(txt: string, user: Role, error = false) {
		this.txt = txt;
		this.user = user;
		this.error = error;
		this.marked = [];

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
export class AiComponent implements OnInit {

	@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

	selectedServer?: Server;
	selectedDatabase?: Database;
	licence?: Licence;
	configuration: WebConfig = new WebConfig();
	initialized = false

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
	openai?: OpenAIApi;
	isLoading = false;

	sample = "";
	config = {
		model: "gpt-3.5-turbo-16k",
		openAI: '',
		temperature: 1
	};
	preSent = {
		tables: [""],
		triggers: false,
		deep: 2,
		count: 5
	}

	constructor(
		private request: RequestService,
		private drawer: DrawerService,
		private route: ActivatedRoute,
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

		this.drawer.drawer.openedChange.subscribe(async (state: boolean) => {
			if (state && !this.initialized) {
				this.initialized = true;
				await this.configChange();
				await this.preSentChange();
				this.scrollToBottom();
			}

			const question = this.route.snapshot.paramMap.get('question');
			if (question) {
				await this.sendMessage(question);
			}
		})

		this.localKeyChatHistory = 'chat-' + this.selectedDatabase.name;
		this.localKeyPreSent = 'preSent-' + this.selectedDatabase.name;

		this.licence = await Licence.get(this.request);
		await this.configChange();
		await this.preSentChange();
		this.initChat();
	}

	async configChange() {
		localStorage.setItem(localKeyConfig, JSON.stringify(this.config));
		this.openai = new OpenAIApi(new Configuration({
			apiKey: this.config.openAI,
		}));
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

	initChat() {
		const msgs = JSON.parse(localStorage.getItem(this.localKeyChatHistory) || '[]');
		this.chat = msgs.map((msg: Msg) => new Msg(msg.txt, msg.user, msg.error));
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

		this.isLoading = true;
		this.chat.push(new Msg(txt, Role.User));
		this.scrollToBottom();
		let message: Msg;

		try {
			const completion = await this.openai!.createChatCompletion({
				model: this.configuration.getByName('openAIModel')?.value,
				messages: [
					{role: Role.System, content: this.sample},
					{role: Role.User, content: txt}
				],
				temperature: this.config.temperature
		});
			message = new Msg(completion.data.choices[0].message!.content!, Role.Assistant);
		} catch (error: any) {
			message = new Msg(error.response?.data.error.message || 'An error occurred during OpenAI request: ' + error, Role.Assistant, true);
		}

		this.chat.push(message);
		this.scrollToBottom();
		this.saveChat();
		this.isLoading = false;
	}

	scrollToBottom() {
		setTimeout(() => {
			if (!this.scrollContainer) {
				return;
			}
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
		}, 10);
	}

	async runQuery(query: string) {
		this.isLoading = true;

		try {
			const result = await this.request.post('database/query', {
				query: query,
				pageSize: 15,
				page: 0
			}, undefined, undefined, undefined, undefined, false);
			await this.sendMessage("Here is the result of the query `" + query + "` : " + JSON.stringify(result));
		} catch (err: any) {
			await this.sendMessage("There is an error : " + err.error);
		} finally {
			this.isLoading = false;
		}
	}

	protected readonly isSQL = isSQL;
}
