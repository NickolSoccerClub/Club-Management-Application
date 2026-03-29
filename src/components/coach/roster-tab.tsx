"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Player interface & mock data                                       */
/* ------------------------------------------------------------------ */

interface Player {
  id: string;
  jerseyNumber: number;
  name: string;
  age: number;
  position: string;
  medicalAlert: boolean;
  medicalNote?: string;
  rsvpStatus: "confirmed" | "maybe" | "unavailable" | "pending";
  parentName: string;
  parentPhone: string;
  gradeScore: number;
}

const MOCK_PLAYERS: Player[] = [
  {
    id: "p1",
    jerseyNumber: 1,
    name: "Liam Johnson",
    age: 8,
    position: "Goalkeeper",
    medicalAlert: false,
    rsvpStatus: "confirmed",
    parentName: "Sarah Johnson",
    parentPhone: "0412 345 678",
    gradeScore: 4.2,
  },
  {
    id: "p2",
    jerseyNumber: 5,
    name: "Noah Williams",
    age: 9,
    position: "Defender",
    medicalAlert: true,
    medicalNote: "Asthma - carries puffer",
    rsvpStatus: "confirmed",
    parentName: "Mark Williams",
    parentPhone: "0423 456 789",
    gradeScore: 3.5,
  },
  {
    id: "p3",
    jerseyNumber: 7,
    name: "Oliver Smith",
    age: 8,
    position: "Midfielder",
    medicalAlert: false,
    rsvpStatus: "maybe",
    parentName: "Jenny Smith",
    parentPhone: "0434 567 890",
    gradeScore: 2.8,
  },
  {
    id: "p4",
    jerseyNumber: 9,
    name: "Ethan Brown",
    age: 9,
    position: "Forward",
    medicalAlert: false,
    rsvpStatus: "unavailable",
    parentName: "David Brown",
    parentPhone: "0445 678 901",
    gradeScore: 3.1,
  },
  {
    id: "p5",
    jerseyNumber: 3,
    name: "Lucas Davis",
    age: 8,
    position: "Defender",
    medicalAlert: true,
    medicalNote: "Bee sting allergy - EpiPen in bag",
    rsvpStatus: "confirmed",
    parentName: "Karen Davis",
    parentPhone: "0456 789 012",
    gradeScore: 1.7,
  },
  {
    id: "p6",
    jerseyNumber: 11,
    name: "Jack Wilson",
    age: 9,
    position: "Forward",
    medicalAlert: false,
    rsvpStatus: "pending",
    parentName: "Tom Wilson",
    parentPhone: "0467 890 123",
    gradeScore: 4.5,
  },
];

/* ------------------------------------------------------------------ */
/*  Grade score helpers                                                */
/* ------------------------------------------------------------------ */

function getGradeConfig(score: number) {
  if (score >= 4) return { label: "Expert", color: "bg-green-100 text-green-800" };
  if (score >= 3) return { label: "Competent", color: "bg-blue-100 text-blue-800" };
  if (score >= 2) return { label: "Developing", color: "bg-amber-100 text-amber-800" };
  return { label: "Basic", color: "bg-red-100 text-red-800" };
}

