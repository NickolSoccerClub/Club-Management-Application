"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type TeamStatus = "Active" | "Draft" | "Full" | "Archived";

interface Team {
  id: number;
  name: string;
  ageGroup: string;
  division: string;
  coach: string;
  playerCount: number;
  capacity: number;
  status: TeamStatus;
}

interface TeamPlayer {
  id: number;
  name: string;
  ageGroup: string;
  position: string;
  gradeScore: number;
}

const MOCK_TEAMS: Team[] = [
  { id: 1, name: "Nickol Thunder",   ageGroup: "U7",  division: "Mixed", coach: "Sarah Mitchell",  playerCount: 7,  capacity: 10, status: "Active" },
  { id: 2, name: "Nickol Lightning", ageGroup: "U7",  division: "Mixed", coach: "Mark Davies",     playerCount: 6,  capacity: 10, status: "Active" },
  { id: 3, name: "Nickol Storm",     ageGroup: "U9",  division: "A",     coach: "David Chen",      playerCount: 10, capacity: 12, status: "Active" },
  { id: 4, name: "Nickol Blaze",     ageGroup: "U9",  division: "B",     coach: "Lisa Thompson",   playerCount: 5,  capacity: 12, status: "Draft"  },
  { id: 5, name: "Nickol Titans",    ageGroup: "U11", division: "A",     coach: "Robert Nguyen",   playerCount: 14, capacity: 16, status: "Active" },
  { id: 6, name: "Nickol Hawks",     ageGroup: "U13", division: "A",     coach: "Karen Williams",  playerCount: 16, capacity: 16, status: "Full"   },
  { id: 7, name: "Nickol Eagles",    ageGroup: "U15", division: "A",     coach: "Peter Reynolds",  playerCount: 14, capacity: 18, status: "Active" },
  { id: 8, name: "Nickol Wolves",    ageGroup: "U17", division: "A",     coach: "James Anderson",  playerCount: 12, capacity: 18, status: "Active" },
];

