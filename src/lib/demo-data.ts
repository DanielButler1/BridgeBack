import type {
  Concept,
  ConceptLink,
  DiagnosticQuestion,
  LearningStep,
} from "@/lib/bridgeback-schema";

export const demoPupil = {
  name: "Mia",
  initials: "MI",
  year: "Year 10",
  subject: "GCSE Computer Science",
  daysMissed: 20,
  resourcesMissed: 12,
  nextLesson: "Binary search",
};

export const concepts: Concept[] = [
  {
    id: "variables",
    title: "Variables",
    description: "Store and update values while an algorithm runs.",
    status: "secure",
    source: "Lesson 03 · slide 8",
    position: { x: 0, y: 44 },
  },
  {
    id: "arrays",
    title: "Arrays",
    description: "Keep an ordered collection of related values.",
    status: "secure",
    source: "Lesson 05 · slide 4",
    position: { x: 0, y: 180 },
  },
  {
    id: "indexing",
    title: "Indexing",
    description: "Use positions to access items in an array.",
    status: "check",
    source: "Lesson 05 · slide 11",
    position: { x: 252, y: 112 },
  },
  {
    id: "comparisons",
    title: "Comparisons",
    description: "Compare values using greater than, less than and equal to.",
    status: "secure",
    source: "Lesson 07 · worksheet 1",
    position: { x: 252, y: 272 },
  },
  {
    id: "iteration",
    title: "Iteration",
    description: "Repeat instructions while a condition remains true.",
    status: "support",
    source: "Lesson 08 · slide 6",
    position: { x: 504, y: 36 },
  },
  {
    id: "trace-tables",
    title: "Trace tables",
    description: "Follow changing values through each step of an algorithm.",
    status: "support",
    source: "Lesson 09 · worksheet 2",
    position: { x: 504, y: 200 },
  },
  {
    id: "sorted-data",
    title: "Sorted data",
    description: "Recognise why binary search requires an ordered list.",
    status: "secure",
    source: "Upcoming lesson · slide 3",
    position: { x: 504, y: 354 },
  },
  {
    id: "binary-search",
    title: "Binary search",
    description: "Repeatedly halve a sorted search space.",
    status: "upcoming",
    source: "Upcoming lesson · objective 1",
    position: { x: 780, y: 190 },
  },
];

export const conceptLinks: ConceptLink[] = [
  { id: "variables-iteration", source: "variables", target: "iteration" },
  { id: "arrays-indexing", source: "arrays", target: "indexing" },
  { id: "indexing-trace", source: "indexing", target: "trace-tables" },
  { id: "comparisons-trace", source: "comparisons", target: "trace-tables" },
  { id: "iteration-binary", source: "iteration", target: "binary-search" },
  { id: "trace-binary", source: "trace-tables", target: "binary-search" },
  { id: "sorted-binary", source: "sorted-data", target: "binary-search" },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "q-indexing",
    conceptId: "indexing",
    eyebrow: "Arrays & indexing",
    prompt: "Which value is stored at scores[2]?",
    code: "scores = [12, 18, 25, 31]",
    options: ["18", "25", "31", "There is no value"],
    correctIndex: 1,
    feedback: "Array positions begin at zero, so index 2 points to the third value: 25.",
  },
  {
    id: "q-comparison",
    conceptId: "comparisons",
    eyebrow: "Comparisons",
    prompt: "Which expression is true when target is 18 and middle is 25?",
    options: ["target > middle", "target == middle", "target < middle"],
    correctIndex: 2,
    feedback: "18 is less than 25, so the search would continue in the lower half.",
  },
  {
    id: "q-iteration",
    conceptId: "iteration",
    eyebrow: "Iteration",
    prompt: "What is the purpose of the while loop in this search?",
    code: "while low <= high:\n    middle = (low + high) // 2",
    options: [
      "Sort the data",
      "Keep searching while a valid range remains",
      "Add every value together",
      "Run exactly once",
    ],
    correctIndex: 1,
    feedback: "The loop continues while there is still a valid section of the list to search.",
  },
  {
    id: "q-trace",
    conceptId: "trace-tables",
    eyebrow: "Tracing an algorithm",
    prompt: "After checking the middle value, what should a trace table record?",
    options: [
      "Only the final answer",
      "The updated low, high and middle values",
      "Every item in the original list again",
      "The name of the programmer",
    ],
    correctIndex: 1,
    feedback: "A trace table records how the important variables change after each step.",
  },
];

export const learningSteps: LearningStep[] = [
  {
    id: "step-iteration",
    conceptId: "iteration",
    order: 1,
    title: "Loops that narrow a search",
    description: "See how a while loop keeps going only while a valid range remains.",
    duration: 6,
    type: "explain",
  },
  {
    id: "step-trace",
    conceptId: "trace-tables",
    order: 2,
    title: "Follow the changing boundaries",
    description: "Practise tracking low, high and middle across two search steps.",
    duration: 7,
    type: "practice",
  },
  {
    id: "step-ready",
    conceptId: "binary-search",
    order: 3,
    title: "Ready for binary search",
    description: "A short check that connects both ideas to tomorrow’s lesson.",
    duration: 4,
    type: "check",
  },
];

export const recentResources = [
  { name: "09 · Trace tables", type: "PDF", pages: 4, status: "Analysed" },
  { name: "08 · Iteration", type: "PPTX", pages: 18, status: "Analysed" },
  { name: "Binary search · upcoming", type: "PDF", pages: 12, status: "Current" },
];

