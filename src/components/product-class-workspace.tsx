"use client";

import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { ArrowLeft, BookOpenCheck, CalendarDays, ExternalLink, LoaderCircle, LockKeyhole, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hasClerk, hasConvex } from "@/lib/config";
import type { CurriculumPack } from "@/lib/curriculum-catalog";

type ClassWorkspace = {
  classRecord: { _id: string; name: string; subject: string; yearGroup: string; curriculumKey?: string };
  upcomingLesson: { _id: string; title: string; startsAt: number; objectives: string[]; curriculumTopicCode?: string } | null;
  lessonCount: number;
  curriculum: CurriculumPack | null;
} | null;

const workspaceRef = makeFunctionReference<"query", { classId: string }, ClassWorkspace>("product:classWorkspace");
const createLessonRef = makeFunctionReference<"mutation", { classId: string; title: string; objectives: string[]; startsAt: number; curriculumTopicCode?: string }, string>("product:createLesson");

export function ProductClassWorkspace({ classId }: { classId: string }) {
  if (!hasClerk || !hasConvex) return <WorkspaceNotice title="Connect the school workspace">Add Clerk and Convex credentials to create and analyse a school lesson. The guided demo remains available without credentials.</WorkspaceNotice>;
  return <><AuthLoading><WorkspaceNotice title="Opening the class">Checking your school access.</WorkspaceNotice></AuthLoading><Unauthenticated><WorkspaceNotice title="Sign in to continue">This class belongs to a protected school workspace.</WorkspaceNotice></Unauthenticated><Authenticated><ConnectedClassWorkspace classId={classId} /></Authenticated></>;
}

