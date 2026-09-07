/**
 * 	This file generates a Maturity Scan report in Markdown (.md) format.
 * 	Room for improvement: select different output format (.xsl, .pdf, .docx..)
 */

import type { ScanReport } from "./types.js"

export function toReportFile(report: ScanReport): string {
	const date = new Date(report.createdAt).toLocaleDateString("en-EN");

	const domainRows = report.FunctionScores
		.map(
			(d) => 
				`| ${d.function} | ${d.score}/5 | ${d.justification} | ${d.recommendation} |`
		)
		.join("\n");

		return `# [🌿] 130MS — Cybersecurity Maturity Scan

		**Created:** ${date}
		**Overall Score:** ${report.overallScore}/5

		## Summary
		${report.executiveSummary}

		## Domain details
		| Domaine | Score | Justification | Recommandation |
		|---|---|---|---|
		${domainRows}

		*This report is a pedagocial tool and shall not replace a formal audit. This is just learning
		material to get familiar with GRC/M analysis. Created by 130moodtrbl.*`;
}