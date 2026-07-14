import "server-only";

import OpenAI from "openai";

let openAIClient: OpenAI | null = null;

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not configured. BridgeBack will continue in seeded demo mode.",
    );
  }

  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openAIClient;
}
