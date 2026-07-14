import { internalMutationGeneric } from "convex/server";
import { v } from "convex/values";

const questions = [
  {
    key: "q-indexing",
    conceptKey: "indexing",
    eyebrow: "Arrays & indexing",
    prompt: "Which value is stored at scores[2]?",
    code: "scores = [12, 18, 25, 31]",
    options: ["18", "25", "31", "There is no value"],
    correctIndex: 1,
    feedback: "Array positions begin at zero, so index 2 points to the third value: 25.",
  },
  {
    key: "q-comparison",
    conceptKey: "comparisons",
    eyebrow: "Comparisons",
    prompt: "Which expression is true when target is 18 and middle is 25?",
    options: ["target > middle", "target == middle", "target < middle"],
    correctIndex: 2,
    feedback: "18 is less than 25, so the search continues in the lower half.",
  },
  {
    key: "q-iteration",
    conceptKey: "iteration",
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
    key: "q-trace",
    conceptKey: "trace-tables",
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

const nodes = [
  ["variables", "Variables", "Store and update values while an algorithm runs.", "Lesson 03 · slide 8", 0, 44],
  ["arrays", "Arrays", "Keep an ordered collection of related values.", "Lesson 05 · slide 4", 0, 180],
  ["indexing", "Indexing", "Use positions to access items in an array.", "Lesson 05 · slide 11", 252, 112],
  ["comparisons", "Comparisons", "Compare values using greater than, less than and equal to.", "Lesson 07 · worksheet 1", 252, 272],
  ["iteration", "Iteration", "Repeat instructions while a condition remains true.", "Lesson 08 · slide 6", 504, 36],
  ["trace-tables", "Trace tables", "Follow changing values through each step of an algorithm.", "Lesson 09 · worksheet 2", 504, 200],
  ["sorted-data", "Sorted data", "Recognise why binary search requires an ordered list.", "Upcoming lesson · slide 3", 504, 354],
  ["binary-search", "Binary search", "Repeatedly halve a sorted search space.", "Upcoming lesson · objective 1", 780, 190],
] as const;

const edges = [
  ["variables", "iteration"],
  ["arrays", "indexing"],
  ["indexing", "trace-tables"],
  ["comparisons", "trace-tables"],
  ["iteration", "binary-search"],
  ["trace-tables", "binary-search"],
  ["sorted-data", "binary-search"],
] as const;

export const seedDemo = internalMutationGeneric({
  args: {
    teacherSubject: v.string(),
    pupilSubject: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_subject", (q) => q.eq("clerkSubject", args.teacherSubject))
      .unique();
    if (existing) return { seeded: false, reason: "already_exists" };

    const teacherId = await ctx.db.insert("users", {
      clerkSubject: args.teacherSubject,
      role: "teacher",
      displayName: "Ms Morgan",
      initials: "MM",
      synthetic: true,
    });
    const pupilId = await ctx.db.insert("users", {
      clerkSubject: args.pupilSubject,
      role: "pupil",
      displayName: "Mia",
      initials: "MI",
      synthetic: true,
    });
    const classId = await ctx.db.insert("classes", {
      teacherId,
      name: "10C Computer Science",
      subject: "GCSE Computer Science",
      yearGroup: "Year 10",
      synthetic: true,
    });
    await ctx.db.insert("enrollments", { classId, pupilId });
    const lessonId = await ctx.db.insert("lessons", {
      classId,
      title: "Binary search",
      startsAt: Date.UTC(2026, 6, 16, 9, 0),
      isUpcoming: true,
      objectives: [
        "Explain why binary search requires sorted data",
        "Trace binary search using low, high and middle",
      ],
      analysisStatus: "ready",
      synthetic: true,
    });
    for (const resource of [
      { name: "09 · Trace tables", mediaType: "application/pdf", pageCount: 4, status: "analysed" as const },
      { name: "08 · Iteration", mediaType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", pageCount: 18, status: "analysed" as const },
      { name: "Binary search · upcoming", mediaType: "application/pdf", pageCount: 12, status: "current" as const },
    ]) {
      await ctx.db.insert("resources", { classId, lessonId, ...resource, synthetic: true });
    }
    const graphId = await ctx.db.insert("conceptGraphs", {
      classId,
      lessonId,
      version: 1,
      status: "approved",
      nodes: nodes.map(([key, title, description, sourceRef, x, y]) => ({ key, title, description, sourceRef, x, y })),
      edges: edges.map(([source, target]) => ({ source, target })),
      approvedBy: teacherId,
      approvedAt: Date.now(),
    });
    const diagnosticId = await ctx.db.insert("diagnostics", {
      classId,
      lessonId,
      conceptGraphId: graphId,
      status: "approved",
      questions,
    });
    const assignmentId = await ctx.db.insert("assignments", {
      diagnosticId,
      pupilId,
      assignedBy: teacherId,
      status: "assigned",
      currentQuestion: 0,
      assignedAt: Date.now(),
    });
    return { seeded: true, teacherId, pupilId, classId, lessonId, assignmentId };
  },
});
