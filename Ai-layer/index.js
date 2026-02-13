// import { HumanMessage } from "@langchain/core/messages";
// import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import readline from "readline/promises";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import AISystemPrompt from "./AISystemPrompt.js";
dotenv.config();

const llm = new ChatGroq({
	model: "llama-3.1-8b-instant",
	temperature: 0,
	maxRetries: 2,
});
async function callModel(state) {
	const complaint = state.messages[state.messages.length - 1].content;

	const response = await llm.invoke([
		{ role: "system", content: AISystemPrompt },
		{ role: "user", content: complaint },
	]);

	try {
		return JSON.parse(response.content);
	} catch (err) {
		console.log("Error parsing AI response, returning default value", err);
		return {
			title: "Unclassified Issue",
			category: "Infrastructure",
			priority: "NORMAL",
			department: "Civil / Infrastructure Department",
		};
	}
}


export default callModel;
