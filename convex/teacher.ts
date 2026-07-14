import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

import { requireRole } from "./lib/auth";

export const overview = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const teacher = await requireRole(ctx, "teacher");
    const classRecord = await ctx.db
      .query("classes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id))
      .first();
    if (!classRecord) return null;

    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_class", (q) => q.eq("classId", classRecord._id))
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .first();
    if (!lesson) return { teacher, classRecord, lesson: null };

    const [resources, graphs, diagnostics, enrollments] = await Promise.all([
      ctx.db.query("resources").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect(),
      ctx.db.query("conceptGraphs").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect(),
      ctx.db.query("diagnostics").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect(),
      ctx.db.query("enrollments").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect(),
    ]);
    return {
      teacher,
      classRecord,
      lesson,
      resources,
      graph: graphs.sort((a, b) => b.version - a.version)[0] ?? null,
      diagnostic: diagnostics[0] ?? null,
      pupilCount: enrollments.length,
    };
  },
});

export const generateUploadUrl = mutationGeneric({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "teacher");
    return await ctx.storage.generateUploadUrl();
  },
});

export const addResource = mutationGeneric({
  args: {
    classId: v.id("classes"),
    lessonId: v.id("lessons"),
    storageId: v.id("_storage"),
    name: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const classRecord = await ctx.db.get(args.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    return await ctx.db.insert("resources", {
      ...args,
      status: "uploaded",
      synthetic: true,
    });
  },
});

export const approveGraph = mutationGeneric({
  args: { graphId: v.id("conceptGraphs") },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const graph = await ctx.db.get(args.graphId);
    if (!graph) throw new Error("Concept graph not found");
    const classRecord = await ctx.db.get(graph.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    await ctx.db.patch(graph._id, {
      status: "approved",
      approvedBy: teacher._id,
      approvedAt: Date.now(),
    });
  },
});

export const saveGeneratedGraph = mutationGeneric({
  args: {
    lessonId: v.id("lessons"),
    nodes: v.array(v.object({ key: v.string(), title: v.string(), description: v.string(), sourceRef: v.string(), x: v.number(), y: v.number() })),
    edges: v.array(v.object({ source: v.string(), target: v.string() })),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const classRecord = await ctx.db.get(lesson.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    const previous = await ctx.db.query("conceptGraphs").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect();
    return await ctx.db.insert("conceptGraphs", {
      classId: classRecord._id,
      lessonId: lesson._id,
      version: Math.max(0, ...previous.map((graph) => graph.version)) + 1,
      status: "draft",
      nodes: args.nodes,
      edges: args.edges,
    });
  },
});
