import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";

import { getDemoSession } from "@/lib/auth/demo-session";

export async function GET() {
  const clerkAuth = await auth();
  const browserToken = await clerkAuth.getToken();
  if (browserToken) {
    return Response.json({ token: browserToken }, { headers: { "Cache-Control": "no-store" } });
  }

  const demoSession = await getDemoSession();
  if (!demoSession) return Response.json({ error: "Unauthenticated" }, { status: 401 });

  const client = await clerkClient();
  const token = await client.sessions.getToken(demoSession.sessionId);
  return Response.json({ token: token.jwt }, { headers: { "Cache-Control": "no-store" } });
}
