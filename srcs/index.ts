/**
 * 	This is the main function as it runs the assessment and provides the answers
 * 		and two generated files, as well as do minor error handling.
 * 
 * 	Room for improvement: an interactive GUI, persistent data and organisation.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { questions } from "./questionFramework.js";
import { runAssessment } from "./scanUserAnswers.js";
import { toReportFile } from "./report.js";
import { toDashboard } from "./dashboard.js";
import { collectAnswersInteractively } from "./userResponseCLI.js";

async function main(): Promise<void> {
	const answers = await collectAnswersInteractively(questions);

	console.log("Checking answers...\n");
	const report = await runAssessment(questions, answers);

	const outputDir = "output";
	await mkdir(outputDir, { recursive: true });
 
	const pathReportFile = `${outputDir}/maturity-assessment.md`;
	const pathDashboard = `${outputDir}/dashboard.html`;

	await writeFile(pathReportFile, toReportFile(report), "utf-8");
	await writeFile(pathDashboard, toDashboard(report), "utf-8");

	console.log(`\x1b[32m[✓] Maturity Scan completed!\n\x1b[0m`);
	console.log(`130MS Report: ${pathReportFile}`);
	console.log(`Dashboard: ${pathDashboard}`);
	console.log(`Overall Score: ${report.overallScore}/5`);
	}

	main().catch((error: unknown) => {
	console.error("\x1b[31m[!] Error while generating a Maturity Scan Report:\x1b[30", error);
	process.exitCode = 1;
});