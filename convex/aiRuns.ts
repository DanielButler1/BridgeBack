import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

import { requireRole } from "./lib/auth";

export const start = mutationGeneric({
  args: {
    lessonId: v.id("lessons"),
    job: v.union(v.literal("concept_graph"), v.literal("diagnostic"), v.literal("micro_lesson")),
    model: v.string(),
    promptVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const classRecord = await ctx.db.get(lesson.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    return await ctx.db.insert("aiRuns", {
      requestedBy: teacher._id,
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
    const teacher = await requireRole(ctx, "teacher");
    const run = await ctx.db.get(args.runId);
    if (!run || run.requestedBy !== teacher._id) throw new Error("Forbidden");
    await ctx.db.patch(run._id, { status: "succeeded", latencyMs: args.latencyMs, inputTokens: args.inputTokens, outputTokens: args.outputTokens });
  },
});

export const fail = mutationGeneric({
  args: { runId: v.id("aiRuns"), latencyMs: v.number(), errorCode: v.string() },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const run = await ctx.db.get(args.runId);
    if (!run || run.requestedBy !== teacher._id) throw new Error("Forbidden");
    await ctx.db.patch(run._id, { status: "failed", latencyMs: args.latencyMs, errorCode: args.errorCode });
  },
});
