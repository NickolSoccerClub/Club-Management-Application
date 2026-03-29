"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ArrowRightLeft,
  AlertTriangle,
  CircleDot,
  Play,
  Square,
  ChevronDown,
  ChevronUp,
  User,
  Share2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

interface MatchEvent {
  id: string;
  time: string;
  player: string;
  type: "goal" | "yellow-card" | "red-card" | "substitution";
  detail?: string;
}

interface PlayerLineup {
  jerseyNumber: number;
  name: string;
  position: string;
  isSub: boolean;
}

const UPCOMING_MATCHES = [
  {
    id: "m1",
    date: "Sat 5 Apr",
    time: "9:00 AM",
    opponent: "Karratha Kickers",
    venue: "Nickol West Oval",
    isHome: true,
  },
  {
    id: "m2",
    date: "Sat 12 Apr",
    time: "10:30 AM",
    opponent: "Dampier Dolphins",
    venue: "Dampier Oval",
    isHome: false,
  },
];

const ACTIVE_MATCH = {
  id: "active-1",
  opponent: "Hedland Hawks",
  homeScore: 2,
  awayScore: 1,
  matchTime: "32:15",
  half: "1st Half",
  events: [
    { id: "e1", time: "8'", player: "Noah Williams", type: "goal" as const },
    { id: "e2", time: "15'", player: "Oliver Brown", type: "yellow-card" as const },
    { id: "e3", time: "22'", player: "Hedland #9", type: "goal" as const, detail: "Opposition" },
    { id: "e4", time: "29'", player: "Liam Johnson", type: "goal" as const },
  ] satisfies MatchEvent[],
  lineup: [
    { jerseyNumber: 1, name: "Liam Johnson", position: "GK", isSub: false },
    { jerseyNumber: 2, name: "Ethan Davis", position: "DEF", isSub: false },
    { jerseyNumber: 3, name: "Lucas Taylor", position: "DEF", isSub: false },
    { jerseyNumber: 5, name: "Noah Williams", position: "DEF", isSub: false },
    { jerseyNumber: 7, name: "James Wilson", position: "MID", isSub: false },
    { jerseyNumber: 8, name: "Emma Richardson", position: "MID", isSub: false },
    { jerseyNumber: 10, name: "Oliver Brown", position: "MID", isSub: false },
    { jerseyNumber: 11, name: "Ava Martinez", position: "FWD", isSub: false },
    { jerseyNumber: 4, name: "Mia Anderson", position: "DEF", isSub: true },
    { jerseyNumber: 6, name: "Charlotte Lee", position: "MID", isSub: true },
    { jerseyNumber: 9, name: "Sophia Clark", position: "FWD", isSub: true },
  ] satisfies PlayerLineup[],
};

const PAST_RESULTS = [
  {
    id: "r1",
    date: "Sat 29 Mar",
    opponent: "Wickham Warriors",
    homeScore: 3,
    awayScore: 1,
    isHome: true,
    scorers: ["Noah Williams (2)", "Oliver Brown"],
  },
  {
    id: "r2",
    date: "Sat 22 Mar",
    opponent: "Roebourne Rovers",
    homeScore: 0,
    awayScore: 0,
    isHome: false,
    scorers: [],
  },
  {
    id: "r3",
    date: "Sat 15 Mar",
    opponent: "Tom Price Tigers",
    homeScore: 2,
    awayScore: 3,
    isHome: true,
    scorers: ["Liam Johnson", "James Wilson"],
  },
];

/* ------------------------------------------------------------------ */
/*  Event icon helper                                                  */
/* ------------------------------------------------------------------ */

function EventIcon({ type }: { type: MatchEvent["type"] }) {
  switch (type) {
    case "goal":
      return <CircleDot className="h-4 w-4 text-[#15803D]" />;
    case "yellow-card":
      return <div className="h-4 w-3 rounded-sm bg-yellow-400" />;
    case "red-card":
      return <div className="h-4 w-3 rounded-sm bg-[#B91C1C]" />;
    case "substitution":
      return <ArrowRightLeft className="h-4 w-4 text-[#1D4ED8]" />;
  }
}

