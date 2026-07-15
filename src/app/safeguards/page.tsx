import type { Metadata } from "next";
import { ArrowRight, Check, CircleAlert, EyeOff, FileLock2, Fingerprint, LockKeyhole, School, ShieldCheck } from "lucide-react";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";

const icoCode = "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/";
const icoDpia = "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/2-data-protection-impact-assessments/";
const openAiUnder18 = "https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance";
const openAiData = "https://developers.openai.com/api/docs/guides/your-data";

export const metadata: Metadata = {
  title: "Safeguards | BridgeBack",
  description: "See what pupil data BridgeBack uses, what it leaves out, how access is checked, and how schools prepare for responsible use.",
};

export default function SafeguardsPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/safeguards" />
      <MarketingPageIntro
        title="Support a pupil without building a profile of them."
        description="BridgeBack minimises data, separates responsibilities, and keeps educational decisions with the teacher."
        aside={<div><p className="text-sm font-semibold text-[var(--landing-accent)]">The guiding principle</p><p className="mt-5 text-3xl font-semibold tracking-[-0.035em]">Use what the lesson needs. Leave everything else out.</p><p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">A learning route should not require a detailed account of a child&apos;s life or reason for absence.</p></div>}
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
          <div>
            <ShieldCheck className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">Start with the child’s interests.</h2>
            <p className="mt-6 leading-7 text-[var(--landing-muted)]">Pupils may have limited choice over technology selected by a school. Privacy, agency, transparency, and human support must therefore be product requirements.</p>
          </div>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            <Principle icon={FileLock2} title="Collect less">BridgeBack needs to know which earlier ideas support the lesson. It does not need medical details, family circumstances, or the reason for absence.</Principle>
            <Principle icon={School} title="Keep teachers responsible">Generated structures begin as drafts. A teacher approves the graph before it can shape a diagnostic.</Principle>
            <Principle icon={EyeOff} title="Do not infer hidden traits">The system does not infer emotion, motivation, disability, behaviour, or safeguarding risk from responses.</Principle>
            <Principle icon={Fingerprint} title="Avoid identity in model work">Lesson analysis uses curriculum material without pupil names, attendance histories, Clerk details, or absence reasons.</Principle>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="max-w-3xl"><h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">What the AI sees at each stage</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">The AI gets only the information it needs for that job. It does not receive pupil identity, decide marks, or choose the learning route.</p></div>
          <div className="mt-12 overflow-hidden rounded-[1rem] border border-[var(--landing-line)]">
            <DataStage stage="Lesson analysis" needed="Upcoming lesson, objectives, source text or supported lesson files" excluded="Pupil name, absence record, reason for absence, diagnostic history" output="Draft concept graph with source references" />
            <DataStage stage="Diagnostic creation" needed="Teacher-approved concept graph and references" excluded="Pupil identity, selected answers, attendance information" output="Closed questions, options, and correct indexes" />
            <DataStage stage="Choosing the route" needed="Approved concept map plus the correct or incorrect results" excluded="An AI opinion about the pupil" output="Up to three concepts chosen by BridgeBack code" />
            <DataStage stage="Micro-lesson creation" needed="Approved concept path, source context, concept key, and correctness" excluded="Pupil name, selected option, reason for absence" output="Explanation, example, and closed check" />
          </div>
          <p className="mt-6 text-sm leading-6 text-[var(--landing-muted)]">BridgeBack does not collect free-form pupil chat, precise location, contacts, biometrics, photographs, audio, health information, family information, safeguarding records, or absence reasons.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div><LockKeyhole className="size-7 text-[var(--landing-accent)]" /><h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">How access is checked</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">Hiding a page is not enough. BridgeBack checks a person&apos;s identity and school access again whenever protected data is read or changed.</p></div>
          <div className="border-t border-[var(--landing-line)]">
            <Control title="Sign-in and school access">Clerk handles sign-in. Convex then checks that the person belongs to the right school before protected work can continue.</Control>
            <Control title="Separate school workspaces">Organisation-scoped access prevents a teacher or pupil from opening another school&apos;s classes, lessons, or pathways.</Control>
            <Control title="Secret keys stay private">Clerk, Convex, and OpenAI keys stay on the server or inside the service settings. They are never sent to the browser.</Control>
            <Control title="Private resources">Lesson files remain in managed private storage. Browser uploads are size and type checked and are never placed in the public directory.</Control>
            <Control title="Audit evidence">Administrative actions create append-only events without copying tokens, request bodies, or lesson content into the audit record.</Control>
            <Control title="Sending and storing data">Production deployments require HTTPS. Clerk, Convex, OpenAI, and the hosting platform provide managed encryption controls.</Control>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-deep)] text-[var(--landing-dark-ink)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div><CircleAlert className="size-7 text-[var(--landing-accent-light)]" /><h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">AI generation is separated from educational decisions.</h2><p className="mt-6 leading-7 text-[var(--landing-dark-muted)]">Models help transform source material into inspectable drafts. They do not authorise access, grade responses, choose sanctions, or approve their own work.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Decision title="Draft, then approve">The concept graph is saved as a draft and cannot drive a pupil diagnostic until a teacher approves it.</Decision>
              <Decision title="Validate every structure">Zod Structured Outputs constrain fields. Application checks reject invalid references, cycles, and unsupported shapes.</Decision>
              <Decision title="Mark with fixed rules">BridgeBack compares each response with the correct answer saved by the teacher. The AI does not decide whether a pupil is right.</Decision>
              <Decision title="Choose steps with fixed rules">BridgeBack follows the approved concept map and shows no more than three next ideas.</Decision>
              <Decision title="Preserve sources">Concepts and micro-lessons retain references so a teacher can compare generated content with lesson material.</Decision>
              <Decision title="Keep big school decisions out">BridgeBack cannot decide grades, sets, admissions, exclusions, sanctions, safeguarding referrals, or access to teaching.</Decision>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div><h2 className="text-4xl font-semibold tracking-[-0.04em]">OpenAI request controls and their limits</h2><p className="mt-6 leading-7 text-[var(--landing-muted)]">BridgeBack reduces persistence, but it does not describe store false as Zero Data Retention.</p></div>
          <div className="grid gap-8 sm:grid-cols-2">
            <RequestControl title="Store false">OpenAI requests use store false, so the response is not kept as saved application history in the Responses API.</RequestControl>
            <RequestControl title="Request-scoped files">Lesson files are sent as request inputs rather than created as persistent OpenAI File objects.</RequestControl>
            <RequestControl title="Hashed safety identifier">A SHA-256 hash of the authenticated subject is used instead of sending the raw Clerk identifier.</RequestControl>
            <RequestControl title="What store false does not mean">OpenAI&apos;s standard safety-monitoring retention may still apply. Some personal data about under-18s requires approved Zero Data Retention controls first.</RequestControl>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">What every school rollout must put in place</h2>
          <p className="mt-6 max-w-3xl leading-7 text-[var(--landing-muted)]">Responsible use starts with named owners, tested controls, clear information, and approval from the right people.</p>
          <div className="mt-12 grid gap-x-12 gap-y-6 md:grid-cols-2">
            <ReleaseGate>Complete a child-specific DPIA and establish the lawful basis for every purpose.</ReleaseGate>
            <ReleaseGate>Write down who is responsible for each use of data across the school, BridgeBack, and its service providers.</ReleaseGate>
            <ReleaseGate>Set clear time limits for keeping data, and build deletion, export, correction, and school offboarding tools.</ReleaseGate>
            <ReleaseGate>Configure appropriate OpenAI retention controls for the pupil ages and data involved.</ReleaseGate>
            <ReleaseGate>Run security reviews, penetration tests, software checks, and tests that prove one school cannot see another school&apos;s data.</ReleaseGate>
            <ReleaseGate>Publish age-appropriate privacy information and a clear human help and reporting route.</ReleaseGate>
            <ReleaseGate>Evaluate curriculum quality, accessibility, and unequal performance across pupil groups.</ReleaseGate>
            <ReleaseGate>Obtain named safeguarding, privacy, security, and education approval.</ReleaseGate>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">More information</h2><p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">This page explains our product choices. It is not legal advice, and a school rollout needs expert review.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SourceLink href={icoCode}>ICO Children&apos;s code standards</SourceLink>
            <SourceLink href={icoDpia}>ICO child-specific DPIA guidance</SourceLink>
            <SourceLink href={openAiUnder18}>OpenAI Under 18 API Guidance</SourceLink>
            <SourceLink href={openAiData}>OpenAI data controls</SourceLink>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function Principle({ icon: Icon, title, children }: { icon: typeof ShieldCheck; title: string; children: React.ReactNode }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><Icon className="size-5 text-[var(--landing-accent)]" /><h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}

function DataStage({ stage, needed, excluded, output }: { stage: string; needed: string; excluded: string; output: string }) {
  return <article className="grid gap-5 border-b border-[var(--landing-line)] bg-[var(--landing-bg)] p-6 last:border-b-0 md:grid-cols-[10rem_1fr_1fr_1fr]"><h3 className="font-semibold text-[var(--landing-accent)]">{stage}</h3><DataPoint label="Needed" text={needed} /><DataPoint label="Excluded" text={excluded} /><DataPoint label="Result" text={output} /></article>;
}

function DataPoint({ label, text }: { label: string; text: string }) {
  return <div><p className="text-xs font-semibold text-[var(--landing-ink)]">{label}</p><p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">{text}</p></div>;
}

function Control({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="grid gap-3 border-b border-[var(--landing-line)] py-7 sm:grid-cols-[11rem_1fr]"><h3 className="font-semibold text-[var(--landing-accent)]">{title}</h3><p className="text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}

function Decision({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-[1rem] border border-[color-mix(in_oklch,var(--landing-dark-muted)_25%,transparent)] p-6"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-dark-muted)]">{children}</p></article>;
}

function RequestControl({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}

function ReleaseGate({ children }: { children: React.ReactNode }) {
  return <p className="flex items-start gap-3 text-sm leading-6 text-[var(--landing-muted)]"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.45rem] bg-[var(--landing-bg)] text-[var(--landing-accent)]"><Check className="size-3.5" /></span>{children}</p>;
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-t border-[var(--landing-line)] py-4 text-sm font-semibold text-[var(--landing-accent)] hover:underline">{children}<ArrowRight className="size-4" /></a>;
}
