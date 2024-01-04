import {readdirSync, statSync, unlink} from "fs";
import {join} from "path";
import {URL} from "url";

const dirname = new URL(".", import.meta.url).pathname;
const frontPath = join(dirname, "../../../static/");

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
	let cleaned = 0;

	const logs = new FileCleanup(join(frontPath, "logs"), 100_000_000, 1);
	const dumps = new FileCleanup(join(frontPath, "dump"), 1_000_000_000, 1);
	cleaned += logs.checkAndCleanup();
	cleaned += dumps.checkAndCleanup();

	if (cleaned > 0) {
		console.log(cleaned + " file(s) cleaned");
	}
}, 5 * 60 * 1000);
