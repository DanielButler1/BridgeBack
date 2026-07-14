import { DemoHeader } from "@/components/demo-header";
import { PupilJourney } from "@/components/pupil-journey";
import { requireDemoRole } from "@/lib/auth/server";

export default async function PupilPage() {
  await requireDemoRole("pupil");
  return <div className="min-h-screen bg-background"><DemoHeader role="pupil" /><main className="mx-auto w-full max-w-[1480px] px-4 pt-6 sm:px-6 lg:px-8"><PupilJourney /></main></div>;
}