const ALL_PLAYERS: TeamPlayer[] = [
  // U7
  { id: 1,  name: "Liam Carter",        ageGroup: "U7",  position: "Forward",     gradeScore: 7.2 },
  { id: 2,  name: "Olivia Bennett",     ageGroup: "U7",  position: "Midfielder",  gradeScore: 6.8 },
  { id: 3,  name: "Noah Patel",         ageGroup: "U7",  position: "Defender",    gradeScore: 7.5 },
  { id: 4,  name: "Emma Nguyen",        ageGroup: "U7",  position: "Goalkeeper",  gradeScore: 8.1 },
  { id: 5,  name: "Oliver Smith",       ageGroup: "U7",  position: "Midfielder",  gradeScore: 6.5 },
  { id: 6,  name: "Charlotte Jones",    ageGroup: "U7",  position: "Defender",    gradeScore: 7.0 },
  { id: 7,  name: "William Brown",      ageGroup: "U7",  position: "Forward",     gradeScore: 8.3 },
  { id: 8,  name: "Amelia Wilson",      ageGroup: "U7",  position: "Midfielder",  gradeScore: 6.9 },
  { id: 9,  name: "James Taylor",       ageGroup: "U7",  position: "Defender",    gradeScore: 7.8 },
  { id: 10, name: "Sophia Anderson",    ageGroup: "U7",  position: "Forward",     gradeScore: 6.2 },
  { id: 11, name: "Lucas Thomas",       ageGroup: "U7",  position: "Midfielder",  gradeScore: 7.4 },
  { id: 12, name: "Mia Jackson",        ageGroup: "U7",  position: "Defender",    gradeScore: 7.1 },
  { id: 13, name: "Henry White",        ageGroup: "U7",  position: "Goalkeeper",  gradeScore: 6.5 },
  // U9
  { id: 14, name: "Harper Harris",      ageGroup: "U9",  position: "Forward",     gradeScore: 8.0 },
  { id: 15, name: "Alexander Martin",   ageGroup: "U9",  position: "Defender",    gradeScore: 6.7 },
  { id: 16, name: "Evelyn Garcia",      ageGroup: "U9",  position: "Midfielder",  gradeScore: 7.6 },
  { id: 17, name: "Benjamin Martinez",  ageGroup: "U9",  position: "Midfielder",  gradeScore: 6.4 },
  { id: 18, name: "Abigail Robinson",   ageGroup: "U9",  position: "Forward",     gradeScore: 7.3 },
  { id: 19, name: "Jack Clark",         ageGroup: "U9",  position: "Goalkeeper",  gradeScore: 8.5 },
  { id: 20, name: "Emily Lewis",        ageGroup: "U9",  position: "Defender",    gradeScore: 7.0 },
  { id: 21, name: "Daniel Walker",      ageGroup: "U9",  position: "Midfielder",  gradeScore: 5.8 },
  { id: 22, name: "Aria Hall",          ageGroup: "U9",  position: "Forward",     gradeScore: 6.3 },
  { id: 23, name: "Michael Allen",      ageGroup: "U9",  position: "Defender",    gradeScore: 7.2 },
  { id: 24, name: "Chloe Young",        ageGroup: "U9",  position: "Midfielder",  gradeScore: 5.5 },
  { id: 25, name: "Ethan King",         ageGroup: "U9",  position: "Forward",     gradeScore: 6.9 },
  { id: 26, name: "Grace Wright",       ageGroup: "U9",  position: "Defender",    gradeScore: 7.1 },
  { id: 27, name: "Mason Lopez",        ageGroup: "U9",  position: "Goalkeeper",  gradeScore: 5.0 },
  { id: 28, name: "Zoe Hill",           ageGroup: "U9",  position: "Forward",     gradeScore: 6.6 },
  // U11
  { id: 29, name: "Ella Scott",         ageGroup: "U11", position: "Midfielder",  gradeScore: 8.2 },
  { id: 30, name: "Logan Green",        ageGroup: "U11", position: "Forward",     gradeScore: 7.9 },
  { id: 31, name: "Scarlett Adams",     ageGroup: "U11", position: "Defender",    gradeScore: 7.4 },
  { id: 32, name: "Jacob Baker",        ageGroup: "U11", position: "Goalkeeper",  gradeScore: 8.8 },
  { id: 33, name: "Lily Nelson",        ageGroup: "U11", position: "Forward",     gradeScore: 6.1 },
  { id: 34, name: "Owen Carter",        ageGroup: "U11", position: "Midfielder",  gradeScore: 7.7 },
  { id: 35, name: "Riley Mitchell",     ageGroup: "U11", position: "Defender",    gradeScore: 6.8 },
  { id: 36, name: "Layla Perez",        ageGroup: "U11", position: "Forward",     gradeScore: 7.3 },
  { id: 37, name: "Luke Roberts",       ageGroup: "U11", position: "Midfielder",  gradeScore: 8.0 },
  { id: 38, name: "Nora Turner",        ageGroup: "U11", position: "Defender",    gradeScore: 5.9 },
  { id: 39, name: "Caleb Phillips",     ageGroup: "U11", position: "Forward",     gradeScore: 9.1 },
  { id: 40, name: "Hannah Campbell",    ageGroup: "U11", position: "Goalkeeper",  gradeScore: 7.5 },
  { id: 41, name: "Isaac Parker",       ageGroup: "U11", position: "Midfielder",  gradeScore: 6.6 },
  { id: 42, name: "Stella Evans",       ageGroup: "U11", position: "Defender",    gradeScore: 7.0 },
  // U13
  { id: 43, name: "Aiden Edwards",      ageGroup: "U13", position: "Forward",     gradeScore: 8.4 },
  { id: 44, name: "Victoria Collins",   ageGroup: "U13", position: "Midfielder",  gradeScore: 7.8 },
  { id: 45, name: "Sebastian Stewart",  ageGroup: "U13", position: "Defender",    gradeScore: 9.0 },
  { id: 46, name: "Penelope Morris",    ageGroup: "U13", position: "Goalkeeper",  gradeScore: 7.2 },
  { id: 47, name: "Mateo Sanchez",      ageGroup: "U13", position: "Forward",     gradeScore: 6.5 },
  { id: 48, name: "Aurora Rogers",      ageGroup: "U13", position: "Midfielder",  gradeScore: 8.1 },
  { id: 49, name: "Leo Reed",           ageGroup: "U13", position: "Defender",    gradeScore: 7.6 },
  { id: 50, name: "Hazel Cook",         ageGroup: "U13", position: "Forward",     gradeScore: 5.8 },
  { id: 51, name: "Nathan Morgan",      ageGroup: "U13", position: "Midfielder",  gradeScore: 7.3 },
  { id: 52, name: "Violet Bell",        ageGroup: "U13", position: "Defender",    gradeScore: 6.9 },
  { id: 53, name: "Ezra Murphy",        ageGroup: "U13", position: "Forward",     gradeScore: 8.7 },
  { id: 54, name: "Savannah Bailey",    ageGroup: "U13", position: "Goalkeeper",  gradeScore: 7.0 },
  { id: 55, name: "Thomas Rivera",      ageGroup: "U13", position: "Midfielder",  gradeScore: 9.5 },
  { id: 56, name: "Ellie Cooper",       ageGroup: "U13", position: "Defender",    gradeScore: 6.3 },
  { id: 57, name: "Hudson Richardson",  ageGroup: "U13", position: "Forward",     gradeScore: 7.4 },
  { id: 58, name: "Paisley Cox",        ageGroup: "U13", position: "Midfielder",  gradeScore: 8.0 },
  // U15
  { id: 59, name: "Jackson Howard",     ageGroup: "U15", position: "Forward",     gradeScore: 8.6 },
  { id: 60, name: "Addison Ward",       ageGroup: "U15", position: "Midfielder",  gradeScore: 7.1 },
  { id: 61, name: "Lincoln Torres",     ageGroup: "U15", position: "Defender",    gradeScore: 9.2 },
  { id: 62, name: "Brooklyn Peterson",  ageGroup: "U15", position: "Goalkeeper",  gradeScore: 7.8 },
  { id: 63, name: "Gabriel Gray",       ageGroup: "U15", position: "Forward",     gradeScore: 6.4 },
  { id: 64, name: "Madison Ramirez",    ageGroup: "U15", position: "Midfielder",  gradeScore: 8.3 },
  { id: 65, name: "Julian James",       ageGroup: "U15", position: "Defender",    gradeScore: 7.5 },
  { id: 66, name: "Natalie Watson",     ageGroup: "U15", position: "Forward",     gradeScore: 5.7 },
  { id: 67, name: "Levi Brooks",        ageGroup: "U15", position: "Midfielder",  gradeScore: 8.9 },
  { id: 68, name: "Samantha Kelly",     ageGroup: "U15", position: "Defender",    gradeScore: 7.2 },
  { id: 69, name: "Anthony Sanders",    ageGroup: "U15", position: "Forward",     gradeScore: 6.8 },
  { id: 70, name: "Leah Price",         ageGroup: "U15", position: "Goalkeeper",  gradeScore: 7.6 },
  { id: 71, name: "Dylan Bennett",      ageGroup: "U15", position: "Midfielder",  gradeScore: 8.1 },
  { id: 72, name: "Aubrey Ross",        ageGroup: "U15", position: "Defender",    gradeScore: 6.0 },
  // U17
  { id: 73, name: "Christopher Powell", ageGroup: "U17", position: "Forward",     gradeScore: 9.3 },
  { id: 74, name: "Zoey Long",          ageGroup: "U17", position: "Midfielder",  gradeScore: 7.7 },
  { id: 75, name: "Andrew Patterson",   ageGroup: "U17", position: "Defender",    gradeScore: 8.4 },
  { id: 76, name: "Bella Hughes",       ageGroup: "U17", position: "Goalkeeper",  gradeScore: 7.0 },
  { id: 77, name: "Ryan Flores",        ageGroup: "U17", position: "Forward",     gradeScore: 6.2 },
  { id: 78, name: "Claire Washington",  ageGroup: "U17", position: "Midfielder",  gradeScore: 8.8 },
  { id: 79, name: "Tyler Butler",       ageGroup: "U17", position: "Defender",    gradeScore: 7.3 },
  { id: 80, name: "Lucy Simmons",       ageGroup: "U17", position: "Forward",     gradeScore: 5.5 },
  { id: 81, name: "Brandon Foster",     ageGroup: "U17", position: "Midfielder",  gradeScore: 9.0 },
  { id: 82, name: "Sophie Gonzales",    ageGroup: "U17", position: "Defender",    gradeScore: 6.7 },
  { id: 83, name: "Kevin Bryant",       ageGroup: "U17", position: "Forward",     gradeScore: 7.9 },
  { id: 84, name: "Anna Alexander",     ageGroup: "U17", position: "Goalkeeper",  gradeScore: 8.2 },
];

