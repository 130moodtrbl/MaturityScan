/**
 * 	All needed types for the program.
 * 	This is inspired by the NIST CSF rules, simplified as a learning material.
 */

export type MaturityDomain = 
  | "Identify"
  | "Protect"
  | "Detect"
  | "Respond"
  | "Recover";

export interface ScanQuestion {
	id: string;
	function: MaturityDomain;
	prompt: string;
	/** User guide to help user answer the questions. */
	guidance: string;
}

export interface ScanAnswer {
	questionId: string;
	/** User's response */
	response: string;
}

export interface FunctionScore {
	function: MaturityDomain;
	score: number;
	justification: string;
	recommendation: string;
}

export interface ScanReport {
	createdAt: string;
	overallScore: number;
	FunctionScores: FunctionScore[];
	executiveSummary: string;
}
