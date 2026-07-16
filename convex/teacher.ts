import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

import { requireRole } from "./lib/auth";

type GraphNode = { key: string };
type GraphEdge = { source: string; target: string };

function validateGraph(nodes: GraphNode[], edges: GraphEdge[], targetConceptKey?: string) {
  const keys = new Set(nodes.map((node) => node.key));
  if (keys.size !== nodes.length) throw new Error("Concept keys must be unique");
  if (!targetConceptKey || !keys.has(targetConceptKey)) throw new Error("The upcoming target must exist in the map");
  for (const edge of edges) {
    if (!keys.has(edge.source) || !keys.has(edge.target) || edge.source === edge.target) throw new Error("Every prerequisite must connect two different concepts");
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (key: string) => {
    if (visiting.has(key)) throw new Error("Prerequisites cannot form a cycle");
    if (visited.has(key)) return;
    visiting.add(key);
    for (const edge of edges.filter((item) => item.source === key)) visit(edge.target);
    visiting.delete(key);
    visited.add(key);
  };
  for (const key of keys) visit(key);
}

export const overview = queryGeneric({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const classRecord = args.classId
      ? await ctx.db.get(args.classId)
      : await ctx.db.query("classes").withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id)).first();
    if (!classRecord || classRecord.teacherId !== teacher._id) return null;

    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_class", (q) => q.eq("classId", classRecord._id))
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .first();
    if (!lesson) return { teacher, classRecord, lesson: null };

    const [resources, graphs, diagnostics, enrollments, runs] = await Promise.all([
      ctx.db.query("resources").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect(),
      ctx.db.query("conceptGraphs").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect(),
      ctx.db.query("diagnostics").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect(),
      ctx.db.query("enrollments").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect(),
      ctx.db.query("aiRuns").withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id)).collect(),
    ]);
    const graph = graphs.sort((a, b) => b.version - a.version)[0] ?? null;
    const diagnostic = graph
      ? diagnostics.filter((item) => item.conceptGraphId === graph._id).sort((a, b) => b._creationTime - a._creationTime)[0] ?? null
      : null;
    const enrollment = enrollments[0] ?? null;
    const pupil = enrollment ? await ctx.db.get(enrollment.pupilId) : null;
    const assignment = diagnostic && pupil
      ? (await ctx.db.query("assignments").withIndex("by_diagnostic_and_pupil", (q) => q.eq("diagnosticId", diagnostic._id)).collect()).find((item) => item.pupilId === pupil._id) ?? null
      : null;
    const responses = assignment
      ? await ctx.db.query("responses").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect()
      : [];
    const path = assignment
      ? await ctx.db.query("learningPaths").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).first()
      : null;
    const modules = assignment
      ? await ctx.db.query("learningModules").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect()
      : [];
    const supportRequests = assignment
      ? await ctx.db.query("supportRequests").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect()
      : [];
    return {
      teacher,
      classRecord,
      lesson,
      resources,
      graph,
      diagnostic,
      pupilCount: enrollments.length,
      pupil,
      assignment,
      responses,
      path,
      modules: modules.sort((a, b) => a.order - b.order),
      supportRequests,
      latestRun: runs.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null,
    };
  },
});

export const analysisContext = queryGeneric({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const classRecord = await ctx.db.get(lesson.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    const resources = await ctx.db.query("resources").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect();
    return { teacher, lesson, classRecord, resources };
  },
});

export const assignmentContext = queryGeneric({
  args: { graphId: v.id("conceptGraphs") },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const graph = await ctx.db.get(args.graphId);
    if (!graph || graph.status !== "approved") throw new Error("Approve the concept map first");
    const lesson = await ctx.db.get(graph.lessonId);
    const classRecord = await ctx.db.get(graph.classId);
    if (!lesson || !classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    const enrollment = await ctx.db.query("enrollments").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).first();
    if (!enrollment) throw new Error("No pupil is enrolled");
    const pupil = await ctx.db.get(enrollment.pupilId);
    if (!pupil) throw new Error("Pupil not found");
    return { teacher, lesson, classRecord, graph, pupil };
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
    const allowedTypes = new Set([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ]);
    if (!allowedTypes.has(args.mediaType)) throw new Error("Only PDF and PPTX lesson files are supported");
    if (args.name.trim().length < 1 || args.name.length > 160 || /[\\/\0]/.test(args.name)) throw new Error("Invalid filename");
    const storedFile = await ctx.db.system.get(args.storageId);
    if (!storedFile || storedFile.size > 20 * 1024 * 1024) throw new Error("Files must be no larger than 20 MB");
    if (storedFile.contentType && storedFile.contentType !== args.mediaType) throw new Error("File type does not match its content metadata");
    return await ctx.db.insert("resources", {
      ...args,
      status: "uploaded",
      synthetic: classRecord.synthetic,
    });
  },
});

