export const publicConfig = {
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
};

export const hasClerk = publicConfig.clerkPublishableKey.length > 0;
export const hasConvex = publicConfig.convexUrl.length > 0;
