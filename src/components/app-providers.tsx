"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { publicConfig } from "@/lib/config";

function useConvexAuth() {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "anonymous">("loading");
  const fetchAccessToken = useCallback(
    async () => {
      const response = await fetch("/api/demo/token", { cache: "no-store" });
      if (!response.ok) return null;
      const body = await response.json() as { token: string };
      return body.token;
    },
    [],
  );

  useEffect(() => {
    void fetchAccessToken().then((token) =>
      setAuthState(token ? "authenticated" : "anonymous"),
    );
  }, [fetchAccessToken]);

  return useMemo(
    () => ({
      isLoading: authState === "loading",
      isAuthenticated: authState === "authenticated",
      fetchAccessToken,
    }),
    [authState, fetchAccessToken],
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [convexClient] = useState(() =>
    publicConfig.convexUrl ? new ConvexReactClient(publicConfig.convexUrl) : null,
  );

  if (publicConfig.clerkPublishableKey && convexClient) {
    return (
      <ClerkProvider publishableKey={publicConfig.clerkPublishableKey}>
        <ConvexProviderWithAuth client={convexClient} useAuth={useConvexAuth}>
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexProviderWithAuth>
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
