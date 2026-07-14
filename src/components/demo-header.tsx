"use client";

import { UserButton } from "@clerk/nextjs";
import { GraduationCap, School, Sparkles } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasClerk } from "@/lib/config";

export function DemoHeader({ role }: { role?: "teacher" | "pupil" }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <BridgeBackMark />
          <div>
            <p className="font-heading text-[15px] font-semibold leading-none tracking-tight">BridgeBack</p>
            <p className="mt-1 hidden text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">The shortest path back</p>
          </div>
        </Link>
        <nav className="mx-auto flex items-center rounded-lg bg-muted/65 p-1" aria-label="Demo views">
          <Button nativeButton={false} render={<Link href="/teacher" />} variant={role === "teacher" ? "secondary" : "ghost"} size="sm">
            <School /> <span className="hidden sm:inline">Teacher</span>
          </Button>
          <Button nativeButton={false} render={<Link href="/pupil" />} variant={role === "pupil" ? "secondary" : "ghost"} size="sm">
            <GraduationCap /> <span className="hidden sm:inline">Mia</span>
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden border-primary/20 bg-primary/[0.045] text-primary md:flex">
            <Sparkles data-icon="inline-start" /> Synthetic demo
          </Badge>
          {hasClerk ? <UserButton /> : <span className="size-2 rounded-full bg-amber-500" title="Local demo mode" />}
        </div>
      </div>
    </header>
  );
}
