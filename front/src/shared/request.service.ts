import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { environment } from "../environments/environment";
import { Database } from "../classes/database";
import { Server } from "../classes/server";
import { Table } from "../classes/table";
import * as drivers from "../classes/drivers";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ErrorComponent } from "./error/error.component";

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	private loadingSubject = new BehaviorSubject(0);
	loadingServer = this.loadingSubject.asObservable();

	constructor(
		private bottomSheet: MatBottomSheet,
		private http: HttpClient,
	) {
	}

	async post(url: string, data: any,
			   table = Table.getSelected(),
			   database = Database.getSelected(),
			   server = Server.getSelected(),
			   headers = new HttpHeaders(),
			   snackError = true) {

		const shallow = Server.getShallow(server);

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

	async connectServers(servers: Server[], full = true) {
		const toLoad = [];

		for (let server of servers) {
			// @ts-ignore
			server.driver = new drivers[server.wrapper];
			server.params = server.params || server.driver.connection.defaultParams;

			const connect = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));

			server.connected = !connect.error;
			server.uri = connect.uri;
			toLoad.push(server);
		}

		return await this.loadServers(toLoad, full);
	}

	async loadServers(servers: Server[], full: boolean) {
		let loading = 0;
		this.loadingSubject.next(loading);

		const promises = [];
		for (const server of servers) {
			promises.push(
				new Promise(async resolve => {
					if (!server.connected) {
						return resolve(server);
					}
					try {
						const res = await firstValueFrom(this.http.post<Database[]>(environment.apiRootUrl + `server/structure?full=${+full}`, Server.getShallow(server)));
						this.loadingSubject.next(loading += 100 / servers.length);
						resolve({...server, ...res});
					} catch (e) {
						this.loadingSubject.next(-1);
					}
				})
			);
		}
		servers = <Server[]>(await Promise.all(promises));

		this.loadingSubject.next(100);
		return servers;
	}

	async reloadServer(server = Server.getSelected()) {
		server = (await this.loadServers([server], true))[0];
		if (server.name !== Server.getSelected()?.name) {
			return server;
		}

		Server.setSelected(server);
		Database.reload(server.dbs);
		Table.reload(Database.getSelected());

		return server;
	}
}
