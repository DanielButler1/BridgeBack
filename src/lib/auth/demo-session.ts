import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export const demoSessionCookie = "bridgeback_demo_session";

function signature(sessionId: string) {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error("Clerk is not configured");
  return createHmac("sha256", secret)
    .update(`bridgeback-demo:${sessionId}`)
    .digest("base64url");
}

export function encodeDemoSession(sessionId: string) {
  return `${sessionId}.${signature(sessionId)}`;
}

function decodeDemoSession(value: string | undefined) {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const sessionId = value.slice(0, separator);
  const supplied = Buffer.from(value.slice(separator + 1));
  const expected = Buffer.from(signature(sessionId));
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return sessionId;
}

export async function getDemoSession() {
  const value = (await cookies()).get(demoSessionCookie)?.value;
  const sessionId = decodeDemoSession(value);
  if (!sessionId) return null;

  try {
    const client = await clerkClient();
    const session = await client.sessions.getSession(sessionId);
    if (session.status !== "active") return null;
    return { sessionId: session.id, userId: session.userId };
  } catch {
    return null;
  }
}
