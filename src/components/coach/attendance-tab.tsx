"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

interface SessionAttendance {
  id: string;
  date: string;
  attended: number;
  total: number;
}

interface PlayerAttendance {
  id: string;
  name: string;
  attended: number;
  missed: number;
  total: number;
  trend: "up" | "down" | "stable";
}

const TRAINING_SESSIONS: SessionAttendance[] = [
  { id: "ts1", date: "Tue 25 Mar", attended: 11, total: 14 },
  { id: "ts2", date: "Thu 20 Mar", attended: 13, total: 14 },
  { id: "ts3", date: "Tue 18 Mar", attended: 10, total: 14 },
  { id: "ts4", date: "Thu 13 Mar", attended: 12, total: 14 },
  { id: "ts5", date: "Tue 11 Mar", attended: 14, total: 14 },
  { id: "ts6", date: "Thu 6 Mar", attended: 11, total: 14 },
  { id: "ts7", date: "Tue 4 Mar", attended: 13, total: 14 },
  { id: "ts8", date: "Thu 27 Feb", attended: 9, total: 14 },
];

const MATCH_SESSIONS: SessionAttendance[] = [
  { id: "ms1", date: "Sat 29 Mar", attended: 11, total: 14 },
  { id: "ms2", date: "Sat 22 Mar", attended: 14, total: 14 },
  { id: "ms3", date: "Sat 15 Mar", attended: 12, total: 14 },
  { id: "ms4", date: "Sat 8 Mar", attended: 13, total: 14 },
  { id: "ms5", date: "Sat 1 Mar", attended: 10, total: 14 },
];

const TRAINING_PLAYERS: PlayerAttendance[] = [
  { id: "p1", name: "Liam Johnson", attended: 7, missed: 1, total: 8, trend: "up" },
  { id: "p2", name: "Noah Williams", attended: 8, missed: 0, total: 8, trend: "up" },
  { id: "p3", name: "Oliver Brown", attended: 6, missed: 2, total: 8, trend: "stable" },
  { id: "p4", name: "Ethan Davis", attended: 7, missed: 1, total: 8, trend: "up" },
  { id: "p5", name: "Lucas Taylor", attended: 5, missed: 3, total: 8, trend: "down" },
  { id: "p6", name: "James Wilson", attended: 8, missed: 0, total: 8, trend: "up" },
  { id: "p7", name: "Emma Richardson", attended: 7, missed: 1, total: 8, trend: "stable" },
  { id: "p8", name: "Ava Martinez", attended: 6, missed: 2, total: 8, trend: "down" },
  { id: "p9", name: "Mia Anderson", attended: 4, missed: 4, total: 8, trend: "down" },
  { id: "p10", name: "Charlotte Lee", attended: 7, missed: 1, total: 8, trend: "up" },
  { id: "p11", name: "Sophia Clark", attended: 8, missed: 0, total: 8, trend: "up" },
  { id: "p12", name: "Isabella White", attended: 6, missed: 2, total: 8, trend: "stable" },
  { id: "p13", name: "Amelia Thomas", attended: 5, missed: 3, total: 8, trend: "down" },
  { id: "p14", name: "Harper Moore", attended: 7, missed: 1, total: 8, trend: "up" },
];

