import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { environment } from "../environments/environment";
import { Database } from "../classes/database";
import { Server } from "../classes/server";
import { Table } from "../classes/table";
import * as drivers from "../drivers/index";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ErrorComponent } from "./error/error.component";
import { Configuration } from "../classes/configuration";
import { Licence } from "../classes/licence";

export enum LoadingStatus {
	LOADING = 'LOADING',
	DONE = "DONE",
	ERROR = "ERROR"
}

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	configuration: Configuration = new Configuration();

	private loadingSubject = new BehaviorSubject(LoadingStatus.LOADING);
	loadingServer = this.loadingSubject.asObservable();

	constructor(
		private bottomSheet: MatBottomSheet,
		private http: HttpClient,
	) {
	}

	async getLicenceHeader(headers = new HttpHeaders()) {
		const licence = await Licence.getCached();
		return headers.set('Privatekey', btoa(licence.privateKey));
	}

	async post(url: string, data: any,
			   table = Table.getSelected(),
			   database = Database.getSelected(),
			   server = Server.getSelected(),
			   headers = new HttpHeaders(),
			   snackError = true) {

		const shallow = Server.getShallow(server);

		headers = await this.getLicenceHeader(headers);
		headers = headers.set('Server', JSON.stringify(shallow));
		if (table) {
			headers = headers.set('Table', table.name)
		}
		if (database) {
			headers = headers.set('Database', database.name)
		}

		const result = await firstValueFrom(this.http.post<any>(
			environment.apiRootUrl + url, data, {headers}
		));
		if (snackError && result?.error) {
			this.bottomSheet.open(ErrorComponent, {
				data: {error: result, context: data},
				hasBackdrop: false
			});
			throw new HttpErrorResponse({error: result});
		}

		return result;
	}

	async connectServer(server: Server) {
		// @ts-ignore
		server.driver = new drivers[server.wrapper];
		server.params = server.params || server.driver.connection.defaultParams;

		const connect = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));

		server.connected = !connect.error;
		server.uri = connect.uri;
		return server;
	}

	async loadServers(servers: Server[], full: boolean, signal = true) {
		if (signal) {
			this.loadingSubject.next(LoadingStatus.LOADING);
		}
		const headers = await this.getLicenceHeader();

		const load = (server: Server) => {
			return new Promise(async resolve => {
				if (!server.connected) {
					return resolve(server);
				}
				try {
					const size = this.configuration.getByName("noSqlSample")?.value;
					const res = await firstValueFrom(this.http.post<Database[]>(
						environment.apiRootUrl + `server/structure?full=${+full}&size=${size}`,
						Server.getShallow(server),
						{headers}
					));

					resolve({...server, ...res});
				} catch (e) {
					console.error(e);
					this.loadingSubject.next(LoadingStatus.ERROR);
				}
			})
		};

		const promises = [];
		for (const server of servers) {
			promises.push(load(server));
		}
		servers = <Server[]>(await Promise.all(promises));

		if (signal) {
			this.loadingSubject.next(LoadingStatus.DONE);
		}
		return servers;
	}

	async reloadServer(server = Server.getSelected(), signal = true) {
		server = (await this.loadServers([server], true, signal))[0];
		if (server.name !== Server.getSelected()?.name) {
			return server;
		}

		Server.setSelected(server);
		Database.reload(server.dbs);
		Table.reload(Database.getSelected());

		return server;
	}
}
