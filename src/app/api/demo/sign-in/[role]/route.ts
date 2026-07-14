import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const allowedRoles = new Set(["teacher", "pupil"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ role: string }> },
) {
  const { role } = await context.params;
  if (process.env.DEMO_AUTH_ENABLED !== "true" || !allowedRoles.has(role)) {
    return NextResponse.json({ error: "Demo sign-in is unavailable" }, { status: 404 });
  }
  const userId = role === "teacher"
    ? process.env.DEMO_TEACHER_CLERK_USER_ID
    : process.env.DEMO_PUPIL_CLERK_USER_ID;
  if (!userId) {
    return NextResponse.json({ error: "Demo identity is not configured" }, { status: 503 });
  }
  const client = await clerkClient();
  const token = await client.signInTokens.createSignInToken({ userId, expiresInSeconds: 60 });
  const response = NextResponse.redirect(new URL(token.url, request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
