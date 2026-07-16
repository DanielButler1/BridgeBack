"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, School, Target } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { ConceptMap } from "@/components/concept-map";
import { StandalonePupilJourney, type PupilAssignment } from "@/components/pupil-journey";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mathsConcepts, mathsDiagnosticQuestions, mathsLearningModules, mathsLinks, mathsReadiness, mathsResources } from "@/lib/maths-demo-data";

const mathsAssignment: NonNullable<PupilAssignment> = {
  pupil: { displayName: "Amina", initials: "AM" },
  assignment: { _id: "assignment-maths-demo", status: "assigned", currentQuestion: 0 },
  diagnostic: { questions: mathsDiagnosticQuestions.map((question) => ({ key: question.id, conceptKey: question.conceptId, eyebrow: question.eyebrow, prompt: question.prompt, options: [...question.options], correctIndex: question.correctIndex })) },
  responses: [],
  graph: { targetConceptKey: "simultaneous-equations", nodes: [{ key: "simultaneous-equations", title: "Simultaneous equations", description: "Find a pair of values that makes two equations true at the same time." }] },
  path: { conceptKeys: mathsLearningModules.map((module) => module.conceptId), totalMinutes: mathsLearningModules.reduce((total, module) => total + module.durationMinutes, 0), status: "ready" },
  modules: mathsLearningModules.map((module) => ({ _id: module.id, conceptKey: module.conceptId, order: module.order, title: module.title, objective: module.objective, explanation: module.explanation, exampleTitle: module.exampleTitle, exampleBody: module.exampleBody, practicePrompt: module.practicePrompt, practiceOptions: [...module.practiceOptions], feedback: module.feedback, durationMinutes: module.durationMinutes, sourceRefs: [...module.sourceRefs], status: module.order === 1 ? "ready" : "locked", correctIndex: module.correctIndex })),
  helpRequests: [],
};

function createMathsVisual() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="640" viewBox="0 0 1024 640"><rect width="1024" height="640" fill="#eef8f2"/><text x="70" y="95" fill="#12372a" font-family="Arial" font-size="42" font-weight="700">Keep the equation balanced</text><rect x="80" y="210" width="330" height="120" rx="22" fill="#12372a"/><text x="245" y="282" text-anchor="middle" fill="white" font-family="Arial" font-size="38">x + y = 10</text><path d="M455 270 H565" stroke="#5c8d73" stroke-width="8"/><path d="M545 248 L572 270 L545 292" fill="none" stroke="#5c8d73" stroke-width="8"/><rect x="615" y="210" width="330" height="120" rx="22" fill="#9ad0b2"/><text x="780" y="282" text-anchor="middle" fill="#12372a" font-family="Arial" font-size="38" font-weight="700">y = 10 - x</text><text x="512" y="405" text-anchor="middle" fill="#49665b" font-family="Arial" font-size="28">Subtract x from both sides</text></svg>`;
  return Promise.resolve({ dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, alt: "The equation x plus y equals ten being rearranged by subtracting x from both sides to leave y equals ten minus x." });
}

export function MathsDemo() {
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  if (!hydrated) return <div className="min-h-screen bg-background" />;
  return <HydratedMathsDemo />;
}

function HydratedMathsDemo() {
  const [view, setView] = useState<"teacher" | "pupil">(() => window.sessionStorage.getItem("bridgeback:maths-view") === "pupil" ? "pupil" : "teacher");
  useEffect(() => { window.sessionStorage.setItem("bridgeback:maths-view", view); }, [view]);
  return <div className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl"><div className="mx-auto flex h-[4.5rem] max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8"><Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BridgeBack home"><BridgeBackMark /><span className="hidden font-heading font-semibold sm:inline">BridgeBack</span></Link><nav className="mx-auto flex rounded-xl border bg-muted/45 p-1" aria-label="Mathematics demo views"><Button variant={view === "teacher" ? "secondary" : "ghost"} size="sm" onClick={() => setView("teacher")}><School /> Teacher</Button><Button variant={view === "pupil" ? "secondary" : "ghost"} size="sm" onClick={() => setView("pupil")}><GraduationCap /> Pupil</Button></nav><Button nativeButton={false} render={<Link href="/demo" />} variant="ghost" size="sm"><ArrowLeft /><span className="hidden sm:inline">All demos</span></Button></div></header><main className="mx-auto w-full max-w-[1480px] px-4 py-7 sm:px-6 lg:px-8">{view === "teacher" ? <TeacherMaths onContinue={() => setView("pupil")} /> : <StandalonePupilJourney data={mathsAssignment} teacherName="Ms Patel" teacherHref="/demo/maths" onIllustrate={() => createMathsVisual()} />}</main></div>;
}

function TeacherMaths({ onContinue }: { onContinue: () => void }) {
  return <div className="space-y-6 pb-10"><section className="grid overflow-hidden rounded-3xl border bg-card lg:grid-cols-[1.15fr_0.85fr]"><div className="p-7 sm:p-10 lg:p-12"><Badge variant="secondary">Mathematics · Algebra</Badge><h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Prepare Amina for simultaneous equations—not every lesson she missed.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Four short questions check the earlier ideas that unlock substitution. Her answers lead to two focused activities, each with a worked example and a quick check.</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={onContinue}>Start Amina&apos;s check-in <ArrowRight /></Button><Badge variant="outline">OCR J560 · Year 10</Badge></div></div><div className="grid grid-cols-2 border-t bg-primary text-primary-foreground lg:border-l lg:border-t-0"><Metric value="8" label="missed lessons" /><Metric value="4" label="short questions" /><Metric value="2" label="support needs" /><Metric value="15" label="minutes in the route" /></div></section><section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]"><Card><CardHeader><Badge variant="secondary">Teacher review</Badge><CardTitle className="mt-3 font-heading text-2xl">What unlocks the next lesson?</CardTitle><CardDescription>The map separates prerequisite knowledge from verification. The teacher can edit the proposed route before assigning it.</CardDescription></CardHeader><CardContent><ConceptMap items={mathsConcepts} links={mathsLinks} targetConceptKey="simultaneous-equations" readiness={mathsReadiness} /></CardContent></Card><div className="space-y-4"><Card><CardHeader><CardTitle>Lesson materials</CardTitle><CardDescription>Three relevant sources selected from eight missed lessons.</CardDescription></CardHeader><CardContent className="space-y-2">{mathsResources.map((resource) => <div key={resource.name} className="rounded-xl border p-4"><p className="font-medium">{resource.name}</p><p className="mt-1 text-xs text-muted-foreground">{resource.detail}</p></div>)}</CardContent></Card><Card className="bg-primary text-primary-foreground ring-0"><CardHeader><Target className="size-5" /><CardTitle className="mt-4">The route stays deliberately small.</CardTitle><CardDescription className="text-primary-foreground/70">Quadratics, inequalities and graph transformations are not required for this lesson, so Amina does not receive them.</CardDescription></CardHeader></Card></div></section></div>;
}

function Metric({ value, label }: { value: string; label: string }) { return <div className="flex min-h-36 flex-col justify-end border-b border-r border-primary-foreground/15 p-6"><strong className="font-heading text-4xl">{value}</strong><span className="mt-2 text-sm text-primary-foreground/70">{label}</span></div>; }
