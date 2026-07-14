import { mutationGeneric, queryGeneric } from "convex/server";

import { requireViewer } from "./lib/auth";

export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_subject", (q) => q.eq("clerkSubject", identity.subject))
      .unique();
  },
});

export const provisionDemoViewer = mutationGeneric({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_subject", (q) => q.eq("clerkSubject", identity.subject))
      .unique();
    if (existing) return existing._id;

    const teacherSubject = process.env.DEMO_TEACHER_CLERK_USER_ID;
    const pupilSubject = process.env.DEMO_PUPIL_CLERK_USER_ID;
    const role = identity.subject === teacherSubject
      ? "teacher"
      : identity.subject === pupilSubject
        ? "pupil"
        : null;
    if (!role) throw new Error("This account is not part of the synthetic demo");

    return await ctx.db.insert("users", {
      clerkSubject: identity.subject,
      role,
      displayName: role === "teacher" ? "Ms Morgan" : "Mia",
      initials: role === "teacher" ? "MM" : "MI",
      synthetic: true,
    });
  },
});

export const assertSession = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireViewer(ctx);
    return { id: viewer._id, role: viewer.role };
  },
});
