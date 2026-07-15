import type { Metadata } from "next";
import { ArrowRight, Check, School, Sparkles } from "lucide-react";
import Link from "next/link";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For schools | BridgeBack",
  description: "Explore BridgeBack as a safe synthetic demonstration or use the secure school workspace with your own teaching materials.",
};

export default function ForSchoolsPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/for-schools" />
      <MarketingPageIntro
        title="A convincing demo. A real route to deployment."
        description="Show the complete journey with synthetic data, then use the same product engine inside a private school workspace."
        aside={
          <div>
            <School className="size-8 text-[var(--landing-accent)]" />
            <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Prepared for a five-minute walkthrough. Structured for everyday teacher use.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] lg:grid-cols-[0.85fr_1.15fr]">
          <SchoolRoute title="Guided demo" icon={Sparkles} description="A fictional class, pupil, lesson, and catch-up route that a school can explore without entering personal data." items={["One-click teacher and pupil entry", "Prepared state for presentation reliability", "Live actions use the product engine"]} href="/demo" action="Explore the demo" />
          <SchoolRoute dark title="School workspace" icon={School} description="A private organisation workspace for a school's own lessons, classes, teachers, and approved pupil pathways." items={["Clerk authentication and organisation membership", "Convex-backed classes, lessons, and audit events", "Teacher review before pupil-facing content"]} href="/app" action="Open school workspace" />
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">Each model has a defined job.</h2><p className="mt-6 max-w-md leading-7 text-[var(--landing-muted)]">Routing is based on task complexity, quality requirements, and volume. It is not exposed as extra work for the teacher.</p></div>
          <div className="border-t border-[var(--landing-line)]">
            <ModelJob model="Sol" job="Maps complex prerequisite relationships from lesson materials." />
            <ModelJob model="Terra" job="Builds balanced diagnostics and catch-up plans." />
            <ModelJob model="Luna" job="Creates efficient pupil-sized explanations and checks." />
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function SchoolRoute({ title, icon: Icon, description, items, href, action, dark = false }: { title: string; icon: typeof School; description: string; items: string[]; href: string; action: string; dark?: boolean }) {
  return (
    <div className={dark ? "bg-[var(--landing-deep)] p-8 text-[var(--landing-dark-ink)] sm:p-12" : "p-8 sm:p-12"}>
      <Icon className={dark ? "size-7 text-[var(--landing-accent-light)]" : "size-7 text-[var(--landing-accent)]"} />
      <h2 className="mt-7 text-3xl font-semibold tracking-[-0.035em]">{title}</h2>
      <p className={dark ? "mt-5 max-w-xl leading-7 text-[var(--landing-dark-muted)]" : "mt-5 max-w-xl leading-7 text-[var(--landing-muted)]"}>{description}</p>
      <ul className="mt-8 space-y-4 text-sm">{items.map((item) => <li key={item} className="flex gap-3"><Check className={dark ? "mt-0.5 size-4 text-[var(--landing-accent-light)]" : "mt-0.5 size-4 text-[var(--landing-accent)]"} /><span>{item}</span></li>)}</ul>
      <Button nativeButton={false} render={<Link href={href} />} className={dark ? "mt-9 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)]" : "mt-9 h-11 rounded-[0.875rem] bg-[var(--landing-accent)] px-5 text-[var(--landing-accent-ink)] hover:bg-[var(--landing-accent-strong)]"}>{action} <ArrowRight /></Button>
    </div>
  );
}

function ModelJob({ model, job }: { model: string; job: string }) {
  return <div className="grid gap-3 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[7rem_1fr] sm:items-baseline"><strong className="text-2xl text-[var(--landing-accent)]">{model}</strong><p className="leading-7 text-[var(--landing-muted)]">{job}</p></div>;
}