const TEAM_PLAYER_MAP: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7],
  2: [8, 9, 10, 11, 12, 13],
  3: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  4: [24, 25, 26, 27, 28],
  5: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
  6: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
  7: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72],
  8: [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
};

const MOCK_COACHES = [
  "Sarah Mitchell",
  "Mark Davies",
  "David Chen",
  "Lisa Thompson",
  "Robert Nguyen",
  "Karen Williams",
  "Peter Reynolds",
  "James Anderson",
];

const STATUS_VARIANT: Record<TeamStatus, "success" | "default" | "warning" | "danger"> = {
  Active: "success",
  Draft: "default",
  Full: "warning",
  Archived: "danger",
};

const AGE_GROUPS = ["U7", "U9", "U11", "U13", "U15", "U17"];
const DIVISIONS = ["Mixed", "A", "B", "C"];
const STATUSES: TeamStatus[] = ["Active", "Draft", "Full", "Archived"];

/* ------------------------------------------------------------------ */
/*  Grade colour helper                                                */
/* ------------------------------------------------------------------ */

function gradeVariant(score: number): "success" | "info" | "warning" | "danger" {
  if (score >= 8.0) return "success";
  if (score >= 7.0) return "info";
  if (score >= 5.5) return "warning";
  return "danger";
}

