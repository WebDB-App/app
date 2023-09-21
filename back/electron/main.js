import { app as electron, BrowserWindow } from "electron";
import {URL} from "url";
import * as dotenv from "dotenv";
import * as exp from "../src/index.js";

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/../.env"});
const port = Number(process.env.API_PORT);

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: dirname + "preload.js"
		}
	});

	mainWindow.loadURL(`http://localhost:${port}`);
	mainWindow.focus();
	//mainWindow.webContents.openDevTools()
}

electron.whenReady().then(() => {
	createWindow();

	electron.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

electron.on("before-quit", function () {
	exp.default.then(express => express.close());
});

electron.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		electron.quit();
	}
});
