"use client";

import { useMemo, useRef, useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useAction, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  Check,
  FileStack,
  FileText,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { ConceptMap, type ConceptMapItem, type ConceptMapLink, type ConceptReadiness } from "@/components/concept-map";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { concepts, recentResources } from "@/lib/demo-data";
import { hasClerk, hasConvex } from "@/lib/config";

type Graph = {
  _id: string;
  status: "draft" | "approved";
  targetConceptKey?: string;
  nodes: ConceptMapItem[];
  edges: ConceptMapLink[];
};

type TeacherOverview = {
  classRecord: { _id: string; name: string; subject: string; yearGroup: string };
  lesson: { _id: string; title: string; objectives: string[]; analysisStatus: "not_started" | "processing" | "ready" | "failed" } | null;
  graph: Graph | null;
  resources: Array<{ name: string; mediaType: string; pageCount?: number; status: "uploaded" | "analysed" | "current" }>;
  diagnostic: { _id: string; questions: Array<{ key: string; conceptKey: string }> } | null;
  pupilCount: number;
  pupil: { displayName: string; initials: string } | null;
  assignment: { _id: string; status: "assigned" | "in_progress" | "path_ready" | "complete" } | null;
  responses: Array<{ conceptKey: string; isCorrect: boolean }>;
  path: { conceptKeys: string[]; totalMinutes?: number; status: "ready" | "in_progress" | "complete" } | null;
  modules: Array<{ status: "locked" | "ready" | "complete"; durationMinutes: number }>;
  latestRun: { model: string; job: string; status: string; latencyMs?: number; inputTokens?: number; outputTokens?: number } | null;
} | null;

type DraftGraph = { targetConceptKey: string; nodes: ConceptMapItem[]; edges: ConceptMapLink[] };

const overviewRef = makeFunctionReference<"query", Record<string, never>, TeacherOverview>("teacher:overview");
const uploadUrlRef = makeFunctionReference<"mutation", Record<string, never>, string>("teacher:generateUploadUrl");
const addResourceRef = makeFunctionReference<"mutation", { classId: string; lessonId: string; storageId: string; name: string; mediaType: string }, string>("teacher:addResource");
const updateGraphRef = makeFunctionReference<"mutation", { graphId: string } & DraftGraph, null>("teacher:updateGraph");
const approveGraphRef = makeFunctionReference<"mutation", { graphId: string }, null>("teacher:approveGraph");
const analyseLessonRef = makeFunctionReference<"action", { lessonId: string }, { graphId: string }>("analyseLesson:conceptGraph");
const diagnosticRef = makeFunctionReference<"action", { graphId: string }, { assignmentId: string }>("analyseLesson:diagnostic");
const resetAssignmentRef = makeFunctionReference<"mutation", { assignmentId: string }, null>("teacher:resetSyntheticAssignment");

export function TeacherDashboard() {
  if (hasClerk && hasConvex) {
    return (
      <>
        <AuthLoading><LoadingCard>Connecting the class workspace…</LoadingCard></AuthLoading>
        <Authenticated><ConnectedTeacherDashboard /></Authenticated>
        <Unauthenticated><LoadingCard title="Session unavailable">Return to the start page and choose the teacher demo again.</LoadingCard></Unauthenticated>
      </>
    );
  }
  return <TeacherExperience overview={fallbackOverview} />;
}

function LoadingCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Card className="p-10 text-center">{title ? <CardTitle>{title}</CardTitle> : null}<CardDescription className={title ? "mt-2" : ""}>{children}</CardDescription></Card>;
}

function ConnectedTeacherDashboard() {
  const overview = useQuery(overviewRef, {});
  if (overview === undefined) return <LoadingCard>Loading the class workspace…</LoadingCard>;
  if (!overview?.lesson) return <LoadingCard title="No upcoming lesson">Seed the synthetic class to begin the judge flow.</LoadingCard>;
  return <ConnectedTeacherWorkspace key={overview.graph?._id ?? "no-graph"} overview={overview} />;
}

