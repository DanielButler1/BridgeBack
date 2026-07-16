import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

import { requireRole } from "./lib/auth";
import { shortestSupportPath } from "./lib/pathway";

type Question = {
  key: string;
  conceptKey: string;
  eyebrow: string;
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
};

type StoredResponse = {
  questionKey: string;
  conceptKey: string;
  isCorrect: boolean;
};

export const currentAssignment = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const pupil = await requireRole(ctx, "pupil");
    const assignment = await ctx.db
      .query("assignments")
      .withIndex("by_pupil", (q) => q.eq("pupilId", pupil._id))
      .order("desc")
      .first();
    if (!assignment) return null;
    const diagnostic = await ctx.db.get(assignment.diagnosticId);
    if (!diagnostic || diagnostic.status !== "approved") return null;
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
      .collect();
    const paths = await ctx.db
      .query("learningPaths")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
      .collect();
    const graph = await ctx.db.get(diagnostic.conceptGraphId);
    const modules = await ctx.db
      .query("learningModules")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
      .collect();
    const helpRequests = await ctx.db.query("supportRequests").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect();
    return {
      pupil,
      assignment,
      diagnostic: {
        ...diagnostic,
        questions: (diagnostic.questions as Question[]).map((question) => ({
          key: question.key,
          conceptKey: question.conceptKey,
          eyebrow: question.eyebrow,
          prompt: question.prompt,
          code: question.code,
          options: question.options,
        })),
      },
      responses,
      graph,
      path: paths[0] ?? null,
      modules: modules.sort((a, b) => a.order - b.order),
      helpRequests,
    };
  },
});

export const requestTeacherHelp = mutationGeneric({
  args: { moduleId: v.id("learningModules") },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule || learningModule.pupilId !== pupil._id) throw new Error("Learning activity unavailable");
    const existing = (await ctx.db.query("supportRequests").withIndex("by_assignment", (q) => q.eq("assignmentId", learningModule.assignmentId)).collect()).find((request) => request.moduleId === learningModule._id && request.status === "open");
    if (existing) return existing._id;
    return await ctx.db.insert("supportRequests", { assignmentId: learningModule.assignmentId, pupilId: pupil._id, moduleId: learningModule._id, status: "open", createdAt: Date.now() });
  },
});

export const learningContext = queryGeneric({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.pupilId !== pupil._id) throw new Error("Forbidden");
    const diagnostic = await ctx.db.get(assignment.diagnosticId);
    if (!diagnostic) throw new Error("Diagnostic not found");
    const graph = await ctx.db.get(diagnostic.conceptGraphId);
    const lesson = graph ? await ctx.db.get(graph.lessonId) : null;
    const path = await ctx.db.query("learningPaths").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).first();
    if (!graph || !lesson || !path) throw new Error("Learning path is not ready");
    const responses = await ctx.db.query("responses").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect();
    return { pupil, assignment, diagnostic, graph, lesson, path, responses };
  },
});

export const illustrationContext = queryGeneric({
  args: { moduleId: v.id("learningModules") },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule || learningModule.pupilId !== pupil._id || learningModule.status === "locked") throw new Error("Learning activity unavailable");
    if (learningModule.order > 2) throw new Error("Visual explanations are limited to two activities per pathway");
    const lesson = await ctx.db.get(learningModule.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    return { pupil, lesson, learningModule };
  },
});

