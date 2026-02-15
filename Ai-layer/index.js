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
	const college = state.college;

	if (!complaint || !college) {
		return fallbackResponse();
	}

	const messages = [
		{ role: "system", content: AISystemPrompt },
		{
			role: "user",
			content: `Complaint: ${complaint}\nCollege: ${college}`,
		},
	];

	const response = await llmWithTools.invoke(messages);

	// ✅ TOOL HANDLING PHASE
	if (response.tool_calls?.length) {
		const toolCall = response.tool_calls[0];

		if (toolCall.name === "get_departments") {
			const toolResult = await getDepartmentsTool.invoke({
				college,
			});

			const finalResponse = await llmWithTools.invoke([
				...messages,
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
	console.log(response.content);
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
