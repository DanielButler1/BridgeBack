import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const role = v.union(v.literal("teacher"), v.literal("pupil"));

export default defineSchema({
  users: defineTable({
    clerkSubject: v.string(),
    role,
    displayName: v.string(),
    initials: v.string(),
    synthetic: v.boolean(),
  })
    .index("by_clerk_subject", ["clerkSubject"])
    .index("by_role", ["role"]),

  organisations: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    retentionDays: v.number(),
  }).index("by_created_by", ["createdBy"]),

  memberships: defineTable({
    organisationId: v.id("organisations"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("teacher"), v.literal("safeguarding")),
    status: v.union(v.literal("active"), v.literal("revoked")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organisation", ["organisationId"])
    .index("by_organisation_and_user", ["organisationId", "userId"]),

  classes: defineTable({
    organisationId: v.optional(v.id("organisations")),
    teacherId: v.id("users"),
    name: v.string(),
    subject: v.string(),
    yearGroup: v.string(),
    curriculumKey: v.optional(v.string()),
    synthetic: v.boolean(),
  }).index("by_teacher", ["teacherId"]),

  auditEvents: defineTable({
    organisationId: v.id("organisations"),
    actorId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    occurredAt: v.number(),
  })
    .index("by_organisation", ["organisationId"])
    .index("by_actor", ["actorId"]),

  enrollments: defineTable({
    classId: v.id("classes"),
    pupilId: v.id("users"),
  })
    .index("by_class", ["classId"])
    .index("by_pupil", ["pupilId"])
    .index("by_class_and_pupil", ["classId", "pupilId"]),

  lessons: defineTable({
    classId: v.id("classes"),
    title: v.string(),
    startsAt: v.number(),
    isUpcoming: v.boolean(),
    objectives: v.array(v.string()),
    curriculumTopicCode: v.optional(v.string()),
    analysisStatus: v.union(
      v.literal("not_started"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    synthetic: v.boolean(),
  })
    .index("by_class", ["classId"])
    .index("by_class_and_upcoming", ["classId", "isUpcoming"]),

  resources: defineTable({
    classId: v.id("classes"),
    lessonId: v.optional(v.id("lessons")),
    storageId: v.optional(v.id("_storage")),
    name: v.string(),
    mediaType: v.string(),
    pageCount: v.optional(v.number()),
    sourceText: v.optional(v.string()),
    status: v.union(
      v.literal("uploaded"),
      v.literal("analysed"),
      v.literal("current"),
    ),
    synthetic: v.boolean(),
  })
    .index("by_class", ["classId"])
    .index("by_lesson", ["lessonId"]),

  conceptGraphs: defineTable({
    classId: v.id("classes"),
    lessonId: v.id("lessons"),
    version: v.number(),
    status: v.union(v.literal("draft"), v.literal("approved")),
    targetConceptKey: v.optional(v.string()),
    nodes: v.array(
      v.object({
        key: v.string(),
        title: v.string(),
        description: v.string(),
        sourceRef: v.string(),
        x: v.number(),
        y: v.number(),
      }),
    ),
    edges: v.array(
      v.object({
        source: v.string(),
        target: v.string(),
      }),
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
  })
    .index("by_lesson", ["lessonId"])
    .index("by_lesson_and_version", ["lessonId", "version"]),

  diagnostics: defineTable({
    classId: v.id("classes"),
    lessonId: v.id("lessons"),
    conceptGraphId: v.id("conceptGraphs"),
    status: v.union(v.literal("draft"), v.literal("approved")),
    targetConceptKey: v.optional(v.string()),
    questions: v.array(
      v.object({
        key: v.string(),
        conceptKey: v.string(),
        eyebrow: v.string(),
        prompt: v.string(),
        code: v.optional(v.string()),
        options: v.array(v.string()),
        correctIndex: v.number(),
        feedback: v.string(),
      }),
    ),
  }).index("by_lesson", ["lessonId"]),

  assignments: defineTable({
    diagnosticId: v.id("diagnostics"),
    pupilId: v.id("users"),
    assignedBy: v.id("users"),
    status: v.union(
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("path_ready"),
      v.literal("complete"),
    ),
    currentQuestion: v.number(),
    assignedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_pupil", ["pupilId"])
    .index("by_diagnostic_and_pupil", ["diagnosticId", "pupilId"]),

  responses: defineTable({
    assignmentId: v.id("assignments"),
    pupilId: v.id("users"),
    questionKey: v.string(),
    conceptKey: v.string(),
    selectedIndex: v.number(),
    isCorrect: v.boolean(),
    answeredAt: v.number(),
  })
    .index("by_assignment", ["assignmentId"])
    .index("by_assignment_and_question", ["assignmentId", "questionKey"]),

  learningPaths: defineTable({
    assignmentId: v.id("assignments"),
    pupilId: v.id("users"),
    targetConceptKey: v.string(),
    conceptKeys: v.array(v.string()),
    currentStep: v.optional(v.number()),
    totalMinutes: v.optional(v.number()),
    generatedAt: v.number(),
    status: v.union(v.literal("ready"), v.literal("in_progress"), v.literal("complete")),
  }).index("by_assignment", ["assignmentId"]),

  learningModules: defineTable({
    assignmentId: v.id("assignments"),
    pupilId: v.id("users"),
    lessonId: v.id("lessons"),
    conceptKey: v.string(),
    order: v.number(),
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
    status: v.union(v.literal("locked"), v.literal("ready"), v.literal("complete")),
    completedAt: v.optional(v.number()),
  })
    .index("by_assignment", ["assignmentId"])
    .index("by_assignment_and_order", ["assignmentId", "order"]),

  supportRequests: defineTable({
    assignmentId: v.id("assignments"),
    pupilId: v.id("users"),
    moduleId: v.optional(v.id("learningModules")),
    status: v.union(v.literal("open"), v.literal("acknowledged")),
    createdAt: v.number(),
    acknowledgedAt: v.optional(v.number()),
  })
    .index("by_assignment", ["assignmentId"])
    .index("by_pupil", ["pupilId"]),

  aiRuns: defineTable({
    requestedBy: v.id("users"),
    lessonId: v.id("lessons"),
    assignmentId: v.optional(v.id("assignments")),
    job: v.union(
      v.literal("concept_graph"),
      v.literal("diagnostic"),
      v.literal("micro_lesson"),
      v.literal("illustration"),
    ),
    model: v.string(),
    promptVersion: v.string(),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("succeeded"),
      v.literal("failed"),
    ),
    latencyMs: v.optional(v.number()),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    errorCode: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_lesson", ["lessonId"]),
});
