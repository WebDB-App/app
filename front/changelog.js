/*
This script is for anyone who spent too much time generating pretty changelog (almost everyone)
It just parse the commit message from local git repo and generate a easy customizable HTML code

Just download this file to your repo and run it with the output path like:
```
node ./changelog.js the/path/of/changelog.html
```

Don't hesitate to improve it and if you think your changes can benefit to other people, tell us
 */

const fs = require('fs');
const {execSync} = require("child_process");

function getLogsByDate() {
	const logs = execSync(`git log --date=short`).toString();
	const commits = [];
	for (let log of logs.split(/[a-zA-Z0-9]{40}/)) {
		log = log.split('Date:   ')[1];
		if (!log) {
			continue;
		}
		const obj = {
			date: log.split('\n\n    ')[0],
			subject: log.split('\n\n    ')[1].split('\n\ncommit ')[0]
		}
		commits.push(obj);
	}

	const dates = {};
	for (const com of commits) {
		if (!dates[com.date]) {
			dates[com.date] = [];
		}
		dates[com.date].push(com);
	}
	return dates;
}

(async () => {
	try {
		const logs = getLogsByDate();

		let html = "";
		for (const [date, commit] of Object.entries(logs)) {
			let lis = '';
			for (const com of commit) {
				const sub = com.subject.trim();
				lis += `<li style="padding: 6px 0px;"><div class='msg'>${sub.replaceAll('\n', '<br>')}</div></li>`;
			}
			if (lis.length < 1) {
				continue;
			}
			html += `<div class='changelog-day'><h2 style='margin-bottom: 0px;'>${date}</h2><ul style='padding: 14px 20px; outline: auto;'>${lis}</ul></div>`;
		}

		fs.writeFileSync(process.argv[2], `<html><body><div class='changelog'>${html}</div></body></html>`);
	} catch (error) {
		console.error(error);
	}
})();
