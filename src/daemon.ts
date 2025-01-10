import { serve } from "https://deno.land/std/http/server.ts";

const TIMEOUT_DURATION = 300000; // 5 minutes
let inactivityTimer: Deno.Timeout | undefined;

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    console.log("Shutting down due to inactivity...");
    Deno.exit(0); // Ensure Deno is recognized
  }, TIMEOUT_DURATION);
};

const handleRequest = (req: Request) => {
  resetInactivityTimer();
  // Handle incoming requests here
  return new Response("Hello, world!");
};

const server = await serve({ port: 8000 });
console.log("Server running on http://localhost:8000");

for await (const req of server) {
  handleRequest(req);
}
