"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  ChevronLeft,
  Play,
  Pause,
  Timer,
  Circle,
  Star,
  Send,
  Save,
  UserCheck,
  ArrowLeftRight,
  AlertTriangle,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
}

interface MatchEvent {
  id: string;
  minute: string;
  type: "goal" | "yellow" | "red" | "substitution";
  playerName: string;
}

type PositionSlot =
  | "GK"
  | "DEF1"
  | "DEF2"
  | "DEF3"
  | "DEF4"
  | "MID1"
  | "MID2"
  | "MID3"
  | "FWD1"
  | "FWD2"
  | "FWD3"
  | "SUB1"
  | "SUB2"
  | "SUB3";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                           */
/* ------------------------------------------------------------------ */

const MATCH = {
  id: "f-4",
  date: "2026-03-29",
  time: "09:30",
  opponent: "Karratha Rangers U9",
  venue: "Nickol West Oval",
  homeAway: "Home" as const,
  result: "3-1",
  status: "won" as const,
};

const PLAYERS: Player[] = [
  { id: "p-1", name: "Liam Carter", position: "FWD", jerseyNumber: 9 },
  { id: "p-2", name: "Noah Williams", position: "MID", jerseyNumber: 8 },
  { id: "p-3", name: "Ethan Brown", position: "DEF", jerseyNumber: 4 },
  { id: "p-4", name: "Oliver Smith", position: "GK", jerseyNumber: 1 },
  { id: "p-5", name: "Jack Taylor", position: "DEF", jerseyNumber: 5 },
  { id: "p-6", name: "Lucas Martin", position: "MID", jerseyNumber: 10 },
  { id: "p-7", name: "Henry Jones", position: "FWD", jerseyNumber: 11 },
  { id: "p-8", name: "Mason Wilson", position: "DEF", jerseyNumber: 3 },
  { id: "p-9", name: "James Anderson", position: "MID", jerseyNumber: 7 },
  { id: "p-10", name: "Leo Thomas", position: "DEF", jerseyNumber: 2 },
  { id: "p-11", name: "Charlie Jackson", position: "FWD", jerseyNumber: 14 },
  { id: "p-12", name: "Archie White", position: "MID", jerseyNumber: 6 },
  { id: "p-13", name: "Oscar Harris", position: "DEF", jerseyNumber: 12 },
  { id: "p-14", name: "George Clark", position: "FWD", jerseyNumber: 13 },
];

const POSITION_SLOTS: { slot: PositionSlot; label: string; group: string }[] = [
  { slot: "GK", label: "Goalkeeper", group: "GK" },
  { slot: "DEF1", label: "Defender 1", group: "DEF" },
  { slot: "DEF2", label: "Defender 2", group: "DEF" },
  { slot: "DEF3", label: "Defender 3", group: "DEF" },
  { slot: "DEF4", label: "Defender 4", group: "DEF" },
  { slot: "MID1", label: "Midfielder 1", group: "MID" },
  { slot: "MID2", label: "Midfielder 2", group: "MID" },
  { slot: "MID3", label: "Midfielder 3", group: "MID" },
  { slot: "FWD1", label: "Forward 1", group: "FWD" },
  { slot: "FWD2", label: "Forward 2", group: "FWD" },
  { slot: "FWD3", label: "Forward 3", group: "FWD" },
  { slot: "SUB1", label: "Substitute 1", group: "SUB" },
  { slot: "SUB2", label: "Substitute 2", group: "SUB" },
  { slot: "SUB3", label: "Substitute 3", group: "SUB" },
];

const EVENT_COLORS: Record<MatchEvent["type"], string> = {
  goal: "bg-[#F0FDF4] border-[#15803D]/20 text-[#15803D]",
  yellow: "bg-[#FFFBEB] border-[#B45309]/20 text-[#B45309]",
  red: "bg-[#FEF2F2] border-[#B91C1C]/20 text-[#B91C1C]",
  substitution: "bg-blue-50 border-[#1D4ED8]/20 text-[#1D4ED8]",
};

