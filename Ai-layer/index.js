import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import AISystemPrompt from "./AISystemPrompt.js";
import { getDepartmentsTool } from "./tools.js";

dotenv.config();

const llm = new ChatGroq({
	model: "llama-3.1-8b-instant",
	temperature: 0,
	maxRetries: 2,
});

// Bind tools to model (CRITICAL)
const llmWithTools = llm.bindTools([getDepartmentsTool]);

async function callModel(state) {
	const complaint = state.messages[state.messages.length - 1].content;

	if (!complaint) {
		return fallbackResponse();
	}
	const response = await llmWithTools.invoke([
		{ role: "system", content: AISystemPrompt },
		{ role: "user", content: complaint },
	]);

	if (response.tool_calls?.length) {

		const toolCall = response.tool_calls[0];

		if (toolCall.name === "get_departments") {
			const toolResult = await getDepartmentsTool.invoke(toolCall.args);

			// Send tool response BACK to model
			const finalResponse = await llmWithTools.invoke([
				{ role: "system", content: AISystemPrompt },
				{ role: "user", content: complaint },
				response,
				{
					role: "tool",
					tool_call_id: toolCall.id,
					content: JSON.stringify(toolResult),
				},
			]);

			return JSON.parse(finalResponse.content);
		}
	}

	return JSON.parse(response.content);

}

function fallbackResponse() {
	return {
		title: "Unclassified Issue",
		category: "Infrastructure",
		priority: "Normal", // IMPORTANT FIX
		department: "Civil / Infrastructure Department",
		similarity_key: {
			resource_type: "Infrastructure",
			issue_type: "Unknown",
			location: "Unknown",
		},
	};
}

export default callModel;
