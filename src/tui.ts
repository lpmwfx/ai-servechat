import { readLines } from "https://deno.land/std@0.114.0/io/mod.ts"; // Use a specific version

async function startChat() {
  console.log("Chat session started. Type 'exit' to end the session.");
  const stdin = readLines(Deno.stdin);
  
  for await (const line of stdin) {
    if (line.trim().toLowerCase() === "exit") {
      console.log("Chat session ended.");
      break;
    }
    console.clear(); // Clear the screen
    console.log(`You: ${line}`); 
    // Here you can add logic to process the chat input
  }
}

async function main() {
  console.log("Welcome to the Chat TUI!");
  await startChat();
}

if (import.meta.main) {
  main();
}
