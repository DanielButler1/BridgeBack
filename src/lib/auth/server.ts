import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { hasClerk } from "@/lib/config";
import { getDemoSession } from "@/lib/auth/demo-session";

export async function requireDemoRole(role: "teacher" | "pupil") {
  if (!hasClerk) return { mode: "local" as const, userId: null };

  const clerkAuth = await auth();
  const demoSession = clerkAuth.userId ? null : await getDemoSession();
  const userId = clerkAuth.userId ?? demoSession?.userId ?? null;
  if (!userId) redirect("/");
  const expected = role === "teacher"
    ? process.env.DEMO_TEACHER_CLERK_USER_ID
    : process.env.DEMO_PUPIL_CLERK_USER_ID;
  if (!expected || userId !== expected) redirect("/");
  return { mode: "clerk" as const, userId };
}
