import type { ScanReport } from "./types.js";

/**
 * 	Generates an HTML Dashboard and full report with a visual chart.
 */

export function toDashboard(report: ScanReport): string {
	const date = new Date(report.createdAt).toLocaleDateString("fr-FR");
	const labels = report.FunctionScores.map((d) => d.function);
	const scores = report.FunctionScores.map((d) => d.score);

	const domainCards = report.FunctionScores
		.map(
			(d) => `
			<div class="card">
			<h3>${d.function}</h3>
			<p class="score">${d.score}/5</p>
			<p class="justification">${d.justification}</p>
			<p class="recommendation"><strong>Recommandation :</strong> ${d.recommendation}</p>
			</div>`
		)
		.join("\n");

	return `<!DOCTYPE html>
			<html lang="fr">
			<head>
			<meta charset="UTF-8" />
			<title>130Dashboard</title>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
			<style>
			body {
				font-family: Courier;
				background: #222019;
				color: #92b170;
				max-width: 900px;
				margin: 20px auto;
			}
			h1 { font-size: 1.8rem; color: #92b170; }
			.meta { color: #acaca7; margin-top: 14px; }
			.overall {
				background: #1d1d1f;
				color: #acaca7;
				border-radius: 12px;
				padding: 10px 14px;
				display: inline-block;
				margin-bottom: 12px;
				
			}
			.overall .value { font-size: 2rem; font-weight: 600; }
			.summary {
				color: #1b1612;
				background: #acaca7;
				border-radius: 12px;
				padding: 20px 24px;
				margin-bottom: 32px;
				line-height: 1.6;
			}
			#chartWrapper {
				background: #acaca7;
				border-radius: 12px;
				padding: 24px;
				margin-bottom: 32px;
				max-width: 500px;
			}
			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
				gap: 40px;
			}
			.card {
				background: #acaca7;
				border-radius: 12px;
				padding: 18px 20px;
			}
			.card h3 { margin: 0 0 8px; font-size: 1rem; }
			.card .score { font-size: 1.4rem; font-weight: 400; margin: 4px 0; }
			.card .justification { font-size: 0.8rem; color: #444; }
			.card .recommendation { font-size: 0.9rem; color: #1e3406; }
			</style>
			</head>
			<body>
			<h1>Dashboard — Cybersecurity Maturity Report</h1>
			<p class="meta">${date}</p>

			<div class="overall">
				<div>Overall Score</div>
				<div class="value">${report.overallScore}/5</div>
			</div>

			<div class="summary">
				<strong>Summary</strong>
				<p>${report.executiveSummary}</p>
			</div>

			<div id="chartWrapper">
				<canvas id="radarChart"></canvas>
			</div>

			<div class="grid">
				${domainCards}
			</div>

			<script>
				const ctx = document.getElementById('radarChart');
				new Chart(ctx, {
					type: 'radar',
					data: {
					labels: ${JSON.stringify(labels)},
					datasets: [{
						label: 'score/5',
						data: ${JSON.stringify(scores)},
						backgroundColor: 'rgba(15, 65, 22, 0.69)',
						borderColor: 'rgba(13, 29, 15, 0.74)',
						pointBackgroundColor: 'rgb(76, 107, 70)',
					}]
					},
					options: {
					scales: {
						r: { min: 0, max: 5, ticks: { stepSize: 1 } }
					}
					}
				});
			</script>
			</body>
			</html>
		`;
}