export const markAnalysisStatus = mutationGeneric({
  args: {
    lessonId: v.id("lessons"),
    status: v.union(v.literal("not_started"), v.literal("processing"), v.literal("ready"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const classRecord = await ctx.db.get(lesson.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    await ctx.db.patch(lesson._id, { analysisStatus: args.status });
    if (args.status === "ready") {
      const resources = await ctx.db.query("resources").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect();
      for (const resource of resources) {
        if (resource.status === "uploaded") await ctx.db.patch(resource._id, { status: "analysed" });
      }
    }
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
    validateGraph(graph.nodes, graph.edges, graph.targetConceptKey);
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
    targetConceptKey: v.string(),
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
      targetConceptKey: args.targetConceptKey,
      nodes: args.nodes,
      edges: args.edges,
    });
  },
});

export const updateGraph = mutationGeneric({
  args: {
    graphId: v.id("conceptGraphs"),
    targetConceptKey: v.string(),
    nodes: v.array(v.object({ key: v.string(), title: v.string(), description: v.string(), sourceRef: v.string(), x: v.number(), y: v.number() })),
    edges: v.array(v.object({ source: v.string(), target: v.string() })),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const graph = await ctx.db.get(args.graphId);
    if (!graph || graph.status !== "draft") throw new Error("Only draft maps can be edited");
    const classRecord = await ctx.db.get(graph.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    validateGraph(args.nodes, args.edges, args.targetConceptKey);
    await ctx.db.patch(graph._id, { targetConceptKey: args.targetConceptKey, nodes: args.nodes, edges: args.edges });
  },
});

export const saveDiagnosticAndAssign = mutationGeneric({
  args: {
    graphId: v.id("conceptGraphs"),
    targetConceptKey: v.string(),
    questions: v.array(v.object({
      key: v.string(),
      conceptKey: v.string(),
      eyebrow: v.string(),
      prompt: v.string(),
      code: v.optional(v.string()),
      options: v.array(v.string()),
      correctIndex: v.number(),
      feedback: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const graph = await ctx.db.get(args.graphId);
    if (!graph || graph.status !== "approved") throw new Error("Approve the concept map first");
    const classRecord = await ctx.db.get(graph.classId);
    if (!classRecord || classRecord.teacherId !== teacher._id) throw new Error("Forbidden");
    const enrollment = await ctx.db.query("enrollments").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).first();
    if (!enrollment) throw new Error("No pupil is enrolled");
    const diagnosticId = await ctx.db.insert("diagnostics", {
      classId: graph.classId,
      lessonId: graph.lessonId,
      conceptGraphId: graph._id,
      status: "approved",
      targetConceptKey: args.targetConceptKey,
      questions: args.questions,
    });
    return await ctx.db.insert("assignments", {
      diagnosticId,
      pupilId: enrollment.pupilId,
      assignedBy: teacher._id,
      status: "assigned",
      currentQuestion: 0,
      assignedAt: Date.now(),
    });
  },
});

export const resetSyntheticAssignment = mutationGeneric({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const teacher = await requireRole(ctx, "teacher");
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.assignedBy !== teacher._id) throw new Error("Forbidden");
    const pupil = await ctx.db.get(assignment.pupilId);
    const diagnostic = await ctx.db.get(assignment.diagnosticId);
    const graph = diagnostic ? await ctx.db.get(diagnostic.conceptGraphId) : null;
    const classRecord = graph ? await ctx.db.get(graph.classId) : null;
    if (!pupil?.synthetic || !classRecord?.synthetic) throw new Error("Only synthetic demo progress can be reset");
    const [responses, paths, modules] = await Promise.all([
      ctx.db.query("responses").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect(),
      ctx.db.query("learningPaths").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect(),
      ctx.db.query("learningModules").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect(),
    ]);
    for (const response of responses) await ctx.db.delete(response._id);
    for (const path of paths) await ctx.db.delete(path._id);
    for (const learningModule of modules) await ctx.db.delete(learningModule._id);
    await ctx.db.patch(assignment._id, { status: "assigned", currentQuestion: 0, completedAt: undefined });
  },
});
