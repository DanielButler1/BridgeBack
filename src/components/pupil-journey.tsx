"use client";

import { useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useAction, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Lightbulb,
  LoaderCircle,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { demoPupil, diagnosticQuestions, learningSteps } from "@/lib/demo-data";
import { hasClerk, hasConvex } from "@/lib/config";

type PublicQuestion = {
  key: string;
  conceptKey: string;
  eyebrow: string;
  prompt: string;
  code?: string;
  options: string[];
};

type LearningModule = {
  _id: string;
  conceptKey: string;
  order: number;
  title: string;
  objective: string;
  explanation: string;
  exampleTitle: string;
  exampleBody: string;
  practicePrompt: string;
  practiceOptions: string[];
  feedback: string;
  durationMinutes: number;
  sourceRefs: string[];
  status: "locked" | "ready" | "complete";
};

type PupilAssignment = {
  pupil: { displayName: string; initials: string };
  assignment: { _id: string; status: "assigned" | "in_progress" | "path_ready" | "complete"; currentQuestion: number };
  diagnostic: { questions: PublicQuestion[] };
  responses: Array<{ questionKey: string; selectedIndex: number; isCorrect: boolean }>;
  graph: { targetConceptKey?: string; nodes: Array<{ key: string; title: string; description: string }> } | null;
  path: { conceptKeys: string[]; totalMinutes?: number; status: "ready" | "in_progress" | "complete" } | null;
  modules: LearningModule[];
} | null;

const currentAssignmentRef = makeFunctionReference<"query", Record<string, never>, PupilAssignment>("pupil:currentAssignment");
const submitAnswerRef = makeFunctionReference<"mutation", { assignmentId: string; questionKey: string; selectedIndex: number }, { isCorrect: boolean; complete: boolean }>("pupil:submitAnswer");
const generateModulesRef = makeFunctionReference<"action", { assignmentId: string }, { count: number }>("generateLearning:modules");
const completeModuleRef = makeFunctionReference<"mutation", { moduleId: string; selectedIndex: number }, { isCorrect: boolean; complete: boolean }>("pupil:completeModule");

export function PupilJourney() {
  if (hasClerk && hasConvex) {
    return (
      <>
        <AuthLoading><StatusCard>Connecting Mia&apos;s pathway…</StatusCard></AuthLoading>
        <Authenticated><ConnectedPupilJourney /></Authenticated>
        <Unauthenticated><StatusCard title="Session unavailable">Return to the start page and choose Mia&apos;s demo again.</StatusCard></Unauthenticated>
      </>
    );
  }
  return <JourneyExperience data={fallbackAssignment} />;
}

function StatusCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Card className="mx-auto max-w-3xl p-10 text-center">{title ? <CardTitle>{title}</CardTitle> : null}<CardDescription className={title ? "mt-2" : ""}>{children}</CardDescription></Card>;
}

function ConnectedPupilJourney() {
  const data = useQuery(currentAssignmentRef, {});
  const submitAnswer = useMutation(submitAnswerRef);
  const generateModules = useAction(generateModulesRef);
  const completeModule = useMutation(completeModuleRef);
  if (data === undefined) return <StatusCard>Loading Mia&apos;s saved pathway…</StatusCard>;
  if (!data) return <StatusCard title="No pathway assigned yet">Ms Morgan can analyse the lesson and assign a diagnostic from the teacher view.</StatusCard>;
  return <JourneyExperience data={data} onAnswer={(questionKey, selectedIndex) => submitAnswer({ assignmentId: data.assignment._id, questionKey, selectedIndex })} onGenerate={() => generateModules({ assignmentId: data.assignment._id })} onCompleteModule={(moduleId, selectedIndex) => completeModule({ moduleId, selectedIndex })} />;
}

type JourneyState = "welcome" | "diagnostic" | "generating" | "results" | "lesson" | "complete";

