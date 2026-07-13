import { Route } from "lucide-react";

import { cn } from "@/lib/utils";

export function BridgeBackMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_var(--primary)]",
        className,
      )}
    >
      <Route className="size-4.5" strokeWidth={2.2} />
    </div>
  );
}

