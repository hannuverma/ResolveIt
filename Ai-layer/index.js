import readline from "readline/promises";

async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	while (true) {
		const input = await rl.question("Enter a command: ");
		if (input.toLowerCase() === "exit") {
			console.log("Exiting...");
			break;
		}
		console.log(`You entered: ${input}`);
	}
    rl.close();
}
await main();
