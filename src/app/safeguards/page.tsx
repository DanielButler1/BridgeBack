import type { Metadata } from "next";
import { EyeOff, LockKeyhole, School, ShieldCheck } from "lucide-react";

import { MarketingFooter, MarketingHeader, MarketingPageIntro } from "@/components/marketing-chrome";

export const metadata: Metadata = {
  title: "Safeguards | BridgeBack",
  description: "How BridgeBack protects pupil data, keeps teachers in control, and separates its synthetic demonstration from school workspaces.",
};

export default function SafeguardsPage() {
  return (
    <main className="landing-page min-h-[100dvh] bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <MarketingHeader active="/safeguards" />
      <MarketingPageIntro
        title="Support a pupil without building a profile of them."
        description="BridgeBack minimises data, isolates its public demonstration, and keeps educational decisions with the teacher."
        aside={<div><ShieldCheck className="size-9 text-[var(--landing-accent)]" /><p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Useful AI needs clear boundaries, visible approval, and an audit trail.</p></div>}
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          <Safeguard icon={ShieldCheck} title="Synthetic public demo">The demonstration uses fictional identities, lessons, attendance context, and pupil responses. It requires no real child data.</Safeguard>
          <Safeguard icon={LockKeyhole} title="Private school boundaries">Production records are scoped to an authenticated organisation and checked against active membership before access.</Safeguard>
          <Safeguard icon={School} title="Teacher-controlled routes">AI proposes dependencies, questions, and modules. Teachers can correct the map and approve the pupil pathway.</Safeguard>
          <Safeguard icon={EyeOff} title="No hidden pupil ranking">Diagnostics identify concept support needs. They are not designed to label pupils or create a behavioural score.</Safeguard>
        </div>
      </section>

      <section className="border-y border-[var(--landing-line)] bg-[var(--landing-deep)] text-[var(--landing-dark-ink)]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <h2 className="text-4xl font-semibold tracking-[-0.04em]">Security is a product requirement, not a footer promise.</h2>
          <div className="grid gap-7 text-sm leading-6 text-[var(--landing-dark-muted)] sm:grid-cols-2">
            <p>Authentication is handled through Clerk. School data and membership checks are stored and enforced through Convex.</p>
            <p>Administrative actions create audit events. Uploaded lesson files are validated before they enter the teaching workflow.</p>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function Safeguard({ icon: Icon, title, children }: { icon: typeof ShieldCheck; title: string; children: React.ReactNode }) {
  return <article className="border-t border-[var(--landing-line)] pt-7"><Icon className="size-6 text-[var(--landing-accent)]" /><h2 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-4 max-w-xl leading-7 text-[var(--landing-muted)]">{children}</p></article>;
}
