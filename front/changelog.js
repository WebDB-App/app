#!/usr/bin/env node

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
const {emojify} = require("node-emoji");

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
		for (const [date, commits] of Object.entries(logs)) {
			const subjects = {};

			for (const commit of commits) {
				let subject = commit.subject.trim();
				subject = emojify(subject);
				subject = subject.replaceAll(/<[^>]*>?/gm, '');

				subject.split(/(\s\s+)/).map(s => {
					if (s.length < 30) {
						return;
					}
					subjects[s] = 1;
				});
			}
			if (Object.keys(subjects).length < 1) {
				continue;
			}

			const subs = Object.keys(subjects).map(sub => `<li>${sub}</li>`);
			html += `<div class='day'><h2>${date}</h2><ul>${subs.join('')}</ul></div>`;
		}

		fs.writeFileSync(process.argv[2], `<html><head>
<style>
	#changelog {
		background-color: #282929;
		padding: 10px;
	}
	#changelog * {
		font-family: system-ui;
		color: white;
	}
	#changelog p {
		margin: 0px;
	}
	#changelog .day {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background-color: #515151;
		border-radius: 4px;
		margin: 10px;
	}
	#changelog h2 {
		margin: 54px -14px 0px -6px;
		transform: rotate(270deg);
		white-space: nowrap;
		width: 20px;
		height: 36px;
		min-width: 85px;
	}
	#changelog ul {
		border-left: 2px solid #282929;
		list-style: none;
		margin: 0;
		padding: 20px;
		font-weight: 300;
		font-size: 14px;
		min-height: 110px;
	}
	#changelog li {
		white-space: pre-line;
	}
</style>
</head><body style="margin: 0px"><div id='changelog'>${html}</div></body></html>`);
	} catch (error) {
		console.error(error);
	}
})();