function JourneyExperience({ data, onAnswer, onGenerate, onCompleteModule }: {
  data: NonNullable<PupilAssignment>;
  onAnswer?: (questionKey: string, selectedIndex: number) => Promise<{ isCorrect: boolean; complete: boolean }>;
  onGenerate?: () => Promise<unknown>;
  onCompleteModule?: (moduleId: string, selectedIndex: number) => Promise<{ isCorrect: boolean; complete: boolean }>;
}) {
  const initialState: JourneyState = data.assignment.status === "complete"
    ? "complete"
    : data.path?.status === "in_progress" && data.modules.length > 0
      ? "results"
      : "welcome";
  const [state, setState] = useState<JourneyState>(initialState);
  const [questionIndex, setQuestionIndex] = useState(Math.min(data.assignment.currentQuestion, data.diagnostic.questions.length - 1));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>(Object.fromEntries(data.responses.map((response) => [response.questionKey, response.isCorrect])));
  const [activeOrder, setActiveOrder] = useState(data.modules.find((module) => module.status !== "complete")?.order ?? 1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = data.diagnostic.questions;
  const score = Object.values(answerResults).filter(Boolean).length;
  const target = data.graph?.nodes.find((node) => node.key === data.graph?.targetConceptKey) ?? data.graph?.nodes.at(-1);
  const totalMinutes = data.path?.totalMinutes ?? data.modules.reduce((total, module) => total + module.durationMinutes, 0);
  const activeModule = data.modules.find((module) => module.order === activeOrder) ?? data.modules.find((module) => module.status !== "complete") ?? data.modules[0];
  const renderedState = state === "generating" && data.modules.length > 0 ? "results" : state;

  async function submitDiagnosticAnswer() {
    if (selectedIndex === null) return;
    const question = questions[questionIndex];
    setBusy(true);
    setError(null);
    try {
      const result = onAnswer
        ? await onAnswer(question.key, selectedIndex)
        : { isCorrect: diagnosticQuestions.find((item) => item.id === question.key)?.correctIndex === selectedIndex, complete: questionIndex === questions.length - 1 };
      setAnswerResults((current) => ({ ...current, [question.key]: result.isCorrect }));
      setSelectedIndex(null);
      if (result.complete) {
        setState("generating");
        if (onGenerate) await onGenerate();
        else setState("results");
      } else {
        setQuestionIndex((current) => current + 1);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your answer could not be saved");
      setState("diagnostic");
    } finally {
      setBusy(false);
    }
  }

  if (renderedState === "diagnostic") return <DiagnosticView question={questions[questionIndex]} questionIndex={questionIndex} questionCount={questions.length} selectedIndex={selectedIndex} busy={busy} error={error} onSelect={setSelectedIndex} onSubmit={() => void submitDiagnosticAnswer()} onBack={() => questionIndex === 0 ? setState("welcome") : setQuestionIndex((current) => current - 1)} />;
  if (renderedState === "generating") return <GeneratingView error={error} />;
  if (renderedState === "results") return <ResultsView score={score} questionCount={questions.length} modules={data.modules} totalMinutes={totalMinutes} onContinue={() => setState("lesson")} />;
  if (renderedState === "lesson" && activeModule) return <LessonView key={activeModule._id} module={activeModule} moduleCount={data.modules.length} onComplete={async (selected) => {
    setBusy(true); setError(null);
    try {
      const result = onCompleteModule ? await onCompleteModule(activeModule._id, selected) : { isCorrect: true, complete: activeOrder >= data.modules.length };
      if (!result.isCorrect) return { isCorrect: false };
      if (result.complete || activeOrder >= data.modules.length) setState("complete");
      else setActiveOrder((current) => current + 1);
      return { isCorrect: true };
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This step could not be saved");
      return { isCorrect: false };
    } finally { setBusy(false); }
  }} busy={busy} externalError={error} />;
  if (renderedState === "complete") return <CompleteView onReplay={() => { setState("welcome"); setQuestionIndex(0); setSelectedIndex(null); setAnswerResults({}); setActiveOrder(1); }} />;
  return <WelcomeView pupilName={data.pupil.displayName} targetTitle={target?.title ?? "your next lesson"} targetDescription={target?.description ?? "We’ll focus only on the ideas that unlock what comes next."} questionCount={questions.length} onStart={() => setState("diagnostic")} />;
}

function WelcomeView({ pupilName, targetTitle, targetDescription, questionCount, onStart }: { pupilName: string; targetTitle: string; targetDescription: string; questionCount: number; onStart: () => void }) {
  return <div className="mx-auto max-w-6xl pb-10"><section className="grid min-h-[590px] overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-52px_rgba(20,60,45,0.35)] lg:grid-cols-[1.08fr_0.92fr]"><div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14"><div><Badge variant="secondary" className="mb-8"><HeartHandshake /> A gentle way back in</Badge><p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">Welcome back, {pupilName}</p><h1 className="max-w-xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">You don&apos;t need to catch up on everything today.</h1><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">We&apos;ll check a few ideas that matter for your next lesson, then make a short plan just for you.</p></div><div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"><Button size="lg" className="h-11 px-5" onClick={onStart}>Start my check-in <ArrowRight /></Button><div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" /> About 6 minutes · {questionCount} questions</div></div></div><div className="relative min-h-96 overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10 lg:min-h-full"><div className="absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/15" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[0.16em] opacity-60">Your next lesson</span><Avatar className="size-10 border border-primary-foreground/20"><AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">MI</AvatarFallback></Avatar></div><div className="my-10"><div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary shadow-xl"><Target className="size-7" /></div><p className="font-heading text-4xl font-semibold">{targetTitle}</p><p className="mt-3 max-w-sm leading-7 text-primary-foreground/65">{targetDescription}</p></div><div className="grid gap-2">{["No marks or grades", "Stop whenever you need", "Only the ideas that matter next"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] px-4 py-3 text-sm"><Check className="size-4 opacity-70" /> {item}</div>)}</div></div></div></section></div>;
}

function DiagnosticView({ question, questionIndex, questionCount, selectedIndex, busy, error, onSelect, onSubmit, onBack }: { question: PublicQuestion; questionIndex: number; questionCount: number; selectedIndex: number | null; busy: boolean; error: string | null; onSelect: (index: number) => void; onSubmit: () => void; onBack: () => void }) {
  return <div className="mx-auto max-w-3xl pb-10"><div className="mb-6 flex items-center justify-between gap-4"><Button variant="ghost" onClick={onBack}><ArrowLeft /> Back</Button><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="font-mono">{questionIndex + 1} / {questionCount}</span><div className="w-28 sm:w-44"><Progress value={((questionIndex + 1) / questionCount) * 100} className="[&_[data-slot=progress-track]]:h-1.5" /></div></div></div><Card className="min-h-[520px] justify-between"><CardHeader className="p-6 sm:p-9"><Badge variant="secondary" className="mb-5">{question.eyebrow}</Badge><CardTitle className="max-w-2xl font-heading text-2xl leading-tight sm:text-4xl">{question.prompt}</CardTitle><CardDescription className="mt-2">Choose the answer that feels right. It&apos;s okay not to know yet.</CardDescription></CardHeader><CardContent className="space-y-3 px-6 sm:px-9">{question.code ? <pre className="mb-5 overflow-x-auto rounded-xl border bg-foreground p-4 font-mono text-sm leading-6 text-background"><code>{question.code}</code></pre> : null}{question.options.map((option, index) => <button type="button" key={option} onClick={() => onSelect(index)} className={cn("flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-base", selectedIndex === index ? "border-primary bg-primary/[0.065] shadow-[0_0_0_1px_var(--primary)]" : "bg-background hover:border-primary/35 hover:bg-muted/35")}><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs", selectedIndex === index ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>{String.fromCharCode(65 + index)}</span>{option}</button>)}{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}</CardContent><CardFooter className="justify-between px-6 py-4 sm:px-9"><span className="hidden text-xs text-muted-foreground sm:block">Your answer helps shape your pathway.</span><Button disabled={selectedIndex === null || busy} onClick={onSubmit} className="ml-auto">{busy ? <LoaderCircle className="animate-spin" /> : null}{questionIndex === questionCount - 1 ? "Build my pathway" : "Next question"}<ArrowRight /></Button></CardFooter></Card></div>;
}

function GeneratingView({ error }: { error: string | null }) {
  return <div className="mx-auto max-w-3xl pb-10"><Card className="overflow-hidden text-center"><div className="bg-primary/[0.06] px-6 py-20"><div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="size-7 animate-pulse" /></div><h1 className="mt-7 font-heading text-4xl font-semibold">Finding your shortest path…</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">GPT‑5.6 is using your teacher&apos;s approved map and your answers to prepare no more than three focused steps.</p>{error ? <p role="alert" className="mt-5 text-sm text-destructive">{error}</p> : <LoaderCircle className="mx-auto mt-8 size-5 animate-spin text-primary" />}</div></Card></div>;
}

function ResultsView({ score, questionCount, modules, totalMinutes, onContinue }: { score: number; questionCount: number; modules: LearningModule[]; totalMinutes: number; onContinue: () => void }) {
  return <div className="mx-auto max-w-5xl pb-10"><section className="mb-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]"><Card className="border-0 bg-primary text-primary-foreground ring-0"><CardHeader className="p-7 sm:p-9"><div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/12"><Sparkles className="size-5" /></div><p className="text-xs font-medium uppercase tracking-[0.16em] opacity-60">Check-in complete</p><CardTitle className="mt-2 font-heading text-4xl leading-tight">You already know more than you might think.</CardTitle><CardDescription className="mt-3 text-primary-foreground/65">You were ready in {score} of the {questionCount} ideas we checked. Your pathway focuses only on what unlocks next.</CardDescription></CardHeader></Card><Card><CardHeader className="p-7 sm:p-9"><Badge variant="secondary" className="mb-5">Your shortest path</Badge><CardTitle className="font-heading text-3xl">{modules.length} manageable {modules.length === 1 ? "step" : "steps"}</CardTitle><CardDescription className="mt-2 max-w-xl">Each step comes from the teacher-approved concept map and points back to its lesson source.</CardDescription></CardHeader><CardContent className="px-7 sm:px-9"><div className="relative space-y-1 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-border">{modules.map((module, index) => <div key={module._id} className="relative flex gap-4 py-3"><div className={cn("z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs", index === 0 && "border-primary bg-primary text-primary-foreground")}>{module.order}</div><div className="flex-1 pt-0.5"><p className="font-medium">{module.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{module.objective}</p></div><span className="pt-1 font-mono text-xs text-muted-foreground">{module.durationMinutes} min</span></div>)}</div></CardContent><CardFooter className="justify-between px-7 py-4 sm:px-9"><span className="text-xs text-muted-foreground">{totalMinutes} minutes total</span><Button onClick={onContinue}>Begin step one <Play /></Button></CardFooter></Card></section></div>;
}

function LessonView({ module, moduleCount, onComplete, busy, externalError }: { module: LearningModule; moduleCount: number; onComplete: (selected: number) => Promise<{ isCorrect: boolean }>; busy: boolean; externalError: string | null }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  return <div className="mx-auto max-w-5xl pb-10"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Step {module.order} of {moduleCount}</p><p className="mt-1 font-heading text-2xl font-semibold">{module.title}</p></div><Badge variant="outline"><Clock3 /> {module.durationMinutes} min</Badge></div><div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader className="p-7 sm:p-9"><CardTitle className="font-heading text-3xl">{module.objective}</CardTitle><CardDescription className="mt-2 text-base leading-7">{module.explanation}</CardDescription></CardHeader><CardContent className="space-y-6 px-7 sm:px-9"><div className="rounded-2xl border bg-muted/25 p-5"><p className="font-medium">{module.exampleTitle}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{module.exampleBody}</p></div><div><p className="font-heading text-xl font-semibold">Try a quick check</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{module.practicePrompt}</p><div className="mt-4 space-y-2">{module.practiceOptions.map((option, index) => <button type="button" key={option} onClick={() => { setSelected(index); setFeedback(null); }} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm", selected === index ? "border-primary bg-primary/[0.06]" : "bg-background hover:bg-muted/30")}><span className="flex size-7 items-center justify-center rounded-full border font-mono text-xs">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{feedback ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{feedback}</div> : null}{externalError ? <p role="alert" className="mt-4 text-sm text-destructive">{externalError}</p> : null}</div></CardContent><CardFooter className="justify-end px-7 py-4 sm:px-9"><Button disabled={selected === null || busy} onClick={async () => { if (selected === null) return; const result = await onComplete(selected); if (!result.isCorrect) setFeedback(module.feedback); }}>{busy ? <LoaderCircle className="animate-spin" /> : null}Check and continue <ArrowRight /></Button></CardFooter></Card><div className="space-y-4"><Card className="bg-amber-50 text-amber-950 ring-amber-200"><CardHeader><div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-amber-100"><Lightbulb className="size-4" /></div><CardTitle>Why this matters</CardTitle><CardDescription className="text-amber-900/65">This is one of the minimum ideas needed to participate in the next lesson—not extra catch-up work.</CardDescription></CardHeader></Card><Card><CardHeader><CardTitle>Teacher-approved sources</CardTitle><CardDescription>Where this explanation came from.</CardDescription></CardHeader><CardContent className="space-y-2">{module.sourceRefs.map((source) => <div key={source} className="flex items-start gap-2 rounded-lg border p-3 text-sm"><BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />{source}</div>)}</CardContent></Card></div></div></div>;
}

function CompleteView({ onReplay }: { onReplay: () => void }) {
  return <div className="mx-auto max-w-3xl pb-10"><Card className="overflow-hidden text-center"><div className="bg-primary/[0.07] px-6 py-14 sm:py-20"><div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><CheckCircle2 className="size-7" /></div><Badge variant="secondary" className="mb-5">Pathway complete</Badge><h1 className="mx-auto max-w-xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">You&apos;re ready to take part in the next lesson.</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">Your teacher can see which ideas you practised. This is a readiness signal—not a grade.</p></div><Separator /><CardFooter className="justify-center gap-3 border-0 bg-background py-5"><Button variant="outline" onClick={onReplay}><RotateCcw /> Review from the start</Button><Button onClick={() => window.location.assign("/api/demo/sign-in/teacher")}>Show Ms Morgan <BookOpen /></Button></CardFooter></Card></div>;
}

const fallbackAssignment: NonNullable<PupilAssignment> = {
  pupil: { displayName: demoPupil.name, initials: demoPupil.initials },
  assignment: { _id: "assignment-demo", status: "assigned", currentQuestion: 0 },
  diagnostic: { questions: diagnosticQuestions.map((question) => ({ key: question.id, conceptKey: question.conceptId, eyebrow: question.eyebrow, prompt: question.prompt, code: question.code, options: question.options })) },
  responses: [],
  graph: { targetConceptKey: "binary-search", nodes: [{ key: "binary-search", title: "Binary search", description: "Learn how computers find an item quickly by repeatedly cutting a sorted list in half." }] },
  path: { conceptKeys: learningSteps.map((step) => step.conceptId), totalMinutes: learningSteps.reduce((total, step) => total + step.duration, 0), status: "ready" },
  modules: learningSteps.map((step) => ({ _id: step.id, conceptKey: step.conceptId, order: step.order, title: step.title, objective: step.description, explanation: "This focused explanation prepares you for the next lesson without asking you to repeat every missed resource.", exampleTitle: "A worked example", exampleBody: "Follow the idea one small step at a time, then use the check below to see whether it feels clear.", practicePrompt: "Which option best shows that you understand this step?", practiceOptions: ["The idea can be applied in the next lesson", "Repeat every missed worksheet", "Skip the next lesson"], feedback: "Look again at how this idea unlocks the upcoming lesson.", durationMinutes: step.duration, sourceRefs: ["Synthetic local demo source"], status: step.order === 1 ? "ready" : "locked" })),
};
