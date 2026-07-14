import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type ViewerContext = QueryCtx | MutationCtx;
type Viewer = Doc<"users">;

export async function requireViewer(ctx: ViewerContext) {
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
  ctx: ViewerContext,
  role: "teacher" | "pupil",
) {
  const viewer = await requireViewer(ctx);
  if (viewer.role !== role) throw new Error("Forbidden");
  return viewer;
}
