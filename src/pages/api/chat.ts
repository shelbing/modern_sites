import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
export const prerender = false;
import type { APIRoute } from "astro";

import { system_message } from "./system.message";

const openai = createOpenAI({
  apiKey: import.meta.env.OPEN_AI_SECRET_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  // Get the request body
  const { messages } = await request.json();

  // Process the data
  const result = await streamText({
    model: openai("gpt-4o"),
    system: system_message,
    messages: convertToCoreMessages(messages),
  });

  // Return a response
  return result.toDataStreamResponse();
};
