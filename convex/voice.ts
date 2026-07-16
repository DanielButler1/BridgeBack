import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { requireViewer } from "./lib/auth";

const dailySessionLimit = 6;

export const reserve = mutation({
  args: { topicTitle: v.string(), model: v.string() },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const topicTitle = args.topicTitle.trim().replace(/\s+/g, " ");
    if (topicTitle.length < 2 || topicTitle.length > 120) throw new Error("Invalid topic");
    const model = args.model.trim();
    if (model.length < 2 || model.length > 80) throw new Error("Invalid model");
    const dayAgo = Date.now() - 24 * 60 * 60 * 1_000;
    const recent = await ctx.db.query("voiceSessions")
      .withIndex("by_user_and_started_at", (query) => query.eq("userId", viewer._id).gte("startedAt", dayAgo))
      .collect();
    if (recent.filter((session) => session.status !== "failed").length >= dailySessionLimit) throw new Error("Daily voice limit reached");
    return await ctx.db.insert("voiceSessions", {
      userId: viewer._id,
      topicTitle,
      model,
      durationLimitSeconds: 300,
      status: "reserved",
      startedAt: Date.now(),
    });
  },
});

export const setStatus = mutation({
  args: { sessionId: v.id("voiceSessions"), status: v.union(v.literal("started"), v.literal("failed")) },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== viewer._id) throw new Error("Voice session not found");
    await ctx.db.patch(session._id, { status: args.status });
    return null;
  },
});
