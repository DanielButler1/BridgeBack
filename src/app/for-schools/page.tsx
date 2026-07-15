import type { Metadata } from "next";
import { ArrowRight, Check, Database, FileCheck2, LockKeyhole, School, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For schools | BridgeBack",
  description: "Evaluate the BridgeBack demo, operating model, technical architecture, model routing, pilot stages, and production-readiness gates.",
};

export default function ForSchoolsPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/for-schools" />
      <MarketingPageIntro
        title="A convincing demo. A responsible route to deployment."
        description="Show the complete journey with synthetic data, then evaluate the controls required for use with a school’s own materials."
        aside={
          <div>
            <p className="text-sm font-semibold text-[var(--landing-accent)]">Current release boundary</p>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.035em]">Functional product architecture. Synthetic pupil data only.</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--landing-muted)]">A real-data pilot remains gated by safeguarding, privacy, security, and education approval.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] lg:grid-cols-[0.85fr_1.15fr]">
          <SchoolRoute title="Guided demonstration" icon={Sparkles} description="A fictional class, pupil, lesson, and catch-up route that a school can explore without entering personal data." items={["One-click teacher and pupil entry", "Prepared state for presentation reliability", "Live model actions use the product workflow", "Safe reset of synthetic progress"]} href="/demo" action="Explore the demo" />
          <SchoolRoute dark title="School workspace" icon={School} description="An authenticated organisation workspace for classes, lesson resources, teacher approvals, and auditable learning pathways." items={["Clerk identity and server-side Convex authorisation", "Private lesson storage and organisation membership", "Teacher review before pupil-facing generation", "Audit events for administrative actions"]} href="/app" action="Open school workspace" />
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="max-w-3xl"><h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Designed to reduce teacher preparation, not remove teacher judgment.</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">The school provides curriculum intent and oversight. BridgeBack performs the repetitive transformation work and keeps each proposal inspectable.</p></div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border-t border-[var(--landing-line)] pt-7">
              <FileCheck2 className="size-6 text-[var(--landing-accent)]" />
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">What the school prepares</h3>
              <div className="mt-6 space-y-4 text-sm leading-6 text-[var(--landing-muted)]"><p>Upcoming lesson materials and learning objectives</p><p>Relevant scheme of work, slides, and worksheets</p><p>The class, pupil invitation, and teaching context</p><p>A teacher responsible for reviewing the route</p></div>
            </div>
            <div className="grid border-t border-[var(--landing-line)] sm:grid-cols-2">
              <Responsibility title="BridgeBack prepares">A source-referenced dependency graph, closed diagnostic, deterministic concept pathway, and short learning modules.</Responsibility>
              <Responsibility title="The teacher approves">The prerequisites, correct answers, pupil assignment, and how the pathway is used alongside classroom support.</Responsibility>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <Users className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">Who needs to be involved</h2>
            <p className="mt-6 leading-7 text-[var(--landing-muted)]">A credible pilot is not only an IT installation. Curriculum, safeguarding, privacy, and pupil experience decisions need named owners.</p>
          </div>
          <div className="border-t border-[var(--landing-line)]">
            <Stakeholder role="Curriculum or subject lead" decision="Confirm source quality, prerequisite accuracy, and how readiness is evaluated." />
            <Stakeholder role="Classroom teacher" decision="Review the graph, approve the route, and provide human support when the pupil needs it." />
            <Stakeholder role="Safeguarding and DPO leads" decision="Approve the purpose, lawful basis, DPIA, data flows, retention, notices, and escalation routes." />
            <Stakeholder role="IT and security owner" decision="Review identity, tenant isolation, provider configuration, file handling, logging, deletion, and incident response." />
            <Stakeholder role="Pupils and families" decision="Help test clarity, accessibility, agency, and whether the experience feels supportive rather than punitive." />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-deep)] text-[var(--landing-dark-ink)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div><Database className="size-7 text-[var(--landing-accent-light)]" /><h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">A simple stack with explicit boundaries.</h2><p className="mt-6 leading-7 text-[var(--landing-dark-muted)]">Each service has a defined responsibility. Secrets and access checks stay server-side.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <StackItem name="Next.js" detail="Server-rendered product and marketing routes, API boundaries, and secure response headers." />
              <StackItem name="Clerk" detail="Identity and sessions for teachers, pupils, and organisation access." />
              <StackItem name="Convex" detail="Organisation-scoped records, private resources, realtime state, mutations, and audit events." />
              <StackItem name="OpenAI Responses API" detail="Request-scoped lesson analysis and structured educational drafts with store set to false." />
              <StackItem name="Zod Structured Outputs" detail="Allowed fields, references, questions, and learning-module shapes validated before storage." />
              <StackItem name="React Flow" detail="An inspectable prerequisite map that a teacher can review and correct." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">Model routing follows the shape of the work.</h2><p className="mt-6 max-w-md leading-7 text-[var(--landing-muted)]">OpenAI positions Sol for flagship capability, Terra for a balance of capability and cost, and Luna for efficient high-volume work. BridgeBack maps those strengths to distinct stages.</p><a href="https://developers.openai.com/api/docs/guides/latest-model" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4">Read the model guidance <ArrowRight className="size-4" /></a></div>
          <div className="border-t border-[var(--landing-line)]">
            <ModelJob model="Sol" stage="Dependency analysis" job="Interpret several lesson resources, identify the target, map prerequisite relationships, and preserve source references." boundary="Produces a draft. It cannot approve its own graph." />
            <ModelJob model="Terra" stage="Diagnostic drafting" job="Create concise closed questions from the teacher-approved graph at a practical quality and cost balance." boundary="Does not grade answers or choose the pupil pathway." />
            <ModelJob model="Luna" stage="Pupil support" job="Generate efficient, short explanations and checks for one to three concepts at higher potential volume." boundary="Receives minimal approved concept context, not the reason for absence." />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <LockKeyhole className="size-7 text-[var(--landing-accent)]" />
          <h2 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">A staged path to a real-school pilot</h2>
          <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
            <ReadinessStage number="01" title="Product demonstration" status="Available now" detail="Use the synthetic class, lesson, identities, responses, and resettable pathway." />
            <ReadinessStage number="02" title="School materials trial" status="Synthetic or de-identified only" detail="Test teacher workflow and curriculum quality without uploading identifiable pupil information." />
            <ReadinessStage number="03" title="Controlled real-data pilot" status="Release gated" detail="Requires an approved DPIA, contracts, provider controls, deletion and export, security testing, and named safeguarding ownership." />
            <ReadinessStage number="04" title="Wider deployment" status="Evidence gated" detail="Requires curriculum evaluations, accessibility and bias testing, operational monitoring, incident practice, and demonstrated pupil benefit." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">What a pilot should measure</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">The first evaluation should test whether the workflow is useful and safe before making claims about attendance or attainment.</p></div>
          <div className="grid gap-8 sm:grid-cols-2">
            <PilotMeasure title="Teacher effort">Time to upload, review, correct, and assign a route.</PilotMeasure>
            <PilotMeasure title="Graph quality">Share of prerequisites accepted, edited, added, or removed by teachers.</PilotMeasure>
            <PilotMeasure title="Pupil experience">Clarity, anxiety, agency, accessibility, stopping, and requests for teacher help.</PilotMeasure>
            <PilotMeasure title="Lesson re-entry">Whether teachers judge that the pupil can participate in the target lesson.</PilotMeasure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-28">
        <div className="rounded-[1rem] bg-[var(--landing-accent)] p-8 text-[var(--landing-accent-ink)] sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12"><div><h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em]">Start with the synthetic walkthrough.</h2><p className="mt-5 max-w-2xl leading-7 text-[var(--landing-accent-muted)]">Evaluate the teacher and pupil journeys before discussing data integration or a pilot.</p></div><Button nativeButton={false} render={<Link href="/demo" />} className="mt-8 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)] lg:mt-0">Explore the demo <ArrowRight /></Button></div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function SchoolRoute({ title, icon: Icon, description, items, href, action, dark = false }: { title: string; icon: typeof School; description: string; items: string[]; href: string; action: string; dark?: boolean }) {
  return <div className={dark ? "bg-[var(--landing-deep)] p-8 text-[var(--landing-dark-ink)] sm:p-12" : "p-8 sm:p-12"}><Icon className={dark ? "size-7 text-[var(--landing-accent-light)]" : "size-7 text-[var(--landing-accent)]"} /><h2 className="mt-7 text-3xl font-semibold tracking-[-0.035em]">{title}</h2><p className={dark ? "mt-5 max-w-xl leading-7 text-[var(--landing-dark-muted)]" : "mt-5 max-w-xl leading-7 text-[var(--landing-muted)]"}>{description}</p><div className="mt-8 space-y-4 text-sm">{items.map((item) => <p key={item} className="flex gap-3"><Check className={dark ? "mt-0.5 size-4 text-[var(--landing-accent-light)]" : "mt-0.5 size-4 text-[var(--landing-accent)]"} /><span>{item}</span></p>)}</div><Button nativeButton={false} render={<Link href={href} />} className={dark ? "mt-9 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)]" : "mt-9 h-11 rounded-[0.875rem] bg-[var(--landing-accent)] px-5 text-[var(--landing-accent-ink)] hover:bg-[var(--landing-accent-strong)]"}>{action} <ArrowRight /></Button></div>;
}

