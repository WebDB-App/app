import { app as electron, BrowserWindow, Menu } from "electron";
import {URL} from "url";
import * as dotenv from "dotenv";
// eslint-disable-next-line no-unused-vars
import {server} from "../src/index.js";
import * as squirrel from "electron-squirrel-startup";

if (squirrel.default) {
	electron.quit();
}

const dirname = new URL(".", import.meta.url).pathname;
dotenv.config({path: dirname + "/.env"});
const address = `http://localhost:${Number(process.env.API_PORT)}`;

async function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: dirname + "/assets/webdb.png",
		webPreferences: {
			preload: dirname + "/preload.js"
		}
	});

	await mainWindow.loadURL(address);
	mainWindow.center();
	mainWindow.show();
	mainWindow.on("close", () => {
		mainWindow.destroy();
	});
}

const dockMenu = Menu.buildFromTemplate([
	{
		label: "New Window",
		click: async () => {
			await createWindow();
		}
	}
]);
/*electron.setUserTasks([
	{
		program: process.execPath,
		arguments: "--new-window",
		iconPath: process.execPath,
		iconIndex: 0,
		title: "New Window",
		description: "Create a new window"
	}
]);*/

electron.whenReady().then(async () => {
	if (process.platform === "darwin") {
		electron.dock.setMenu(dockMenu);
	}
	await createWindow();
});

electron.on("activate", async function () {
	if (BrowserWindow.getAllWindows().length === 0) {
		await createWindow();
	}
});

electron.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		electron.quit();
	}
});
