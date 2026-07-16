import type { ConceptMapItem, ConceptMapLink } from "@/components/concept-map";

export const mathsConcepts: ConceptMapItem[] = [
  { key: "negative-numbers", title: "Negative numbers", description: "Calculate confidently when a value is below zero.", sourceRef: "Lesson 04 · starter", x: 0, y: 40 },
  { key: "like-terms", title: "Collecting like terms", description: "Simplify expressions without changing their value.", sourceRef: "Lesson 06 · slide 9", x: 0, y: 220 },
  { key: "substitution", title: "Substitution", description: "Replace a letter with a known value or expression.", sourceRef: "Lesson 07 · worksheet 2", x: 260, y: 40 },
  { key: "rearranging", title: "Rearranging equations", description: "Make one variable the subject of an equation.", sourceRef: "Lesson 08 · slide 12", x: 260, y: 220 },
  { key: "checking", title: "Checking a solution", description: "Substitute values back into both original equations.", sourceRef: "Upcoming lesson · example 1", x: 520, y: 40 },
  { key: "simultaneous-equations", title: "Simultaneous equations", description: "Find a pair of values that makes both equations true.", sourceRef: "Upcoming lesson · objective 1", x: 780, y: 140 },
];

export const mathsLinks: ConceptMapLink[] = [
  { source: "negative-numbers", target: "substitution" },
  { source: "like-terms", target: "rearranging" },
  { source: "substitution", target: "checking" },
  { source: "substitution", target: "simultaneous-equations" },
  { source: "rearranging", target: "simultaneous-equations" },
  { source: "checking", target: "simultaneous-equations" },
];

export const mathsReadiness = {
  "negative-numbers": "secure",
  "like-terms": "secure",
  substitution: "support",
  rearranging: "support",
  checking: "check",
} as const;

export const mathsResources = [
  { name: "07 · Substitution practice", detail: "PDF · 5 pages" },
  { name: "08 · Rearranging equations", detail: "PPTX · 16 slides" },
  { name: "Simultaneous equations · upcoming", detail: "PDF · 9 pages" },
];
