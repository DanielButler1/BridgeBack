export const publicConfig = {
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
};

const forceTestFallback = process.env.NEXT_PUBLIC_E2E_FORCE_FALLBACK === "true";

export const hasClerk = !forceTestFallback && publicConfig.clerkPublishableKey.length > 0;
export const hasConvex = !forceTestFallback && publicConfig.convexUrl.length > 0;