function GradeScoreBadge({ score }: { score: number }) {
  const config = getGradeConfig(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.color
      )}
    >
      {score.toFixed(1)} {config.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  RSVP badge                                                         */
/* ------------------------------------------------------------------ */

function RsvpBadge({ status }: { status: Player["rsvpStatus"] }) {
  const config = {
    confirmed: { variant: "success" as const, label: "Available", Icon: CheckCircle },
    maybe: { variant: "warning" as const, label: "Maybe", Icon: HelpCircle },
    unavailable: { variant: "danger" as const, label: "Unavailable", Icon: X },
    pending: { variant: "default" as const, label: "No Reply", Icon: HelpCircle },
  }[status];

  return (
    <Badge variant={config.variant} className="gap-1">
      <config.Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Position filter helpers                                            */
/* ------------------------------------------------------------------ */

type PositionFilter = "All" | "GK" | "DEF" | "MID" | "FWD";

const POSITION_FILTERS: PositionFilter[] = ["All", "GK", "DEF", "MID", "FWD"];

function matchesPosition(position: string, filter: PositionFilter): boolean {
  if (filter === "All") return true;
  const map: Record<PositionFilter, string[]> = {
    All: [],
    GK: ["goalkeeper"],
    DEF: ["defender"],
    MID: ["midfielder"],
    FWD: ["forward"],
  };
  return map[filter].includes(position.toLowerCase());
}

type RsvpFilter = "All" | "confirmed" | "maybe" | "unavailable" | "pending";

const RSVP_FILTERS: { value: RsvpFilter; label: string }[] = [
  { value: "All", label: "All RSVP" },
  { value: "confirmed", label: "Available" },
  { value: "maybe", label: "Maybe" },
  { value: "unavailable", label: "Unavailable" },
  { value: "pending", label: "No Reply" },
];

/* ------------------------------------------------------------------ */
/*  Development goals mock                                             */
/* ------------------------------------------------------------------ */

const DEV_GOALS: Record<string, string[]> = {
  p1: ["Improve distribution accuracy", "Work on high-ball claiming"],
  p2: ["Strengthen tackling technique", "Build positional awareness"],
  p3: ["Develop weaker foot passing", "Increase match tempo"],
  p4: ["Finishing consistency under pressure", "Off-the-ball movement"],
  p5: ["First touch improvement", "Heading confidence"],
  p6: ["Dribbling in tight spaces", "Defensive tracking back"],
};

/* ------------------------------------------------------------------ */
/*  Roster tab                                                         */
/* ------------------------------------------------------------------ */

export function RosterTab() {
  const addToast = useToastStore((s) => s.addToast);
  const [loading, setLoading] = React.useState(true);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [positionFilter, setPositionFilter] = React.useState<PositionFilter>("All");
  const [rsvpFilter, setRsvpFilter] = React.useState<RsvpFilter>("All");
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  const [playerToRemove, setPlayerToRemove] = React.useState<Player | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* Filtered players */
  const filteredPlayers = React.useMemo(() => {
    return MOCK_PLAYERS.filter((player) => {
      const nameMatch =
        searchQuery === "" ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const posMatch = matchesPosition(player.position, positionFilter);
      const rsvpMatch = rsvpFilter === "All" || player.rsvpStatus === rsvpFilter;
      return nameMatch && posMatch && rsvpMatch;
    });
  }, [searchQuery, positionFilter, rsvpFilter]);

  function handleMessageParent() {
    if (selectedPlayer) {
      addToast(`Message sent to ${selectedPlayer.parentName}`, "success");
      setSelectedPlayer(null);
    }
  }

  function handleEditPlayer() {
    if (selectedPlayer) {
      addToast(`Editing ${selectedPlayer.name}`, "info");
      setSelectedPlayer(null);
    }
  }

  function handleRemovePlayer() {
    if (playerToRemove) {
      addToast(`${playerToRemove.name} removed from roster`, "success");
      setPlayerToRemove(null);
    }
  }

  return (
    <>
      {/* Header bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {filteredPlayers.length} of {MOCK_PLAYERS.length} players
        </p>
        <Button variant="secondary" size="sm">
          + Add Player
        </Button>
      </div>

      {/* Search & filters */}
      <div className="mb-4 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B2545] placeholder-gray-400 outline-none transition-colors focus:border-[#1D4ED8]/40 focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Position
            </span>
          </div>
          {POSITION_FILTERS.map((pf) => (
            <button
              key={pf}
              type="button"
              onClick={() => setPositionFilter(pf)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors min-h-[32px]",
                positionFilter === pf
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {pf}
            </button>
          ))}

          <div className="mx-1 hidden sm:block w-px bg-gray-200" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              RSVP
            </span>
          </div>
          {RSVP_FILTERS.map((rf) => (
            <button
              key={rf.value}
              type="button"
              onClick={() => setRsvpFilter(rf.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors min-h-[32px]",
                rsvpFilter === rf.value
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {rf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Player card grid */}
          <div className="grid gap-3 md:grid-cols-2">
            {filteredPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 rounded-lg"
                onClick={() => setSelectedPlayer(player)}
              >
                <Card className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98] h-full">
                  <CardContent className="flex items-center gap-4 p-5 md:p-6">
                    {/* Jersey number circle */}
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold",
                        "bg-[#0B2545] text-white"
                      )}
                    >
                      {player.jerseyNumber}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-[#0B2545]">
                          {player.name}
                        </span>
                        {player.medicalAlert && (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Age {player.age} &middot; {player.position}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <RsvpBadge status={player.rsvpStatus} />
                        <GradeScoreBadge score={player.gradeScore} />
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
                  </CardContent>
                </Card>
              </button>
            ))}

            {filteredPlayers.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                <Search className="mb-3 h-10 w-10" />
                <p className="text-base font-medium">No players match your filters</p>
                <p className="mt-1 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Player detail drawer / dialog */}
      <Dialog
        open={selectedPlayer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPlayer(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selectedPlayer && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B2545] text-2xl font-bold text-white">
                  {selectedPlayer.jerseyNumber}
                </div>
                <div>
                  <DialogTitle>{selectedPlayer.name}</DialogTitle>
                  <DialogDescription>
                    Age {selectedPlayer.age} &middot;{" "}
                    {selectedPlayer.position}
                  </DialogDescription>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Grade score */}
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Player Grade
                  </p>
                  <GradeScoreBadge score={selectedPlayer.gradeScore} />
                </div>

                {/* RSVP */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    RSVP Status (Next Event)
                  </p>
                  <RsvpBadge status={selectedPlayer.rsvpStatus} />
                </div>

                {/* Medical */}
                {selectedPlayer.medicalAlert && (
                  <div className="rounded-lg border border-[#B45309]/30 bg-[#FFFBEB] p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#B45309]">
                      <AlertTriangle className="h-4 w-4" />
                      Medical Alert
                    </div>
                    <p className="mt-1 text-sm text-[#92400E]">
                      {selectedPlayer.medicalNote}
                    </p>
                  </div>
                )}

                {/* Parent contact */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Parent / Guardian
                  </p>
                  <p className="text-sm font-medium text-[#0B2545]">
                    {selectedPlayer.parentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedPlayer.parentPhone}
                  </p>
                </div>

                {/* Development goals */}
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                    <Target className="mr-1 inline h-3.5 w-3.5" />
                    Development Goals
                  </p>
                  <ul className="space-y-1.5">
                    {(DEV_GOALS[selectedPlayer.id] ?? []).map((goal, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="accent"
                  size="lg"
                  className="flex-1 min-h-[48px]"
                  onClick={handleMessageParent}
                >
                  Message Parent
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 min-h-[48px]"
                  onClick={handleEditPlayer}
                >
                  Edit Player
                </Button>
              </div>

              {/* Remove player action */}
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px]"
                  onClick={() => {
                    setPlayerToRemove(selectedPlayer);
                    setConfirmRemove(true);
                    setSelectedPlayer(null);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from Roster
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm remove dialog */}
      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={(open) => {
          setConfirmRemove(open);
          if (!open) setPlayerToRemove(null);
        }}
        onConfirm={handleRemovePlayer}
        title="Remove Player"
        description={
          playerToRemove
            ? `Are you sure you want to remove ${playerToRemove.name} from the roster? This action cannot be undone.`
            : "Are you sure you want to remove this player?"
        }
        variant="danger"
        confirmLabel="Remove"
      />
    </>
  );
}
