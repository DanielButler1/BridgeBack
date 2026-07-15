import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const marketingLinks = [
  { href: "/evidence", label: "Evidence" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-schools", label: "For schools" },
  { href: "/safeguards", label: "Safeguards" },
] as const;

export type MarketingSection = (typeof marketingLinks)[number]["href"];

export function MarketingHeader({ active }: { active?: MarketingSection }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--landing-line)] bg-[color-mix(in_oklch,var(--landing-bg)_92%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center gap-5 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BridgeBack home">
          <BridgeBackMark className="rounded-[0.875rem] shadow-none" />
          <span className="text-base font-semibold tracking-[-0.02em]">BridgeBack</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 text-sm md:flex" aria-label="Main navigation">
          {marketingLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-[var(--landing-ink)]",
                active === item.href
                  ? "font-semibold text-[var(--landing-ink)]"
                  : "text-[var(--landing-muted)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/app"
          className="ml-auto hidden text-sm font-semibold text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-ink)] lg:block"
        >
          School sign in
        </Link>

        <details className="group relative ml-auto md:hidden">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-[0.875rem] border border-[var(--landing-line)] text-[var(--landing-ink)] transition-colors hover:bg-[var(--landing-soft)] [&::-webkit-details-marker]:hidden">
            <Menu className="size-4" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav className="absolute right-0 top-12 w-64 overflow-hidden rounded-[1rem] border border-[var(--landing-line)] bg-[var(--landing-surface)] p-2 shadow-[0_24px_60px_-36px_var(--landing-shadow)]" aria-label="Mobile navigation">
            {marketingLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                className={cn(
                  "block rounded-[0.75rem] px-4 py-3 text-sm transition-colors hover:bg-[var(--landing-soft)]",
                  active === item.href ? "font-semibold text-[var(--landing-ink)]" : "text-[var(--landing-muted)]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/app" className="block rounded-[0.75rem] px-4 py-3 text-sm font-semibold text-[var(--landing-ink)] hover:bg-[var(--landing-soft)]">
              School sign in
            </Link>
          </nav>
        </details>

        <Button
          nativeButton={false}
          render={<Link href="/demo" />}
          className="h-10 rounded-[0.875rem] bg-[var(--landing-accent)] px-4 text-[var(--landing-accent-ink)] shadow-none hover:bg-[var(--landing-accent-strong)]"
        >
          <span className="hidden sm:inline">Explore the demo</span>
          <span className="sm:hidden">Demo</span>
          <ArrowRight />
        </Button>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--landing-line)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 text-xs text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-[var(--landing-ink)]">
          <ArrowLeft className="size-3.5" /> BridgeBack home
        </Link>
        <p>Built with <span role="img" aria-label="love">❤️</span> for OpenAI Build Week</p>
      </div>
    </footer>
  );
}

export function MarketingPageIntro({
  title,
  description,
  aside,
}: {
  title: string;
  description: string;
  aside: React.ReactNode;
}) {
  return (
    <section className="border-b border-[var(--landing-line)]">
      <div className="mx-auto grid min-h-[34rem] max-w-[1400px] items-stretch lg:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">{description}</p>
        </div>
        <div className="flex items-end border-t border-[var(--landing-line)] bg-[var(--landing-soft)] p-7 sm:p-10 lg:border-l lg:border-t-0">
          {aside}
        </div>
      </div>
    </section>
  );
}
