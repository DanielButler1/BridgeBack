"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, ImageIcon, School, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { ConceptMap } from "@/components/concept-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mathsConcepts, mathsLinks, mathsReadiness, mathsResources } from "@/lib/maths-demo-data";

export function MathsDemo() {
  const [view, setView] = useState<"teacher" | "pupil">("teacher");
  const [showVisual, setShowVisual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BridgeBack home"><BridgeBackMark /><span className="hidden font-heading font-semibold sm:inline">BridgeBack</span></Link>
          <nav className="mx-auto flex rounded-xl border bg-muted/45 p-1" aria-label="Mathematics demo views">
            <Button variant={view === "teacher" ? "secondary" : "ghost"} size="sm" onClick={() => setView("teacher")}><School /> Teacher</Button>
            <Button variant={view === "pupil" ? "secondary" : "ghost"} size="sm" onClick={() => setView("pupil")}><GraduationCap /> Pupil</Button>
          </nav>
          <Button nativeButton={false} render={<Link href="/demo" aria-label="Back to all demos" />} variant="ghost" size="sm"><ArrowLeft /> <span className="hidden sm:inline">All demos</span></Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1480px] px-4 py-7 sm:px-6 lg:px-8">
        {view === "teacher" ? <TeacherMaths onContinue={() => setView("pupil")} /> : <PupilMaths showVisual={showVisual} onVisualise={() => setShowVisual(true)} />}
      </main>
    </div>
  );
}

function TeacherMaths({ onContinue }: { onContinue: () => void }) {
  return <div className="space-y-6 pb-10">
    <section className="grid overflow-hidden rounded-3xl border bg-card lg:grid-cols-[1.15fr_0.85fr]">
      <div className="p-7 sm:p-10 lg:p-12"><Badge variant="secondary">Mathematics · Algebra</Badge><h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Prepare Amina for simultaneous equations—not every lesson she missed.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">The class is moving to substitution. BridgeBack checks the few earlier ideas that unlock that lesson, then keeps the route back short.</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={onContinue}>Open Amina&apos;s pathway <ArrowRight /></Button><Badge variant="outline">Year 10 · GCSE Mathematics</Badge></div></div>
      <div className="grid grid-cols-2 border-t bg-primary text-primary-foreground lg:border-l lg:border-t-0"><Metric value="8" label="missed lessons" /><Metric value="6" label="possible prerequisites" /><Metric value="2" label="support needs" /><Metric value="2" label="focused activities" /></div>
    </section>
    <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
      <Card><CardHeader><Badge variant="secondary">Teacher review</Badge><CardTitle className="mt-3 font-heading text-2xl">What unlocks the next lesson?</CardTitle><CardDescription>Each idea is source-labelled. Support is proposed for substitution and rearranging; the teacher can change the route.</CardDescription></CardHeader><CardContent><ConceptMap items={mathsConcepts} links={mathsLinks} targetConceptKey="simultaneous-equations" readiness={mathsReadiness} /></CardContent></Card>
      <div className="space-y-4"><Card><CardHeader><CardTitle>Lesson materials</CardTitle><CardDescription>Three relevant sources selected from eight missed lessons.</CardDescription></CardHeader><CardContent className="space-y-2">{mathsResources.map((resource) => <div key={resource.name} className="rounded-xl border p-4"><p className="font-medium">{resource.name}</p><p className="mt-1 text-xs text-muted-foreground">{resource.detail}</p></div>)}</CardContent></Card><Card className="bg-primary text-primary-foreground ring-0"><CardHeader><Target className="size-5" /><CardTitle className="mt-4">Four concepts stay out.</CardTitle><CardDescription className="text-primary-foreground">Factorising, graph transformations, quadratics and inequalities are not required for tomorrow&apos;s lesson, so Amina does not receive them.</CardDescription></CardHeader></Card></div>
    </section>
  </div>;
}

function Metric({ value, label }: { value: string; label: string }) { return <div className="flex min-h-36 flex-col justify-end border-b border-r border-primary-foreground/15 p-6"><strong className="font-heading text-4xl">{value}</strong><span className="mt-2 text-sm text-primary-foreground">{label}</span></div>; }

function PupilMaths({ showVisual, onVisualise }: { showVisual: boolean; onVisualise: () => void }) {
  return <div className="mx-auto max-w-5xl space-y-6 pb-10">
    <section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10"><p className="text-sm font-semibold text-primary-foreground/65">Amina&apos;s shortest path</p><h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold sm:text-5xl">Two ideas before simultaneous equations.</h1><p className="mt-4 max-w-2xl leading-7 text-primary-foreground/70">Your check-in showed that negative numbers and simplifying expressions are already in place. Start with rearranging, then practise substitution.</p></section>
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card><CardHeader><Badge variant="secondary">Step 1 of 2 · 7 minutes</Badge><CardTitle className="mt-3 font-heading text-3xl">Make one variable the subject</CardTitle><CardDescription className="text-base leading-7">To use substitution, first rewrite one equation so that it tells you what one letter equals.</CardDescription></CardHeader><CardContent className="space-y-5">
        {showVisual ? <figure className="rounded-2xl border bg-[#eef8f2] p-6"><svg viewBox="0 0 720 260" role="img" aria-label="The equation x plus y equals 10 being rearranged to y equals 10 minus x" className="h-auto w-full"><text x="40" y="115" fill="#12372a" fontSize="48" fontWeight="700">x + y = 10</text><path d="M300 100 H410" stroke="#5c8d73" strokeWidth="7" strokeLinecap="round"/><path d="M395 82 L418 100 L395 118" fill="none" stroke="#5c8d73" strokeWidth="7"/><text x="450" y="115" fill="#12372a" fontSize="48" fontWeight="700">y = 10 − x</text><text x="40" y="205" fill="#49665b" fontSize="26">Subtract x from both sides</text></svg><figcaption className="mt-3 text-sm text-[#49665b]">The same operation is applied to both sides, leaving y on its own.</figcaption></figure> : <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed bg-primary/[0.035] p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 font-medium"><ImageIcon className="size-4 text-primary" /> Would a picture help?</p><p className="mt-1 text-sm text-muted-foreground">Visualise how the equation stays balanced while x moves to the other side.</p></div><Button variant="outline" onClick={onVisualise}><Sparkles /> Create a visual</Button></div>}
        <div className="rounded-2xl border bg-muted/25 p-5"><p className="font-medium">Worked example</p><p className="mt-3 font-mono text-lg">x + y = 10<br/>y = 10 − x</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Subtract x from both sides. The equation now gives an expression for y that can be substituted into the second equation.</p></div>
      </CardContent></Card>
      <div className="space-y-4"><Card className="bg-amber-50 text-amber-950 ring-amber-200"><CardHeader><CardTitle>Why this matters</CardTitle><CardDescription className="text-amber-900/70">Tomorrow&apos;s method replaces y in the second equation with 10 − x. Rearranging creates the expression you need.</CardDescription></CardHeader></Card><Card><CardHeader><CardTitle>What BridgeBack left out</CardTitle><CardDescription>No quadratics, factorising or graph transformations. They do not unlock this lesson.</CardDescription></CardHeader><CardContent><div className="flex items-center gap-3 text-sm"><Check className="size-4 text-primary" /> Only two focused activities</div><div className="mt-3 flex items-center gap-3 text-sm"><BookOpen className="size-4 text-primary" /> Teacher-approved sources</div></CardContent></Card></div>
    </div>
  </div>;
}
