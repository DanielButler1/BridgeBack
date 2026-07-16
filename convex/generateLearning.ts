"use node";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { actionGeneric, anyApi } from "convex/server";
import { v } from "convex/values";
import { z } from "zod";

const model = "gpt-5.6-luna";
const promptVersion = "micro-lessons-v1";
const illustrationModel = "gpt-image-1-mini";
const illustrationPromptVersion = "learning-illustration-v1";

const modulesSchema = z.object({
  modules: z.array(z.object({
    conceptKey: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1).max(90),
    objective: z.string().min(1).max(180),
    explanation: z.string().min(1).max(900),
    exampleTitle: z.string().min(1).max(90),
    exampleBody: z.string().min(1).max(900),
    practicePrompt: z.string().min(1).max(280),
    practiceOptions: z.array(z.string().min(1).max(180)).min(3).max(4),
    correctIndex: z.number().int().min(0).max(3),
    feedback: z.string().min(1).max(280),
    durationMinutes: z.number().int().min(3).max(10),
    sourceRefs: z.array(z.string().min(1).max(160)).min(1).max(4),
  })).min(1).max(3),
});

type LearningContext = {
  lesson: { _id: string; title: string; objectives: string[] };
  assignment: { _id: string };
  path: { conceptKeys: string[]; targetConceptKey: string };
  graph: {
    nodes: Array<{ key: string; title: string; description: string; sourceRef: string }>;
    edges: Array<{ source: string; target: string }>;
  };
  diagnostic: {
    questions: Array<{ key: string; conceptKey: string; prompt: string; feedback: string }>;
  };
  responses: Array<{ questionKey: string; conceptKey: string; isCorrect: boolean }>;
};

async function safetyIdentifier(subject: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(subject));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validateModules(parsed: z.infer<typeof modulesSchema>, context: LearningContext) {
  const expected = context.path.conceptKeys;
  if (parsed.modules.length !== expected.length) throw new Error("module_count_mismatch");
  for (const [index, module] of parsed.modules.entries()) {
    if (module.conceptKey !== expected[index]) throw new Error("module_order_mismatch");
    if (module.correctIndex >= module.practiceOptions.length) throw new Error("invalid_correct_index");
    const validRefs = new Set(context.graph.nodes.map((node) => node.sourceRef));
    if (module.sourceRefs.some((ref) => !validRefs.has(ref))) throw new Error("unknown_source_reference");
  }
  return parsed.modules;
}

export const modules = actionGeneric({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
    const context = await ctx.runQuery(anyApi.pupil.learningContext, args) as LearningContext;

    const startedAt = Date.now();
    const runId = await ctx.runMutation(anyApi.aiRuns.start, {
      lessonId: context.lesson._id,
      assignmentId: args.assignmentId,
      job: "micro_lesson",
      model,
      promptVersion,
    });
    try {
      const relevantNodes = context.path.conceptKeys.map((key) => context.graph.nodes.find((node) => node.key === key));
      if (relevantNodes.some((node) => !node)) throw new Error("path_concept_missing");
      const responseSummary = context.responses.map((response) => ({
        conceptKey: response.conceptKey,
        isCorrect: response.isCorrect,
      }));
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.parse({
        model,
        store: false,
        safety_identifier: await safetyIdentifier(identity.subject),
        reasoning: { effort: "low" },
        input: [
          {
            role: "developer",
            content: "Create one calm, concise micro-lesson for each concept in the supplied path, in exactly the supplied order. These lessons prepare a returning UK secondary pupil to participate in the upcoming lesson; they are not a complete replacement curriculum. Ground every explanation and example in the approved concept descriptions and reuse only the exact source references supplied. Use encouraging, age-appropriate language without making claims about ability, emotion, disability, absence reason, behaviour, or mastery. Each module must include a short explanation, one worked example, and one unambiguous multiple-choice check. Keep the total pathway manageable and do not add concepts.",
          },
          {
            role: "user",
            content: `Upcoming lesson: ${context.lesson.title}\nObjectives: ${context.lesson.objectives.join("; ")}\nRequired concept order: ${context.path.conceptKeys.join(", ")}\nApproved concepts: ${JSON.stringify(relevantNodes)}\nDiagnostic response summary: ${JSON.stringify(responseSummary)}`,
          },
        ],
        text: { format: zodTextFormat(modulesSchema, "bridgeback_micro_lessons") },
      });
      if (!response.output_parsed) throw new Error("model_refusal_or_empty_output");
      const generatedModules = validateModules(response.output_parsed, context);
      await ctx.runMutation(anyApi.pupil.saveLearningModules, {
        assignmentId: args.assignmentId,
        modules: generatedModules,
      });
      await ctx.runMutation(anyApi.aiRuns.succeed, {
        runId,
        latencyMs: Date.now() - startedAt,
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
      });
      return { count: generatedModules.length };
    } catch (error) {
      const errorCode = error instanceof Error ? error.message.slice(0, 80) : "unknown_error";
      await ctx.runMutation(anyApi.aiRuns.fail, { runId, latencyMs: Date.now() - startedAt, errorCode });
      throw error;
    }
  },
});

export const illustration = actionGeneric({
  args: { moduleId: v.id("learningModules") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
    const context = await ctx.runQuery(anyApi.pupil.illustrationContext, args) as {
      lesson: { _id: string; title: string };
      learningModule: { assignmentId: string; title: string; objective: string; explanation: string; exampleTitle: string; exampleBody: string };
    };
    const startedAt = Date.now();
    const runId = await ctx.runMutation(anyApi.aiRuns.start, {
      lessonId: context.lesson._id,
      assignmentId: context.learningModule.assignmentId,
      job: "illustration",
      model: illustrationModel,
      promptVersion: illustrationPromptVersion,
    });
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const result = await client.images.generate({
        model: illustrationModel,
        prompt: `Create one calm, age-appropriate educational illustration for a UK Year 10 pupil. It should explain the computer-science idea visually without adding decorative clutter. Do not include a person, pupil name, school logo, marks, grades, medical context, attendance context, or readable text. Use clear shapes, a restrained green and cream palette, strong contrast, and a simple left-to-right visual sequence.\n\nUpcoming lesson: ${context.lesson.title}\nActivity: ${context.learningModule.title}\nObjective: ${context.learningModule.objective}\nExplanation: ${context.learningModule.explanation}\nWorked example: ${context.learningModule.exampleTitle}: ${context.learningModule.exampleBody}`,
        size: "1024x1024",
        quality: "low",
        output_format: "webp",
        moderation: "auto",
      });
      const imageBase64 = result.data?.[0]?.b64_json;
      if (!imageBase64) throw new Error("image_generation_empty");
      await ctx.runMutation(anyApi.aiRuns.succeed, { runId, latencyMs: Date.now() - startedAt });
      return {
        dataUrl: `data:image/webp;base64,${imageBase64}`,
        alt: `Visual explanation of ${context.learningModule.title}: ${context.learningModule.objective}`,
      };
    } catch (error) {
      const errorCode = error instanceof Error ? error.message.slice(0, 80) : "unknown_error";
      await ctx.runMutation(anyApi.aiRuns.fail, { runId, latencyMs: Date.now() - startedAt, errorCode });
      throw error;
    }
  },
});
