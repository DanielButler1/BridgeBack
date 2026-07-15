import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, Check, FileStack, GitBranch, Network, ScanSearch, UserCheck } from "lucide-react";
import Link from "next/link";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works | BridgeBack",
  description: "The complete BridgeBack workflow, from lesson upload and teacher approval to deterministic diagnostics and pupil catch-up modules.",
};

const workflow = [
  { number: "01", title: "Set the destination", detail: "The teacher selects the upcoming lesson and adds the slides, worksheets, and missed resources that provide curriculum context." },
  { number: "02", title: "Draft the dependency graph", detail: "Sol extracts the target concept, prerequisite relationships, and exact source references into a structured draft." },
  { number: "03", title: "Review before use", detail: "The teacher checks the graph, adds or removes prerequisites, and approves the educational route." },
  { number: "04", title: "Create a closed diagnostic", detail: "Terra writes short multiple-choice questions against the approved prerequisites. The teacher-controlled answer key is stored with them." },
  { number: "05", title: "Score in application code", detail: "TypeScript compares each selected option with the approved answer index. A model does not grade the pupil." },
  { number: "06", title: "Select no more than three steps", detail: "Deterministic graph traversal prioritises unresolved concepts closest to the target lesson." },
  { number: "07", title: "Teach and check", detail: "Luna creates short source-grounded explanations, examples, and closed checks for the selected concepts." },
] as const;

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
        <div className="max-w-3xl">
          <ScanSearch className="size-7 text-[var(--landing-accent)]" />
          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">A seven-stage path with three clear decision owners.</h2>
          <p className="mt-6 leading-7 text-[var(--landing-muted)]">AI transforms teaching material. Application code handles reproducible decisions. Teachers approve what becomes part of the pupil experience.</p>
        </div>
        <div className="mt-14 grid gap-x-16 lg:grid-cols-2">
          {workflow.map((step) => <WorkflowStep key={step.number} {...step} />)}
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-deep)] text-[var(--landing-dark-ink)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <GitBranch className="size-7 text-[var(--landing-accent-light)]" />
              <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">What “shortest path” means for binary search.</h2>
              <p className="mt-6 leading-7 text-[var(--landing-dark-muted)]">The route is not the shortest set of files. It is the smallest approved set of concepts that reconnects Mia to the target lesson.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Concept role="Already understood" title="Variables and comparison" detail="Diagnostic answers show Mia can store values and compare two numbers." />
              <Concept role="Gap to address" title="Arrays and indexing" detail="Mia needs to locate an item by its zero-based position." />
              <Concept role="Gap to address" title="Trace tables" detail="Mia needs to follow how low, high, and midpoint change." />
              <Concept role="Upcoming target" title="Binary search" detail="The class can now explore halving a sorted search space." />
            </div>
          </div>
          <div className="mt-12 grid border-t border-[color-mix(in_oklch,var(--landing-dark-muted)_26%,transparent)] pt-8 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <MiniStep icon={FileStack} value="12" label="resources considered" />
            <FlowArrow />
            <MiniStep icon={Network} value="2" label="unresolved prerequisites" />
            <FlowArrow />
            <MiniStep icon={BookOpenCheck} value="3" label="visible next steps" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <UserCheck className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">Responsibility stays visible.</h2>
            <p className="mt-6 leading-7 text-[var(--landing-muted)]">Structured output controls the format of generated material. It does not establish educational correctness, so approval and deterministic checks remain separate.</p>
          </div>
          <div className="border-t border-[var(--landing-line)]">
            <OwnerRow owner="AI models" responsibility="Draft dependency graphs, closed diagnostic questions, and short learning explanations from approved source material." />
            <OwnerRow owner="Application code" responsibility="Validate schemas, reject cycles, grade closed responses, traverse the graph, enforce limits, and record progress." />
            <OwnerRow owner="Teacher" responsibility="Choose the upcoming lesson, correct the graph, approve the diagnostic, and decide how BridgeBack fits classroom support." />
            <OwnerRow owner="Pupil" responsibility="Complete a calm check-in, stop when needed, work through the next step, and ask a teacher for help." />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">What the teacher sees</h2>
            <div className="mt-8 space-y-5">
              <CheckLine>Source references beside each concept</CheckLine>
              <CheckLine>Draft, approved, and generated workflow states</CheckLine>
              <CheckLine>Editable prerequisites before assignment</CheckLine>
              <CheckLine>Concept-level progress without a pupil ranking</CheckLine>
            </div>
          </div>
          <div className="border-t border-[var(--landing-line)] p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">What the pupil sees</h2>
            <div className="mt-8 space-y-5">
              <CheckLine>A clear explanation of why the check-in exists</CheckLine>
              <CheckLine>Short closed questions with no marks or grade</CheckLine>
              <CheckLine>No more than three current concepts</CheckLine>
              <CheckLine>One explanation, example, and check at a time</CheckLine>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10 lg:py-28">
        <div className="rounded-[1rem] bg-[var(--landing-accent)] p-8 text-[var(--landing-accent-ink)] sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div><h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em]">See every stage with Mia and Ms Morgan.</h2><p className="mt-5 max-w-2xl leading-7 text-[var(--landing-accent-muted)]">The demo is synthetic, resettable, and connected to the same workflow used by the product.</p></div>
          <Button nativeButton={false} render={<Link href="/demo" />} className="mt-8 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)] lg:mt-0">Walk through the demo <ArrowRight /></Button>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function WorkflowStep({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <article className="grid grid-cols-[3rem_1fr] gap-5 border-t border-[var(--landing-line)] py-7"><span className="font-mono text-xs text-[var(--landing-accent)]">{number}</span><div><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{detail}</p></div></article>;
}

function Concept({ role, title, detail }: { role: string; title: string; detail: string }) {
  return <article className="rounded-[1rem] border border-[color-mix(in_oklch,var(--landing-dark-muted)_25%,transparent)] p-6"><p className="text-xs font-semibold text-[var(--landing-accent-light)]">{role}</p><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-dark-muted)]">{detail}</p></article>;
}

function MiniStep({ icon: Icon, value, label }: { icon: typeof FileStack; value: string; label: string }) {
  return <div className="flex items-center gap-4 py-4 md:flex-col md:items-start"><Icon className="size-5 text-[var(--landing-accent-light)]" /><strong className="text-4xl tracking-[-0.05em]">{value}</strong><span className="text-sm text-[var(--landing-dark-muted)]">{label}</span></div>;
}

function FlowArrow() {
  return <div className="hidden items-center px-8 text-[var(--landing-accent-light)] md:flex"><ArrowRight className="size-5" /></div>;
}

function OwnerRow({ owner, responsibility }: { owner: string; responsibility: string }) {
  return <div className="grid gap-3 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[9rem_1fr]"><h3 className="font-semibold text-[var(--landing-accent)]">{owner}</h3><p className="text-sm leading-6 text-[var(--landing-muted)]">{responsibility}</p></div>;
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return <p className="flex items-start gap-3 text-sm leading-6 text-[var(--landing-muted)]"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.45rem] bg-[var(--landing-soft)] text-[var(--landing-accent)]"><Check className="size-3.5" /></span>{children}</p>;
}
