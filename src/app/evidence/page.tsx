import type { Metadata } from "next";
import { ArrowRight, Quote } from "lucide-react";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";

const attendanceSource = "https://explore-education-statistics.service.gov.uk/find-statistics/pupil-attendance-in-schools/2025-week-29";
const nferSource = "https://www.nfer.ac.uk/publications/voices-from-the-classroom-understanding-how-secondary-schools-support-pupils-returning-from-absence/";

export const metadata: Metadata = {
  title: "The evidence | BridgeBack",
  description: "The attendance and pupil-return evidence behind BridgeBack, with direct links to Department for Education and NFER research.",
};

export default function EvidencePage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/evidence" />
      <MarketingPageIntro
        title="Absence creates a second problem when pupils return."
        description="Attendance matters. So does giving a returning pupil a practical route back into the lesson already in progress."
        aside={
          <div>
            <p className="text-sm font-semibold text-[var(--landing-accent)]">State-funded schools in England, 2024/25</p>
            <strong className="mt-5 block text-7xl font-semibold tracking-[-0.07em]">18.7%</strong>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--landing-muted)]">of pupils were persistently absent, meaning they missed at least 10% of possible sessions.</p>
          </div>
        }
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">The scale is not evenly distributed.</h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--landing-muted)]">Secondary and special schools face still higher rates. These are England figures, not UK-wide statistics.</p>
            <a href={attendanceSource} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4">
              Open the Department for Education data <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="grid border-t border-[var(--landing-line)] sm:grid-cols-2">
            <EvidenceStat label="Secondary schools" value="24.3%" detail="almost one pupil in four" />
            <EvidenceStat label="Special schools" value="35.8%" detail="more than one pupil in three" />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.9fr_1.1fr]">
          <blockquote className="bg-[var(--landing-deep)] p-8 text-[var(--landing-dark-ink)] sm:p-12 lg:p-16">
            <Quote className="size-8 text-[var(--landing-accent-light)]" />
            <p className="mt-8 text-3xl font-medium leading-snug tracking-[-0.03em]">“Catching up on missed work was one of the biggest concerns for pupils.”</p>
            <footer className="mt-7 text-sm text-[var(--landing-dark-muted)]">NFER, Voices from the Classroom</footer>
          </blockquote>
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em]">Availability is not the same as support.</h2>
            <p className="mt-6 max-w-2xl leading-7 text-[var(--landing-muted)]">NFER spoke with 85 pupils across nine secondary schools. Pupils valued teachers explaining what they had missed. Some pupils without that support felt anxious, confused in class, or left to catch up alone.</p>
            <a href={nferSource} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4">
              Read the NFER research <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function EvidenceStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border-b border-[var(--landing-line)] py-9 sm:border-r sm:px-9 sm:last:border-r-0">
      <p className="text-sm text-[var(--landing-muted)]">{label}</p>
      <strong className="mt-8 block text-6xl font-semibold tracking-[-0.06em]">{value}</strong>
      <p className="mt-3 text-sm text-[var(--landing-muted)]">{detail}</p>
    </div>
  );
}