function teamRatingLabel(avg: number): { label: string; variant: "success" | "info" | "warning" } {
  if (avg >= 8.0) return { label: "Top Heavy", variant: "warning" };
  if (avg >= 6.5) return { label: "Balanced", variant: "success" };
  return { label: "Developing", variant: "info" };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = Number(params.id);
  const addToast = useToastStore((s) => s.addToast);

  /* Find the team from mock data */
  const team = MOCK_TEAMS.find((t) => t.id === teamId);

  /* ---- Roster state ---- */
  const initialRosterIds = TEAM_PLAYER_MAP[teamId] || [];
  const [rosterIds, setRosterIds] = useState<number[]>(initialRosterIds);
  const [playerSearch, setPlayerSearch] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);

  /* ---- Settings state ---- */
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [ageGroup, setAgeGroup] = useState(team?.ageGroup ?? "U7");
  const [division, setDivision] = useState(team?.division ?? "Mixed");
  const [coach, setCoach] = useState(team?.coach ?? "");
  const [capacity, setCapacity] = useState(team?.capacity ?? 16);
  const [status, setStatus] = useState<TeamStatus>(team?.status ?? "Draft");

  /* ---- Derived data ---- */
  const rosterPlayers = useMemo(
    () => ALL_PLAYERS.filter((p) => rosterIds.includes(p.id)),
    [rosterIds]
  );

  const availablePlayers = useMemo(() => {
    const q = playerSearch.toLowerCase();
    return ALL_PLAYERS.filter((p) => {
      if (rosterIds.includes(p.id)) return false;
      if (p.ageGroup !== ageGroup) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => b.gradeScore - a.gradeScore);
  }, [rosterIds, ageGroup, playerSearch]);

  const avgGrade =
    rosterPlayers.length > 0
      ? rosterPlayers.reduce((sum, p) => sum + p.gradeScore, 0) / rosterPlayers.length
      : 0;

  const capacityPct = capacity > 0 ? Math.round((rosterPlayers.length / capacity) * 100) : 0;

  const rating = teamRatingLabel(avgGrade);

  /* ---- Handlers ---- */
  const addPlayer = (playerId: number) => {
    if (rosterPlayers.length >= capacity) {
      addToast("Team is at full capacity", "warning");
      return;
    }
    setRosterIds((prev) => [...prev, playerId]);
  };

  const removePlayer = (playerId: number) => {
    setRosterIds((prev) => prev.filter((id) => id !== playerId));
  };

  const handleSubmitRoster = () => {
    addToast("Team roster updated successfully", "success");
    setSubmitOpen(false);
  };

  const handleSaveSettings = () => {
    addToast("Team settings saved successfully", "success");
  };

  /* ---- 404 ---- */
  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-lg font-medium text-gray-600">Team not found</p>
        <Link href="/committee/registrar/teams">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/committee/registrar/teams"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0B2545]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0B2545]">{teamName || team.name}</h1>
              <Badge variant="info">{ageGroup}</Badge>
              <Badge variant="default">{division}</Badge>
              <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{coach}</p>
          </div>
        </div>
      </div>

      {/* ---- Tabs ---- */}
      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  Roster Tab                                                   */}
        {/* ============================================================ */}
        <TabsContent value="roster">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ---- Left: Available Players ---- */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-[#0B2545]">
                  Available Players
                </h2>
                <p className="text-xs text-gray-500">
                  {availablePlayers.length} players in {ageGroup}
                </p>
              </div>
              <div className="px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players..."
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Position</th>
                      <th className="px-4 py-2">Grade</th>
                      <th className="px-4 py-2 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availablePlayers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                          No available players
                        </td>
                      </tr>
                    ) : (
                      availablePlayers.map((player) => (
                        <tr
                          key={player.id}
                          className="border-t border-gray-50 transition-colors hover:bg-blue-50/40"
                        >
                          <td className="px-4 py-2.5 font-medium text-[#0B2545]">
                            {player.name}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {player.position}
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge variant={gradeVariant(player.gradeScore)}>
                              {player.gradeScore.toFixed(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5">
                            <button
                              type="button"
                              onClick={() => addPlayer(player.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-[#15803D] transition-colors hover:bg-[#F0FDF4]"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---- Right: Team Roster ---- */}
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-[#0B2545]">
                        Team Roster
                      </h2>
                      <p className="text-xs text-gray-500">
                        {rosterPlayers.length} / {capacity} players
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium tabular-nums text-gray-600">
                        {rosterPlayers.length}/{capacity}
                      </span>
                    </div>
                  </div>
                  {/* Capacity bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        capacityPct >= 100
                          ? "bg-[#B45309]"
                          : capacityPct >= 75
                            ? "bg-[#1D4ED8]"
                            : "bg-[#15803D]"
                      )}
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="max-h-[340px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-2 w-10">#</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Position</th>
                        <th className="px-4 py-2">Grade</th>
                        <th className="px-4 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rosterPlayers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                            No players assigned yet
                          </td>
                        </tr>
                      ) : (
                        rosterPlayers.map((player, idx) => (
                          <tr
                            key={player.id}
                            className="border-t border-gray-50 transition-colors hover:bg-blue-50/40"
                          >
                            <td className="px-4 py-2.5 text-gray-400 tabular-nums">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-2.5 font-medium text-[#0B2545]">
                              {player.name}
                            </td>
                            <td className="px-4 py-2.5 text-gray-600">
                              {player.position}
                            </td>
                            <td className="px-4 py-2.5">
                              <Badge variant={gradeVariant(player.gradeScore)}>
                                {player.gradeScore.toFixed(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-2.5">
                              <button
                                type="button"
                                onClick={() => removePlayer(player.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Rating card */}
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Team Rating
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#0B2545] tabular-nums">
                    {avgGrade > 0 ? avgGrade.toFixed(1) : "--"}
                  </span>
                  {rosterPlayers.length > 0 && (
                    <Badge variant={rating.variant}>{rating.label}</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Average grade across {rosterPlayers.length} player{rosterPlayers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Submit Roster button */}
              <Button
                variant="accent"
                className="w-full"
                onClick={() => setSubmitOpen(true)}
              >
                Submit Roster
              </Button>
            </div>
          </div>

          {/* Submit Roster confirmation */}
          <ConfirmDialog
            open={submitOpen}
            onOpenChange={(open) => setSubmitOpen(open)}
            onConfirm={handleSubmitRoster}
            title="Submit Roster"
            description={`Confirm the roster for ${teamName || team.name} with ${rosterPlayers.length} player${rosterPlayers.length !== 1 ? "s" : ""}. This will finalise the team lineup.`}
            variant="accent"
            confirmLabel="Submit"
          />
        </TabsContent>

        {/* ============================================================ */}
        {/*  Settings Tab                                                 */}
        {/* ============================================================ */}
        <TabsContent value="settings">
          <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#0B2545]">
              Team Settings
            </h2>
            <div className="space-y-5">
              {/* Team Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              {/* Age Group */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Age Group
                </label>
                <Select
                  options={AGE_GROUPS.map((ag) => ({ label: ag, value: ag }))}
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                />
              </div>

              {/* Division */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Division
                </label>
                <Select
                  options={DIVISIONS.map((d) => ({ label: d, value: d }))}
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </div>

              {/* Coach */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Coach
                </label>
                <Select
                  options={MOCK_COACHES.map((c) => ({ label: c, value: c }))}
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={1}
                  max={30}
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  options={STATUSES.map((s) => ({ label: s, value: s }))}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TeamStatus)}
                />
              </div>

              {/* Save */}
              <Button
                variant="accent"
                className="w-full"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
