"use client";

import { useUser } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Building2, LockKeyhole, Plus, School, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const provisionRef = makeFunctionReference<"mutation">("product:provisionTeacher");
const workspaceRef = makeFunctionReference<"query">("product:workspace");
const createOrgRef = makeFunctionReference<"mutation">("product:createOrganisation");
const createClassRef = makeFunctionReference<"mutation">("product:createClass");

export function ProductWorkspace() {
  return <><AuthLoading><main className="p-8">Securing your workspace...</main></AuthLoading><Unauthenticated><main className="p-8">Sign in to continue.</main></Unauthenticated><Authenticated><Workspace /></Authenticated></>;
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
  const [busy, setBusy] = useState(false);
  if (data === undefined) return <main className="p-8">Loading your encrypted workspace...</main>;
  if (data === null) return <main className="grid min-h-[100dvh] place-items-center p-6"><Card className="w-full max-w-lg"><CardHeader><CardTitle>Create your secure profile</CardTitle></CardHeader><CardContent><p className="mb-6 text-sm text-muted-foreground">Your Clerk identity is verified server-side before BridgeBack provisions access.</p><Button onClick={() => void provision({ displayName: user?.fullName || user?.firstName || "Teacher" })}><LockKeyhole /> Continue securely</Button></CardContent></Card></main>;
  const organisation = data.organisations[0];
  return <div className="min-h-[100dvh] bg-background"><header className="border-b"><div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5"><BridgeBackMark /><span className="font-semibold">BridgeBack</span><span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Production workspace</span></div></header><main className="mx-auto max-w-6xl px-5 py-10"><h1 className="text-4xl font-semibold tracking-tight">Welcome, {data.viewer.displayName}.</h1><p className="mt-3 text-muted-foreground">Create a school workspace, then add the first class.</p>{!organisation ? <Card className="mt-10 max-w-xl"><CardHeader><CardTitle className="flex items-center gap-2"><Building2 /> Create your school workspace</CardTitle></CardHeader><CardContent className="space-y-4"><Input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="School or organisation name" maxLength={120} /><Button disabled={busy} onClick={async () => { setBusy(true); try { await createOrg({ name: schoolName }); setSchoolName(""); } finally { setBusy(false); } }}><Plus /> Create workspace</Button><p className="text-xs text-muted-foreground">Default retention: 365 days. Membership and administrative actions are audited.</p></CardContent></Card> : <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><School /> {organisation.name}</CardTitle></CardHeader><CardContent>{data.classes.length ? <div className="space-y-3">{data.classes.map((item: { _id: string; name: string; subject: string; yearGroup: string }) => <div key={item._id} className="rounded-xl border p-4"><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">{item.subject} · {item.yearGroup}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No classes yet.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Add a class</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={className} onChange={(event) => setClassName(event.target.value)} placeholder="Class name" maxLength={80} /><Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" maxLength={80} /><Input value={yearGroup} onChange={(event) => setYearGroup(event.target.value)} placeholder="Year group" maxLength={40} /><Button disabled={busy} onClick={async () => { setBusy(true); try { await createClass({ organisationId: organisation._id, name: className, subject, yearGroup }); setClassName(""); setSubject(""); setYearGroup(""); } finally { setBusy(false); } }}><Plus /> Add class</Button></CardContent></Card></div>}</main></div>;
}
