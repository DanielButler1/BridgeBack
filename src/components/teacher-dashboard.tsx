"use client";

import { useRef, useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  FileStack,
  FileText,
  MoreHorizontal,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { ConceptMap } from "@/components/concept-map";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { demoPupil, recentResources } from "@/lib/demo-data";
import { hasClerk, hasConvex } from "@/lib/config";

export function TeacherDashboard() {
  if (hasClerk && hasConvex) {
    return (
      <>
        <AuthLoading>
          <Card className="p-10 text-center text-sm text-muted-foreground">Connecting the class workspace…</Card>
        </AuthLoading>
        <Authenticated>
          <ConnectedTeacherDashboard />
        </Authenticated>
        <Unauthenticated>
          <Card className="p-10 text-center"><CardTitle>Session unavailable</CardTitle><CardDescription className="mt-2">Return to the start page and choose the teacher demo again.</CardDescription></Card>
        </Unauthenticated>
      </>
    );
  }
  return <TeacherExperience />;
}

type TeacherOverview = {
  classRecord: { _id: string };
  lesson: { _id: string } | null;
  graph: { _id: string; status: string } | null;
  resources: Array<{ name: string; mediaType: string; pageCount?: number; status: string }>;
} | null;

const overviewRef = makeFunctionReference<"query", Record<string, never>, TeacherOverview>("teacher:overview");
const uploadUrlRef = makeFunctionReference<"mutation", Record<string, never>, string>("teacher:generateUploadUrl");
const addResourceRef = makeFunctionReference<"mutation", { classId: string; lessonId: string; storageId: string; name: string; mediaType: string }, string>("teacher:addResource");
const approveGraphRef = makeFunctionReference<"mutation", { graphId: string }, null>("teacher:approveGraph");

function ConnectedTeacherDashboard() {
  const overview = useQuery(overviewRef, {});
  const generateUploadUrl = useMutation(uploadUrlRef);
  const addResource = useMutation(addResourceRef);
  const approveGraph = useMutation(approveGraphRef);
  const [uploading, setUploading] = useState(false);
  if (overview === undefined) return <Card className="p-10 text-center text-sm text-muted-foreground">Loading the class workspace…</Card>;
  if (!overview || !overview.lesson) return <Card className="p-10 text-center"><CardTitle>No upcoming lesson</CardTitle><CardDescription className="mt-2">Seed the synthetic class to begin the judge flow.</CardDescription></Card>;

  async function upload(file: File) {
    setUploading(true);
    try {
      const url = await generateUploadUrl({});
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json() as { storageId: string };
      await addResource({ classId: overview!.classRecord._id, lessonId: overview!.lesson!._id, storageId, name: file.name, mediaType: file.type || "application/octet-stream" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <TeacherExperience
      resources={overview.resources.map((resource) => ({
        name: resource.name,
        type: resource.mediaType.includes("presentation") ? "PPTX" : resource.mediaType.includes("pdf") ? "PDF" : "FILE",
        pages: resource.pageCount ?? 0,
        status: resource.status === "current" ? "Current" : resource.status === "analysed" ? "Analysed" : "Uploaded",
      }))}
      uploading={uploading}
      onUpload={upload}
      graphApproved={overview.graph?.status === "approved"}
      onApprove={overview.graph ? () => approveGraph({ graphId: overview.graph!._id }) : undefined}
    />
  );
}

function TeacherExperience({
  resources = recentResources,
  uploading = false,
  onUpload,
  graphApproved = false,
  onApprove,
}: {
  resources?: Array<{ name: string; type: string; pages: number; status: string }>;
  uploading?: boolean;
  onUpload?: (file: File) => Promise<void>;
  graphApproved?: boolean;
  onApprove?: () => Promise<unknown>;
}) {
  const uploadInput = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="relative min-h-64 overflow-hidden border-0 bg-foreground text-background ring-0">
          <div className="absolute -right-14 -top-24 size-64 rounded-full border border-background/10" />
          <div className="absolute -right-2 -top-8 size-40 rounded-full border border-background/10" />
          <CardHeader className="relative max-w-2xl p-6 sm:p-8">
            <Badge className="mb-6 bg-background/10 text-background hover:bg-background/10">
              <Sparkles data-icon="inline-start" />
              Upcoming lesson analysed
            </Badge>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-background/55">
              Year 10 · GCSE Computer Science
            </p>
            <h1 className="mt-2 max-w-xl font-heading text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Make tomorrow&apos;s lesson feel possible.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-background/65 sm:text-base">
              BridgeBack found the smallest set of ideas pupils need before your
              class begins binary search.
            </p>
          </CardHeader>
          <CardFooter className="relative mt-auto border-background/10 bg-background/5 px-6 py-4 sm:px-8">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-background/60">
                <FileStack className="size-4" />
                12 missed resources · 1 upcoming lesson
              </div>
              <Button className="bg-background text-foreground hover:bg-background/90">
                Review pathway
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="justify-between bg-primary/[0.065]">
          <CardHeader>
            <CardDescription>Class readiness</CardDescription>
            <CardTitle className="font-heading text-3xl">7 of 8 pupils</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpenCheck className="size-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={87.5} className="[&_[data-slot=progress-track]]:h-2" />
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Mia is the only pupil with a pathway still to complete before
              Thursday.
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-xs text-muted-foreground">Last updated 4 min ago</span>
            <Button variant="ghost" size="sm">
              View class <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["6", "prerequisites identified", "From 13 lesson objectives"],
          ["2", "concept gaps found", "Iteration and trace tables"],
          ["17 min", "recommended pathway", "Across three small steps"],
        ].map(([value, label, detail]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle className="font-mono text-2xl font-semibold">{value}</CardTitle>
              <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardFooter className="border-0 bg-transparent pt-0 text-xs text-muted-foreground">
              {detail}
            </CardFooter>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader className="border-b">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">Teacher review</Badge>
              <span className="text-xs text-muted-foreground">AI-generated · editable</span>
            </div>
            <CardTitle className="font-heading text-xl">Concept dependency map</CardTitle>
            <CardDescription className="mt-1 max-w-2xl">
              Each prerequisite is grounded in the uploaded lesson materials. Drag
              nodes to organise the map before approving it for pupils.
            </CardDescription>
          </div>
          <CardAction className="flex gap-2">
            <Button variant="outline">
              <Plus data-icon="inline-start" /> Add concept
            </Button>
            <Button onClick={() => void onApprove?.()} disabled={!onApprove || graphApproved}>
              <Check data-icon="inline-start" /> {graphApproved ? "Map approved" : "Approve map"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ConceptMap />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {[
              ["bg-emerald-500", "Secure"],
              ["bg-amber-500", "Needs checking"],
              ["bg-rose-500", "Needs support"],
              ["bg-primary", "Upcoming lesson"],
            ].map(([colour, label]) => (
              <span key={label} className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${colour}`} /> {label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Lesson materials</CardTitle>
            <CardDescription>Sources used to build this pathway.</CardDescription>
            <CardAction>
              <input
                ref={uploadInput}
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload?.(file);
                  event.currentTarget.value = "";
                }}
              />
              <Button variant="outline" size="sm" onClick={() => uploadInput.current?.click()} disabled={!onUpload || uploading}>
                <UploadCloud data-icon="inline-start" /> {uploading ? "Uploading…" : "Upload"}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            {resources.map((resource) => (
              <div
                key={resource.name}
                className="flex items-center gap-3 rounded-xl border bg-background p-3 transition-colors hover:bg-muted/35"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.type} · {resource.pages} pages
                  </p>
                </div>
                <Badge variant={resource.status === "Current" ? "default" : "outline"}>
                  {resource.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Pupils returning</CardTitle>
            <CardDescription>Readiness for the next lesson—not work completed.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="icon" aria-label="More pupil options">
                <MoreHorizontal />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-primary/10 font-medium text-primary">
                    {demoPupil.initials}
                  </AvatarFallback>
                  <AvatarBadge className="bg-amber-500" />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{demoPupil.name}</p>
                    <Badge variant="secondary">Diagnostic ready</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {demoPupil.year} · {demoPupil.daysMissed} school days missed · Last active today
                  </p>
                </div>
                <div className="w-full sm:w-36">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-mono font-medium">42%</span>
                  </div>
                  <Progress value={42} />
                </div>
                <Button variant="outline" size="sm">
                  Open <ChevronRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
