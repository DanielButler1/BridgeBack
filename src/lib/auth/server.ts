import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { hasClerk } from "@/lib/config";

export async function requireDemoRole(role: "teacher" | "pupil") {
  if (!hasClerk) return { mode: "local" as const, userId: null };

  const { userId } = await auth();
  if (!userId) redirect("/");
  const expected = role === "teacher"
    ? process.env.DEMO_TEACHER_CLERK_USER_ID
    : process.env.DEMO_PUPIL_CLERK_USER_ID;
  if (!expected || userId !== expected) redirect("/");
  return { mode: "clerk" as const, userId };
}
