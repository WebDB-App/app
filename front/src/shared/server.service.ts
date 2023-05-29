import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Server } from "../classes/server";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { RequestService } from "./request.service";
import * as drivers from '../classes/drivers';

@Injectable({
	providedIn: 'root'
})
export class ServerService {

	servers?: Server[]

	constructor(
		private http: HttpClient,
		private request: RequestService
	) {
	}

	async getServer(server: Server) {

		// @ts-ignore
		server.driver = new drivers[server.wrapper];
		server.params = server.params || server.driver.defaultParams;

		const connect = await firstValueFrom(this.http.post<any>(environment.apiRootUrl + 'server/connect', Server.getShallow(server)));
		if (!connect.error) {
			server = await this.request.reloadDbs(server);
			server.connected = true;
		} else {
			server.connected = false;
		}
		return server;
	}

	async scan() {
		let servers = [];

		const scans = (await firstValueFrom(this.http.get<Server[]>(environment.apiRootUrl + 'server/scan'))).map(scan => {
			scan.name = Server.setName(scan);
			scan.scanned = true
			return scan;
		});
		const locals = Server.getAll().map(local => {
			const scan = scans.find(sc => sc.name === local.name);
			if (scan) {
				local.scanned = scan.scanned;
			}
			return local;
		});

		for (const scan of scans) {
			if (locals.findIndex(server => server.name === scan.name) < 0) {
				locals.push(scan);
			}
		}

		for (let server of locals) {
			servers.push(this.getServer(server));
		}

		servers = await Promise.all(servers);
		servers = servers.sort((a, b) => {
			return Number(b.connected) - Number(a.connected)
		});

		this.servers = servers;
		return servers;
	}
}
