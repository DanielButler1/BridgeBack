import { ArrowLeft, GraduationCap, School, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { Button } from "@/components/ui/button";
import { hasClerk } from "@/lib/config";

export default function DemoPage() {
  const teacher = hasClerk ? "/api/demo/sign-in/teacher" : "/demo/teacher";
  const pupil = hasClerk ? "/api/demo/sign-in/pupil" : "/demo/pupil";
  return <main className="min-h-[100dvh] bg-background px-4 py-10 sm:py-16"><div className="mx-auto max-w-3xl"><div className="flex items-center justify-between gap-4"><Link href="/" className="flex items-center gap-3"><BridgeBackMark /><span className="font-semibold">BridgeBack</span></Link><Button nativeButton={false} render={<Link href="/" />} variant="ghost"><ArrowLeft /> Back to site</Button></div><div className="mt-20"><p className="text-sm font-semibold text-primary">Synthetic product tour</p><h1 className="mt-4 text-5xl font-semibold tracking-tight">Choose where to begin.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Explore the complete return-to-learning workflow with fictional identities, lessons and responses. Nothing here belongs to a real child.</p><div className="mt-10 grid gap-4 sm:grid-cols-2"><Button nativeButton={false} render={<a href={teacher} />} size="lg" className="h-14"><School /> Enter as Ms Morgan</Button><Button nativeButton={false} render={<a href={pupil} />} size="lg" variant="outline" className="h-14"><GraduationCap /> Enter as Mia</Button></div><p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4" /> Isolated from production workspaces and safe to reset.</p></div></div></main>;
}
