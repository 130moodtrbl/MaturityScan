import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { ScanAnswer, ScanQuestion } from "./types.js";

/**
 * 	Collecting NIST CSF-inspired questions in CLI.
 */
export async function collectAnswersInteractively(
  questions: ScanQuestion[]
): Promise<ScanAnswer[]> {
	const rl = createInterface({ input: stdin, output: stdout });
	const answers: ScanAnswer[] = [];

	console.log("[🌿] GRC - NIST MATURITY SCORE SELF-ASSESSMENT\n");
	console.log(
		"For each function, give a proper answer. This will help provide an accurate recommendation.\n"
	);

	for (const question of questions) {
		console.log(`\x1b[34m[${question.function}]\x1b[0m`);
		console.log(question.prompt);
		console.log(`\x1b[3m💡 ${question.guidance})\x1b[0m`);

		const response = await rl.question("→ ");
		answers.push({ questionId: question.id, response: response.trim() });
		console.log("");
	}

	rl.close();
	return answers;
}
