"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { ArrowLeft, ArrowRight, BookOpenCheck, Building2, LockKeyhole, Plus, School, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { curriculumPacks, findCurriculumPack } from "@/lib/curriculum-catalog";

const provisionRef = makeFunctionReference<"mutation">("product:provisionTeacher");
const workspaceRef = makeFunctionReference<"query">("product:workspace");
const createOrgRef = makeFunctionReference<"mutation">("product:createOrganisation");
const createClassRef = makeFunctionReference<"mutation">("product:createClass");

export function ProductWorkspace() {
  return (
    <>
      <AuthLoading><WorkspaceMessage title="Opening your workspace">Checking your secure school access.</WorkspaceMessage></AuthLoading>
      <Unauthenticated><WorkspaceMessage title="Sign in to continue">Your school workspace is available after authentication.</WorkspaceMessage></Unauthenticated>
      <Authenticated><Workspace /></Authenticated>
    </>
  );
}

function Workspace() {
  const { user } = useUser();
  const data = useQuery(workspaceRef, {});
  const provision = useMutation(provisionRef);
  const createOrg = useMutation(createOrgRef);
  const createClass = useMutation(createClassRef);
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [curriculumKey, setCurriculumKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (data === undefined) return <WorkspaceMessage title="Loading your workspace">Bringing your classes and access settings together.</WorkspaceMessage>;

  if (data === null) {
    return (
      <WorkspaceFrame userButton>
        <main className="mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div>
            <h1 className="mt-7 font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Create your secure teacher profile.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Your signed-in identity is checked before BridgeBack creates access to any school workspace.</p>
          </div>
          <Card className="rounded-2xl p-2 shadow-[0_24px_70px_-50px_rgba(25,90,60,0.35)]">
            <CardHeader className="p-6 sm:p-8">
              <CardTitle className="text-2xl">Ready when you are</CardTitle>
              <CardDescription className="mt-2 leading-6">Continue as {user?.fullName || user?.firstName || "Teacher"}. BridgeBack will create the minimum profile needed for school access.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <Button className="h-11 w-full" onClick={() => void provision({ displayName: user?.fullName || user?.firstName || "Teacher" })}>
                <ShieldCheck /> Continue securely
              </Button>
            </CardContent>
          </Card>
        </main>
      </WorkspaceFrame>
    );
  }

  const organisation = data.organisations[0];

  async function run(operation: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await operation();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That change could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <WorkspaceFrame userButton>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 border-b pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="size-4" /> Protected school workspace</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Welcome, {data.viewer.displayName}.</h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Set up the school, add a class, and bring the next lesson into one teacher-controlled workspace.</p>
          </div>
          {organisation ? <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm"><Building2 className="size-4 text-primary" /><span className="font-medium">{organisation.name}</span></div> : null}
        </div>

        {error ? <div role="alert" className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}

        {!organisation ? (
          <section className="grid gap-10 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:py-14">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="size-5" /></div>
              <h2 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.03em]">Start with your school.</h2>
              <p className="mt-4 max-w-md leading-7 text-muted-foreground">This creates the private boundary that classes, teachers, lesson files, and pupil pathways belong to.</p>
            </div>
            <Card className="rounded-2xl">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl">Create a school workspace</CardTitle>
                <CardDescription className="mt-2">Membership changes and administrative actions are recorded. The default retention period is 365 days.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
                <Field label="School or organisation name" htmlFor="school-name">
                  <Input id="school-name" className="h-11" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="Northbridge Academy" maxLength={120} />
                </Field>
                <Button className="h-11" disabled={busy || !schoolName.trim()} onClick={() => void run(async () => { await createOrg({ name: schoolName.trim() }); setSchoolName(""); })}>
                  <Plus /> Create workspace
                </Button>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="grid gap-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
            <Card className="rounded-2xl">
              <CardHeader className="border-b p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl"><School className="size-5 text-primary" /> Classes</CardTitle>
                    <CardDescription className="mt-2">Choose a class to continue into lesson planning and pupil pathways.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="size-4" /> {data.classes.length}</div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
                {data.classes.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.classes.map((item: { _id: string; name: string; subject: string; yearGroup: string; curriculumKey?: string }) => (
                      <Link key={item._id} href={`/app/classes/${item._id}`} className="group rounded-xl border bg-muted/20 p-5 transition-colors hover:border-primary/35 hover:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border"><BookOpenCheck className="size-4" /></div>
                        <p className="mt-5 font-heading text-lg font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.subject}</p>
                        {findCurriculumPack(item.curriculumKey) ? <p className="mt-2 text-xs font-medium text-primary">OCR {findCurriculumPack(item.curriculumKey)?.specificationCode} · v{findCurriculumPack(item.curriculumKey)?.version}</p> : null}
                        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{item.yearGroup}</span><span className="flex items-center gap-1 font-semibold text-primary">Open class <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span></div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-52 flex-col items-center justify-center text-center">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><School className="size-5" /></div>
                    <p className="mt-5 font-medium">No classes yet</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Add the first class using the form beside this list.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="h-fit rounded-2xl">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl">Add a class</CardTitle>
                <CardDescription className="mt-2">Create the teaching space that will hold lessons, source files, and pupil pathways.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
                <Field label="Class name" htmlFor="class-name"><Input id="class-name" className="h-11" value={className} onChange={(event) => setClassName(event.target.value)} placeholder="10C Computer Science" maxLength={80} /></Field>
                <Field label="Curriculum" htmlFor="class-curriculum">
                  <select id="class-curriculum" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" value={curriculumKey} onChange={(event) => { const nextKey = event.target.value; setCurriculumKey(nextKey); const pack = findCurriculumPack(nextKey); if (pack) setSubject(pack.subject); }}>
                    <option value="">Custom curriculum</option>
                    {curriculumPacks.map((pack) => <option key={pack.key} value={pack.key}>OCR {pack.specificationCode} · {pack.qualification}</option>)}
                  </select>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Field label="Subject" htmlFor="class-subject"><Input id="class-subject" className="h-11" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Computer Science" maxLength={80} /></Field>
                  <Field label="Year group" htmlFor="class-year"><Input id="class-year" className="h-11" value={yearGroup} onChange={(event) => setYearGroup(event.target.value)} placeholder="Year 10" maxLength={40} /></Field>
                </div>
                {curriculumKey ? <p className="rounded-lg bg-primary/5 px-3 py-2 text-xs leading-5 text-muted-foreground">BridgeBack uses the specification as a navigation layer. Your lesson files remain the teaching source.</p> : null}
                <Button className="h-11 w-full" disabled={busy || !className.trim() || !subject.trim() || !yearGroup.trim()} onClick={() => void run(async () => { await createClass({ organisationId: organisation._id, name: className.trim(), subject: subject.trim(), yearGroup: yearGroup.trim(), curriculumKey: curriculumKey || undefined }); setClassName(""); setSubject(""); setYearGroup(""); setCurriculumKey(""); })}>
                  <Plus /> Add class
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </WorkspaceFrame>
  );
}

function WorkspaceFrame({ children, userButton = false }: { children: React.ReactNode; userButton?: boolean }) {
  return (
    <div className="min-h-[100dvh] bg-[color-mix(in_oklch,var(--muted)_22%,var(--background))]">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BridgeBack home"><BridgeBackMark /><div><p className="font-heading text-[15px] font-semibold leading-none">BridgeBack</p><p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">School workspace</p></div></Link>
          <div className="ml-auto flex items-center gap-2">
            <Button nativeButton={false} render={<Link href="/" />} variant="ghost" size="sm" className="hidden sm:inline-flex"><ArrowLeft /> Back to site</Button>
            {userButton ? <UserButton /> : null}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

function WorkspaceMessage({ title, children }: { title: string; children: React.ReactNode }) {
  return <WorkspaceFrame><main className="grid min-h-[calc(100dvh-4.5rem)] place-items-center p-6"><div className="max-w-md text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div><h1 className="mt-6 font-heading text-3xl font-semibold">{title}</h1><p className="mt-3 leading-7 text-muted-foreground">{children}</p></div></main></WorkspaceFrame>;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={htmlFor}>{label}</Label>{children}</div>;
}