function eventBgColor(type: MatchEvent["type"]) {
  switch (type) {
    case "goal":
      return "bg-[#15803D]/20 border-[#15803D]/30";
    case "yellow-card":
      return "bg-yellow-400/20 border-yellow-400/30";
    case "red-card":
      return "bg-[#B91C1C]/20 border-[#B91C1C]/30";
    case "substitution":
      return "bg-[#1D4ED8]/20 border-[#1D4ED8]/30";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FixturesTab() {
  const [loading, setLoading] = React.useState(true);
  const [showMatchDay, setShowMatchDay] = React.useState(false);
  const [showLineup, setShowLineup] = React.useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = React.useState(false);
  const [scoreFlash, setScoreFlash] = React.useState(false);
  const addToast = useToastStore((s) => s.addToast);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const starters = ACTIVE_MATCH.lineup.filter((p) => !p.isSub);
  const subs = ACTIVE_MATCH.lineup.filter((p) => p.isSub);

  const handleGoal = () => {
    setScoreFlash(true);
    setTimeout(() => setScoreFlash(false), 800);
    addToast("Goal added!", "success");
  };

  const handleCard = () => {
    addToast("Card recorded", "warning");
  };

  const handleEndMatch = () => {
    setShowMatchDay(false);
    addToast("Match ended - result saved", "success");
  };

  const handleShareResult = (opponent: string) => {
    addToast("Result shared with parents", "success");
  };

  /* Loading skeleton */
  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* ---- End Match Confirmation ---- */}
      <ConfirmDialog
        open={confirmEndOpen}
        onOpenChange={(open) => setConfirmEndOpen(open)}
        onConfirm={handleEndMatch}
        title="End Match?"
        description="This will finalize the score and notify parents of the result. This action cannot be undone."
        confirmLabel="End Match"
        variant="danger"
      />

      {/* ---- Upcoming Matches ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Upcoming Matches
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {UPCOMING_MATCHES.map((match) => (
            <Card key={match.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={match.isHome ? "info" : "default"}>
                    {match.isHome ? "Home" : "Away"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[#0B2545]">
                  vs {match.opponent}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{match.venue}</span>
                  </div>
                </div>
                <Button
                  className="mt-3 min-h-[44px] w-full gap-2 bg-[#0B2545] hover:bg-[#0B2545]/90"
                  onClick={() => setShowMatchDay(true)}
                >
                  <Play className="h-4 w-4" />
                  Match Day
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Match Day Active View ---- */}
      {showMatchDay && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
            Match Day - Live
          </h2>
          <Card className="overflow-hidden border-[#1D4ED8]/30">
            {/* Dark header with score */}
            <div className="bg-gradient-to-b from-[#0B2545] to-[#0B2545]/95 p-4 md:p-6">
              {/* Timer */}
              <div className="mb-4 text-center">
                <p className="text-sm font-medium text-blue-300">
                  {ACTIVE_MATCH.half}
                </p>
                <p className="text-3xl font-mono font-bold text-white">
                  {ACTIVE_MATCH.matchTime}
                </p>
              </div>

              {/* Score - dramatic & large */}
              <div
                className={cn(
                  "mb-6 flex items-center justify-center gap-6 rounded-2xl bg-white/10 py-6 px-4 transition-all duration-300",
                  scoreFlash && "ring-2 ring-[#15803D] bg-[#15803D]/20"
                )}
              >
                <div className="text-center min-w-[80px]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    Nickol Thunder
                  </p>
                  <p
                    className={cn(
                      "text-6xl md:text-7xl font-black text-white transition-transform duration-300",
                      scoreFlash && "scale-110"
                    )}
                  >
                    {ACTIVE_MATCH.homeScore}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-light text-blue-300/60">vs</span>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    {ACTIVE_MATCH.opponent}
                  </p>
                  <p className="text-6xl md:text-7xl font-black text-white">
                    {ACTIVE_MATCH.awayScore}
                  </p>
                </div>
              </div>

              {/* Quick action buttons - large for tablet */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <Button
                  className="min-h-[56px] flex-col gap-1.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white text-sm font-semibold rounded-xl"
                  onClick={handleGoal}
                >
                  <CircleDot className="h-6 w-6" />
                  Goal
                </Button>
                <Button
                  className="min-h-[56px] flex-col gap-1.5 bg-[#B45309] hover:bg-[#B45309]/90 text-white text-sm font-semibold rounded-xl"
                  onClick={handleCard}
                >
                  <AlertTriangle className="h-6 w-6" />
                  Card
                </Button>
                <Button
                  className="min-h-[56px] flex-col gap-1.5 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white text-sm font-semibold rounded-xl"
                  onClick={() => addToast("Substitution recorded", "info")}
                >
                  <ArrowRightLeft className="h-6 w-6" />
                  Sub
                </Button>
              </div>

              {/* Goal / Event Log - improved visual distinction */}
              <div className="mb-4 rounded-xl bg-white/10 p-4">
                <h4 className="mb-3 text-sm font-semibold text-blue-200">
                  Match Events
                </h4>
                <div className="space-y-2">
                  {ACTIVE_MATCH.events.map((evt) => (
                    <div
                      key={evt.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-white/90",
                        eventBgColor(evt.type)
                      )}
                    >
                      <span className="w-10 shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-blue-200">
                        {evt.time}
                      </span>
                      <EventIcon type={evt.type} />
                      <span className="font-medium">
                        {evt.player}
                        {evt.detail && (
                          <span className="ml-1.5 text-xs font-normal text-blue-300">
                            ({evt.detail})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lineup toggle */}
              <button
                type="button"
                className="mb-2 flex w-full min-h-[48px] items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-white/15 transition-colors"
                onClick={() => setShowLineup(!showLineup)}
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Player Lineup
                </span>
                {showLineup ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showLineup && (
                <div className="space-y-3 rounded-xl bg-white/10 p-3">
                  <div>
                    <h5 className="mb-2 text-xs font-medium uppercase tracking-wider text-blue-300">
                      Starting XI
                    </h5>
                    <div className="grid grid-cols-2 gap-1.5">
                      {starters.map((p) => (
                        <div
                          key={p.jerseyNumber}
                          className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-sm text-white/90"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                            {p.jerseyNumber}
                          </span>
                          <span className="truncate">{p.name}</span>
                          <span className="ml-auto text-xs text-blue-300">
                            {p.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-2 text-xs font-medium uppercase tracking-wider text-blue-300">
                      Substitutes
                    </h5>
                    <div className="grid grid-cols-2 gap-1.5">
                      {subs.map((p) => (
                        <div
                          key={p.jerseyNumber}
                          className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-sm text-white/80"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                            {p.jerseyNumber}
                          </span>
                          <span className="truncate">{p.name}</span>
                          <span className="ml-auto text-xs text-blue-300">
                            {p.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* End Match */}
              <Button
                variant="secondary"
                className="mt-4 min-h-[48px] w-full rounded-xl border-[#B91C1C]/50 bg-transparent text-[#FCA5A5] hover:bg-[#B91C1C]/20 hover:text-white font-semibold"
                onClick={() => setConfirmEndOpen(true)}
              >
                <Square className="mr-2 h-4 w-4" />
                End Match
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* ---- Past Results ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Past Results
        </h2>
        <div className="space-y-2">
          {PAST_RESULTS.map((result) => {
            const isWin =
              (result.isHome && result.homeScore > result.awayScore) ||
              (!result.isHome && result.awayScore > result.homeScore);
            const isDraw = result.homeScore === result.awayScore;

            return (
              <Card key={result.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#0B2545]">
                          vs {result.opponent}
                        </p>
                        <Badge
                          variant={
                            isWin
                              ? "success"
                              : isDraw
                              ? "warning"
                              : "danger"
                          }
                        >
                          {isWin ? "W" : isDraw ? "D" : "L"}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {result.date}
                        {result.isHome ? " (H)" : " (A)"}
                      </p>
                      {result.scorers.length > 0 && (
                        <p className="mt-1 text-xs text-gray-400">
                          <Trophy className="mr-1 inline h-3 w-3" />
                          {result.scorers.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-[#0B2545]">
                        {result.homeScore} - {result.awayScore}
                      </p>
                      <Button
                        variant="secondary"
                        className="ml-2 h-9 w-9 shrink-0 p-0"
                        onClick={() => handleShareResult(result.opponent)}
                        aria-label={`Share result vs ${result.opponent}`}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
