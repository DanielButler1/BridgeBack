import type { ConceptMapItem, ConceptMapLink } from "@/components/concept-map";

export const mathsConcepts: ConceptMapItem[] = [
  { key: "negative-numbers", title: "Negative numbers", description: "Calculate confidently when a value is below zero.", sourceRef: "Lesson 04 · starter", x: 0, y: 40 },
  { key: "like-terms", title: "Collecting like terms", description: "Simplify expressions without changing their value.", sourceRef: "Lesson 06 · slide 9", x: 0, y: 220 },
  { key: "substitution", title: "Substitution", description: "Replace a letter with a known value or expression.", sourceRef: "Lesson 07 · worksheet 2", x: 260, y: 40 },
  { key: "rearranging", title: "Rearranging equations", description: "Make one variable the subject of an equation.", sourceRef: "Lesson 08 · slide 12", x: 260, y: 220 },
  { key: "solving-linear", title: "Solving linear equations", description: "Use inverse operations to find an unknown when it appears in a linear equation.", sourceRef: "Lesson 06 · worksheet 3", x: 520, y: 40 },
  { key: "simultaneous-equations", title: "Simultaneous equations", description: "Find a pair of values that makes both equations true.", sourceRef: "Upcoming lesson · objective 1", x: 780, y: 140 },
];

export const mathsLinks: ConceptMapLink[] = [
  { source: "negative-numbers", target: "substitution" },
  { source: "like-terms", target: "rearranging" },
  { source: "negative-numbers", target: "solving-linear" },
  { source: "like-terms", target: "solving-linear" },
  { source: "substitution", target: "simultaneous-equations" },
  { source: "rearranging", target: "simultaneous-equations" },
  { source: "solving-linear", target: "simultaneous-equations" },
];

export const mathsReadiness = {
  "negative-numbers": "secure",
  "like-terms": "secure",
  substitution: "support",
  rearranging: "support",
  "solving-linear": "check",
} as const;

export const mathsResources = [
  { name: "07 · Substitution practice", detail: "PDF · 5 pages" },
  { name: "08 · Rearranging equations", detail: "PPTX · 16 slides" },
  { name: "Simultaneous equations · upcoming", detail: "PDF · 9 pages" },
];

export const mathsDiagnosticQuestions = [
  {
    id: "maths-negative",
    conceptId: "negative-numbers",
    eyebrow: "Negative numbers",
    prompt: "What is 7 - 12?",
    options: ["5", "-5", "-19", "19"],
    correctIndex: 1,
    feedback: "Moving 12 places down from 7 passes zero and finishes at -5.",
  },
  {
    id: "maths-like-terms",
    conceptId: "like-terms",
    eyebrow: "Collecting like terms",
    prompt: "Which expression is equivalent to 3x + 2x - 4?",
    options: ["5x - 4", "5x + 4", "6x - 4", "x - 4"],
    correctIndex: 0,
    feedback: "3x and 2x are like terms, so they combine to make 5x. The constant -4 stays unchanged.",
  },
  {
    id: "maths-substitution",
    conceptId: "substitution",
    eyebrow: "Substitution",
    prompt: "If y = 10 - x and x = 4, what is y?",
    options: ["4", "6", "10", "14"],
    correctIndex: 1,
    feedback: "Replace x with 4: y = 10 - 4, so y = 6.",
  },
  {
    id: "maths-rearranging",
    conceptId: "rearranging",
    eyebrow: "Rearranging equations",
    prompt: "Which rearrangement of x + y = 10 makes y the subject?",
    options: ["y = x + 10", "y = x - 10", "y = 10 - x", "y = 10x"],
    correctIndex: 2,
    feedback: "Subtract x from both sides. This leaves y = 10 - x.",
  },
] as const;

export const mathsLearningModules = [
  {
    id: "maths-step-rearranging",
    conceptId: "rearranging",
    order: 1,
    title: "Make one variable the subject",
    objective: "Rearrange an equation so that one variable is written in terms of the other.",
    explanation: "Substitution starts by making one letter the subject. Whatever operation you apply to one side of an equation must also be applied to the other side, so the equation stays balanced.",
    exampleTitle: "Worked example: isolate y",
    exampleBody: "x + y = 10\n\nSubtract x from both sides:\ny = 10 - x\n\nThe equation now tells us what y equals for any value of x.",
    practicePrompt: "Make y the subject of 2x + y = 13.",
    practiceOptions: ["y = 13 - 2x", "y = 13 + 2x", "y = 2x - 13", "y = 13 / 2x"],
    correctIndex: 0,
    feedback: "Subtract 2x from both sides to leave y on its own: y = 13 - 2x.",
    durationMinutes: 7,
    sourceRefs: ["Lesson 08 · slide 12", "Upcoming lesson · example 1"],
  },
  {
    id: "maths-step-substitution",
    conceptId: "substitution",
    order: 2,
    title: "Substitute, solve and check",
    objective: "Substitute one expression into a second equation and check the resulting pair of values.",
    explanation: "Once one equation gives y in terms of x, replace y in the other equation with that expression. Solve the one-variable equation, then substitute back to find the second value. A correct pair must satisfy both original equations.",
    exampleTitle: "Worked example: solve the pair",
    exampleBody: "x + y = 10\n2x + y = 14\n\nFrom the first equation: y = 10 - x\nSubstitute into the second: 2x + (10 - x) = 14\nSo x + 10 = 14, therefore x = 4\nThen y = 10 - 4 = 6\n\nCheck: 4 + 6 = 10 and 2(4) + 6 = 14.",
    practicePrompt: "After finding x = 4 from this pair, which calculation correctly finds y?",
    practiceOptions: ["y = 10 + 4", "y = 10 - 4", "y = 14 - 4", "y = 4 - 10"],
    correctIndex: 1,
    feedback: "Use y = 10 - x and substitute x = 4. This gives y = 6.",
    durationMinutes: 8,
    sourceRefs: ["Lesson 07 · worksheet 2", "Upcoming lesson · objective 1"],
  },
] as const;
