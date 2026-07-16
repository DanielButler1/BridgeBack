"use client";

/* eslint-disable @next/next/no-img-element -- Generated data URLs are transient and cannot use the image optimiser. */

import { useEffect, useState, useSyncExternalStore } from "react";
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
  ImageIcon,
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
import { demoLearningModules, demoPupil, diagnosticQuestions } from "@/lib/demo-data";
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
  helpRequests: Array<{ moduleId?: string; status: "open" | "acknowledged" }>;
} | null;

const currentAssignmentRef = makeFunctionReference<"query", Record<string, never>, PupilAssignment>("pupil:currentAssignment");
const submitAnswerRef = makeFunctionReference<"mutation", { assignmentId: string; questionKey: string; selectedIndex: number }, { isCorrect: boolean; complete: boolean }>("pupil:submitAnswer");
const generateModulesRef = makeFunctionReference<"action", { assignmentId: string }, { count: number }>("generateLearning:modules");
const completeModuleRef = makeFunctionReference<"mutation", { moduleId: string; selectedIndex: number }, { isCorrect: boolean; complete: boolean }>("pupil:completeModule");
const generateIllustrationRef = makeFunctionReference<"action", { moduleId: string }, { dataUrl: string; alt: string }>("generateLearning:illustration");
const requestHelpRef = makeFunctionReference<"mutation", { moduleId: string }, string>("pupil:requestTeacherHelp");

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
  const generateIllustration = useAction(generateIllustrationRef);
  const requestHelp = useMutation(requestHelpRef);
  if (data === undefined) return <StatusCard>Loading Mia&apos;s saved pathway…</StatusCard>;
  if (!data) return <StatusCard title="No pathway assigned yet">Ms Morgan can analyse the lesson and assign a diagnostic from the teacher view.</StatusCard>;
  return <JourneyExperience data={data} onAnswer={(questionKey, selectedIndex) => submitAnswer({ assignmentId: data.assignment._id, questionKey, selectedIndex })} onGenerate={() => generateModules({ assignmentId: data.assignment._id })} onCompleteModule={(moduleId, selectedIndex) => completeModule({ moduleId, selectedIndex })} onIllustrate={(moduleId) => generateIllustration({ moduleId })} onRequestHelp={(moduleId) => requestHelp({ moduleId })} />;
}

type JourneyState = "welcome" | "diagnostic" | "generating" | "results" | "lesson" | "complete";

const journeyStates = new Set<JourneyState>(["welcome", "diagnostic", "generating", "results", "lesson", "complete"]);

function defaultJourneyState(data: NonNullable<PupilAssignment>): JourneyState {
  if (data.assignment.status === "complete") return "complete";
  if (data.assignment.status === "path_ready" && data.modules.length === 0) return "generating";
  if (data.modules.length > 0) {
    return data.modules.some((module) => module.status === "complete") ? "lesson" : "results";
  }
  if (data.assignment.status === "in_progress" || data.responses.length > 0) return "diagnostic";
  return "welcome";
}

function canRestoreJourneyState(state: JourneyState, data: NonNullable<PupilAssignment>) {
  if (data.assignment.status === "complete") return state !== "generating";
  if (data.assignment.status === "path_ready" && data.modules.length === 0) return state === "generating";
  if (data.modules.length > 0) return state === "results" || state === "lesson";
  return state === "welcome" || state === "diagnostic";
}

type JourneyExperienceProps = {
  data: NonNullable<PupilAssignment>;
  onAnswer?: (questionKey: string, selectedIndex: number) => Promise<{ isCorrect: boolean; complete: boolean }>;
  onGenerate?: () => Promise<unknown>;
  onCompleteModule?: (moduleId: string, selectedIndex: number) => Promise<{ isCorrect: boolean; complete: boolean }>;
  onIllustrate?: (moduleId: string) => Promise<{ dataUrl: string; alt: string }>;
  onRequestHelp?: (moduleId: string) => Promise<unknown>;
};

const subscribeToHydration = () => () => undefined;

function JourneyExperience(props: JourneyExperienceProps) {
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  if (!isHydrated) return <StatusCard>Restoring your saved place…</StatusCard>;
  return <HydratedJourneyExperience {...props} />;
}

