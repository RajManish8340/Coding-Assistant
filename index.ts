import { streamText, type ModelMessage } from "ai";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { browserSearch, groq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// const open_router = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

const orange = Bun.color("orange", "ansi");
const green = Bun.color("green", "ansi");
const yellow = Bun.color("yellow", "ansi");
const red = Bun.color("red", "ansi");
const reset = "\x1b[0m";

const rl = readline.createInterface(input, output);
const messages: ModelMessage[] = [];

console.log(
  `${yellow}this is the start of the rabit hole you are about to get in${reset} \n`,
);

async function chatLoop() {
  while (true) {
    const userInput = await rl.question(`${green}You: ${reset}`);
    if (userInput.toLowerCase().trim() === "exit") {
      console.log("ending chat");
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });

    try {
      const stream = streamText({
        model: groq("openai/gpt-oss-120b"),
        messages: messages,
        tools: {
          browserSearch: groq.tools.browserSearch({}),
        },
      });

      process.stdout.write(`${orange}AI: ${reset}`);

      for await (const event of stream.stream) {
        if (event.type === "text-delta") {
          process.stdout.write(`${orange}${event.text}${reset}`);
        }
      }
      console.log((await stream.finalStep).usage);

      console.log("");
      messages.push({ role: "assistant", content: await stream.text });
    } catch (e) {
      console.error(`\n${red} error occurred.${reset}\n`, e);
      messages.pop();
    }
  }
}
chatLoop();
