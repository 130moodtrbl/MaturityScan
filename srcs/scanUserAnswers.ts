/**
 *		This file contains the prompt the the IA (Ollama) will receive
 *		to run the assessment.
 */

import { callLLM } from './handlingOllama.js';
import type {
	ScanQuestion,
	ScanAnswer,
	ScanReport,
	FunctionScore,
}	from './types.js';

const MS_PROMPT = `You are an experimented consultant in cybersecurity governance 
and risk management (GRC). You are assessing an organisation's maturity in a given function, 
based on the response provided by a user to a framework question (inspired by the NIST CSF).

You must respond STRICTLY in the following JSON format, with no text before or after:
{
  "score": <integer between 1 and 5>,
  "justification": "<3-5 sentences explaining the score>",
  "recommendation": "<1-3 sentences of concrete action to make progress>"
}

Important: the output must be valid, parseable JSON. If your justification or
recommendation text needs to reference a quoted term, use single quotes instead
of double quotes inside the string values, and never break a string across
multiple JSON properties.

Maturity scale:
1 = Initial (no formalised processes)
2 = Reproducible (ad hoc, undocumented practices)
3 = Defined (documented and implemented processes)
4 = Managed (processes measured and steered by indicators)
5 = Optimised (continuous improvement, sector benchmarking)`;

interface RawScoreResponse {
	score: number;
	justification: string;
	recommendation: string;
}

/**
 * 	Ensure that even small LLM models like Llama can deliver consistent JSON
 * 	by checking and parsing the JSON answer in case of errors.
 */
function tryRepairJson(text: string): string {
	let fixed = text.trim();

	const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length;
	if (quoteCount % 2 !== 0) {
		fixed += '"';
	}

	const openBraces = (fixed.match(/{/g) || []).length;
	const closeBraces = (fixed.match(/}/g) || []).length;
	if (openBraces > closeBraces) {
		fixed += "}".repeat(openBraces - closeBraces);
	}
	return fixed;
}

/**
 *		In case the LLM model puts md balises, this functions cleans it to keep
 *		the JSON data clean.
 */
function parseModelJson(raw: string): RawScoreResponse {
	const withoutFences = raw.replace(/```json|```/g, "").trim();
	const firstBrace = withoutFences.indexOf("{");
	if (firstBrace === -1) {
		console.error("[!] Model Error | no JSON detected. Quit.", raw);
		throw new Error("[!] Model Error | no JSON detected. Quit.");
	}

	const lastBrace = withoutFences.lastIndexOf("}");
	const output =
		lastBrace > firstBrace
			? withoutFences.slice(firstBrace, lastBrace + 1)
			: withoutFences.slice(firstBrace);

	try {
		return JSON.parse(output) as RawScoreResponse;
	} catch {
		const fixed = tryRepairJson(output);
		try {
			const parsed = JSON.parse(fixed) as RawScoreResponse;
			console.error(
			"[!] Fixing JSON..."
			);
			return parsed;
		} catch (err) {
			console.error("[!] Model Error | Invalid JSON. Quit.\n", output);
			throw err;
		}
	}
}

/**
 *      Calls the LLM to score the Domain
 */
async function scoreDomain(
  question: ScanQuestion,
  answer: ScanAnswer,
): Promise<FunctionScore> {
  const userPrompt = `Domain scanned: ${question.function}
      Question asked: ${question.prompt}
      User's response: ${answer.response}`;

  const raw = await callLLM(MS_PROMPT, userPrompt);
  const parsed = parseModelJson(raw);

  return {
		function: question.function,
		score: parsed.score,
		justification: parsed.justification,
		recommendation: parsed.recommendation,
  };
}

/**
 *		Computes the function's overall maturity score
 */
function calculateOverallScore(scores: FunctionScore[]): number {
	const total = scores.reduce((sum, s) => sum + s.score, 0);
	return Math.round((total / scores.length) * 10) / 10;
}

/**
 *		Uses LLM to generate a short, easy summary of the scan
 */
async function generateSummary(
	scores: FunctionScore[],
	overallScore: number
	): Promise<string> {
	const summaryPrompt = `Here are the maturity scores by function (on a scale of 1–5):
						${scores.map((s) => `- ${s.function}: ${s.score}/5 — ${s.justification}`).join('\n')}

			Overall score: ${overallScore}/5

			Write a summary of 4-6 sentences, intended for non-technical people,
			which summarises the overall security posture and prioritises the two most urgent areas for improvement.`;

	return callLLM(
			`You are a GRC consultant. Respond in plain text, without JSON or Markdown.`,
			summaryPrompt
	);
}

export async function runAssessment(
	questions: ScanQuestion[],
	answers: ScanAnswer[]
	): Promise<ScanReport> {
	const FunctionScores: FunctionScore[] = [];

	for (const question of questions) {
		const answer = answers.find((a) => a.questionId === question.id);
		if (!answer) {
			throw new Error(`[!] Missing answer for this question → ${question.id}`);
		}
		const score = await scoreDomain(question, answer);
		FunctionScores.push(score);
	}

	const overallScore = calculateOverallScore(FunctionScores);
	const executiveSummary = await generateSummary(
		FunctionScores,
		overallScore
	);

	return {
		createdAt: new Date().toISOString(),
		overallScore,
		FunctionScores,
		executiveSummary,
	};
}