"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Calendar,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  ChevronRight,
  Bot,
  Dumbbell,
  Users,
  ExternalLink,
  StickyNote,
  Flame,
  Target,
  Wind,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

interface Drill {
  id: string;
  name: string;
  duration: number;
  description: string;
  completed: boolean;
}

interface SessionPlan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  focusArea: string;
  warmUp: { description: string; duration: number };
  drills: Drill[];
  coolDown: { description: string; duration: number };
}

interface PastSession {
  id: string;
  date: string;
  title: string;
  attendanceCount: number;
  totalPlayers: number;
}

const UPCOMING_SESSIONS: { id: string; date: string; time: string; location: string; title: string; focusArea: string }[] = [
  {
    id: "s1",
    date: "Tue 1 Apr",
    time: "4:30 PM - 5:30 PM",
    location: "Nickol West Oval",
    title: "Passing & Movement",
    focusArea: "Passing",
  },
  {
    id: "s2",
    date: "Thu 3 Apr",
    time: "4:30 PM - 5:30 PM",
    location: "Nickol West Oval",
    title: "Shooting & Finishing",
    focusArea: "Shooting",
  },
];

const CURRENT_PLAN: SessionPlan = {
  id: "sp1",
  title: "Passing & Movement",
  date: "Tue 1 Apr",
  time: "4:30 PM - 5:30 PM",
  location: "Nickol West Oval",
  focusArea: "Passing",
  warmUp: {
    description: "Light jog around half pitch, dynamic stretches, passing in pairs on the move.",
    duration: 5,
  },
  drills: [
    {
      id: "d1",
      name: "Triangle Passing",
      duration: 10,
      description: "Groups of 3 form a triangle (5m sides). One-touch passing clockwise, then switch. Focus on weight of pass and body shape.",
      completed: false,
    },
    {
      id: "d2",
      name: "Pass & Move Grid",
      duration: 12,
      description: "4v4 in a 15m grid. Must complete 5 passes before scoring through a gate. Encourage movement off the ball.",
      completed: false,
    },
    {
      id: "d3",
      name: "Through-Ball Game",
      duration: 10,
      description: "Two teams, full half-pitch. Bonus point for any goal scored from a through-ball. Encourage timing of runs.",
      completed: false,
    },
  ],
  coolDown: {
    description: "Slow jog, static stretches, team huddle to recap key passing points.",
    duration: 5,
  },
};

const PAST_SESSIONS: PastSession[] = [
  { id: "ps1", date: "Tue 25 Mar", title: "Defending Shape", attendanceCount: 11, totalPlayers: 14 },
  { id: "ps2", date: "Thu 20 Mar", title: "1v1 Skills", attendanceCount: 13, totalPlayers: 14 },
  { id: "ps3", date: "Tue 18 Mar", title: "Set Pieces", attendanceCount: 10, totalPlayers: 14 },
  { id: "ps4", date: "Thu 13 Mar", title: "Fitness & Agility", attendanceCount: 12, totalPlayers: 14 },
];

/* ------------------------------------------------------------------ */
/*  Focus area colors                                                  */
/* ------------------------------------------------------------------ */