function readSavedJourneyView(storageKey: string, data: NonNullable<PupilAssignment>) {
  try {
    const saved = window.sessionStorage.getItem(storageKey);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as { state?: unknown; questionIndex?: unknown; activeOrder?: unknown };
    const state = typeof parsed.state === "string" && journeyStates.has(parsed.state as JourneyState) && canRestoreJourneyState(parsed.state as JourneyState, data)
      ? parsed.state as JourneyState
      : undefined;
    const questionIndex = typeof parsed.questionIndex === "number" && Number.isInteger(parsed.questionIndex) && parsed.questionIndex >= 0 && parsed.questionIndex < data.diagnostic.questions.length
      ? parsed.questionIndex
      : undefined;
    const activeOrder = typeof parsed.activeOrder === "number" && data.modules.some((module) => module.order === parsed.activeOrder)
      ? parsed.activeOrder
      : undefined;
    return { state, questionIndex, activeOrder };
  } catch {
    try { window.sessionStorage.removeItem(storageKey); } catch { /* Storage may be unavailable. */ }
    return null;
  }
}

function HydratedJourneyExperience({ data, onAnswer, onGenerate, onCompleteModule, onIllustrate, onRequestHelp }: JourneyExperienceProps) {
  const initialState = defaultJourneyState(data);
  const storageKey = `bridgeback:pupil-view:${data.assignment._id}`;
  const [savedView] = useState(() => readSavedJourneyView(storageKey, data));
  const [state, setState] = useState<JourneyState>(savedView?.state ?? initialState);
  const [questionIndex, setQuestionIndex] = useState(savedView?.questionIndex ?? Math.min(data.assignment.currentQuestion, data.diagnostic.questions.length - 1));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeOrder, setActiveOrder] = useState(savedView?.activeOrder ?? data.modules.find((module) => module.status !== "complete")?.order ?? 1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = data.diagnostic.questions;
  const target = data.graph?.nodes.find((node) => node.key === data.graph?.targetConceptKey) ?? data.graph?.nodes.at(-1);
  const totalMinutes = data.path?.totalMinutes ?? data.modules.reduce((total, module) => total + module.durationMinutes, 0);
  const activeModule = data.modules.find((module) => module.order === activeOrder) ?? data.modules.find((module) => module.status !== "complete") ?? data.modules[0];
  const renderedState = state === "generating" && data.modules.length > 0 ? "results" : state;

  useEffect(() => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify({ state, questionIndex, activeOrder }));
    } catch { /* Convex still holds submitted answers and completed modules. */ }
  }, [activeOrder, questionIndex, state, storageKey]);

  async function submitDiagnosticAnswer() {
    if (selectedIndex === null) return;
    const question = questions[questionIndex];
    setBusy(true);
    setError(null);
    try {
      const result = onAnswer
        ? await onAnswer(question.key, selectedIndex)
        : { isCorrect: diagnosticQuestions.find((item) => item.id === question.key)?.correctIndex === selectedIndex, complete: questionIndex === questions.length - 1 };
      setSelectedIndex(null);
      if (result.complete) {
        setState("generating");
        if (onGenerate) {
          try {
            await onGenerate();
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Your pathway is still being prepared");
          }
        } else setState("results");
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

  async function retryGeneration() {
    if (!onGenerate) return;
    setBusy(true);
    setError(null);
    try {
      await onGenerate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your pathway is still being prepared");
    } finally {
      setBusy(false);
    }
  }

  if (renderedState === "diagnostic") return <DiagnosticView question={questions[questionIndex]} questionIndex={questionIndex} questionCount={questions.length} selectedIndex={selectedIndex} busy={busy} error={error} onSelect={setSelectedIndex} onSubmit={() => void submitDiagnosticAnswer()} onBack={() => questionIndex === 0 ? setState("welcome") : setQuestionIndex((current) => current - 1)} />;
  if (renderedState === "generating") return <GeneratingView error={error} busy={busy} onRetry={() => void retryGeneration()} />;
  if (renderedState === "results") return <ResultsView modules={data.modules} totalMinutes={totalMinutes} onContinue={() => setState("lesson")} />;
  if (renderedState === "lesson" && activeModule) return <LessonView key={activeModule._id} module={activeModule} moduleCount={data.modules.length} helpRequested={data.helpRequests.some((request) => request.moduleId === activeModule._id && request.status === "open")} onRequestHelp={onRequestHelp ? () => onRequestHelp(activeModule._id) : undefined} onIllustrate={onIllustrate ? () => onIllustrate(activeModule._id) : undefined} onComplete={async (selected) => {
    setBusy(true); setError(null);
    try {
      const fallbackCorrectIndex = demoLearningModules.find((module) => module.id === activeModule._id)?.correctIndex;
      const result = onCompleteModule
        ? await onCompleteModule(activeModule._id, selected)
        : { isCorrect: selected === fallbackCorrectIndex, complete: activeOrder >= data.modules.length };
      if (!result.isCorrect) return { isCorrect: false };
      if (result.complete || activeOrder >= data.modules.length) setState("complete");
      else setActiveOrder((current) => current + 1);
      return { isCorrect: true };
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This step could not be saved");
      return { isCorrect: false };
    } finally { setBusy(false); }
  }} busy={busy} externalError={error} />;
  if (renderedState === "complete") return <CompleteView modules={data.modules} onReview={() => { setActiveOrder(1); setState("results"); }} onReplay={() => { setState("welcome"); setQuestionIndex(0); setSelectedIndex(null); setActiveOrder(1); }} />;
  return <WelcomeView pupilName={data.pupil.displayName} targetTitle={target?.title ?? "your next lesson"} targetDescription={target?.description ?? "We’ll focus only on the ideas that unlock what comes next."} questionCount={questions.length} onStart={() => setState("diagnostic")} />;
}

function WelcomeView({ pupilName, targetTitle, targetDescription, questionCount, onStart }: { pupilName: string; targetTitle: string; targetDescription: string; questionCount: number; onStart: () => void }) {
  return <div className="mx-auto max-w-6xl pb-10"><section className="grid min-h-[590px] overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-52px_rgba(20,60,45,0.35)] lg:grid-cols-[1.08fr_0.92fr]"><div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14"><div><Badge variant="secondary" className="mb-8"><HeartHandshake /> A gentle way back in</Badge><p className="mb-3 text-sm font-semibold text-primary">Welcome back, {pupilName}</p><h1 className="max-w-xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">You don&apos;t need to catch up on everything today.</h1><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">We&apos;ll check a few ideas that matter for your next lesson, then make a short plan just for you.</p></div><div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"><Button size="lg" className="h-11 px-5" onClick={onStart}>Start my check-in <ArrowRight /></Button><div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" /> About 6 minutes · {questionCount} questions</div></div></div><div className="relative min-h-96 overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10 lg:min-h-full"><div className="absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/15" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-sm font-medium opacity-70">Your next lesson</span><Avatar className="size-10 border border-primary-foreground/20"><AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">MI</AvatarFallback></Avatar></div><div className="my-10"><div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary shadow-xl"><Target className="size-7" /></div><p className="font-heading text-4xl font-semibold">{targetTitle}</p><p className="mt-3 max-w-sm leading-7 text-primary-foreground/65">{targetDescription}</p></div><div className="grid gap-2">{["No marks or grades", "Stop whenever you need", "Only the ideas that matter next"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] px-4 py-3 text-sm"><Check className="size-4 opacity-70" /> {item}</div>)}</div></div></div></section></div>;
}

