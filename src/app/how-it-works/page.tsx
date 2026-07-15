import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, FileStack, Network } from "lucide-react";
import Link from "next/link";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works | BridgeBack",
  description: "See how BridgeBack turns an upcoming lesson into a short diagnostic and a manageable learning route.",
};

export default function HowItWorksPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/how-it-works" />
      <MarketingPageIntro
        title="Start with tomorrow, not everything that was missed."
        description="BridgeBack works backwards from the upcoming lesson to find the smallest useful route back into classroom learning."
        aside={
          <div>
            <p className="text-sm font-semibold text-[var(--landing-accent)]">Mia&apos;s synthetic example</p>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.035em]">Twelve resources become three manageable steps.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <ProcessStep icon={FileStack} number="01" title="Read the destination" detail="The teacher uploads the upcoming lesson and relevant missed resources." />
          <ProcessArrow />
          <ProcessStep icon={Network} number="02" title="Find the dependencies" detail="AI proposes the concepts needed to take part, and the teacher reviews them." />
          <ProcessArrow />
          <ProcessStep icon={BookOpenCheck} number="03" title="Build the shortest route" detail="A diagnostic finds what the pupil knows, then unlocks no more than three concepts." />
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">The teacher remains the decision-maker.</h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--landing-muted)]">AI proposes a dependency map, diagnostic, and learning modules. The teacher can correct prerequisites and approve the route before it reaches a pupil.</p>
          </div>
          <div className="border-t border-[var(--landing-line)] bg-[var(--landing-deep)] p-8 text-[var(--landing-dark-ink)] sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">The pupil sees one calm next step.</h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--landing-dark-muted)]">The diagnostic does not produce a rank. It identifies specific support needs and opens a source-grounded explanation, example, and check for understanding.</p>
            <Button nativeButton={false} render={<Link href="/demo" />} className="mt-8 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)]">
              Walk through the demo <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function ProcessStep({ icon: Icon, number, title, detail }: { icon: typeof FileStack; number: string; title: string; detail: string }) {
  return (
    <div className="flex min-h-72 flex-col justify-between p-7 sm:p-8">
      <div className="flex items-center justify-between text-[var(--landing-accent)]"><Icon className="size-5" /><span className="font-mono text-xs">{number}</span></div>
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">{detail}</p></div>
    </div>
  );
}

function ProcessArrow() {
  return <div className="flex items-center justify-center border-y border-[var(--landing-line)] p-4 text-[var(--landing-accent)] md:border-x md:border-y-0"><ArrowRight className="size-5 rotate-90 md:rotate-0" /></div>;
}
