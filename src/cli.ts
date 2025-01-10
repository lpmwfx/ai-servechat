import { Command } from "https://deno.land/x/cliffy@v1.0.0/command/mod.ts";

await new Command()
  .name("Chat Daemon CLI")
  .version("1.0.0")
  .description("CLI for interacting with the chat daemon")
  .globalOption("-d, --debug", "Enable debug output.")
  .command("start", "Start a new chat session")
  .command("stop", "Stop the current chat session")
  .parse(Deno.args);

console.log("Welcome to the Chat Daemon CLI!");
