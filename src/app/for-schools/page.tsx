import type { Metadata } from "next";
import { ArrowRight, Check, Database, FileCheck2, LockKeyhole, School, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For schools | BridgeBack",
  description: "See how BridgeBack fits a school, who stays involved, how the technology works, and how to plan a responsible rollout.",
};

export default function ForSchoolsPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/for-schools" />
      <MarketingPageIntro
        title="See it safely. Plan the next step."
        description="Explore the complete product journey, then see how BridgeBack fits lesson planning, teacher review, and pupil support in school."
        aside={
          <div>
            <p className="text-sm font-semibold text-[var(--landing-accent)]">Built for a school rollout</p>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.035em]">One workspace connects the next lesson to the support a pupil needs.</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--landing-muted)]">Teachers keep control of the route while school leaders set the privacy, safeguarding, and security requirements.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] lg:grid-cols-[0.85fr_1.15fr]">
          <SchoolRoute title="Guided demonstration" icon={Sparkles} description="A complete class, lesson, diagnostic, and catch-up route that a school can explore from both sides of the experience." items={["One-click teacher and pupil entry", "Prepared state for presentation reliability", "Live model actions use the product workflow", "Reset the journey and try it again"]} href="/demo" action="Explore the demo" />
          <SchoolRoute dark title="School workspace" icon={School} description="A secure place for classes, lesson resources, teacher checks, and pupil learning routes." items={["Clerk sign-in with access checked again in Convex", "Private lesson storage for each school", "Teacher review before pupils see AI-written content", "A record of important admin actions"]} href="/app" action="Open school workspace" />
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
              <Responsibility title="BridgeBack prepares">A concept map linked to the lesson sources, a short check-in, a catch-up route, and small learning activities.</Responsibility>
              <Responsibility title="The teacher approves">The earlier concepts, correct answers, pupil assignment, and how the route is used alongside classroom support.</Responsibility>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <Users className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">Who needs to be involved</h2>
            <p className="mt-6 leading-7 text-[var(--landing-muted)]">A good pilot needs more than an IT setup. Schools need people responsible for teaching quality, safeguarding, privacy, and the pupil experience.</p>
          </div>
          <div className="border-t border-[var(--landing-line)]">
            <Stakeholder role="Curriculum or subject lead" decision="Check the lesson sources, make sure the concept map is accurate, and agree how readiness will be judged." />
            <Stakeholder role="Classroom teacher" decision="Review the graph, approve the route, and provide human support when the pupil needs it." />
            <Stakeholder role="Safeguarding and data protection leads" decision="Check why data is needed, complete the DPIA, agree how long data is kept, and set clear routes for help or concerns." />
            <Stakeholder role="IT and security owner" decision="Check sign-in, separation between schools, file handling, logs, deletion, service settings, and what happens if something goes wrong." />
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
              <StackItem name="OpenAI Responses API" detail="Reads lesson material when an analysis is requested and returns the draft in a set format. Store is set to false." />
              <StackItem name="Zod Structured Outputs" detail="Allowed fields, references, questions, and learning-module shapes validated before storage." />
              <StackItem name="React Flow" detail="Shows the concept map in a form that teachers can review and correct." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">Each AI model has one clear job.</h2><p className="mt-6 max-w-md leading-7 text-[var(--landing-muted)]">Sol handles the hardest lesson analysis. Terra creates the check-in. Luna writes short pupil activities quickly and efficiently.</p><a href="https://developers.openai.com/api/docs/guides/latest-model" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4">Read the model guidance <ArrowRight className="size-4" /></a></div>
          <div className="border-t border-[var(--landing-line)]">
            <ModelJob model="Sol" stage="Lesson mapping" job="Read several lesson resources, find the main lesson idea, map the earlier ideas, and link each one to its source." limit="approve its own concept map" />
            <ModelJob model="Terra" stage="Check-in questions" job="Create short multiple-choice questions from the teacher-approved concept map." limit="mark answers or choose the pupil&apos;s route" />
            <ModelJob model="Luna" stage="Pupil support" job="Write short explanations and checks for one to three concepts." limit="see the pupil&apos;s name or reason for absence" />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <LockKeyhole className="size-7 text-[var(--landing-accent)]" />
          <h2 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">A clear path into school</h2>
          <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
            <ReadinessStage number="01" title="Guided product tour" status="Explore" detail="Review the complete teacher and pupil journey, including the concept map, diagnostic, pathway, and progress view." />
            <ReadinessStage number="02" title="Curriculum setup" status="Prepare" detail="Add the school&apos;s scheme of work, lesson resources, classes, and the teachers responsible for checking each route." />
            <ReadinessStage number="03" title="Governed rollout" status="Approve" detail="Complete the DPIA, contracts, access checks, retention settings, security review, and named safeguarding ownership." />
            <ReadinessStage number="04" title="Ongoing evaluation" status="Improve" detail="Review teaching quality, accessibility, fairness, incidents, teacher effort, and whether pupils can rejoin the target lesson." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">What a pilot should measure</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">The first evaluation should test whether the workflow is useful and safe before making claims about attendance or attainment.</p></div>
          <div className="grid gap-8 sm:grid-cols-2">
            <PilotMeasure title="Teacher effort">Time to upload, review, correct, and assign a route.</PilotMeasure>
            <PilotMeasure title="Concept-map quality">How often teachers accept, edit, add, or remove earlier concepts.</PilotMeasure>
            <PilotMeasure title="Pupil experience">Clarity, anxiety, agency, accessibility, stopping, and requests for teacher help.</PilotMeasure>
            <PilotMeasure title="Lesson re-entry">Whether teachers judge that the pupil can participate in the target lesson.</PilotMeasure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-28">
        <div className="rounded-[1rem] bg-[var(--landing-accent)] p-8 text-[var(--landing-accent-ink)] sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12"><div><h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em]">Start with the guided walkthrough.</h2><p className="mt-5 max-w-2xl leading-7 text-[var(--landing-accent-muted)]">See the teacher and pupil journeys together, then plan how BridgeBack could fit your school.</p></div><Button nativeButton={false} render={<Link href="/demo" />} className="mt-8 h-11 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] hover:bg-[var(--landing-cta-hover)] lg:mt-0">Explore the demo <ArrowRight /></Button></div>
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

function ModelJob({ model, stage, job, limit }: { model: string; stage: string; job: string; limit: string }) {
  return <article className="grid gap-4 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[7rem_1fr]"><div><strong className="text-2xl text-[var(--landing-accent)]">{model}</strong><p className="mt-1 text-xs text-[var(--landing-muted)]">{stage}</p></div><div><p className="leading-7 text-[var(--landing-muted)]">{job}</p><p className="mt-3 text-sm font-medium text-[var(--landing-ink)]">It cannot {limit}.</p></div></article>;
}

function ReadinessStage({ number, title, status, detail }: { number: string; title: string; status: string; detail: string }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><div className="flex items-center justify-between gap-4"><span className="font-mono text-xs text-[var(--landing-accent)]">{number}</span><span className="text-xs font-semibold text-[var(--landing-accent)]">{status}</span></div><h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{detail}</p></article>;
}

function PilotMeasure({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}
