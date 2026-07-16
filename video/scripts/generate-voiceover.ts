import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import OpenAI from "openai";

import { narrationText } from "../src/script.ts";

if (!process.env.OPENAI_API_KEY) throw new Error("Set OPENAI_API_KEY before generating the voiceover.");

const output = resolve("public/voiceover/bridgeback-build-week.mp3");
await mkdir(dirname(output), { recursive: true });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const speech = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "marin",
  input: narrationText,
  instructions: "Warm, calm UK English documentary delivery. Sound human and assured, never corporate or overexcited. Use a deliberate pace with clear pauses between ideas, gently emphasise the number sequence, and pronounce BridgeBack as two words. Complete the narration in approximately one hundred and sixteen seconds.",
  response_format: "mp3",
  speed: 0.78,
});

await writeFile(output, Buffer.from(await speech.arrayBuffer()));
console.log(`Generated ${output}`);
