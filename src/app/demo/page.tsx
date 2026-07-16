import { ArrowLeft, ArrowRight, BookOpenCheck, Calculator, GraduationCap, School, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { hasClerk } from "@/lib/config";

export default function DemoPage() {
  const teacher = hasClerk ? "/api/demo/sign-in/teacher" : "/demo/teacher";
  const pupil = hasClerk ? "/api/demo/sign-in/pupil" : "/demo/pupil";

  return (
    <main className="min-h-[100dvh] bg-[color-mix(in_oklch,var(--muted)_38%,var(--background))] px-4 sm:px-6">
      <header className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-3" aria-label="BridgeBack home">
          <BridgeBackMark />
          <span className="font-heading font-semibold tracking-[-0.02em]">BridgeBack</span>
        </Link>
        <Button nativeButton={false} render={<Link href="/" />} variant="ghost" size="sm">
          <ArrowLeft /> Back to site
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 py-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:py-24">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpenCheck className="size-4" /> Guided product tour
          </p>
          <h1 className="mt-6 text-balance font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
            See the whole journey from both sides.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            Start with Ms Morgan&apos;s lesson planning, or follow Mia through her short route back into class.
          </p>
          <p className="mt-8 flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            Switch roles at any point and reset the journey whenever you want to show it again.
          </p>
          <div className="mt-8 rounded-2xl border bg-card p-5">
            <p className="flex items-center gap-2 font-heading font-semibold"><Calculator className="size-4 text-primary" /> Also explore mathematics</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">See the same next-lesson method applied to simultaneous equations, with a different concept map and pupil pathway.</p>
            <Button nativeButton={false} render={<Link href="/demo/maths" />} variant="outline" size="sm" className="mt-4">Open the maths example <ArrowRight /></Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-2xl bg-foreground p-7 text-background shadow-xl shadow-foreground/5 sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-background/10">
                <School className="size-5" />
              </div>
              <h2 className="mt-7 font-heading text-2xl font-semibold">Teacher workspace</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-background/65">
                Review the upcoming lesson, concept map, source materials, diagnostic, and Mia&apos;s pathway.
              </p>
            </div>
            <Button nativeButton={false} render={<a href={teacher} />} className="mt-7 bg-background text-foreground hover:bg-background/90 lg:mt-0">
              Enter as Ms Morgan <ArrowRight />
            </Button>
          </article>

          <article className="rounded-2xl border bg-card p-7 shadow-xl shadow-primary/5 sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>
              <h2 className="mt-7 font-heading text-2xl font-semibold">Mia&apos;s journey</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Complete the calm check-in, see the selected concepts, and work through one focused activity.
              </p>
            </div>
            <Button nativeButton={false} render={<a href={pupil} />} variant="outline" className="mt-7 lg:mt-0">
              Enter as Mia <ArrowRight />
            </Button>
          </article>
        </div>
      </section>
    </main>
  );
}