function ConnectedTeacherWorkspace({ overview }: { overview: NonNullable<TeacherOverview> }) {
  const generateUploadUrl = useMutation(uploadUrlRef);
  const addResource = useMutation(addResourceRef);
  const updateGraph = useMutation(updateGraphRef);
  const approveGraph = useMutation(approveGraphRef);
  const resetAssignment = useMutation(resetAssignmentRef);
  const analyseLesson = useAction(analyseLessonRef);
  const generateDiagnostic = useAction(diagnosticRef);
  const [busy, setBusy] = useState<"upload" | "analyse" | "save" | "assign" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftGraph | null>(() => overview.graph ? ({
    targetConceptKey: overview.graph.targetConceptKey ?? overview.graph.nodes.at(-1)?.key ?? "target",
    nodes: overview.graph.nodes,
    edges: overview.graph.edges,
  }) : null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const currentOverview = overview;
  const currentLesson = overview.lesson!;

  async function run(label: NonNullable<typeof busy>, operation: () => Promise<unknown>) {
    setBusy(label);
    setError(null);
    try {
      await operation();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function upload(file: File) {
    if (file.size > 15 * 1024 * 1024) {
      setError("Keep each lesson file under 15 MB for this demonstration.");
      return;
    }
    await run("upload", async () => {
      const url = await generateUploadUrl({});
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
      if (!response.ok) throw new Error("The lesson file could not be uploaded");
      const { storageId } = await response.json() as { storageId: string };
      await addResource({ classId: currentOverview.classRecord._id, lessonId: currentLesson._id, storageId, name: file.name, mediaType: file.type || "application/octet-stream" });
    });
  }

  async function saveDraft() {
    if (!currentOverview.graph || !draft) return;
    await updateGraph({ graphId: currentOverview.graph._id, ...draft });
    setDirty(false);
  }

  async function approveAndAssign() {
    if (!currentOverview.graph || !draft) return;
    const graphId = currentOverview.graph._id;
    await run("assign", async () => {
      if (currentOverview.graph?.status === "draft") {
        if (dirty) await updateGraph({ graphId, ...draft });
        await approveGraph({ graphId });
      }
      await generateDiagnostic({ graphId });
      setDirty(false);
    });
  }

  return (
    <TeacherExperience
      overview={currentOverview}
      draft={draft}
      selectedKey={selectedKey}
      busy={busy}
      error={error}
      dirty={dirty}
      onUpload={upload}
      onAnalyse={() => run("analyse", () => analyseLesson({ lessonId: currentLesson._id }))}
      onSave={() => run("save", saveDraft)}
      onApproveAndAssign={approveAndAssign}
      onReset={() => currentOverview.assignment ? run("reset", () => resetAssignment({ assignmentId: currentOverview.assignment!._id })) : Promise.resolve()}
      onSelect={setSelectedKey}
      onDraftChange={(next) => { setDraft(next); setDirty(true); }}
    />
  );
}

function TeacherExperience({
  overview,
  draft,
  selectedKey,
  busy = null,
  error,
  dirty = false,
  onUpload,
  onAnalyse,
  onSave,
  onApproveAndAssign,
  onReset,
  onSelect,
  onDraftChange,
}: {
  overview: NonNullable<TeacherOverview>;
  draft?: DraftGraph | null;
  selectedKey?: string | null;
  busy?: "upload" | "analyse" | "save" | "assign" | "reset" | null;
  error?: string | null;
  dirty?: boolean;
  onUpload?: (file: File) => Promise<void>;
  onAnalyse?: () => Promise<unknown> | void;
  onSave?: () => Promise<unknown> | void;
  onApproveAndAssign?: () => Promise<unknown> | void;
  onReset?: () => Promise<unknown> | void;
  onSelect?: (key: string | null) => void;
  onDraftChange?: (draft: DraftGraph) => void;
}) {
  const uploadInput = useRef<HTMLInputElement>(null);
  const graph = draft ?? (overview.graph ? {
    targetConceptKey: overview.graph.targetConceptKey ?? overview.graph.nodes.at(-1)?.key ?? "binary-search",
    nodes: overview.graph.nodes,
    edges: overview.graph.edges,
  } : null);
  const readiness = useMemo(() => {
    const states: Record<string, ConceptReadiness> = {};
    for (const response of overview.responses) {
      if (!response.isCorrect) states[response.conceptKey] = "support";
      else if (!states[response.conceptKey]) states[response.conceptKey] = "secure";
    }
    return states;
  }, [overview.responses]);
  const incorrectConcepts = new Set(overview.responses.filter((response) => !response.isCorrect).map((response) => response.conceptKey));
  const answered = overview.responses.length;
  const questionCount = overview.diagnostic?.questions.length ?? 0;
  const readinessPercent = questionCount ? Math.round((overview.responses.filter((response) => response.isCorrect).length / questionCount) * 100) : 0;
  const totalMinutes = overview.path?.totalMinutes ?? overview.modules.reduce((total, module) => total + module.durationMinutes, 0);
  const selected = graph?.nodes.find((node) => node.key === selectedKey) ?? null;
  const canEdit = overview.graph?.status === "draft" && Boolean(onDraftChange && graph);
  const assigned = Boolean(overview.assignment);
  const pathwayComplete = overview.assignment?.status === "complete";
  const displayedReadiness = pathwayComplete ? 100 : readinessPercent;
  const analysisLabel = overview.lesson?.analysisStatus === "processing" || busy === "analyse"
    ? "GPT‑5.6 is analysing"
    : overview.graph
      ? overview.graph.status === "approved" ? "Teacher-approved pathway" : "AI draft ready for review"
      : "Ready for lesson analysis";

  function updateSelected(patch: Partial<ConceptMapItem>) {
    if (!graph || !selected || !onDraftChange) return;
    onDraftChange({ ...graph, nodes: graph.nodes.map((node) => node.key === selected.key ? { ...node, ...patch } : node) });
  }

  function setPrerequisite(source: string, enabled: boolean) {
    if (!graph || !selected || !onDraftChange) return;
    const without = graph.edges.filter((edge) => !(edge.source === source && edge.target === selected.key));
    onDraftChange({ ...graph, edges: enabled ? [...without, { source, target: selected.key }] : without });
  }

  function addConcept() {
    if (!graph || !onDraftChange) return;
    const key = `teacher-concept-${graph.nodes.length + 1}`;
    onDraftChange({
      ...graph,
      nodes: [...graph.nodes, { key, title: "New concept", description: "Describe what pupils need to understand.", sourceRef: "Teacher-added", x: 100, y: graph.nodes.length * 60 }],
    });
    onSelect?.(key);
  }

  return (
    <div className="space-y-6 pb-10">
      {error ? <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><div><p className="font-medium">That step did not complete</p><p className="mt-1 text-destructive/80">{error}</p></div></div> : null}

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="relative min-h-64 overflow-hidden border-0 bg-foreground text-background ring-0">
          <div className="absolute -right-14 -top-24 size-64 rounded-full border border-background/10" />
          <CardHeader className="relative max-w-2xl p-6 sm:p-8">
            <Badge className="mb-6 bg-background/10 text-background hover:bg-background/10"><Sparkles /> {analysisLabel}</Badge>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-background/55">{overview.classRecord.yearGroup} · {overview.classRecord.subject}</p>
            <h1 className="mt-2 max-w-xl font-heading text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Make tomorrow&apos;s lesson feel possible.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-background/65 sm:text-base">BridgeBack finds the smallest set of ideas pupils need before your class begins {overview.lesson?.title.toLowerCase()}.</p>
          </CardHeader>
          <CardFooter className="relative mt-auto border-background/10 bg-background/5 px-6 py-4 sm:px-8">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-background/60"><FileStack className="size-4" />{overview.resources.length} resources · 1 upcoming lesson</div>
              {overview.graph ? <Button nativeButton={false} render={<a href="#concept-map" />} className="bg-background text-foreground hover:bg-background/90">Review pathway <ArrowRight /></Button> : <Button onClick={() => void onAnalyse?.()} disabled={!onAnalyse || busy !== null} className="bg-background text-foreground hover:bg-background/90">{busy === "analyse" ? <LoaderCircle className="animate-spin" /> : <Sparkles />} Analyse with GPT‑5.6</Button>}
            </div>
          </CardFooter>
        </Card>

        <Card className="justify-between bg-primary/[0.065]">
          <CardHeader><CardDescription>Re-entry status</CardDescription><CardTitle className="font-heading text-3xl">{pathwayComplete ? "Ready for class" : answered ? `${readinessPercent}% diagnostic` : "Not checked yet"}</CardTitle><CardAction><div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><BookOpenCheck className="size-4" /></div></CardAction></CardHeader>
          <CardContent><Progress value={displayedReadiness} className="[&_[data-slot=progress-track]]:h-2" /><p className="mt-3 text-sm leading-6 text-muted-foreground">{pathwayComplete ? `Mia completed her ${totalMinutes}-minute pathway and is ready to rejoin the lesson.` : assigned ? `${answered} of ${questionCount} diagnostic questions answered.` : "Approve the map to create and assign Mia’s diagnostic."}</p></CardContent>
          <CardFooter><Badge variant="outline">{overview.assignment?.status?.replace("_", " ") ?? "Awaiting assignment"}</Badge></CardFooter>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [String(Math.max(0, (graph?.nodes.length ?? 1) - 1)), "prerequisites identified", overview.graph ? "Grounded in lesson resources" : "Analysis has not run"],
          [String(incorrectConcepts.size), "concept gaps found", answered ? "From Mia’s diagnostic" : "Awaiting Mia’s check-in"],
          [totalMinutes ? `${totalMinutes} min` : "—", "recommended pathway", overview.path ? `Across ${overview.path.conceptKeys.length} focused steps` : "Generated after the diagnostic"],
        ].map(([value, label, detail]) => <Card key={label} size="sm"><CardHeader><CardTitle className="font-mono text-2xl font-semibold">{value}</CardTitle><CardDescription>{label}</CardDescription></CardHeader><CardFooter className="border-0 bg-transparent pt-0 text-xs text-muted-foreground">{detail}</CardFooter></Card>)}
      </section>

      <Card id="concept-map">
        <CardHeader className="border-b">
          <div><div className="mb-2 flex items-center gap-2"><Badge variant="secondary">Teacher review</Badge><span className="text-xs text-muted-foreground">{overview.graph ? `GPT‑5.6 ${overview.graph.status}` : "Not generated"}</span></div><CardTitle className="font-heading text-xl">Concept dependency map</CardTitle><CardDescription className="mt-1 max-w-2xl">Every prerequisite is source-labelled. Review and edit the draft before assigning anything to Mia.</CardDescription></div>
          <CardAction className="flex flex-wrap gap-2">
            {canEdit ? <Button variant="outline" onClick={addConcept}><Plus /> Add concept</Button> : null}
            {canEdit ? <Button variant="outline" onClick={() => void onSave?.()} disabled={!dirty || busy !== null}>{busy === "save" ? <LoaderCircle className="animate-spin" /> : <Save />} Save draft</Button> : null}
            <Button onClick={() => void onApproveAndAssign?.()} disabled={!overview.graph || assigned || busy !== null || !onApproveAndAssign}>{busy === "assign" ? <LoaderCircle className="animate-spin" /> : <Check />}{assigned ? "Assigned to Mia" : "Approve & assign"}</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {graph ? <ConceptMap items={graph.nodes} links={graph.edges} targetConceptKey={graph.targetConceptKey} readiness={readiness} editable={canEdit} onSelect={onSelect ?? undefined} onPositionChange={(key, position) => { if (!onDraftChange) return; onDraftChange({ ...graph, nodes: graph.nodes.map((node) => node.key === key ? { ...node, ...position } : node) }); }} /> : <div className="grid min-h-72 place-items-center rounded-xl border border-dashed bg-muted/15 p-8 text-center"><div><Sparkles className="mx-auto size-7 text-primary" /><p className="mt-3 font-medium">No concept map yet</p><p className="mt-1 text-sm text-muted-foreground">Analyse the lesson resources to create a reviewable draft.</p><Button className="mt-5" onClick={() => void onAnalyse?.()} disabled={!onAnalyse || busy !== null}>{busy === "analyse" ? <LoaderCircle className="animate-spin" /> : <Sparkles />} Analyse lesson</Button></div></div>}

          {canEdit && selected ? <div className="grid gap-5 rounded-xl border bg-muted/20 p-5 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4"><div><Label htmlFor="concept-title">Concept title</Label><Input id="concept-title" className="mt-2" value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></div><div><Label htmlFor="concept-description">What pupils need to understand</Label><Textarea id="concept-description" className="mt-2" value={selected.description} onChange={(event) => updateSelected({ description: event.target.value })} /></div><div><Label htmlFor="concept-source">Source reference</Label><Input id="concept-source" className="mt-2" value={selected.sourceRef} onChange={(event) => updateSelected({ sourceRef: event.target.value })} /></div></div>
            <div><Label>Direct prerequisites for {selected.title}</Label><div className="mt-2 space-y-2">{graph!.nodes.filter((node) => node.key !== selected.key).map((node) => { const checked = graph!.edges.some((edge) => edge.source === node.key && edge.target === selected.key); return <label key={node.key} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm"><input type="checkbox" checked={checked} onChange={(event) => setPrerequisite(node.key, event.target.checked)} className="size-4 accent-primary" />{node.title}</label>; })}</div></div>
          </div> : canEdit ? <p className="text-center text-xs text-muted-foreground">Select a concept to edit its wording, evidence and prerequisites. Drag concepts to tidy the map.</p> : null}

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">{[["bg-emerald-500", "Secure"], ["bg-amber-500", "Needs checking"], ["bg-rose-500", "Needs support"], ["bg-primary", "Upcoming lesson"]].map(([colour, label]) => <span key={label} className="flex items-center gap-2"><span className={`size-2 rounded-full ${colour}`} /> {label}</span>)}</div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <Card><CardHeader><CardTitle className="font-heading text-xl">Lesson materials</CardTitle><CardDescription>Files and synthetic source extracts supplied to GPT‑5.6.</CardDescription><CardAction><input ref={uploadInput} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload?.(file); event.currentTarget.value = ""; }} /><Button variant="outline" size="sm" onClick={() => uploadInput.current?.click()} disabled={!onUpload || busy !== null}><UploadCloud /> {busy === "upload" ? "Uploading…" : "Upload"}</Button></CardAction></CardHeader><CardContent className="space-y-2">{overview.resources.map((resource) => <div key={resource.name} className="flex items-center gap-3 rounded-xl border bg-background p-3"><div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><FileText className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{resource.name}</p><p className="text-xs text-muted-foreground">{resource.mediaType.includes("presentation") ? "PPTX" : resource.mediaType.includes("pdf") ? "PDF" : "FILE"}{resource.pageCount ? ` · ${resource.pageCount} pages` : ""}</p></div><Badge variant={resource.status === "current" ? "default" : "outline"}>{resource.status}</Badge></div>)}</CardContent><CardFooter className="justify-between"><span className="text-xs text-muted-foreground">Maximum 15 MB per uploaded file in this demo</span>{overview.graph ? <Button variant="outline" size="sm" onClick={() => void onAnalyse?.()} disabled={!onAnalyse || busy !== null}><Sparkles /> Re-analyse</Button> : null}</CardFooter></Card>

        <Card><CardHeader><CardTitle className="font-heading text-xl">Pupil pathway</CardTitle><CardDescription>Readiness for the next lesson—not work completed.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center"><Avatar className="size-12"><AvatarFallback>{overview.pupil?.initials ?? "MI"}</AvatarFallback><AvatarBadge className="bg-emerald-500" /></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-heading text-lg font-semibold">{overview.pupil?.displayName ?? "Mia"}</p><Badge variant="outline">{overview.assignment?.status?.replace("_", " ") ?? "Not assigned"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{answered ? `${answered} responses · ${incorrectConcepts.size} concepts need support` : "Diagnostic waiting to begin"}</p></div><div className="flex gap-2">{overview.assignment && onReset ? <Button onClick={() => void onReset()} disabled={busy !== null} variant="ghost" size="sm">{busy === "reset" ? <LoaderCircle className="animate-spin" /> : <RotateCcw />} Reset</Button> : null}<Button onClick={() => window.location.assign("/api/demo/sign-in/pupil")} variant="outline" size="sm">Open Mia&apos;s view <ArrowRight /></Button></div></div></CardContent>{overview.latestRun ? <CardFooter className="justify-between text-xs text-muted-foreground"><span>Latest AI run: {overview.latestRun.job.replace("_", " ")} · {overview.latestRun.model}</span><Badge variant="outline">{overview.latestRun.status}</Badge></CardFooter> : null}</Card>
      </section>
    </div>
  );
}

const fallbackOverview: NonNullable<TeacherOverview> = {
  classRecord: { _id: "class-demo", name: "10C Computer Science", subject: "GCSE Computer Science", yearGroup: "Year 10" },
  lesson: { _id: "lesson-demo", title: "Binary search", objectives: [], analysisStatus: "ready" },
  graph: {
    _id: "graph-demo",
    status: "approved",
    targetConceptKey: "binary-search",
    nodes: concepts.map((concept) => ({ key: concept.id, title: concept.title, description: concept.description, sourceRef: concept.source, x: concept.position.x, y: concept.position.y })),
    edges: [
      { source: "variables", target: "iteration" }, { source: "arrays", target: "indexing" }, { source: "indexing", target: "trace-tables" },
      { source: "comparisons", target: "trace-tables" }, { source: "iteration", target: "binary-search" }, { source: "trace-tables", target: "binary-search" }, { source: "sorted-data", target: "binary-search" },
    ],
  },
  resources: recentResources.map((resource) => ({ name: resource.name, mediaType: resource.type === "PDF" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.presentationml.presentation", pageCount: resource.pages, status: resource.status === "Current" ? "current" : "analysed" })),
  diagnostic: null,
  pupilCount: 1,
  pupil: { displayName: "Mia", initials: "MI" },
  assignment: null,
  responses: [],
  path: null,
  modules: [],
  latestRun: null,
};
