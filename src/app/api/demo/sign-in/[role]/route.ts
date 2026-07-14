import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { demoSessionCookie, encodeDemoSession } from "@/lib/auth/demo-session";

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
  const session = await client.sessions.createSession({ userId });
  const response = NextResponse.redirect(new URL(`/${role}`, request.nextUrl.origin));
  response.cookies.set(demoSessionCookie, encodeDemoSession(session.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