function focusBadgeVariant(area: string) {
  switch (area.toLowerCase()) {
    case "passing":
      return "info" as const;
    case "shooting":
      return "success" as const;
    case "defending":
      return "warning" as const;
    default:
      return "default" as const;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TrainingTab() {
  const [loading, setLoading] = React.useState(true);
  const [drillState, setDrillState] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(CURRENT_PLAN.drills.map((d) => [d.id, d.completed]))
  );
  const [sessionNotes, setSessionNotes] = React.useState("");
  const addToast = useToastStore((s) => s.addToast);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleDrill = (id: string) => {
    setDrillState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const drillName = CURRENT_PLAN.drills.find((d) => d.id === id)?.name;
      if (next[id]) {
        addToast(`"${drillName}" marked complete`, "success");
      }
      return next;
    });
  };

  const completedCount = Object.values(drillState).filter(Boolean).length;
  const totalDrills = CURRENT_PLAN.drills.length;

  /* Loading skeleton */
  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* ---- This Week's Sessions ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          This Week&apos;s Sessions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {UPCOMING_SESSIONS.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={focusBadgeVariant(session.focusArea)}>
                    {session.focusArea}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[#0B2545]">
                  {session.title}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{session.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Current Session Plan (expanded) ---- */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Current Session Plan
          </h2>
          <Badge variant="default">
            {completedCount}/{totalDrills} drills done
          </Badge>
        </div>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B2545]">
                  {CURRENT_PLAN.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {CURRENT_PLAN.date} &middot; {CURRENT_PLAN.time}
                </p>
              </div>
              <Badge variant={focusBadgeVariant(CURRENT_PLAN.focusArea)}>
                {CURRENT_PLAN.focusArea}
              </Badge>
            </div>

            {/* Warm-up */}
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#B45309]">
                  <Flame className="h-4 w-4" />
                  Warm-Up
                </span>
                <Badge variant="warning">{CURRENT_PLAN.warmUp.duration} min</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {CURRENT_PLAN.warmUp.description}
              </p>
            </div>

            {/* Drills */}
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#1D4ED8]" />
              <span className="text-sm font-semibold text-[#0B2545]">
                Drills ({completedCount}/{totalDrills} complete)
              </span>
            </div>
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${totalDrills > 0 ? (completedCount / totalDrills) * 100 : 0}%` }}
              />
            </div>

            <div className="space-y-3 mt-3">
              {CURRENT_PLAN.drills.map((drill, idx) => (
                <div
                  key={drill.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all duration-200",
                    drillState[drill.id]
                      ? "border-[#15803D]/30 bg-green-50/80 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox toggle - extra large for tablet */}
                    <button
                      type="button"
                      className={cn(
                        "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                        drillState[drill.id]
                          ? "bg-[#15803D]/10 hover:bg-[#15803D]/20"
                          : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                      )}
                      onClick={() => toggleDrill(drill.id)}
                      aria-label={`Mark ${drill.name} as ${drillState[drill.id] ? "incomplete" : "completed"}`}
                    >
                      {drillState[drill.id] ? (
                        <CheckSquare className="h-6 w-6 text-[#15803D]" />
                      ) : (
                        <Square className="h-6 w-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={cn(
                            "font-semibold",
                            drillState[drill.id]
                              ? "text-[#15803D] line-through"
                              : "text-[#0B2545]"
                          )}
                        >
                          Drill {idx + 1}: {drill.name}
                        </h4>
                        <Badge variant={drillState[drill.id] ? "success" : "default"}>
                          {drill.duration} min
                        </Badge>
                      </div>

                      {/* Diagram placeholder */}
                      <div className="my-2 flex h-24 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">
                        <Dumbbell className="mr-1.5 h-4 w-4" />
                        Drill diagram
                      </div>

                      <p className="text-sm text-gray-600">
                        {drill.description}
                      </p>

                      {/* View in Drill Library link */}
                      <button
                        type="button"
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View in Drill Library
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cool-down */}
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
                  <Wind className="h-4 w-4" />
                  Cool-Down
                </span>
                <Badge variant="info">{CURRENT_PLAN.coolDown.duration} min</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {CURRENT_PLAN.coolDown.description}
              </p>
            </div>

            {/* Session Notes */}
            <div className="mt-5">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                <StickyNote className="h-4 w-4 text-gray-400" />
                Session Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8] min-h-[100px] resize-y"
                placeholder="Add notes about today's session... (player progress, things to work on, etc.)"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Past Sessions ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          View All Session Plans
        </h2>
        <div className="space-y-2">
          {PAST_SESSIONS.map((s) => (
            <Card key={s.id} className="cursor-pointer hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-[#0B2545]">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      {s.attendanceCount}/{s.totalPlayers}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Request New Session ---- */}
      <div className="pt-2">
        <Button
          className="min-h-[44px] w-full gap-2 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
          onClick={() => addToast("Session plan request sent to Coach Niko", "success")}
        >
          <Bot className="h-4 w-4" />
          Request New Session Plan from Coach Niko
        </Button>
      </div>
    </div>
  );
}
