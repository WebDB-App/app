import { Component, OnDestroy, OnInit } from '@angular/core';
import { Database } from "../../../classes/database";
import { Server } from "../../../classes/server";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Licence } from "../../../classes/licence";
import { RequestService } from "../../../shared/request.service";
import { Configuration, OpenAIApi } from "openai";
import { Subscription } from "rxjs";
import { Configuration as WebConfig } from "../../../classes/configuration";

const localKeyOpenAI = 'openai-key';

enum Role {
	System = 'system',
	User = 'user',
	Assistant = 'assistant',
}

class Msg {
	user!: Role;
	error = false;
	txt!: string;
}

class Sample {
	data!: any[];
	structure!: string;
}

@Component({
	selector: 'app-ai',
	templateUrl: './ai.component.html',
	styleUrls: ['./ai.component.scss']
})
export class AiComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	licence?: Licence;
	obs!: Subscription;
	configuration: WebConfig = new WebConfig();

	Role = Role
	examples = [
		'Explain me the purpose of this database',
		'Propose me some optimisation of the structure',
		'What are the most efficient MySQL Performance Tuning Tips',
		'Give me a SQL query retrieving all users',
		'Show me the syntax error of `SELECT * FRM users`',
	]
	changing = false;
	localKeyChatHistory!: string;
	chat: Msg[] = [];
	key?: string;
	openai?: OpenAIApi;
	isLoading = false;
	sample!: Sample[];

	constructor(
		private _snackBar: MatSnackBar,
		private request: RequestService
	) {
	}

	async ngOnInit() {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();
		const limit = this.configuration.getByName('sampleLimit')?.value

		this.obs = this.request.serverReload.subscribe(async (_params) => {
			this.sample = await this.request.post('database/sample', {limit}, undefined);
		});

		this.localKeyChatHistory = 'chat-' + this.selectedDatabase.name;

		this.licence = await Licence.get(this.request);
		this.initChat();
	}

	ngOnDestroy(): void {
		this.obs.unsubscribe();
	}

	initChat() {
		this.chat = JSON.parse(localStorage.getItem(this.localKeyChatHistory) || '[]');
		this.key = localStorage.getItem(localKeyOpenAI) || '';

		this.openai = new OpenAIApi(new Configuration({
			apiKey: this.key,
		}));
	}

	setKey(key: string) {
		if (!key) {
			return;
		}
		localStorage.setItem(localKeyOpenAI, key);
		this.initChat();
		this.changing = !this.changing;
	}

	saveChat() {
		localStorage.setItem(this.localKeyChatHistory, JSON.stringify(this.chat));
	}

	async getDatabase() {
		let database = `There is a database called ${this.selectedDatabase?.name} on a ${this.selectedServer?.wrapper} server`;
		for (const table of this.sample) {
			database += `In this database, there is a table as ${table.structure} containing a sample of the following data : ${JSON.stringify(table.data)}`;
		}

		return database;
	}

	async sendMessage(message: string) {
		if (!message) {
			return;
		}
		this.isLoading = true;
		this.chat.push(<Msg>{txt: message, user: Role.User});

		const response = new Msg();
		response.user = Role.Assistant;

		try {
			const completion = await this.openai!.createChatCompletion({
				model: this.configuration.getByName('openAIModel')?.value,
				messages: [
					{role: Role.System, content: await this.getDatabase()},
					{role: Role.User, content: message}
				],
			});
			response.txt = completion.data.choices[0].message!.content;
		} catch (error: any) {
			response.error = true;
			response.txt = error.response.data.error.message || 'An error occurred during OpenAI request: ' + error
		}

		this.chat.push(response);
		this.saveChat();
		this.isLoading = false;
	}

	clearHistory() {
		this.chat = [];
	}
}
