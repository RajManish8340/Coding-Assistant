import { generateText, type ModelMessage } from "ai";
import { google } from "@ai-sdk/google";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface(input, output);
const messages: ModelMessage[] = [];

console.log("this is the start of the rabit hole you are about to get in \n");

async function chatLoop() {
  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.toLowerCase().trim() === "exit") {
      console.log("ending chat");
      rl.close();
      break;
    }
    messages.push({ role: "user", content: userInput });
    try {
      const { text } = await generateText({
        model: google("gemini-3.5-flash-lite"),
        messages: messages,
      });
      console.log(`\nGemini: ${text}\n`);
      messages.push({ role: "assistant", content: text });
    } catch (e) {
      console.log("error while geneerating text from provided api", e);
    }
  }
}
chatLoop();
