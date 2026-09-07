/**
 * 	Handling Ollama's answers and work.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:1b";

interface OllamaChatResponse {
	message: {
		role: string;
		content: string;
	};
	done_reason?: string;
}

/** Format the kinds of answers, since Ollama is a small model, the priority is to make it answer */
export async function callLLM(
	systemPrompt: string,
	userPrompt: string
	): Promise<string> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: OLLAMA_MODEL,
			stream: false,
			options: {
			temperature: 0.2,
			num_predict: 512,
			},
			messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
			],
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(
			`[!] Ollama call failed (${response.status}): ${errorBody}\n` +
			`Ensure Ollama is running and "${OLLAMA_MODEL}" is available (\`ollama pull ${OLLAMA_MODEL}\`).`
		);
  }

  const data = (await response.json()) as OllamaChatResponse;

  if (data.done_reason === "length") {
		console.error(
			"[!]Model Error | Response exceeded max-length."
		);
	}
	return data.message.content;
}
