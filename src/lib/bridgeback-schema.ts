import { z } from "zod";

export const conceptStatusSchema = z.enum([
  "secure",
  "check",
  "support",
  "upcoming",
]);

export const conceptSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: conceptStatusSchema,
  source: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
});

export const conceptLinkSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const diagnosticQuestionSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  eyebrow: z.string(),
  prompt: z.string(),
  code: z.string().optional(),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().nonnegative(),
  feedback: z.string(),
});

export const learningStepSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  duration: z.number().int().positive(),
  type: z.enum(["explain", "practice", "check"]),
});

export const conceptGraphSchema = z.object({
  lessonTitle: z.string(),
  concepts: z.array(conceptSchema),
  links: z.array(conceptLinkSchema),
});

export type Concept = z.infer<typeof conceptSchema>;
export type ConceptLink = z.infer<typeof conceptLinkSchema>;
export type DiagnosticQuestion = z.infer<typeof diagnosticQuestionSchema>;
export type LearningStep = z.infer<typeof learningStepSchema>;

