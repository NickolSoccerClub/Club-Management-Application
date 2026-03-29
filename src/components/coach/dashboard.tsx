"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Users,
  Calendar,
  Trophy,
  BarChart3,
  MessageSquare,
  Medal,
  Dumbbell,
  ClipboardList,
  Bot,
  ArrowLeft,
  CheckSquare,
  Flag,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CoachTeam } from "./team-selector";
import { RosterTab } from "./roster-tab";
import { CoachNiko } from "./coach-niko";
import { TrainingTab } from "./training-tab";
import { FixturesTab } from "./fixtures-tab";
import { AttendanceTab } from "./attendance-tab";
import { MessagesTab } from "./messages-tab";

/* ------------------------------------------------------------------ */
/*  Summary cards data                                                */
/* ------------------------------------------------------------------ */

function getSummaryCards(team: CoachTeam) {
  return [
    {
      label: "Players",
      value: String(team.playerCount),
      icon: Users,
      color: "text-[#1D4ED8]",
      bg: "bg-blue-50",
    },
    {
      label: "Next Training",
      value: team.nextTraining,
      icon: Dumbbell,
      color: "text-[#15803D]",
      bg: "bg-green-50",
    },
    {
      label: "Next Match",
      value: `vs ${team.fixtureOpponent}`,
      sub: team.nextFixture,
      icon: Trophy,
      color: "text-[#B45309]",
      bg: "bg-amber-50",
    },
    {
      label: "Attendance Rate",
      value: "87%",
      icon: BarChart3,
      color: "text-[#7C3AED]",
      bg: "bg-purple-50",
    },
    {
      label: "Unread Messages",
      value: "3",
      icon: MessageSquare,
      color: "text-[#E11D48]",
      bg: "bg-rose-50",
    },
    {
      label: "Season Record",
      value: "5W - 1D - 2L",
      icon: Medal,
      color: "text-[#0B2545]",
      bg: "bg-gray-100",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Quick actions                                                      */
/* ------------------------------------------------------------------ */

const QUICK_ACTIONS = [
  { label: "Take Attendance", icon: CheckSquare, color: "text-[#15803D]", bg: "bg-green-50" },
  { label: "Start Match Day", icon: Flag, color: "text-[#B45309]", bg: "bg-amber-50" },
  { label: "Message Parents", icon: Mail, color: "text-[#1D4ED8]", bg: "bg-blue-50" },
  { label: "Ask Coach Niko", icon: Sparkles, color: "text-[#7C3AED]", bg: "bg-purple-50" },
];

/* ------------------------------------------------------------------ */
/*  Placeholder tab content                                           */
/* ------------------------------------------------------------------ */

function Placeholder({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="mb-3 h-12 w-12" />
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-sm">Coming soon</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab label map for toasts                                           */
/* ------------------------------------------------------------------ */

const TAB_LABELS: Record<string, string> = {
  roster: "Roster",
  training: "Training",
  fixtures: "Fixtures",
  attendance: "Attendance",
  messages: "Messages",
  niko: "Coach Niko",
};

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */

interface DashboardProps {
  team: CoachTeam;
  onBack: () => void;
}

export function Dashboard({ team, onBack }: DashboardProps) {
  const cards = getSummaryCards(team);
  const addToast = useToastStore((s) => s.addToast);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  function handleTabChange(value: string) {
    const label = TAB_LABELS[value] ?? value;
    addToast(`Switched to ${label}`, "info");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] p-2"
          aria-label="Back to team selector"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#0B2545] md:text-2xl">
              {team.name}
            </h1>
            <Badge variant="info">{team.ageGroup}</Badge>
          </div>
          <p className="text-sm text-gray-500">{team.division}</p>
        </div>
      </div>

      {/* Summary cards - horizontal scroll on mobile, 3-col grid on tablet+ */}
      <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x">
            {cards.map((card) => (
              <Card
                key={card.label}
                className="min-w-[180px] shrink-0 snap-start md:min-w-0 overflow-hidden"
              >
                {/* Coloured top accent line */}
                <div className={cn("h-1 w-full", card.bg)} />
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        card.bg
                      )}
                    >
                      <card.icon className={cn("h-4.5 w-4.5", card.color)} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-[#0B2545]">
                    {card.value}
                  </p>
                  {card.sub && (
                    <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions row */}
      {!loading && (
        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
            Quick Actions
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 snap-x">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex-shrink-0 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 rounded-lg"
                onClick={() =>
                  addToast(`${action.label} opened`, "success")
                }
              >
                <Card className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98] min-w-[160px] md:min-w-0">
                  <CardContent className="flex items-center gap-3 p-4 min-h-[56px]">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                        action.bg
                      )}
                    >
                      <action.icon className={cn("h-4.5 w-4.5", action.color)} />
                    </div>
                    <span className="text-sm font-medium text-[#0B2545] whitespace-nowrap">
                      {action.label}
                    </span>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <Tabs defaultValue="roster" onValueChange={handleTabChange}>
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <TabsList className="w-max md:w-full md:grid md:grid-cols-6 h-auto gap-0.5 p-1">
            <TabsTrigger value="roster" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Roster</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Fixtures</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="niko" className="min-h-[48px] gap-1.5 px-4 text-sm md:text-base">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Coach Niko</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="roster">
          <RosterTab />
        </TabsContent>
        <TabsContent value="training">
          <TrainingTab />
        </TabsContent>
        <TabsContent value="fixtures">
          <FixturesTab />
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="niko">
          <CoachNiko />
        </TabsContent>
      </Tabs>
    </div>
  );
}
