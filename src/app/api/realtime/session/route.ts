import "server-only";

import { createHash } from "node:crypto";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

import { getDemoSession } from "@/lib/auth/demo-session";
import { buildRealtimeTutorInstructions, realtimeTutorRequestSchema } from "@/lib/realtime-tutor";

export const runtime = "nodejs";

const reserveRef = makeFunctionReference<"mutation", { topicTitle: string; model: string }, string>("voice:reserve");
const setStatusRef = makeFunctionReference<"mutation", { sessionId: string; status: "started" | "failed" }, null>("voice:setStatus");

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 75_000) return Response.json({ error: "Request too large" }, { status: 413 });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "Expected JSON" }, { status: 415 });

  const clerkAuth = await auth();
  const demoSession = clerkAuth.userId ? null : await getDemoSession();
  const userId = clerkAuth.userId ?? demoSession?.userId;
  if (!userId) return Response.json({ error: "Unauthenticated" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "Voice learning is not configured" }, { status: 503 });

  let input: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 75_000) return Response.json({ error: "Request too large" }, { status: 413 });
    input = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = realtimeTutorRequestSchema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "Invalid learning context" }, { status: 400 });

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return Response.json({ error: "Voice learning is not configured" }, { status: 503 });
  const token = clerkAuth.userId
    ? await clerkAuth.getToken()
    : demoSession ? (await (await clerkClient()).sessions.getToken(demoSession.sessionId)).jwt : null;
  if (!token) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(token);
  const realtimeModel = process.env.OPENAI_REALTIME_MODEL?.trim() || "gpt-realtime-2.1";
  let voiceSessionId: string;
  try {
    voiceSessionId = await convex.mutation(reserveRef, { topicTitle: parsed.data.context.title, model: realtimeModel });
  } catch (cause) {
    const message = cause instanceof Error && cause.message.includes("Daily voice limit")
      ? "You have reached today's voice conversation limit"
      : "Voice session could not be authorised";
    return Response.json({ error: message }, { status: cause instanceof Error && cause.message.includes("Daily voice limit") ? 429 : 403 });
  }

  const safetyIdentifier = createHash("sha256").update(`bridgeback-realtime:${userId}`).digest("hex");
  const form = new FormData();
  form.set("sdp", parsed.data.sdp);
  form.set("session", JSON.stringify({
    type: "realtime",
    model: realtimeModel,
    output_modalities: ["audio"],
    instructions: buildRealtimeTutorInstructions(parsed.data.context),
    audio: {
      input: { turn_detection: { type: "semantic_vad" } },
      output: { voice: "marin" },
    },
  }));

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": safetyIdentifier,
      },
      body: form,
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    if (!response.ok) {
      await convex.mutation(setStatusRef, { sessionId: voiceSessionId, status: "failed" }).catch(() => null);
      return Response.json({ error: "Voice session could not be started" }, { status: 502 });
    }
    await convex.mutation(setStatusRef, { sessionId: voiceSessionId, status: "started" });
    return new Response(body, { status: 200, headers: { "Content-Type": "application/sdp", "Cache-Control": "no-store" } });
  } catch {
    await convex.mutation(setStatusRef, { sessionId: voiceSessionId, status: "failed" }).catch(() => null);
    return Response.json({ error: "Voice session could not be started" }, { status: 502 });
  }
}