const EVENT_LABELS: Record<MatchEvent["type"], string> = {
  goal: "Goal",
  yellow: "Yellow Card",
  red: "Red Card",
  substitution: "Substitution",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function padTime(n: number): string {
  return n.toString().padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function MatchDayPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lineup");

  /* ---- Lineup state ---- */
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [lineup, setLineup] = useState<Record<PositionSlot, string | null>>({
    GK: null, DEF1: null, DEF2: null, DEF3: null, DEF4: null,
    MID1: null, MID2: null, MID3: null,
    FWD1: null, FWD2: null, FWD3: null,
    SUB1: null, SUB2: null, SUB3: null,
  });
  const [lineupConfirmed, setLineupConfirmed] = useState(false);

  /* ---- Live match state ---- */
  const [clockRunning, setClockRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [half, setHalf] = useState<1 | 2>(1);
  const [matchEnded, setMatchEnded] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [pendingEvent, setPendingEvent] = useState<MatchEvent["type"] | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Summary state ---- */
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [matchNotes, setMatchNotes] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  /* Clock effect */
  useEffect(() => {
    if (clockRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [clockRunning]);

  /* ---- Lineup handlers ---- */
  const assignedPlayerIds = Object.values(lineup).filter(Boolean) as string[];

  const availablePlayers = PLAYERS.filter((p) => !assignedPlayerIds.includes(p.id));

  const handleSlotClick = useCallback(
    (slot: PositionSlot) => {
      if (!selectedPlayer) {
        // Clear slot
        if (lineup[slot]) {
          setLineup((prev) => ({ ...prev, [slot]: null }));
        }
        return;
      }
      setLineup((prev) => ({ ...prev, [slot]: selectedPlayer }));
      setSelectedPlayer(null);
    },
    [selectedPlayer, lineup]
  );

  const getPlayerForSlot = (slot: PositionSlot): Player | undefined => {
    const pid = lineup[slot];
    return pid ? PLAYERS.find((p) => p.id === pid) : undefined;
  };

  const handleConfirmLineup = () => {
    const filledSlots = Object.values(lineup).filter(Boolean).length;
    if (filledSlots < 7) {
      addToast("Please assign at least 7 players to confirm lineup", "warning");
      return;
    }
    setLineupConfirmed(true);
    addToast("Lineup confirmed", "success");
    setActiveTab("live");
  };

  /* ---- Live match handlers ---- */
  const currentMinute = `${padTime(Math.floor(seconds / 60))}:${padTime(seconds % 60)}`;

  const handleHalfTime = () => {
    setClockRunning(false);
    setHalf(2);
    addToast("Half-time", "info");
  };

  const handleEndMatch = () => {
    setClockRunning(false);
    setMatchEnded(true);
    addToast("Full-time! Match ended", "success");
    setActiveTab("summary");
  };

  const lineupPlayerOptions = assignedPlayerIds
    .map((pid) => PLAYERS.find((p) => p.id === pid))
    .filter(Boolean)
    .map((p) => ({ label: `#${p!.jerseyNumber} ${p!.name}`, value: p!.id }));

  const handleEventPlayerSelect = (playerId: string) => {
    if (!pendingEvent) return;
    const player = PLAYERS.find((p) => p.id === playerId);
    if (!player) return;

    const evt: MatchEvent = {
      id: `evt-${Date.now()}`,
      minute: currentMinute,
      type: pendingEvent,
      playerName: player.name,
    };

    setEvents((prev) => [evt, ...prev]);

    if (pendingEvent === "goal") {
      setHomeScore((s) => s + 1);
      addToast(`Goal! ${player.name}`, "success");
    } else if (pendingEvent === "yellow") {
      addToast(`Yellow card: ${player.name}`, "warning");
    } else if (pendingEvent === "red") {
      addToast(`Red card: ${player.name}`, "error");
    } else if (pendingEvent === "substitution") {
      addToast(`Substitution: ${player.name}`, "info");
    }

    setPendingEvent(null);
  };

  /* ---- Summary handlers ---- */
  const handleRating = (playerId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [playerId]: rating }));
  };

  const handleShareResult = () => {
    addToast("Result shared with parents", "success");
  };

  const handleSaveReport = () => {
    addToast("Match report saved", "success");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
      {/* ---- Match Header Bar ---- */}
      <div className="rounded-xl bg-[#0B2545] p-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-white/60 uppercase tracking-wider">
              {formatDate(MATCH.date)} &middot; Kick-off {MATCH.time}
            </p>
            <p className="text-sm text-white/70">
              {MATCH.venue} &middot; {MATCH.homeAway}
            </p>
          </div>
        </div>

        {/* Score display */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-white/70">Nickol SC U9</p>
            <p className="text-4xl font-bold">{homeScore}</p>
          </div>
          <div className="text-lg font-medium text-white/40">vs</div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/70">{MATCH.opponent}</p>
            <p className="text-4xl font-bold">{awayScore}</p>
          </div>
        </div>

        {/* Clock */}
        <div className="mt-3 text-center">
          <span className="font-mono text-2xl text-white/90">{currentMinute}</span>
          {half === 2 && (
            <Badge className="ml-2 bg-white/20 text-white text-[10px]">2nd Half</Badge>
          )}
          {matchEnded && (
            <Badge className="ml-2 bg-white/20 text-white text-[10px]">Full-Time</Badge>
          )}
        </div>
      </div>

      {/* ---- Tabs ---- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="lineup" className="flex-1 min-h-[44px]">Lineup</TabsTrigger>
          <TabsTrigger value="live" className="flex-1 min-h-[44px]">Live Match</TabsTrigger>
          <TabsTrigger value="summary" className="flex-1 min-h-[44px]">Summary</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  Lineup Tab                                                    */}
        {/* ============================================================ */}
        <TabsContent value="lineup">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Available Players */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-3">
                Available Players ({availablePlayers.length})
              </h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {availablePlayers.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayer(player.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                      selectedPlayer === player.id
                        ? "bg-[#1D4ED8] text-white"
                        : "hover:bg-gray-50"
                    )}
                    style={{ minHeight: 48 }}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                        selectedPlayer === player.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-[#0B2545]"
                      )}
                    >
                      {player.jerseyNumber}
                    </span>
                    <div>
                      <p className={cn("text-sm font-medium", selectedPlayer !== player.id && "text-[#0B2545]")}>
                        {player.name}
                      </p>
                      <p className={cn("text-xs", selectedPlayer === player.id ? "text-white/70" : "text-gray-500")}>
                        {player.position}
                      </p>
                    </div>
                  </button>
                ))}
                {availablePlayers.length === 0 && (
                  <p className="py-4 text-center text-sm text-gray-400">All players assigned</p>
                )}
              </div>
            </div>

            {/* Position Slots */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-3">Position Slots</h3>
              <p className="text-xs text-gray-500 mb-4">
                Select a player on the left, then tap a position slot to assign them.
              </p>

              {["GK", "DEF", "MID", "FWD", "SUB"].map((group) => (
                <div key={group} className="mb-4">
                  <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                    {group === "GK" ? "Goalkeeper" : group === "DEF" ? "Defenders" : group === "MID" ? "Midfielders" : group === "FWD" ? "Forwards" : "Substitutes"}
                  </p>
                  <div className="space-y-1">
                    {POSITION_SLOTS.filter((s) => s.group === group).map((slotDef) => {
                      const assignedPlayer = getPlayerForSlot(slotDef.slot);
                      return (
                        <button
                          key={slotDef.slot}
                          type="button"
                          onClick={() => handleSlotClick(slotDef.slot)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                            assignedPlayer
                              ? "border-[#15803D]/30 bg-[#F0FDF4]"
                              : selectedPlayer
                              ? "border-[#1D4ED8]/30 bg-blue-50/50 hover:bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                          style={{ minHeight: 48 }}
                        >
                          {assignedPlayer ? (
                            <>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15803D] text-xs font-bold text-white">
                                {assignedPlayer.jerseyNumber}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#0B2545]">{assignedPlayer.name}</p>
                                <p className="text-xs text-gray-500">{slotDef.label}</p>
                              </div>
                              <span className="text-xs text-gray-400">Tap to remove</span>
                            </>
                          ) : (
                            <>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-xs text-gray-400">
                                --
                              </span>
                              <p className="text-sm text-gray-400">{slotDef.label}</p>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <Button
                variant="accent"
                size="lg"
                className="w-full mt-4"
                onClick={handleConfirmLineup}
                disabled={lineupConfirmed}
              >
                <UserCheck className="mr-2 h-5 w-5" />
                {lineupConfirmed ? "Lineup Confirmed" : "Confirm Lineup"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Live Match Tab                                                */}
        {/* ============================================================ */}
        <TabsContent value="live">
          <div className="space-y-6">
            {/* Clock Controls */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!clockRunning && !matchEnded && (
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => setClockRunning(true)}
                    style={{ minHeight: 48 }}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {seconds === 0 ? "Start Match" : "Resume"}
                  </Button>
                )}
                {clockRunning && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setClockRunning(false)}
                    style={{ minHeight: 48 }}
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                )}
                {half === 1 && seconds > 0 && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleHalfTime}
                    style={{ minHeight: 48 }}
                  >
                    <Timer className="mr-2 h-5 w-5" />
                    Half-Time
                  </Button>
                )}
                {half === 2 && seconds > 0 && !matchEnded && (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={handleEndMatch}
                    style={{ minHeight: 48 }}
                  >
                    <Circle className="mr-2 h-5 w-5" />
                    End Match
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Event Buttons */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-3">Quick Events</h3>

              {pendingEvent ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Select player for: <span className="font-semibold">{EVENT_LABELS[pendingEvent]}</span>
                  </p>
                  <Select
                    options={[{ label: "Select player...", value: "" }, ...lineupPlayerOptions]}
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleEventPlayerSelect(e.target.value);
                    }}
                  />
                  <Button variant="ghost" size="sm" onClick={() => setPendingEvent(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setPendingEvent("goal")}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#15803D]/30 bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D] transition-colors hover:bg-[#F0FDF4]/80"
                    style={{ minHeight: 48 }}
                    disabled={matchEnded}
                  >
                    <Zap className="h-5 w-5" />
                    Goal +
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingEvent("yellow")}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#B45309]/30 bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#B45309] transition-colors hover:bg-[#FFFBEB]/80"
                    style={{ minHeight: 48 }}
                    disabled={matchEnded}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Yellow Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingEvent("red")}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#B91C1C]/30 bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]/80"
                    style={{ minHeight: 48 }}
                    disabled={matchEnded}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Red Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingEvent("substitution")}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#1D4ED8]/30 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#1D4ED8] transition-colors hover:bg-blue-50/80"
                    style={{ minHeight: 48 }}
                    disabled={matchEnded}
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                    Substitution
                  </button>
                </div>
              )}
            </div>

            {/* Away Goal button */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-3">Opposition Events</h3>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setAwayScore((s) => s + 1);
                  addToast(`Opposition goal — ${MATCH.opponent}`, "info");
                }}
                disabled={matchEnded}
                style={{ minHeight: 48 }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Opposition Goal +
              </Button>
            </div>

            {/* Event Log */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-3">
                Event Log ({events.length})
              </h3>
              {events.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  No events recorded yet. Use the quick event buttons above.
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3",
                        EVENT_COLORS[evt.type]
                      )}
                    >
                      <span className="font-mono text-sm font-bold">{evt.minute}</span>
                      <span className="text-sm font-medium">{EVENT_LABELS[evt.type]}</span>
                      <span className="text-sm">{evt.playerName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Summary Tab                                                   */}
        {/* ============================================================ */}
        <TabsContent value="summary">
          <div className="space-y-6">
            {/* Final Score */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Final Score</p>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nickol SC U9</p>
                  <p className="text-5xl font-bold text-[#0B2545]">{homeScore}</p>
                </div>
                <span className="text-lg text-gray-400">-</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">{MATCH.opponent}</p>
                  <p className="text-5xl font-bold text-[#0B2545]">{awayScore}</p>
                </div>
              </div>

              {/* Events Summary */}
              {events.length > 0 && (
                <div className="mt-4 space-y-1">
                  {events.map((evt) => (
                    <p key={evt.id} className="text-sm text-gray-600">
                      {evt.minute} — {EVENT_LABELS[evt.type]}: {evt.playerName}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Player Ratings */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-4">Player Ratings</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {PLAYERS.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[#0B2545]">
                      {player.jerseyNumber}
                    </span>
                    <span className="flex-1 text-sm font-medium text-[#0B2545]">{player.name}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => handleRating(player.id, starVal)}
                          className="p-1 transition-colors"
                          style={{ minHeight: 36, minWidth: 36 }}
                          aria-label={`Rate ${player.name} ${starVal} stars`}
                        >
                          <Star
                            className={cn(
                              "h-5 w-5",
                              (ratings[player.id] || 0) >= starVal
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Notes */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <Textarea
                label="Match Notes"
                placeholder="Add notes about the match performance, key moments, areas to improve..."
                rows={4}
                value={matchNotes}
                onChange={(e) => setMatchNotes(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="accent"
                size="lg"
                onClick={handleShareResult}
                style={{ minHeight: 48 }}
              >
                <Send className="mr-2 h-5 w-5" />
                Share Result with Parents
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveReport}
                style={{ minHeight: 48 }}
              >
                <Save className="mr-2 h-5 w-5" />
                Save Match Report
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
