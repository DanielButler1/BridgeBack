"use client";

import { Bell, GraduationCap, School, Sparkles } from "lucide-react";

import { BridgeBackMark } from "@/components/bridgeback-mark";
import { PupilJourney } from "@/components/pupil-journey";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AppShell() {
  return (
    <Tabs defaultValue="teacher" className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BridgeBackMark />
            <div>
              <p className="font-heading text-[15px] font-semibold leading-none tracking-tight">
                BridgeBack
              </p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
                The shortest path back
              </p>
            </div>
          </div>

          <TabsList className="mx-auto h-9 bg-muted/65 p-1">
            <TabsTrigger value="teacher" className="px-3 sm:px-4">
              <School data-icon="inline-start" />
              <span className="hidden sm:inline">Teacher view</span>
              <span className="sm:hidden">Teacher</span>
            </TabsTrigger>
            <TabsTrigger value="pupil" className="px-3 sm:px-4">
              <GraduationCap data-icon="inline-start" />
              <span className="hidden sm:inline">Mia&apos;s view</span>
              <span className="sm:hidden">Mia</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden border-primary/20 bg-primary/[0.045] text-primary md:flex">
              <Sparkles data-icon="inline-start" /> Guided tour
            </Badge>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
            <Avatar className="size-8">
              <AvatarFallback className="bg-foreground text-xs text-background">DM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 pt-6 sm:px-6 lg:px-8">
        <TabsContent value="teacher">
          <TeacherDashboard />
        </TabsContent>
        <TabsContent value="pupil">
          <PupilJourney />
        </TabsContent>
      </main>
    </Tabs>
  );
}