export const submitAnswer = mutationGeneric({
  args: {
    assignmentId: v.id("assignments"),
    questionKey: v.string(),
    selectedIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.pupilId !== pupil._id) throw new Error("Forbidden");
    const diagnostic = await ctx.db.get(assignment.diagnosticId);
    if (!diagnostic) throw new Error("Diagnostic not found");
    const questions = diagnostic.questions as Question[];
    const question = questions.find((item) => item.key === args.questionKey);
    if (!question) throw new Error("Question not found");
    if (args.selectedIndex < 0 || args.selectedIndex >= question.options.length) {
      throw new Error("Invalid answer");
    }

    const previous = (await ctx.db
      .query("responses")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
      .collect()).find((item) => item.questionKey === question.key);
    const response = {
      assignmentId: assignment._id,
      pupilId: pupil._id,
      questionKey: question.key,
      conceptKey: question.conceptKey,
      selectedIndex: args.selectedIndex,
      isCorrect: args.selectedIndex === question.correctIndex,
      answeredAt: Date.now(),
    };
    if (previous) await ctx.db.patch(previous._id, response);
    else await ctx.db.insert("responses", response);

    const answered = await ctx.db
      .query("responses")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
      .collect();
    const answerMap = new Map<string, StoredResponse>(
      answered.map((item) => [item.questionKey as string, item as StoredResponse]),
    );
    answerMap.set(question.key, response);
    const complete = questions.every((item) => answerMap.has(item.key));
    await ctx.db.patch(assignment._id, {
      status: complete ? "path_ready" : "in_progress",
      currentQuestion: Math.min(answerMap.size, questions.length - 1),
    });

    if (complete) {
      const graph = await ctx.db.get(diagnostic.conceptGraphId);
      if (!graph) throw new Error("Concept graph not found");
      const incorrectConcepts = questions
        .filter((item) => !answerMap.get(item.key)?.isCorrect)
        .map((item) => item.conceptKey);
      const targetConceptKey = diagnostic.targetConceptKey ?? graph.targetConceptKey ?? graph.nodes.at(-1)?.key;
      if (!targetConceptKey) throw new Error("Target concept not found");
      const conceptKeys = shortestSupportPath({
        target: targetConceptKey,
        incorrectConcepts,
        edges: graph.edges,
        limit: 3,
      });
      const existingPath = await ctx.db
        .query("learningPaths")
        .withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id))
        .unique();
      const path = {
        assignmentId: assignment._id,
        pupilId: pupil._id,
        targetConceptKey,
        conceptKeys,
        currentStep: 0,
        generatedAt: Date.now(),
        status: "ready" as const,
      };
      if (existingPath) await ctx.db.patch(existingPath._id, path);
      else await ctx.db.insert("learningPaths", path);
    }
    return { isCorrect: response.isCorrect, complete };
  },
});

export const saveLearningModules = mutationGeneric({
  args: {
    assignmentId: v.id("assignments"),
    modules: v.array(v.object({
      conceptKey: v.string(),
      title: v.string(),
      objective: v.string(),
      explanation: v.string(),
      exampleTitle: v.string(),
      exampleBody: v.string(),
      practicePrompt: v.string(),
      practiceOptions: v.array(v.string()),
      correctIndex: v.number(),
      feedback: v.string(),
      durationMinutes: v.number(),
      sourceRefs: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.pupilId !== pupil._id) throw new Error("Forbidden");
    const diagnostic = await ctx.db.get(assignment.diagnosticId);
    const graph = diagnostic ? await ctx.db.get(diagnostic.conceptGraphId) : null;
    if (!graph) throw new Error("Concept graph not found");
    const existing = await ctx.db.query("learningModules").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).collect();
    for (const learningModule of existing) await ctx.db.delete(learningModule._id);
    for (const [index, learningModule] of args.modules.entries()) {
      await ctx.db.insert("learningModules", {
        assignmentId: assignment._id,
        pupilId: pupil._id,
        lessonId: graph.lessonId,
        ...learningModule,
        order: index + 1,
        status: index === 0 ? "ready" : "locked",
      });
    }
    const path = await ctx.db.query("learningPaths").withIndex("by_assignment", (q) => q.eq("assignmentId", assignment._id)).first();
    if (path) await ctx.db.patch(path._id, {
      status: "in_progress",
      currentStep: 0,
      totalMinutes: args.modules.reduce((total, learningModule) => total + learningModule.durationMinutes, 0),
    });
    return { count: args.modules.length };
  },
});

export const completeModule = mutationGeneric({
  args: { moduleId: v.id("learningModules"), selectedIndex: v.number() },
  handler: async (ctx, args) => {
    const pupil = await requireRole(ctx, "pupil");
    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule || learningModule.pupilId !== pupil._id || learningModule.status === "locked") throw new Error("Forbidden");
    if (args.selectedIndex < 0 || args.selectedIndex >= learningModule.practiceOptions.length) throw new Error("Invalid answer");
    const isCorrect = args.selectedIndex === learningModule.correctIndex;
    if (!isCorrect) return { isCorrect, complete: false };

    await ctx.db.patch(learningModule._id, { status: "complete", completedAt: Date.now() });
    const modules = await ctx.db.query("learningModules").withIndex("by_assignment", (q) => q.eq("assignmentId", learningModule.assignmentId)).collect();
    const ordered = modules.sort((a, b) => a.order - b.order);
    const next = ordered.find((item) => item.order === learningModule.order + 1);
    if (next) await ctx.db.patch(next._id, { status: "ready" });
    const allComplete = ordered.every((item) => item._id === learningModule._id || item.status === "complete");
    const path = await ctx.db.query("learningPaths").withIndex("by_assignment", (q) => q.eq("assignmentId", learningModule.assignmentId)).first();
    if (path) await ctx.db.patch(path._id, {
      currentStep: Math.min(learningModule.order, ordered.length),
      status: allComplete ? "complete" : "in_progress",
    });
    if (allComplete) {
      await ctx.db.patch(learningModule.assignmentId, { status: "complete", completedAt: Date.now() });
    }
    return { isCorrect, complete: allComplete };
  },
});
