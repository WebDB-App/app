import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { environment } from "../environments/environment";
import { Database } from "../classes/database";
import { Server } from "../classes/server";
import { Table } from "../classes/table";
import { Relation } from "../classes/relation";
import { Index } from "../classes";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as drivers from "../classes/drivers";

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	private messageSource = new BehaviorSubject(<Server>{});
	serverReload = this.messageSource.asObservable();

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
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
		if (snackError && result.error) {
			this.snackBar.open(result.error, "╳", {panelClass: 'snack-error'});
			throw new HttpErrorResponse({statusText: result.error});
		}

		return result;
	}

	async connectServer(server: Server) {
		// @ts-ignore
		server.driver = new drivers[server.wrapper];
		server.params = server.params || server.driver.defaultParams;

		const connect = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));
		if (!connect.error) {
			server = await this.reloadServer(server);
			server.connected = true;
		} else {
			server.connected = false;
		}
		return server;
	}

	async reloadServer(server = Server.getSelected(), emit = true) {
		const shallow = Server.getShallow(server);

		await Promise.all([
			new Promise(async resolve => {
				server.dbs = await firstValueFrom(this.http.post<Database[]>(environment.apiRootUrl + 'server/structure', shallow))
				resolve(true);
			}),
			new Promise(async resolve => {
				server.relations = await firstValueFrom(this.http.post<Relation[]>(environment.apiRootUrl + 'server/relations', shallow))
				resolve(true);
			}),
			new Promise(async resolve => {
				server.indexes = await firstValueFrom(this.http.post<Index[]>(environment.apiRootUrl + 'server/indexes', shallow))
				resolve(true);
			}),
		]);

		if (server.name !== Server.getSelected()?.name) {
			return server;
		}

		Database.reload(server.dbs);
		Table.reload(Database.getSelected());

		if (emit) {
			this.messageSource.next(server);
		}
		return server;
	}
}
