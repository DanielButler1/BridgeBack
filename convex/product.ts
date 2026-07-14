import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireViewer } from "./lib/auth";

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
  args: { organisationId: v.id("organisations"), name: v.string(), subject: v.string(), yearGroup: v.string() },
  handler: async (ctx, args) => {
    const viewer = await requireProductionViewer(ctx);
    const membership = await ctx.db.query("memberships").withIndex("by_organisation_and_user", (q) => q.eq("organisationId", args.organisationId).eq("userId", viewer._id)).unique();
    if (!membership || membership.status !== "active" || !["owner", "admin", "teacher"].includes(membership.role)) throw new Error("Forbidden");
    const classId = await ctx.db.insert("classes", { organisationId: args.organisationId, teacherId: viewer._id, name: clean(args.name, "Class name"), subject: clean(args.subject, "Subject"), yearGroup: clean(args.yearGroup, "Year group", 40), synthetic: false });
    await ctx.db.insert("auditEvents", { organisationId: args.organisationId, actorId: viewer._id, action: "class.created", targetType: "class", targetId: String(classId), occurredAt: Date.now() });
    return classId;
  },
});
