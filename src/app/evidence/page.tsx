import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, CircleAlert, Quote, Users } from "lucide-react";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";

const attendanceSource = "https://explore-education-statistics.service.gov.uk/find-statistics/pupil-attendance-in-schools/2025-week-29";
const nferSource = "https://www.nfer.ac.uk/publications/voices-from-the-classroom-understanding-how-secondary-schools-support-pupils-returning-from-absence/";

export const metadata: Metadata = {
  title: "The evidence | BridgeBack",
  description: "A source-led explanation of persistent absence in England, pupil experiences of returning, and the evidence behind BridgeBack.",
};

export default function EvidencePage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/evidence" />
      <MarketingPageIntro
        title="Absence creates a second problem when pupils return."
        description="Attendance matters. So does giving a returning pupil a practical route into the lesson already in progress."
        aside={
          <div>
            <p className="text-sm font-semibold text-[var(--landing-accent)]">State-funded schools in England, 2024/25</p>
            <strong className="mt-5 block text-7xl font-semibold tracking-[-0.07em]">18.7%</strong>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--landing-muted)]">of pupils were persistently absent, meaning they missed at least 10% of their possible sessions.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <CircleAlert className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Read the percentage carefully.</h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--landing-muted)]">Persistent absence is a pupil-level threshold. A pupil enters the category after missing 10% or more of the sessions available to them.</p>
          </div>
          <div className="grid border-t border-[var(--landing-line)] sm:grid-cols-2">
            <Definition title="A session is half a school day">Schools normally record morning and afternoon attendance. Missing 10% of sessions is broadly equivalent to missing one day in ten.</Definition>
            <Definition title="The rate counts pupils">A 35.8% persistent-absence rate means 35.8% of pupils crossed the 10% threshold. It does not mean every pupil missed 35.8% of school.</Definition>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">The national headline hides unequal exposure.</h2>
            <p className="mt-6 leading-7 text-[var(--landing-muted)]">The full-year release reports lower rates than 2023/24, but persistent absence remained concentrated in secondary schools and among pupils facing disadvantage or additional needs.</p>
          </div>
          <div className="mt-12 grid border-t border-[var(--landing-line)] sm:grid-cols-2 lg:grid-cols-4">
            <EvidenceStat label="All pupils" value="18.7%" detail="2.0 percentage points lower than 2023/24" />
            <EvidenceStat label="Secondary schools" value="24.3%" detail="almost one pupil in four" />
            <EvidenceStat label="Special schools" value="35.8%" detail="more than one pupil in three" />
            <EvidenceStat label="Pupils with an EHC plan" value="36.9%" detail="compared with 16.5% with no identified SEN" />
          </div>
          <div className="mt-8 grid gap-6 border-l-2 border-[var(--landing-accent)] pl-6 sm:grid-cols-2">
            <p className="text-sm leading-6 text-[var(--landing-muted)]"><strong className="text-[var(--landing-ink)]">Free school meals:</strong> 33.0% of eligible pupils were persistently absent, compared with 13.4% of pupils who were not eligible.</p>
            <p className="text-sm leading-6 text-[var(--landing-muted)]"><strong className="text-[var(--landing-ink)]">Scope:</strong> figures cover compulsory-school-age pupils in state-funded primary, secondary, and special schools in England.</p>
          </div>
          <a href={attendanceSource} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4 hover:decoration-[var(--landing-accent)]">
            Open the Department for Education release <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <blockquote className="rounded-[1rem] bg-[var(--landing-deep)] p-8 text-[var(--landing-dark-ink)] sm:p-11">
            <Quote className="size-8 text-[var(--landing-accent-light)]" />
            <p className="mt-8 text-3xl font-medium leading-snug tracking-[-0.03em]">“Catching up on missed work was one of the biggest concerns for pupils.”</p>
            <footer className="mt-7 text-sm text-[var(--landing-dark-muted)]">NFER, Voices from the Classroom</footer>
          </blockquote>
          <div>
            <Users className="size-7 text-[var(--landing-accent)]" />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">NFER studied the return, not only the absence.</h2>
            <p className="mt-6 max-w-2xl leading-7 text-[var(--landing-muted)]">Researchers visited nine state-funded secondary schools selected for good or improving attendance. They spoke with 85 pupils, 22 senior or attendance staff, and surveyed 606 secondary teachers and leaders.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <ResearchFact value="9" label="case-study schools" />
              <ResearchFact value="85" label="pupils interviewed" />
              <ResearchFact value="22" label="school staff interviewed" />
              <ResearchFact value="606" label="Teacher Voice respondents" />
            </div>
            <p className="mt-7 text-sm leading-6 text-[var(--landing-muted)]">This purposive qualitative sample explains experiences and practices. It should not be read as a nationally representative prevalence estimate.</p>
            <a href={nferSource} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4 hover:decoration-[var(--landing-accent)]">
              Read the NFER research <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <BookOpenCheck className="size-7 text-[var(--landing-accent)]" />
          <h2 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">The evidence shapes the product choices.</h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            <DesignResponse finding="Pupils worried about the volume of missed work." response="Start from the upcoming lesson and identify only the prerequisites needed to participate." />
            <DesignResponse finding="Personalised catch-up and staff check-ins were valued." response="Keep the teacher in the loop and produce an individual route from a short diagnostic." />
            <DesignResponse finding="Punitive approaches could make returning harder." response="Use calm language, no grades, no deficit ranking, and no attendance consequences." />
            <DesignResponse finding="Relationships and belonging mattered." response="Support the teacher-pupil relationship rather than presenting AI as a replacement teacher." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">What this evidence does not prove</h2>
          <p className="max-w-3xl leading-7 text-[var(--landing-muted)]">It does not prove that BridgeBack improves attendance, attainment, or wellbeing. Those outcomes require a controlled school evaluation. The evidence establishes a credible problem and guides a testable intervention.</p>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function Definition({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="border-b border-[var(--landing-line)] py-8 sm:border-r sm:px-8 sm:last:border-r-0"><h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">{children}</p></article>;
}

function EvidenceStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="border-b border-[var(--landing-line)] py-8 sm:border-r sm:px-7 sm:last:border-r-0"><p className="text-sm text-[var(--landing-muted)]">{label}</p><strong className="mt-7 block text-5xl font-semibold tracking-[-0.06em]">{value}</strong><p className="mt-3 text-xs leading-5 text-[var(--landing-muted)]">{detail}</p></div>;
}

function ResearchFact({ value, label }: { value: string; label: string }) {
  return <div className="border-t border-[var(--landing-line)] pt-4"><strong className="text-3xl font-semibold tracking-[-0.04em]">{value}</strong><p className="mt-1 text-sm text-[var(--landing-muted)]">{label}</p></div>;
}

function DesignResponse({ finding, response }: { finding: string; response: string }) {
  return <article className="border-t border-[var(--landing-line)] pt-6"><p className="font-semibold">{finding}</p><p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">{response}</p></article>;
}
