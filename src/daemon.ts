import { serve } from "https://deno.land/std/http/server.ts"; // Ensure this import is correct
export type Request = { url: string; respond: (response: Response) => void }; // Define Request type

const TIMEOUT_DURATION = 300000; // 5 minutes
let inactivityTimer: ReturnType<typeof setTimeout> | undefined;

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    console.log("Shutting down due to inactivity...");
    Deno.exit(0); // Ensure Deno is recognized
  }, TIMEOUT_DURATION);
};

export const handleRequest = async (req: Request) => {
  resetInactivityTimer();
  
  const url = new URL(req.url);
  const model = url.searchParams.get("model"); // Get the model from query parameters
  const userInput = url.searchParams.get("input"); // Get user input from query parameters

  if (!userInput) {
    return new Response("Input is required.", { status: 400 });
  }
  
  if (!model) {
    return new Response("Model is required.", { status: 400 });
  }

  let responseText = "Model not recognized.";
  
  if (model === "openai") {
    responseText = await callOpenAI(userInput);
  } else if (model === "claude") {
    responseText = await callClaude(userInput);
  }

  return new Response(responseText);
};

const callOpenAI = async (input: string) => {
  // Implement OpenAI API call logic here
  return `OpenAI response for: ${input}`;
};

const callClaude = async (input: string) => {
  // Implement Claude API call logic here
  return `Claude response for: ${input}`;
};

const server = await serve({ port: 8000 });
console.log("Server running on http://localhost:8000");

for await (const req of server) {
  const response = await handleRequest(req);
  req.respond(response);
}
