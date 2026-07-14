import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

import { requireViewer } from "./lib/auth";

export const start = mutationGeneric({
  args: {
    lessonId: v.id("lessons"),
    assignmentId: v.optional(v.id("assignments")),
    job: v.union(v.literal("concept_graph"), v.literal("diagnostic"), v.literal("micro_lesson")),
    model: v.string(),
    promptVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    if (args.job === "micro_lesson") {
      if (viewer.role !== "pupil" || !args.assignmentId) throw new Error("Forbidden");
      const assignment = await ctx.db.get(args.assignmentId);
      if (!assignment || assignment.pupilId !== viewer._id) throw new Error("Forbidden");
    } else {
      if (viewer.role !== "teacher") throw new Error("Forbidden");
      const classRecord = await ctx.db.get(lesson.classId);
      if (!classRecord || classRecord.teacherId !== viewer._id) throw new Error("Forbidden");
    }
    return await ctx.db.insert("aiRuns", {
      requestedBy: viewer._id,
      ...args,
      status: "running",
      createdAt: Date.now(),
    });
  },
});

export const succeed = mutationGeneric({
  args: {
    runId: v.id("aiRuns"),
    latencyMs: v.number(),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const run = await ctx.db.get(args.runId);
    if (!run || run.requestedBy !== viewer._id) throw new Error("Forbidden");
    await ctx.db.patch(run._id, { status: "succeeded", latencyMs: args.latencyMs, inputTokens: args.inputTokens, outputTokens: args.outputTokens });
  },
});

export const fail = mutationGeneric({
  args: { runId: v.id("aiRuns"), latencyMs: v.number(), errorCode: v.string() },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const run = await ctx.db.get(args.runId);
    if (!run || run.requestedBy !== viewer._id) throw new Error("Forbidden");
    await ctx.db.patch(run._id, { status: "failed", latencyMs: args.latencyMs, errorCode: args.errorCode });
  },
});
