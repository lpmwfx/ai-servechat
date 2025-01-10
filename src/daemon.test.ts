import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { handleRequest } from "./daemon.ts"; // Import the function to test

Deno.test("handleRequest - valid request with openai model", async () => {
  const req = {
    url: "http://localhost:8000?model=openai&input=test",
    respond: (response: Response) => response,
  };

  const response = await handleRequest(req as any);
  assertEquals(await response.text(), "OpenAI response for: test");
});

Deno.test("handleRequest - valid request with claude model", async () => {
  const req = {
    url: "http://localhost:8000?model=claude&input=test",
    respond: (response: Response) => response,
  };

  const response = await handleRequest(req as any);
  assertEquals(await response.text(), "Claude response for: test");
});

Deno.test("handleRequest - request without user input", async () => {
  const req = {
    url: "http://localhost:8000?model=openai",
    respond: (response: Response) => response,
  };

  const response = await handleRequest(req as any);
  assertEquals(await response.text(), "Input is required.");
});

Deno.test("handleRequest - request without model", async () => {
  const req = {
    url: "http://localhost:8000?input=test",
    respond: (response) => response,
  };

  const response = await handleRequest(req as any);
  assertEquals(await response.text(), "Model is required.");
});

Deno.test("handleRequest - request with unrecognized model", async () => {
  const req = {
    url: "http://localhost:8000?model=unknown&input=test",
    respond: (response) => response,
  };

  const response = await handleRequest(req as any);
  assertEquals(await response.text(), "Model not recognized.");
});
