"use client";

import { useMemo, useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
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
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  demoPupil,
  diagnosticQuestions,
  learningSteps,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { hasClerk, hasConvex } from "@/lib/config";

type JourneyState = "welcome" | "diagnostic" | "results" | "lesson" | "complete";

export function PupilJourney() {
  if (hasClerk && hasConvex) {
    return (
      <>
        <AuthLoading>
          <Card className="mx-auto max-w-3xl p-10 text-center text-sm text-muted-foreground">Connecting Mia&apos;s pathway…</Card>
        </AuthLoading>
        <Authenticated>
          <ConnectedPupilJourney />
        </Authenticated>
        <Unauthenticated>
          <Card className="mx-auto max-w-3xl p-10 text-center"><CardTitle>Session unavailable</CardTitle><CardDescription className="mt-2">Return to the start page and choose Mia&apos;s demo again.</CardDescription></Card>
        </Unauthenticated>
      </>
    );
  }
  return <JourneyExperience />;
}

type AssignmentData = {
  assignment: { _id: string; currentQuestion: number; status: string };
  responses: Array<{ questionKey: string; selectedIndex: number }>;
} | null;

const currentAssignmentRef = makeFunctionReference<
  "query",
  Record<string, never>,
  AssignmentData
>("pupil:currentAssignment");
const submitAnswerRef = makeFunctionReference<
  "mutation",
  { assignmentId: string; questionKey: string; selectedIndex: number },
  { isCorrect: boolean; complete: boolean }
>("pupil:submitAnswer");

function ConnectedPupilJourney() {
  const data = useQuery(currentAssignmentRef, {});
  const submitAnswer = useMutation(submitAnswerRef);
  if (data === undefined) {
    return <Card className="mx-auto max-w-3xl p-10 text-center text-sm text-muted-foreground">Loading Mia&apos;s saved pathway…</Card>;
  }
  if (!data) {
    return <Card className="mx-auto max-w-3xl p-10 text-center"><CardTitle>No pathway assigned yet</CardTitle><CardDescription className="mt-2">Ms Morgan can assign a diagnostic from the teacher view.</CardDescription></Card>;
  }
  const initialAnswers = Object.fromEntries(
    data.responses.map((response) => [response.questionKey, response.selectedIndex]),
  );
  return (
    <JourneyExperience
      key={data.assignment._id}
      initialAnswers={initialAnswers}
      initialQuestionIndex={data.assignment.currentQuestion}
      onAnswer={(questionKey, selectedIndex) =>
        submitAnswer({ assignmentId: data.assignment._id, questionKey, selectedIndex })
      }
    />
  );
}

function JourneyExperience({
  initialAnswers = {},
  initialQuestionIndex = 0,
  onAnswer,
}: {
  initialAnswers?: Record<string, number>;
  initialQuestionIndex?: number;
  onAnswer?: (questionKey: string, selectedIndex: number) => Promise<unknown>;
}) {
  const [journeyState, setJourneyState] = useState<JourneyState>(
    Object.keys(initialAnswers).length === diagnosticQuestions.length ? "results" : "welcome",
  );
  const [questionIndex, setQuestionIndex] = useState(initialQuestionIndex);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);

  const question = diagnosticQuestions[questionIndex];
  const score = useMemo(
    () =>
      diagnosticQuestions.filter(
        (item) => answers[item.id] === item.correctIndex,
      ).length,
    [answers],
  );

  function resetJourney() {
    setJourneyState("welcome");
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswers({});
  }

  function submitAnswer() {
    if (selectedIndex === null) return;

    setAnswers((current) => ({ ...current, [question.id]: selectedIndex }));
    void onAnswer?.(question.id, selectedIndex);

    if (questionIndex === diagnosticQuestions.length - 1) {
      setJourneyState("results");
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedIndex(null);
  }

  if (journeyState === "diagnostic") {
    return (
      <DiagnosticView
        questionIndex={questionIndex}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onSubmit={submitAnswer}
        onBack={() => {
          if (questionIndex === 0) setJourneyState("welcome");
          else {
            setQuestionIndex((current) => current - 1);
            setSelectedIndex(
              answers[diagnosticQuestions[questionIndex - 1].id] ?? null,
            );
          }
        }}
      />
    );
  }

  if (journeyState === "results") {
    return <ResultsView score={score} onContinue={() => setJourneyState("lesson")} />;
  }

  if (journeyState === "lesson") {
    return <LessonView onComplete={() => setJourneyState("complete")} />;
  }

  if (journeyState === "complete") {
    return <CompleteView onReset={resetJourney} />;
  }

  return <WelcomeView onStart={() => setJourneyState("diagnostic")} />;
}

function WelcomeView({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-6xl pb-10">
      <section className="grid min-h-[590px] overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-52px_rgba(20,60,45,0.35)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div>
            <Badge variant="secondary" className="mb-8">
              <HeartHandshake data-icon="inline-start" /> A gentle way back in
            </Badge>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Welcome back, {demoPupil.name}
            </p>
            <h1 className="max-w-xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              You don&apos;t need to catch up on everything today.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              We&apos;ll check a few ideas that matter for your next computer
              science lesson, then make a short plan just for you.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Button size="lg" className="h-11 px-5" onClick={onStart}>
              Start my check-in <ArrowRight data-icon="inline-end" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="size-4" /> About 6 minutes · 4 questions
            </div>
          </div>
        </div>

        <div className="relative min-h-96 overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10 lg:min-h-full">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/15" />
          <div className="absolute -right-8 -top-8 size-48 rounded-full border border-primary-foreground/15" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.16em] opacity-60">
                Your next lesson
              </span>
              <Avatar className="size-10 border border-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                  {demoPupil.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="my-10">
              <div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary shadow-xl">
                <Target className="size-7" />
              </div>
              <p className="font-heading text-4xl font-semibold">Binary search</p>
              <p className="mt-3 max-w-sm leading-7 text-primary-foreground/65">
                Learn how computers find an item quickly by repeatedly cutting a
                sorted list in half.
              </p>
            </div>

            <div className="grid gap-2">
              {[
                "No marks or grades",
                "Stop whenever you need",
                "Only the ideas that matter next",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] px-4 py-3 text-sm"
                >
                  <Check className="size-4 opacity-70" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DiagnosticView({
  questionIndex,
  selectedIndex,
  onSelect,
  onSubmit,
  onBack,
}: {
  questionIndex: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const question = diagnosticQuestions[questionIndex];
  const progress = ((questionIndex + 1) / diagnosticQuestions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" /> Back
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">
            {questionIndex + 1} / {diagnosticQuestions.length}
          </span>
          <div className="w-28 sm:w-44">
            <Progress value={progress} className="[&_[data-slot=progress-track]]:h-1.5" />
          </div>
        </div>
      </div>

      <Card className="min-h-[520px] justify-between">
        <CardHeader className="p-6 sm:p-9">
          <Badge variant="secondary" className="mb-5">
            {question.eyebrow}
          </Badge>
          <CardTitle className="max-w-2xl font-heading text-2xl leading-tight sm:text-4xl">
            {question.prompt}
          </CardTitle>
          <CardDescription className="mt-2">
            Choose the answer that feels right. It&apos;s okay not to know yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-6 sm:px-9">
          {question.code ? (
            <pre className="mb-5 overflow-x-auto rounded-xl border bg-foreground p-4 font-mono text-sm leading-6 text-background">
              <code>{question.code}</code>
            </pre>
          ) : null}
          {question.options.map((option, index) => (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(index)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border p-4 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-base",
                selectedIndex === index
                  ? "border-primary bg-primary/[0.065] shadow-[0_0_0_1px_var(--primary)]"
                  : "bg-background hover:border-primary/35 hover:bg-muted/35",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                  selectedIndex === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </CardContent>
        <CardFooter className="justify-between px-6 py-4 sm:px-9">
          <span className="hidden text-xs text-muted-foreground sm:block">
            Your answer helps shape your pathway.
          </span>
          <Button disabled={selectedIndex === null} onClick={onSubmit} className="ml-auto">
            {questionIndex === diagnosticQuestions.length - 1
              ? "Build my pathway"
              : "Next question"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ResultsView({ score, onContinue }: { score: number; onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-5xl pb-10">
      <section className="mb-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <Card className="border-0 bg-primary text-primary-foreground ring-0">
          <CardHeader className="p-7 sm:p-9">
            <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/12">
              <Sparkles className="size-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-60">
              Check-in complete
            </p>
            <CardTitle className="mt-2 font-heading text-4xl leading-tight">
              You already know more than you might think.
            </CardTitle>
            <CardDescription className="mt-3 text-primary-foreground/65">
              You showed secure understanding in {Math.max(score, 2)} of the four
              ideas we checked.
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-primary-foreground/15 bg-primary-foreground/[0.07] p-6 sm:px-9">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="size-5" /> Arrays and comparisons are secure
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="p-7 sm:p-9">
            <Badge variant="secondary" className="mb-5">Your shortest path</Badge>
            <CardTitle className="font-heading text-3xl">Three small steps</CardTitle>
            <CardDescription className="mt-2 max-w-xl">
              We skipped the ten resources you don&apos;t need right now and focused
              on the two ideas that unlock binary search.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-7 sm:px-9">
            <div className="relative space-y-1 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-border">
              {learningSteps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 py-3">
                  <div
                    className={cn(
                      "z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs",
                      index === 0 && "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {step.order}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-medium">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <span className="pt-1 font-mono text-xs text-muted-foreground">
                    {step.duration} min
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between px-7 py-4 sm:px-9">
            <span className="text-xs text-muted-foreground">17 minutes total</span>
            <Button onClick={onContinue}>
              Begin step one <Play data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}

function LessonView({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Step 1 of 3
          </p>
          <p className="mt-1 font-heading text-2xl font-semibold">Loops that narrow a search</p>
        </div>
        <Badge variant="outline"><Clock3 data-icon="inline-start" /> 6 min</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="p-7 sm:p-9">
            <CardTitle className="font-heading text-3xl">Think of a number line.</CardTitle>
            <CardDescription className="mt-2 text-base leading-7">
              Binary search does not check every item. It keeps a lower and upper
              boundary, checks the middle, then throws half the remaining list away.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-7 sm:px-9">
            <div className="rounded-2xl border bg-muted/25 p-5 sm:p-7">
              <div className="grid grid-cols-7 gap-1.5">
                {[3, 7, 12, 18, 25, 31, 46].map((number) => (
                  <div
                    key={number}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg border bg-background font-mono text-sm",
                      number === 18 && "border-primary bg-primary text-primary-foreground shadow-lg",
                    )}
                  >
                    {number}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-7 text-center font-mono text-[10px] text-muted-foreground">
                <span>low</span><span /><span /><span className="text-primary">middle</span><span /><span /><span>high</span>
              </div>
            </div>

            <div className="mt-7 space-y-5 text-sm leading-7 sm:text-base">
              <p>
                The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">while</code> loop
                repeats while <strong>low is not beyond high</strong>. Each repeat
                checks a new middle value.
              </p>
              <pre className="overflow-x-auto rounded-xl bg-foreground p-5 font-mono text-sm leading-7 text-background">
                <code>{"while low <= high:\n    middle = (low + high) // 2\n    check(items[middle])"}</code>
              </pre>
            </div>
          </CardContent>
          <CardFooter className="justify-end px-7 py-4 sm:px-9">
            <Button onClick={onComplete}>
              I understand the loop <ArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="bg-amber-50 text-amber-950 ring-amber-200">
            <CardHeader>
              <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-amber-100">
                <Lightbulb className="size-4" />
              </div>
              <CardTitle>Why this matters</CardTitle>
              <CardDescription className="text-amber-900/65">
                Without the loop, binary search would check the middle only once
                and stop too early.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your pathway</CardTitle>
              <CardDescription>One idea at a time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <span className={cn("flex size-7 items-center justify-center rounded-full border font-mono text-xs", index === 0 && "border-primary bg-primary text-primary-foreground")}>{step.order}</span>
                  <span className={cn("text-sm", index > 0 && "text-muted-foreground")}>{step.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CompleteView({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl pb-10">
      <Card className="overflow-hidden text-center">
        <div className="bg-primary/[0.07] px-6 py-14 sm:py-20">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_15px_40px_-18px_var(--primary)]">
            <CheckCircle2 className="size-7" />
          </div>
          <Badge variant="secondary" className="mb-5">First step complete</Badge>
          <h1 className="mx-auto max-w-xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            You&apos;re one step closer to tomorrow&apos;s lesson.
          </h1>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">
            Your teacher can see that you&apos;ve practised iteration. Next up:
            following the boundaries in a trace table.
          </p>
        </div>
        <Separator />
        <CardFooter className="justify-center gap-3 border-0 bg-background py-5">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw data-icon="inline-start" /> Replay demo
          </Button>
          <Button>
            Continue pathway <BookOpen data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
