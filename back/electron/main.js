import { app as electron, BrowserWindow } from "electron";
import {URL} from "url";
import * as dotenv from "dotenv";
import {shutdown} from "../src/index.js";

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});
const address = `http://localhost:${Number(process.env.API_PORT)}`;

async function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: dirname + "preload.js"
		}
	});

	await new Promise(resolve => {
		setTimeout(() => {
			mainWindow.loadURL(address);
			resolve();
		}, 1000);
	});

	mainWindow.focus();
	//mainWindow.webContents.openDevTools()
}

electron.whenReady().then(async () => {
	await createWindow();

	electron.on("activate", async function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			await createWindow();
		}
	});
});

electron.on("before-quit", function () {
	shutdown();
});

electron.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		electron.quit();
	}
});
