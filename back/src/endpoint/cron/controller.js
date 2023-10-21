const {readdirSync, statSync, unlink}= require("fs");
const {join} = require("path");
const bash = require("../../shared/bash");
const frontPath = join(__dirname, "../../../static/");

class FileCleanup {
	constructor(folderPath, maxSizeInBytes, maxFilesToDelete) {
		this.folderPath = folderPath;
		this.maxSizeInBytes = maxSizeInBytes;
		this.maxFilesToDelete = maxFilesToDelete;
	}

	checkAndCleanup() {
		const files = readdirSync(this.folderPath).filter(file => !file.startsWith("."));
		const fileStats = files.map((file) => ({
			name: file,
			size: statSync(join(this.folderPath, file)).size,
		}));

		fileStats.sort((a, b) => b.size - a.size);

		let totalSize = 0;
		let filesToDelete = [];

		for (let i = 0; i < fileStats.length; i++) {
			totalSize += fileStats[i].size;
			if (totalSize > this.maxSizeInBytes) {
				filesToDelete.push(fileStats[i].name);
				if (filesToDelete.length >= this.maxFilesToDelete) {
					break;
				}
			}
		}

		if (filesToDelete.length > 0) {
			this.deleteFiles(filesToDelete);
		}
		return filesToDelete.length;
	}

	deleteFiles(filesToDelete) {
		filesToDelete.forEach((file) => {
			const filePath = join(this.folderPath, file);
			unlink(filePath, (err) => {
				if (err) {
					console.error(`Error deleting ${file}:`, err);
				}
			});
		});
	}
}

setInterval(() => {
	const cid = bash.startCommand("file(s) cleaned", "", "");
	let cleaned = 0;

	const logs = new FileCleanup(join(frontPath, "logs"), 10_000_000, 5);
	const dumps = new FileCleanup(join(frontPath, "dump"), 100_000_000, 5);
	const states = new FileCleanup(join(frontPath, "state"), 100_000_000, 5);
	cleaned += logs.checkAndCleanup();
	cleaned += dumps.checkAndCleanup();
	cleaned += states.checkAndCleanup();

	bash.endCommand(cid, cleaned);
}, 5 * 60 * 1000);
