import {JSDOM} from "jsdom";
import fs from "fs";

const threshold = 90;

const getTestCoverage = (junitFilePath) => {
	const dom = new JSDOM(fs.readFileSync(junitFilePath, "utf8")).window.document;
	const tests = dom.querySelectorAll("testsuite testcase");
	const failures = dom.querySelectorAll("testsuite testcase failure");

	return Math.floor(100 - ((failures.length / tests.length) * 100));
};

const main = (junitFilePath) => {
	const testCoverage = getTestCoverage(junitFilePath);
	if (testCoverage < threshold) {
		console.error(`Test success is ${testCoverage}%, which is below the minimum threshold of ${threshold}%.`);
		process.exit(1);
	} else {
		console.log(`Test success is ${testCoverage}%.`);
	}
};

if (process.argv.length !== 3) {
	console.error("Usage: node test_coverage.js <junit_file_path>");
	process.exit(1);
}

main(process.argv[2]);