function DiagnosticView({ question, questionIndex, questionCount, selectedIndex, busy, error, onSelect, onSubmit, onBack }: { question: PublicQuestion; questionIndex: number; questionCount: number; selectedIndex: number | null; busy: boolean; error: string | null; onSelect: (index: number) => void; onSubmit: () => void; onBack: () => void }) {
  return <div className="mx-auto max-w-3xl pb-10"><div className="mb-6 flex items-center justify-between gap-4"><Button variant="ghost" onClick={onBack}><ArrowLeft /> Back</Button><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="font-mono">{questionIndex + 1} / {questionCount}</span><div className="w-28 sm:w-44"><Progress value={((questionIndex + 1) / questionCount) * 100} className="[&_[data-slot=progress-track]]:h-1.5" /></div></div></div><Card className="min-h-[520px] justify-between"><CardHeader className="p-6 sm:p-9"><Badge variant="secondary" className="mb-5">{question.eyebrow}</Badge><CardTitle className="max-w-2xl font-heading text-2xl leading-tight sm:text-4xl">{question.prompt}</CardTitle><CardDescription className="mt-2">Choose the answer that feels right. It&apos;s okay not to know yet.</CardDescription></CardHeader><CardContent className="space-y-3 px-6 sm:px-9">{question.code ? <pre className="mb-5 overflow-x-auto rounded-xl border bg-foreground p-4 font-mono text-sm leading-6 text-background"><code>{question.code}</code></pre> : null}{question.options.map((option, index) => <button type="button" key={option} onClick={() => onSelect(index)} className={cn("flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-base", selectedIndex === index ? "border-primary bg-primary/[0.065] shadow-[0_0_0_1px_var(--primary)]" : "bg-background hover:border-primary/35 hover:bg-muted/35")}><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs", selectedIndex === index ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>{String.fromCharCode(65 + index)}</span>{option}</button>)}{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}</CardContent><CardFooter className="justify-between px-6 py-4 sm:px-9"><span className="hidden text-xs text-muted-foreground sm:block">Your answer helps shape your pathway.</span><Button disabled={selectedIndex === null || busy} onClick={onSubmit} className="ml-auto">{busy ? <LoaderCircle className="animate-spin" /> : null}{questionIndex === questionCount - 1 ? "Build my pathway" : "Next question"}<ArrowRight /></Button></CardFooter></Card></div>;
}

function GeneratingView({ error, busy, onRetry }: { error: string | null; busy: boolean; onRetry: () => void }) {
  return <div className="mx-auto max-w-3xl pb-10"><Card className="overflow-hidden text-center"><div className="bg-primary/[0.06] px-6 py-20"><div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="size-7 animate-pulse" /></div><h1 className="mt-7 font-heading text-4xl font-semibold">Finding your shortest path…</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">GPT‑5.6 is using your teacher&apos;s approved map and your answers to prepare no more than three focused steps.</p>{error ? <div className="mt-5"><p role="alert" className="text-sm text-destructive">The connection was interrupted while your pathway was being prepared.</p><Button className="mt-4" variant="outline" onClick={onRetry} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <RotateCcw />} Check again</Button></div> : <LoaderCircle className="mx-auto mt-8 size-5 animate-spin text-primary" />}</div></Card></div>;
}

function ResultsView({ modules, totalMinutes, onContinue }: { modules: LearningModule[]; totalMinutes: number; onContinue: () => void }) {
  return <div className="mx-auto max-w-5xl pb-10"><section className="mb-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]"><Card className="border-0 bg-primary text-primary-foreground ring-0"><CardHeader className="p-7 sm:p-9"><div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/12"><Sparkles className="size-5" /></div><p className="text-sm font-semibold opacity-70">Check-in complete</p><CardTitle className="mt-2 font-heading text-4xl leading-tight">Your next steps are ready.</CardTitle><CardDescription className="mt-3 text-primary-foreground/65">BridgeBack prepared {modules.length === 1 ? "one focused activity" : `${modules.length} focused activities`} from your check-in and the upcoming lesson. Nothing else has been added.</CardDescription></CardHeader></Card><Card><CardHeader className="p-7 sm:p-9"><Badge variant="secondary" className="mb-5">Your shortest path</Badge><CardTitle className="font-heading text-3xl">{modules.length} manageable {modules.length === 1 ? "step" : "steps"}</CardTitle><CardDescription className="mt-2 max-w-xl">Each step includes an explanation, a worked example and one quick check drawn from your teacher&apos;s lesson sources.</CardDescription></CardHeader><CardContent className="px-7 sm:px-9"><div className="relative space-y-1 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-border">{modules.map((module, index) => <div key={module._id} className="relative flex gap-4 py-3"><div className={cn("z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs", index === 0 && "border-primary bg-primary text-primary-foreground")}>{module.order}</div><div className="flex-1 pt-0.5"><p className="font-medium">{module.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{module.objective}</p></div><span className="pt-1 font-mono text-xs text-muted-foreground">{module.durationMinutes} min</span></div>)}</div></CardContent><CardFooter className="justify-between px-7 py-4 sm:px-9"><span className="text-xs text-muted-foreground">{totalMinutes} minutes total</span><Button onClick={onContinue}>{modules.every((module) => module.status === "complete") ? "Review step one" : "Begin step one"} <Play /></Button></CardFooter></Card></section></div>;
}

function LessonView({ module, moduleCount, onComplete, onIllustrate, onRequestHelp, helpRequested = false, busy, externalError }: { module: LearningModule; moduleCount: number; onComplete: (selected: number) => Promise<{ isCorrect: boolean }>; onIllustrate?: () => Promise<{ dataUrl: string; alt: string }>; onRequestHelp?: () => Promise<unknown>; helpRequested?: boolean; busy: boolean; externalError: string | null }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [illustration, setIllustration] = useState<{ dataUrl: string; alt: string } | null>(null);
  const [illustrating, setIllustrating] = useState(false);
  const [illustrationError, setIllustrationError] = useState<string | null>(null);
  const [helpSent, setHelpSent] = useState(helpRequested);
  const [sendingHelp, setSendingHelp] = useState(false);
  return <div className="mx-auto max-w-5xl pb-10"><div className="mb-6 flex items-center justify-between"><div><p className="text-sm font-semibold text-primary">Step {module.order} of {moduleCount}</p><p className="mt-1 font-heading text-2xl font-semibold">{module.title}</p></div><Badge variant="outline"><Clock3 /> {module.durationMinutes} min</Badge></div><div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader className="p-7 sm:p-9"><CardTitle className="font-heading text-3xl">{module.objective}</CardTitle><CardDescription className="mt-2 text-base leading-7">{module.explanation}</CardDescription></CardHeader><CardContent className="space-y-6 px-7 sm:px-9">{illustration ? <figure className="overflow-hidden rounded-2xl border bg-muted/25"><img src={illustration.dataUrl} alt={illustration.alt} className="aspect-square h-auto w-full object-cover sm:aspect-[16/10]" /><figcaption className="border-t px-4 py-3 text-xs leading-5 text-muted-foreground">AI-generated visual explanation. Use the written example and ask your teacher if anything is unclear.</figcaption></figure> : onIllustrate && module.order <= 2 ? <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed bg-primary/[0.035] p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 font-medium"><ImageIcon className="size-4 text-primary" /> Would a picture help?</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Create one simple visual for this activity. It may take up to a minute.</p>{illustrationError ? <p role="alert" className="mt-2 text-sm text-destructive">{illustrationError}</p> : null}</div><Button variant="outline" disabled={illustrating} onClick={async () => { setIllustrating(true); setIllustrationError(null); try { setIllustration(await onIllustrate()); } catch { setIllustrationError("The visual could not be created. You can continue with the written example."); } finally { setIllustrating(false); } }}>{illustrating ? <LoaderCircle className="animate-spin" /> : <Sparkles />} Create a visual</Button></div> : null}<div className="rounded-2xl border bg-muted/25 p-5"><p className="font-medium">{module.exampleTitle}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{module.exampleBody}</p></div><div><p className="font-heading text-xl font-semibold">Try a quick check</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{module.practicePrompt}</p><div className="mt-4 space-y-2">{module.practiceOptions.map((option, index) => <button type="button" key={option} onClick={() => { setSelected(index); setFeedback(null); }} className={cn("flex min-h-11 w-full items-center gap-3 rounded-xl border p-3 text-left text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50", selected === index ? "border-primary bg-primary/[0.06]" : "bg-background hover:bg-muted/30")}><span className="flex size-7 items-center justify-center rounded-full border font-mono text-xs">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{feedback ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{feedback}</div> : null}{externalError ? <p role="alert" className="mt-4 text-sm text-destructive">{externalError}</p> : null}</div></CardContent><CardFooter className="justify-end px-7 py-4 sm:px-9"><Button disabled={selected === null || busy} onClick={async () => { if (selected === null) return; const result = await onComplete(selected); if (!result.isCorrect) setFeedback(module.feedback); }}>{busy ? <LoaderCircle className="animate-spin" /> : null}Check and continue <ArrowRight /></Button></CardFooter></Card><div className="space-y-4"><Card className="bg-amber-50 text-amber-950 ring-amber-200"><CardHeader><div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-amber-100"><Lightbulb className="size-4" /></div><CardTitle>Why this matters</CardTitle><CardDescription className="text-amber-900/65">This is one of the minimum ideas needed to participate in the next lesson, not extra catch-up work.</CardDescription></CardHeader></Card><Card><CardHeader><CardTitle>Teacher-approved sources</CardTitle><CardDescription>Where this explanation came from.</CardDescription></CardHeader><CardContent className="space-y-2">{module.sourceRefs.map((source) => <div key={source} className="flex items-start gap-2 rounded-lg border p-3 text-sm"><BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />{source}</div>)}</CardContent></Card><Card><CardHeader><CardTitle>Need a person?</CardTitle><CardDescription>This preparation never replaces your teacher. Stop here and ask for help whenever you need it.</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full" disabled={!onRequestHelp || helpSent || sendingHelp} onClick={async () => { if (!onRequestHelp) return; setSendingHelp(true); try { await onRequestHelp(); setHelpSent(true); } finally { setSendingHelp(false); } }}>{sendingHelp ? <LoaderCircle className="animate-spin" /> : helpSent ? <Check /> : <HeartHandshake />}{helpSent ? "Help request sent" : "Ask my teacher for help"}</Button></CardContent></Card></div></div></div>;
}

function CompleteView({ modules, onReview, onReplay }: { modules: LearningModule[]; onReview: () => void; onReplay: () => void }) {
  return <div className="mx-auto max-w-3xl pb-10"><Card className="overflow-hidden text-center"><div className="bg-primary/[0.07] px-6 py-12 sm:px-10 sm:py-16"><div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><CheckCircle2 className="size-7" /></div><Badge variant="secondary" className="mb-5">Pathway complete</Badge><h1 className="mx-auto max-w-xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Your learning pathway is complete.</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">You completed all {modules.length} focused learning {modules.length === 1 ? "activity" : "activities"}. Ms Morgan sees the same completed pathway.</p><div className="mx-auto mt-8 max-w-lg space-y-2 text-left">{modules.map((module) => <div key={module._id} className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm"><CheckCircle2 className="size-4 shrink-0 text-primary" /><span className="font-medium">{module.title}</span></div>)}</div></div><Separator /><CardFooter className="flex-wrap justify-center gap-3 border-0 bg-background py-5"><Button variant="outline" onClick={onReview}><BookOpen /> Review learning materials</Button><Button variant="ghost" onClick={onReplay}><RotateCcw /> Restart check-in</Button><Button onClick={() => window.location.assign("/api/demo/sign-in/teacher")}>Show Ms Morgan <ArrowRight /></Button></CardFooter></Card></div>;
}

const fallbackAssignment: NonNullable<PupilAssignment> = {
  pupil: { displayName: demoPupil.name, initials: demoPupil.initials },
  assignment: { _id: "assignment-demo", status: "assigned", currentQuestion: 0 },
  diagnostic: { questions: diagnosticQuestions.map((question) => ({ key: question.id, conceptKey: question.conceptId, eyebrow: question.eyebrow, prompt: question.prompt, code: question.code, options: question.options })) },
  responses: [],
  graph: { targetConceptKey: "binary-search", nodes: [{ key: "binary-search", title: "Binary search", description: "Learn how computers find an item quickly by repeatedly cutting a sorted list in half." }] },
  path: { conceptKeys: demoLearningModules.map((module) => module.conceptId), totalMinutes: demoLearningModules.reduce((total, module) => total + module.durationMinutes, 0), status: "ready" },
  modules: demoLearningModules.map((module) => ({ _id: module.id, conceptKey: module.conceptId, order: module.order, title: module.title, objective: module.objective, explanation: module.explanation, exampleTitle: module.exampleTitle, exampleBody: module.exampleBody, practicePrompt: module.practicePrompt, practiceOptions: [...module.practiceOptions], feedback: module.feedback, durationMinutes: module.durationMinutes, sourceRefs: [...module.sourceRefs], status: module.order === 1 ? "ready" : "locked" })),
  helpRequests: [],
};