const MATCH_PLAYERS: PlayerAttendance[] = [
  { id: "p1", name: "Liam Johnson", attended: 5, missed: 0, total: 5, trend: "up" },
  { id: "p2", name: "Noah Williams", attended: 5, missed: 0, total: 5, trend: "up" },
  { id: "p3", name: "Oliver Brown", attended: 4, missed: 1, total: 5, trend: "stable" },
  { id: "p4", name: "Ethan Davis", attended: 5, missed: 0, total: 5, trend: "up" },
  { id: "p5", name: "Lucas Taylor", attended: 3, missed: 2, total: 5, trend: "down" },
  { id: "p6", name: "James Wilson", attended: 5, missed: 0, total: 5, trend: "up" },
  { id: "p7", name: "Emma Richardson", attended: 4, missed: 1, total: 5, trend: "stable" },
  { id: "p8", name: "Ava Martinez", attended: 4, missed: 1, total: 5, trend: "stable" },
  { id: "p9", name: "Mia Anderson", attended: 3, missed: 2, total: 5, trend: "down" },
  { id: "p10", name: "Charlotte Lee", attended: 5, missed: 0, total: 5, trend: "up" },
  { id: "p11", name: "Sophia Clark", attended: 4, missed: 1, total: 5, trend: "stable" },
  { id: "p12", name: "Isabella White", attended: 4, missed: 1, total: 5, trend: "stable" },
  { id: "p13", name: "Amelia Thomas", attended: 3, missed: 2, total: 5, trend: "down" },
  { id: "p14", name: "Harper Moore", attended: 5, missed: 0, total: 5, trend: "up" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pct(attended: number, total: number) {
  return total === 0 ? 0 : Math.round((attended / total) * 100);
}

function pctColor(p: number) {
  if (p >= 80) return "text-[#15803D]";
  if (p >= 60) return "text-[#B45309]";
  return "text-[#B91C1C]";
}

function barColor(p: number) {
  if (p >= 80) return "bg-[#15803D]";
  if (p >= 60) return "bg-[#B45309]";
  return "bg-[#B91C1C]";
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-[#15803D]" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-[#B91C1C]" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AttendanceTab() {
  const [view, setView] = React.useState<"training" | "matches">("training");
  const [showChecklist, setShowChecklist] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const sessions = view === "training" ? TRAINING_SESSIONS : MATCH_SESSIONS;
  const players = view === "training" ? TRAINING_PLAYERS : MATCH_PLAYERS;

  const overallAttended = sessions.reduce((s, x) => s + x.attended, 0);
  const overallTotal = sessions.reduce((s, x) => s + x.total, 0);
  const overallPct = pct(overallAttended, overallTotal);

  const allPlayerIds = TRAINING_PLAYERS.map((p) => p.id);

  const togglePlayer = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 py-4">
      {/* ---- Toggle ---- */}
      <div className="flex gap-2">
        <Button
          variant={view === "training" ? "primary" : "secondary"}
          className="min-h-[44px] flex-1"
          onClick={() => setView("training")}
        >
          Training
        </Button>
        <Button
          variant={view === "matches" ? "primary" : "secondary"}
          className="min-h-[44px] flex-1"
          onClick={() => setView("matches")}
        >
          Matches
        </Button>
      </div>

      {/* ---- Summary Card ---- */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white",
              overallPct >= 80
                ? "bg-[#15803D]"
                : overallPct >= 60
                ? "bg-[#B45309]"
                : "bg-[#B91C1C]"
            )}
          >
            {overallPct}%
          </div>
          <div>
            <p className="text-lg font-semibold text-[#0B2545]">
              Overall Attendance Rate
            </p>
            <p className="text-sm text-gray-500">
              {overallAttended} of {overallTotal} total check-ins across{" "}
              {sessions.length} {view === "training" ? "sessions" : "matches"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Session-by-session ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          {view === "training" ? "Session" : "Match"} Breakdown
        </h2>
        <div className="space-y-2">
          {sessions.map((s) => {
            const p = pct(s.attended, s.total);
            return (
              <Card key={s.id}>
                <CardContent className="p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0B2545]">
                      {s.date}
                    </span>
                    <span className={cn("text-sm font-semibold", pctColor(p))}>
                      {s.attended}/{s.total} ({p}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn("h-full rounded-full transition-all", barColor(p))}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- Player Breakdown ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Player Breakdown
        </h2>
        <Card>
          <CardContent className="p-0">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 border-b border-gray-200 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              <span>Player</span>
              <span className="w-16 text-center">Attended</span>
              <span className="w-16 text-center">Missed</span>
              <span className="w-14 text-center">%</span>
              <span className="w-10 text-center">Trend</span>
            </div>
            <div className="divide-y divide-gray-100">
              {players.map((player) => {
                const p = pct(player.attended, player.total);
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between gap-2 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto]"
                  >
                    <span className="font-medium text-[#0B2545] text-sm truncate">
                      {player.name}
                    </span>
                    <div className="flex items-center gap-3 sm:contents">
                      <span className="hidden sm:block w-16 text-center text-sm text-gray-600">
                        {player.attended}
                      </span>
                      <span className="hidden sm:block w-16 text-center text-sm text-gray-600">
                        {player.missed}
                      </span>
                      <span
                        className={cn(
                          "w-14 text-center text-sm font-semibold",
                          pctColor(p)
                        )}
                      >
                        {p}%
                      </span>
                      <span className="flex w-10 justify-center">
                        <TrendIcon trend={player.trend} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Mark Attendance ---- */}
      <Button
        className="min-h-[44px] w-full gap-2 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
        onClick={() => {
          setChecked({});
          setShowChecklist(true);
        }}
      >
        <Users className="h-4 w-4" />
        Mark Attendance
      </Button>

      {/* ---- Attendance Checklist Overlay ---- */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-4 pb-8 sm:rounded-2xl sm:pb-4 max-h-[85vh] flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0B2545]">
                Mark Attendance
              </h3>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
                onClick={() => setShowChecklist(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {TRAINING_PLAYERS.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className="flex w-full min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => togglePlayer(player.id)}
                >
                  {checked[player.id] ? (
                    <CheckSquare className="h-5 w-5 shrink-0 text-[#15803D]" />
                  ) : (
                    <Square className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-[#0B2545]">
                    {player.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                className="min-h-[44px] flex-1"
                onClick={() => setShowChecklist(false)}
              >
                Cancel
              </Button>
              <Button
                className="min-h-[44px] flex-1 bg-[#15803D] hover:bg-[#15803D]/90"
                onClick={() => setShowChecklist(false)}
              >
                Save ({Object.values(checked).filter(Boolean).length}/
                {allPlayerIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
