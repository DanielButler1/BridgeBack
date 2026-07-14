import { DemoHeader } from "@/components/demo-header";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { requireDemoRole } from "@/lib/auth/server";

export default async function DemoTeacherPage() { await requireDemoRole("teacher"); return <div className="min-h-screen bg-background"><DemoHeader role="teacher" /><main className="mx-auto w-full max-w-[1480px] px-4 pt-6 sm:px-6 lg:px-8"><TeacherDashboard /></main></div>; }