function Responsibility({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="border-b border-[var(--landing-line)] py-8 sm:border-r sm:px-8 sm:last:border-r-0"><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}

function Stakeholder({ role, decision }: { role: string; decision: string }) {
  return <div className="grid gap-3 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[12rem_1fr]"><h3 className="font-semibold text-[var(--landing-accent)]">{role}</h3><p className="text-sm leading-6 text-[var(--landing-muted)]">{decision}</p></div>;
}

function StackItem({ name, detail }: { name: string; detail: string }) {
  return <article className="rounded-[1rem] border border-[color-mix(in_oklch,var(--landing-dark-muted)_25%,transparent)] p-6"><h3 className="text-xl font-semibold">{name}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-dark-muted)]">{detail}</p></article>;
}

function ModelJob({ model, stage, job, boundary }: { model: string; stage: string; job: string; boundary: string }) {
  return <article className="grid gap-4 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[7rem_1fr]"><div><strong className="text-2xl text-[var(--landing-accent)]">{model}</strong><p className="mt-1 text-xs text-[var(--landing-muted)]">{stage}</p></div><div><p className="leading-7 text-[var(--landing-muted)]">{job}</p><p className="mt-3 text-sm font-medium text-[var(--landing-ink)]">Boundary: {boundary}</p></div></article>;
}

function ReadinessStage({ number, title, status, detail }: { number: string; title: string; status: string; detail: string }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><div className="flex items-center justify-between gap-4"><span className="font-mono text-xs text-[var(--landing-accent)]">{number}</span><span className="text-xs font-semibold text-[var(--landing-accent)]">{status}</span></div><h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{detail}</p></article>;
}

function PilotMeasure({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}
