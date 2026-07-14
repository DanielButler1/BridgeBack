import { ArrowRight, BookOpenCheck, GraduationCap, Route, School, ShieldCheck, Sparkles } from "lucide-react";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasClerk } from "@/lib/config";

const teacherHref = hasClerk ? "/api/demo/sign-in/teacher" : "/teacher";
const pupilHref = hasClerk ? "/api/demo/sign-in/pupil" : "/pupil";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-foreground text-background">
      <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_72%_20%,color-mix(in_oklch,var(--primary)_55%,transparent),transparent_32rem)] opacity-55" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-background p-1.5 text-foreground"><BridgeBackMark /></div>
            <span className="font-heading text-lg font-semibold">BridgeBack</span>
          </div>
          <Badge className="border border-background/15 bg-background/10 text-background hover:bg-background/10"><Sparkles /> OpenAI Build Week</Badge>
        </header>
        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <Badge className="mb-7 bg-primary text-primary-foreground hover:bg-primary">A calmer return to learning</Badge>
            <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[5.5rem]">Don&apos;t catch up on everything. Catch up on what unlocks next.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-background/65">BridgeBack turns the next lesson into a precise, teacher-approved route back into class—without overwhelming a returning pupil with every missed worksheet.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button nativeButton={false} render={<a href={teacherHref} />} size="lg" className="h-12 bg-background px-6 text-foreground hover:bg-background/90"><School /> Enter as Ms Morgan <ArrowRight /></Button>
              <Button nativeButton={false} render={<a href={pupilHref} />} size="lg" variant="outline" className="h-12 border-background/25 bg-transparent px-6 text-background hover:bg-background/10 hover:text-background"><GraduationCap /> Enter as Mia</Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-background/45"><ShieldCheck className="size-3.5" /> Every identity, lesson and response in this experience is synthetic.</p>
          </div>
          <Card className="border-background/10 bg-background/[0.065] text-background ring-0 backdrop-blur-xl">
            <CardHeader className="border-background/10 p-7 sm:p-9"><CardDescription className="text-background/50">Tomorrow · Year 10 Computer Science</CardDescription><CardTitle className="font-heading text-4xl">Binary search</CardTitle></CardHeader>
            <CardContent className="space-y-3 p-7 sm:p-9">
              {[
                [BookOpenCheck, "12 missed resources", "analysed against the upcoming lesson"],
                [Route, "2 prerequisite gaps", "identified through a four-question check-in"],
                [Sparkles, "3 manageable steps", "the shortest teacher-approved path back"],
              ].map(([Icon, title, detail]) => {
                const ItemIcon = Icon as typeof BookOpenCheck;
                return <div key={String(title)} className="flex gap-4 rounded-2xl border border-background/10 bg-background/[0.055] p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ItemIcon className="size-4" /></div><div><p className="font-medium">{String(title)}</p><p className="mt-1 text-sm text-background/50">{String(detail)}</p></div></div>;
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
