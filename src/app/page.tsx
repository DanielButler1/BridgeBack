import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileStack,
  GraduationCap,
  Network,
  School,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { hasClerk } from "@/lib/config";

const teacherHref = hasClerk ? "/api/demo/sign-in/teacher" : "/teacher";
const pupilHref = hasClerk ? "/api/demo/sign-in/pupil" : "/pupil";

const attendanceSource =
  "https://explore-education-statistics.service.gov.uk/find-statistics/pupil-attendance-in-schools/2025-week-29";
const nferSource =
  "https://www.nfer.ac.uk/publications/voices-from-the-classroom-understanding-how-secondary-schools-support-pupils-returning-from-absence/";

export default function Home() {
  return (
    <main className="landing-page min-h-[100dvh] overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--landing-line)] bg-[color-mix(in_oklch,var(--landing-bg)_92%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center gap-5 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BridgeBack home">
            <BridgeBackMark className="rounded-[0.875rem] shadow-none" />
            <span className="text-base font-semibold tracking-[-0.02em]">BridgeBack</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-[var(--landing-muted)] md:flex" aria-label="Landing page">
            <a className="transition-colors hover:text-[var(--landing-ink)]" href="#evidence">Evidence</a>
            <a className="transition-colors hover:text-[var(--landing-ink)]" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-[var(--landing-ink)]" href="#safeguards">Safeguards</a>
          </nav>
          <Button
            nativeButton={false}
            render={<a href={teacherHref} />}
            className="ml-auto h-10 rounded-[0.875rem] bg-[var(--landing-accent)] px-4 text-[var(--landing-accent-ink)] shadow-none hover:bg-[var(--landing-accent-strong)] md:ml-3"
          >
            Try the teacher demo <ArrowRight />
          </Button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[3.75rem]">
            Catch up on what<br className="hidden sm:block" /> unlocks next.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--landing-muted)]">
            BridgeBack finds the few concepts a returning pupil needs to understand tomorrow&apos;s lesson.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<a href={teacherHref} />}
              size="lg"
              className="h-12 rounded-[0.875rem] bg-[var(--landing-accent)] px-5 text-[var(--landing-accent-ink)] shadow-none hover:bg-[var(--landing-accent-strong)]"
            >
              <School /> Try the teacher demo <ArrowRight />
            </Button>
            <Button
              nativeButton={false}
              render={<a href={pupilHref} />}
              size="lg"
              variant="outline"
              className="h-12 rounded-[0.875rem] border-[var(--landing-line)] bg-transparent px-5 text-[var(--landing-ink)] shadow-none hover:bg-[var(--landing-soft)] hover:text-[var(--landing-ink)]"
            >
              <GraduationCap /> Try Mia&apos;s journey
            </Button>
          </div>
        </div>

        <figure className="relative overflow-hidden rounded-[1rem] bg-[var(--landing-surface)] shadow-[0_30px_80px_-48px_var(--landing-shadow)]">
          <Image
            src="/bridgeback-classroom.webp"
            alt="A quiet classroom desk with a computer science workbook and three green learning cards"
            width={1448}
            height={1086}
            priority
            className="aspect-[4/3] h-auto w-full object-cover"
          />
          <figcaption className="absolute inset-x-4 bottom-4 rounded-[0.875rem] bg-[color-mix(in_oklch,var(--landing-deep)_92%,transparent)] p-4 text-[var(--landing-dark-ink)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[19rem]">
            <p className="text-sm font-semibold">Twelve missed resources become three manageable steps.</p>
            <p className="mt-1 text-xs leading-5 text-[var(--landing-dark-muted)]">The route is based on the next lesson, not the volume of work left behind.</p>
          </figcaption>
        </figure>
      </section>

      <section id="evidence" className="border-y border-[var(--landing-line)]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <p className="text-sm font-semibold text-[var(--landing-accent)]">The attendance gap</p>
            <p className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
              Returning to school should not mean facing every missed lesson at once.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--landing-muted)]">
              Persistent absence means missing at least 10% of possible sessions. The latest full-year data shows the scale across state-funded schools in England.
            </p>
            <a
              href={attendanceSource}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4 hover:decoration-[var(--landing-accent)]"
            >
              Read the Department for Education data <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="grid border-t border-[var(--landing-line)] sm:grid-cols-2 lg:border-l lg:border-t-0">
            <div className="flex min-h-64 flex-col justify-between bg-[var(--landing-accent)] p-7 text-[var(--landing-accent-ink)] sm:col-span-2 sm:p-9">
              <span className="text-sm font-medium">All schools, 2024/25</span>
              <div>
                <strong className="text-7xl font-semibold tracking-[-0.07em] sm:text-8xl">18.7%</strong>
                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--landing-accent-muted)]">of pupils were persistently absent, almost one pupil in five.</p>
              </div>
            </div>
            <div className="flex min-h-52 flex-col justify-between border-r border-t border-[var(--landing-line)] p-7 sm:p-8">
              <span className="text-sm text-[var(--landing-muted)]">Secondary schools</span>
              <strong className="text-5xl font-semibold tracking-[-0.055em]">24.3%</strong>
            </div>
            <div className="flex min-h-52 flex-col justify-between border-t border-[var(--landing-line)] p-7 sm:p-8">
              <span className="text-sm text-[var(--landing-muted)]">Special schools</span>
              <strong className="text-5xl font-semibold tracking-[-0.055em]">35.8%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <blockquote className="rounded-[1rem] bg-[var(--landing-deep)] p-7 text-[var(--landing-dark-ink)] sm:p-10">
            <p className="text-2xl font-medium leading-snug tracking-[-0.025em] sm:text-3xl">“Catching up on missed work was one of the biggest concerns for pupils.”</p>
            <footer className="mt-7 text-sm text-[var(--landing-dark-muted)]">NFER, Voices from the Classroom</footer>
          </blockquote>
          <div className="lg:pb-2">
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">The work can be available and still feel impossible.</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--landing-muted)]">
              NFER spoke with 85 pupils across nine secondary schools. Pupils valued teachers explaining what they had missed. Without that support, some felt anxious, confused in class, or left to struggle alone.
            </p>
            <a
              href={nferSource}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] underline decoration-[var(--landing-line)] underline-offset-4 hover:decoration-[var(--landing-accent)]"
            >
              Read the NFER research <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[var(--landing-soft)]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Mia missed four weeks. She does not need twelve catch-up lessons.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--landing-muted)]">She needs the shortest route into tomorrow&apos;s binary search lesson.</p>

          <div className="mt-14 grid overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <JourneyStep icon={FileStack} value="12" title="Resources analysed" detail="Slides, worksheets and the upcoming lesson" />
            <JourneyArrow />
            <JourneyStep icon={Network} value="2" title="Concept gaps found" detail="From a short prerequisite diagnostic" />
            <JourneyArrow />
            <JourneyStep icon={BookOpenCheck} value="3" title="Steps to rejoin" detail="Never more than three at one time" />
          </div>
          <p className="mt-4 text-xs text-[var(--landing-muted)]">Mia and all figures in this example are synthetic demo data.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex size-12 items-center justify-center rounded-[0.875rem] bg-[var(--landing-soft)] text-[var(--landing-accent)]"><School className="size-5" /></div>
            <h2 className="mt-7 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Teachers set the destination.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--landing-muted)]">Upload lesson materials, review the prerequisite map, correct it if needed, then approve the diagnostic and pathway.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <CheckItem>Lesson files remain attached to the teacher&apos;s class</CheckItem>
              <CheckItem>Every concept keeps a source reference</CheckItem>
              <CheckItem>Teacher approval stays in the loop</CheckItem>
            </ul>
          </div>
          <div className="border-t border-[var(--landing-line)] pt-12 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
            <div className="flex size-12 items-center justify-center rounded-[0.875rem] bg-[var(--landing-soft)] text-[var(--landing-accent)]"><GraduationCap className="size-5" /></div>
            <h2 className="mt-7 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Pupils see only what comes next.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--landing-muted)]">A calm check-in finds what they already know. BridgeBack then unlocks one short, source-grounded module at a time.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <CheckItem>No wall of overdue work</CheckItem>
              <CheckItem>No more than three concepts at once</CheckItem>
              <CheckItem>Clear progress back toward the class</CheckItem>
            </ul>
          </div>
        </div>
      </section>

      <section id="safeguards" className="border-y border-[var(--landing-line)]">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-[var(--landing-deep)] px-4 py-20 text-[var(--landing-dark-ink)] sm:px-8 lg:px-10 lg:py-24">
            <ShieldCheck className="size-10 text-[var(--landing-accent-light)]" strokeWidth={1.7} />
            <p className="mt-8 text-sm font-semibold text-[var(--landing-accent-light)]">Built for pupils</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em]">Useful AI needs firm boundaries.</h2>
          </div>
          <div className="grid bg-[var(--landing-surface)] sm:grid-cols-2">
            <Safeguard title="Synthetic by default">The public demo contains no real child identities, attendance records, lessons, or responses.</Safeguard>
            <Safeguard title="Minimal data">Only the information needed to plan and complete the learning route is stored.</Safeguard>
            <Safeguard title="Teacher controlled">AI proposes prerequisite maps and learning content. A teacher reviews the route.</Safeguard>
            <Safeguard title="No hidden ranking">The diagnostic identifies concept support needs. It does not label or rank the pupil.</Safeguard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="rounded-[1rem] bg-[var(--landing-accent)] px-6 py-16 text-[var(--landing-accent-ink)] sm:px-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:px-14 lg:py-20">
          <div>
            <Sparkles className="size-8" strokeWidth={1.7} />
            <h2 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-6xl">See the shortest path back into learning.</h2>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 lg:mt-0 lg:justify-end">
            <Button nativeButton={false} render={<a href={teacherHref} />} size="lg" className="h-12 rounded-[0.875rem] bg-[var(--landing-cta)] px-5 text-[var(--landing-cta-ink)] shadow-none hover:bg-[var(--landing-cta-hover)]">
              <School /> Try the teacher demo <ArrowRight />
            </Button>
            <Button nativeButton={false} render={<a href={pupilHref} />} size="lg" variant="outline" className="h-12 rounded-[0.875rem] border-[var(--landing-accent-ink)]/35 bg-transparent px-5 text-[var(--landing-accent-ink)] shadow-none hover:bg-[var(--landing-accent-ink)]/10 hover:text-[var(--landing-accent-ink)]">
              <GraduationCap /> Try Mia&apos;s journey
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--landing-line)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-8 text-sm text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex items-center gap-3"><BridgeBackMark className="size-8 rounded-[0.75rem] shadow-none" /><span className="font-semibold text-[var(--landing-ink)]">BridgeBack</span></div>
          <p>Built with synthetic data for OpenAI Build Week.</p>
        </div>
      </footer>
    </main>
  );
}

function JourneyStep({
  icon: Icon,
  value,
  title,
  detail,
}: {
  icon: typeof FileStack;
  value: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex min-h-64 flex-col justify-between p-7 sm:p-8">
      <Icon className="size-5 text-[var(--landing-accent)]" strokeWidth={1.8} />
      <div>
        <strong className="text-6xl font-semibold tracking-[-0.065em]">{value}</strong>
        <p className="mt-4 font-semibold">{title}</p>
        <p className="mt-2 max-w-52 text-sm leading-6 text-[var(--landing-muted)]">{detail}</p>
      </div>
    </div>
  );
}

function JourneyArrow() {
  return (
    <div className="flex items-center justify-center border-y border-[var(--landing-line)] px-5 py-4 text-[var(--landing-accent)] md:border-x md:border-y-0">
      <ArrowRight className="size-5 rotate-90 md:rotate-0" />
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.45rem] bg-[var(--landing-soft)] text-[var(--landing-accent)]"><Check className="size-3.5" strokeWidth={2.5} /></span><span>{children}</span></li>;
}

function Safeguard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-52 border-b border-[var(--landing-line)] p-7 sm:border-l sm:p-8">
      <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--landing-muted)]">{children}</p>
    </div>
  );
}
