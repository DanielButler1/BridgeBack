import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireViewer } from "./lib/auth";
import { findCurriculumPack, findCurriculumTopic } from "../src/lib/curriculum-catalog";

function clean(value: string, label: string, max = 80) {
  const result = value.trim().replace(/\s+/g, " ");
  if (result.length < 2 || result.length > max) throw new Error(`${label} must be between 2 and ${max} characters`);
  return result;
}

async function requireProductionViewer(ctx: Parameters<typeof requireViewer>[0]) {
  const viewer = await requireViewer(ctx);
  if (viewer.synthetic) throw new Error("Synthetic demo identities cannot access production workspaces");
  return viewer;
}

export const provisionTeacher = mutation({
  args: { displayName: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const existing = await ctx.db.query("users").withIndex("by_clerk_subject", (q) => q.eq("clerkSubject", identity.subject)).unique();
    if (existing) return existing._id;
    const displayName = clean(args.displayName, "Name");
    const initials = displayName.split(" ").slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
    return await ctx.db.insert("users", { clerkSubject: identity.subject, role: "teacher", displayName, initials, synthetic: false });
  },
});

export const workspace = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireProductionViewer(ctx);
    const memberships = await ctx.db.query("memberships").withIndex("by_user", (q) => q.eq("userId", viewer._id)).collect();
    const active = memberships.filter((membership) => membership.status === "active");
    const organisations = (await Promise.all(active.map((membership) => ctx.db.get(membership.organisationId)))).filter(Boolean);
    const classes = await ctx.db.query("classes").withIndex("by_teacher", (q) => q.eq("teacherId", viewer._id)).collect();
    return { viewer, memberships: active, organisations, classes: classes.filter((item) => !item.synthetic) };
  },
});

export const createOrganisation = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const viewer = await requireProductionViewer(ctx);
    const organisationId = await ctx.db.insert("organisations", { name: clean(args.name, "School name", 120), createdBy: viewer._id, createdAt: Date.now(), retentionDays: 365 });
    await ctx.db.insert("memberships", { organisationId, userId: viewer._id, role: "owner", status: "active", createdAt: Date.now() });
    await ctx.db.insert("auditEvents", { organisationId, actorId: viewer._id, action: "organisation.created", targetType: "organisation", targetId: String(organisationId), occurredAt: Date.now() });
    return organisationId;
  },
});

export const createClass = mutation({
  args: { organisationId: v.id("organisations"), name: v.string(), subject: v.string(), yearGroup: v.string(), curriculumKey: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const viewer = await requireProductionViewer(ctx);
    const membership = await ctx.db.query("memberships").withIndex("by_organisation_and_user", (q) => q.eq("organisationId", args.organisationId).eq("userId", viewer._id)).unique();
    if (!membership || membership.status !== "active" || !["owner", "admin", "teacher"].includes(membership.role)) throw new Error("Forbidden");
    if (args.curriculumKey && !findCurriculumPack(args.curriculumKey)) throw new Error("Choose a supported curriculum");
    const classId = await ctx.db.insert("classes", { organisationId: args.organisationId, teacherId: viewer._id, name: clean(args.name, "Class name"), subject: clean(args.subject, "Subject"), yearGroup: clean(args.yearGroup, "Year group", 40), curriculumKey: args.curriculumKey, synthetic: false });
    await ctx.db.insert("auditEvents", { organisationId: args.organisationId, actorId: viewer._id, action: "class.created", targetType: "class", targetId: String(classId), occurredAt: Date.now() });
    return classId;
  },
});

export const classWorkspace = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const viewer = await requireProductionViewer(ctx);
    const classRecord = await ctx.db.get(args.classId);
    if (!classRecord || classRecord.synthetic || classRecord.teacherId !== viewer._id || !classRecord.organisationId) throw new Error("Class not found");
    const membership = await ctx.db.query("memberships").withIndex("by_organisation_and_user", (q) => q.eq("organisationId", classRecord.organisationId!).eq("userId", viewer._id)).unique();
    if (!membership || membership.status !== "active") throw new Error("Forbidden");
    const lessons = await ctx.db.query("lessons").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect();
    const upcomingLesson = lessons.filter((lesson) => lesson.isUpcoming).sort((a, b) => a.startsAt - b.startsAt)[0] ?? null;
    const curriculum = findCurriculumPack(classRecord.curriculumKey);
    return { classRecord, upcomingLesson, lessonCount: lessons.length, curriculum: curriculum ?? null };
  },
});

export const createLesson = mutation({
  args: {
    classId: v.id("classes"),
    title: v.string(),
    objectives: v.array(v.string()),
    startsAt: v.number(),
    curriculumTopicCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireProductionViewer(ctx);
    const classRecord = await ctx.db.get(args.classId);
    if (!classRecord || classRecord.synthetic || classRecord.teacherId !== viewer._id || !classRecord.organisationId) throw new Error("Class not found");
    const membership = await ctx.db.query("memberships").withIndex("by_organisation_and_user", (q) => q.eq("organisationId", classRecord.organisationId!).eq("userId", viewer._id)).unique();
    if (!membership || membership.status !== "active" || !["owner", "admin", "teacher"].includes(membership.role)) throw new Error("Forbidden");
    const title = clean(args.title, "Lesson title", 120);
    if (args.curriculumTopicCode && !findCurriculumTopic(classRecord.curriculumKey, args.curriculumTopicCode)) throw new Error("Choose a topic from this class curriculum");
    const objectives = args.objectives.map((objective) => clean(objective, "Objective", 180)).slice(0, 6);
    if (!objectives.length) throw new Error("Add at least one lesson objective");
    if (!Number.isFinite(args.startsAt) || args.startsAt < Date.now() - 24 * 60 * 60 * 1000) throw new Error("Choose an upcoming lesson time");
    const existing = await ctx.db.query("lessons").withIndex("by_class", (q) => q.eq("classId", classRecord._id)).collect();
    for (const lesson of existing) {
      if (lesson.isUpcoming) await ctx.db.patch(lesson._id, { isUpcoming: false });
    }
    const lessonId = await ctx.db.insert("lessons", {
      classId: classRecord._id,
      title,
      startsAt: args.startsAt,
      isUpcoming: true,
      objectives,
      curriculumTopicCode: args.curriculumTopicCode,
      analysisStatus: "not_started",
      synthetic: false,
    });
    await ctx.db.insert("auditEvents", { organisationId: classRecord.organisationId, actorId: viewer._id, action: "lesson.created", targetType: "lesson", targetId: String(lessonId), occurredAt: Date.now() });
    return lessonId;
  },
});
