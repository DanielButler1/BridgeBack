"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { publicConfig } from "@/lib/config";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [convexClient] = useState(() =>
    publicConfig.convexUrl ? new ConvexReactClient(publicConfig.convexUrl) : null,
  );

  if (publicConfig.clerkPublishableKey && convexClient) {
    return (
      <ClerkProvider publishableKey={publicConfig.clerkPublishableKey}>
        <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  }

  if (publicConfig.clerkPublishableKey) {
    return (
      <ClerkProvider publishableKey={publicConfig.clerkPublishableKey}>
        <TooltipProvider>{children}</TooltipProvider>
      </ClerkProvider>
    );
  }

  return <TooltipProvider>{children}</TooltipProvider>;
}
