"use client";

import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, GraduationCap, School } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { hasClerk } from "@/lib/config";

export function DemoHeader({ role }: { role?: "teacher" | "pupil" }) {
  const teacherHref = hasClerk ? "/api/demo/sign-in/teacher" : "/demo/teacher";
  const pupilHref = hasClerk ? "/api/demo/sign-in/pupil" : "/demo/pupil";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BridgeBack home">
          <BridgeBackMark />
          <div className="hidden sm:block">
            <p className="font-heading text-[15px] font-semibold leading-none tracking-[-0.02em]">BridgeBack</p>
            <p className="mt-1 text-[11px] text-muted-foreground">The shortest path back</p>
          </div>
        </Link>

        <nav className="mx-auto flex items-center rounded-xl border bg-muted/45 p-1" aria-label="Demo views">
          <Button nativeButton={false} render={<a href={teacherHref} />} variant={role === "teacher" ? "secondary" : "ghost"} size="sm" className="rounded-lg px-3 sm:px-4">
            <School /> <span className="hidden sm:inline">Teacher workspace</span><span className="sm:hidden">Teacher</span>
          </Button>
          <Button nativeButton={false} render={<a href={pupilHref} />} variant={role === "pupil" ? "secondary" : "ghost"} size="sm" className="rounded-lg px-3 sm:px-4">
            <GraduationCap /> <span className="hidden sm:inline">Mia&apos;s journey</span><span className="sm:hidden">Mia</span>
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {hasClerk ? <UserButton /> : null}
          <Button nativeButton={false} render={<Link href="/" />} variant="ghost" size="sm" className="hidden lg:inline-flex">
            <ArrowLeft /> Back to site
          </Button>
          <Button nativeButton={false} render={<Link href="/" />} variant="ghost" size="icon" className="lg:hidden" aria-label="Back to site">
            <ArrowLeft />
          </Button>
        </div>
      </div>
    </header>
  );
}
