import {describe} from "node:test"
import {basicConf} from "./config.js";
import assert from "node:assert";
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless: process.env.CI ? 'new' : false});
const page = await browser.newPage();
await page.setViewport({width: 1920, height: 1080});
await page.goto(basicConf.front);

await describe('licence:basic', async () => {

	await (await page.waitForSelector('button[tid="settings"]', {visible: true})).click();

	await (await page.waitForSelector('#mat-tab-label-1-1', {visible: true})).click();

	await page.waitForSelector('mat-icon[tid=validLicence]', {visible: true});
	await page.click('#mat-tab-label-1-3');
});

await describe('explore:basic', async () => {

	page.on('console', msg => {
		assert.notEqual(msg.type(), "error");
	});

	await page.type('.login input[tid=user]', basicConf.credentials.user);
	await page.type('.login input[tid=password]', basicConf.credentials.password);

	await (await page.waitForSelector('button[tid=connect]', {visible: true})).click();

	await (await page.waitForSelector('.servers mat-list-option[tid=database]', {visible: true})).click();

	await new Promise(r => setTimeout(r, 2000));
});

await browser.close();
