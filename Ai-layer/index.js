import { HumanMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "readline/promises";
import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv";
dotenv.config();

const llm = new ChatGroq({
	model: "openai/gpt-oss-120b",
	temperature: 1,
	maxRetries: 2,
	// other params...
});


async function callModel(state) {
	console.log("Calling AI model");
	// Call the AI model here and return the response

	const response =  await llm.invoke(state.messages);

	return {messages : [response]};
}


const workflow = new StateGraph(MessagesAnnotation)
	.addNode("agent", callModel)
	.addEdge("__start__", "agent")
	.addEdge("agent", "__end__")

const app = workflow.compile();
async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		const input = await rl.question("Enter a command: ");

		const finalState = await app.invoke({
			messages: [{role: "user" , content: input}],
		})
		if (input.toLowerCase() === "exit") {
			console.log("Exiting...");
			break;
		}

		const AImessage = finalState.messages[finalState.messages.length - 1];
		console.log("AI Response:", AImessage.content);
	}
	rl.close();
}
await main();
