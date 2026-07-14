import type {
  GenericDataModel,
  GenericDocument,
  GenericQueryCtx,
} from "convex/server";

type QueryContext = GenericQueryCtx<GenericDataModel>;

type Viewer = GenericDocument & {
  clerkSubject: string;
  role: "teacher" | "pupil";
  displayName: string;
  initials: string;
  synthetic: boolean;
};

export async function requireViewer(ctx: QueryContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const viewer = await ctx.db
    .query("users")
    .withIndex("by_clerk_subject", (query) =>
      query.eq("clerkSubject", identity.subject),
    )
    .unique();

  if (!viewer) throw new Error("Viewer has not been provisioned");
  return viewer as Viewer;
}

export async function requireRole(
  ctx: QueryContext,
  role: "teacher" | "pupil",
) {
  const viewer = await requireViewer(ctx);
  if (viewer.role !== role) throw new Error("Forbidden");
  return viewer;
}
