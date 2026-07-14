import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

import { requireRole } from "./lib/auth";
import { shortestSupportPath } from "./lib/pathway";

type Question = {
  key: string;
  conceptKey: string;
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
    return { pupil, assignment, diagnostic, responses, path: paths[0] ?? null };
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
      const conceptKeys = shortestSupportPath({
        target: "binary-search",
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
        targetConceptKey: "binary-search",
        conceptKeys,
        generatedAt: Date.now(),
        status: "ready" as const,
      };
      if (existingPath) await ctx.db.patch(existingPath._id, path);
      else await ctx.db.insert("learningPaths", path);
    }
    return { isCorrect: response.isCorrect, complete };
  },
});