function ConnectedClassWorkspace({ classId }: { classId: string }) {
  const data = useQuery(workspaceRef, { classId });
  const createLesson = useMutation(createLessonRef);
  const [title, setTitle] = useState("");
  const [objectives, setObjectives] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [topicCode, setTopicCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (data === undefined) return <WorkspaceNotice title="Opening the class">Loading lessons and source materials.</WorkspaceNotice>;
  if (!data) return <WorkspaceNotice title="Class unavailable">The class could not be found in your school workspace.</WorkspaceNotice>;

  if (data.upcomingLesson) {
    return <WorkspaceFrame className={data.classRecord.name}><main className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8"><TeacherDashboard classId={classId} mode="school" /></main></WorkspaceFrame>;
  }

  async function submitLesson() {
    const parsedDate = Date.parse(startsAt);
    if (!Number.isFinite(parsedDate)) { setError("Choose when the lesson begins."); return; }
    setBusy(true); setError(null);
    try {
      await createLesson({ classId, title, objectives: objectives.split("\n").map((item) => item.trim()).filter(Boolean), startsAt: parsedDate, curriculumTopicCode: topicCode || undefined });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The lesson could not be created.");
    } finally { setBusy(false); }
  }

  const selectableTopics = data.curriculum?.topics.filter((item) => item.kind === "topic") ?? [];
  const selectedTopic = selectableTopics.find((item) => item.code === topicCode);

  return (
    <WorkspaceFrame className={data.classRecord.name}>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="size-4" /> {data.classRecord.yearGroup} · {data.classRecord.subject}</p>
            <h1 className="mt-5 max-w-xl font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Start with the lesson pupils need to join.</h1>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">BridgeBack works backwards from this destination. Add the objective now, then upload the source materials you already teach from.</p>
            {data.curriculum ? <CurriculumSummary curriculum={data.curriculum} /> : <div className="mt-8 rounded-xl border bg-card p-4 text-sm leading-6 text-muted-foreground"><BookOpenCheck className="mb-3 size-5 text-primary" />This class uses a custom curriculum. Your objectives and source files will ground the prerequisite map.</div>}
          </div>
          <Card className="rounded-2xl">
            <CardHeader className="p-6 sm:p-8"><CardTitle className="text-2xl">Create the upcoming lesson</CardTitle><CardDescription className="mt-2">Choose the curriculum destination, then adjust the objective to match the lesson pupils will join.</CardDescription></CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
              {error ? <p role="alert" className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
              {data.curriculum ? <Field label="Specification topic" htmlFor="lesson-topic"><select id="lesson-topic" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" value={topicCode} onChange={(event) => { const code = event.target.value; setTopicCode(code); const next = selectableTopics.find((item) => item.code === code); if (next) { setTitle(next.title); setObjectives(next.summary); } }}><option value="">Choose a topic</option>{data.curriculum.topics.filter((item) => item.kind === "strand").map((group) => <optgroup key={group.code} label={`${group.code} ${group.title}`}>{selectableTopics.filter((item) => item.parentCode === group.code).map((item) => <option key={item.code} value={item.code}>{item.code} · {item.title}</option>)}</optgroup>)}</select></Field> : null}
              {selectedTopic ? <div className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4"><p className="text-xs font-semibold text-primary">{selectedTopic.component} · {selectedTopic.code}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedTopic.summary}</p>{selectedTopic.prerequisiteCodes.length ? <p className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Likely earlier knowledge:</span> {selectedTopic.prerequisiteCodes.join(", ")}</p> : null}</div> : null}
              <Field label="Lesson title" htmlFor="lesson-title"><Input id="lesson-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Binary search" maxLength={120} /></Field>
              <Field label="Learning objectives, one per line" htmlFor="lesson-objectives"><Textarea id="lesson-objectives" value={objectives} onChange={(event) => setObjectives(event.target.value)} placeholder={"Explain why binary search needs sorted data\nTrace low, high and middle"} rows={5} maxLength={1100} /></Field>
              <Field label="Lesson date and time" htmlFor="lesson-start"><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="lesson-start" type="datetime-local" className="pl-9" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} /></div></Field>
              <Button className="h-11 w-full" disabled={busy || !title.trim() || !objectives.trim() || !startsAt} onClick={() => void submitLesson()}>{busy ? <LoaderCircle className="animate-spin" /> : <Plus />} Create lesson and add sources</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </WorkspaceFrame>
  );
}

function CurriculumSummary({ curriculum }: { curriculum: CurriculumPack }) {
  const lessonTopics = curriculum.topics.filter((item) => item.kind === "topic");
  const strands = curriculum.topics.filter((item) => item.kind === "strand");
  return <div className="mt-8 overflow-hidden rounded-xl border bg-card"><div className="p-5"><p className="text-xs font-semibold text-primary">OCR {curriculum.specificationCode} · Version {curriculum.version}</p><h2 className="mt-2 font-heading text-lg font-semibold">Curriculum connected</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{strands.length} areas and {lessonTopics.length} lesson-level topics are available for planning.</p><a href={curriculum.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">View the OCR specification <ExternalLink className="size-3.5" /></a></div><div className="grid grid-cols-2 border-t bg-muted/25"><div className="p-4"><p className="font-heading text-2xl font-semibold">{strands.length}</p><p className="mt-1 text-xs text-muted-foreground">curriculum areas</p></div><div className="border-l p-4"><p className="font-heading text-2xl font-semibold">{lessonTopics.length}</p><p className="mt-1 text-xs text-muted-foreground">selectable topics</p></div></div></div>;
}

function WorkspaceFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className="min-h-[100dvh] bg-muted/20"><header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl"><div className="mx-auto flex h-[4.5rem] max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3" aria-label="BridgeBack home"><BridgeBackMark /><span className="font-heading text-sm font-semibold">BridgeBack</span></Link>{className ? <span className="hidden border-l pl-4 text-sm text-muted-foreground sm:block">{className}</span> : null}<Button nativeButton={false} render={<Link href="/app" />} variant="ghost" size="sm" className="ml-auto"><ArrowLeft /> Classes</Button></div></header>{children}</div>;
}

function WorkspaceNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return <WorkspaceFrame><main className="grid min-h-[calc(100dvh-4.5rem)] place-items-center p-6"><div className="max-w-md text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div><h1 className="mt-6 font-heading text-3xl font-semibold">{title}</h1><p className="mt-3 leading-7 text-muted-foreground">{children}</p></div></main></WorkspaceFrame>;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={htmlFor}>{label}</Label>{children}</div>;
}
