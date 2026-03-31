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
  Star,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
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

type PositionKey = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
type PositionShort = "GK" | "DEF" | "MID" | "FWD";

const POSITION_SHORT: Record<PositionKey, PositionShort> = {
  Goalkeeper: "GK",
  Defender: "DEF",
  Midfielder: "MID",
  Forward: "FWD",
};

const POSITION_ORDER: Record<string, number> = {
  Goalkeeper: 0,
  Defender: 1,
  Midfielder: 2,
  Forward: 3,
};

/* Ideal position ratios per team capacity */
function getIdealPositionRanges(cap: number): Record<PositionShort, [number, number]> {
  if (cap <= 10) {
    return { GK: [1, 2], DEF: [2, 3], MID: [2, 3], FWD: [2, 3] };
  }
  if (cap <= 14) {
    return { GK: [1, 2], DEF: [3, 4], MID: [3, 4], FWD: [2, 3] };
  }
  return { GK: [1, 2], DEF: [4, 5], MID: [4, 5], FWD: [3, 4] };
}

type SortOption = "grade-desc" | "grade-asc" | "position" | "name";
type PositionFilter = "All" | PositionShort;

/* ------------------------------------------------------------------ */
/*  Grade colour helper                                                */
/* ------------------------------------------------------------------ */

function gradeVariant(score: number): "success" | "info" | "warning" | "danger" {
  if (score >= 8.0) return "success";
  if (score >= 7.0) return "info";
  if (score >= 5.5) return "warning";
  return "danger";
}

/* Team rating on 5-point scale */
function teamRatingInfo(fivePointAvg: number): {
  label: string;
  colour: string;
  bgColour: string;
  variant: "success" | "info" | "warning" | "danger";
} {
  if (fivePointAvg >= 4.0)
    return { label: "Expert", colour: "text-[#15803D]", bgColour: "bg-[#15803D]", variant: "success" };
  if (fivePointAvg >= 3.0)
    return { label: "Competent", colour: "text-[#1D4ED8]", bgColour: "bg-[#1D4ED8]", variant: "info" };
  if (fivePointAvg >= 2.0)
    return { label: "Developing", colour: "text-[#B45309]", bgColour: "bg-[#B45309]", variant: "warning" };
  return { label: "Basic", colour: "text-[#B91C1C]", bgColour: "bg-[#B91C1C]", variant: "danger" };
}

function calcStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
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
  const [sortOption, setSortOption] = useState<SortOption>("grade-desc");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("All");
  const [hoveredPlayerId, setHoveredPlayerId] = useState<number | null>(null);
  const [hoveredRemoveId, setHoveredRemoveId] = useState<number | null>(null);

  /* ---- Settings state ---- */
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [ageGroup, setAgeGroup] = useState(team?.ageGroup ?? "U7");
  const [division, setDivision] = useState(team?.division ?? "Mixed");
  const [coach, setCoach] = useState(team?.coach ?? "");
  const [capacity, setCapacity] = useState(team?.capacity ?? 16);
  const [status, setStatus] = useState<TeamStatus>(team?.status ?? "Draft");

  /* ---- Derived data ---- */
  const rosterPlayers = useMemo(
    () =>
      ALL_PLAYERS.filter((p) => rosterIds.includes(p.id)).sort(
        (a, b) => (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9)
      ),
    [rosterIds]
  );

  const availablePlayers = useMemo(() => {
    const q = playerSearch.toLowerCase();
    let filtered = ALL_PLAYERS.filter((p) => {
      if (rosterIds.includes(p.id)) return false;
      if (p.ageGroup !== ageGroup) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (positionFilter !== "All") {
        const short = POSITION_SHORT[p.position as PositionKey];
        if (short !== positionFilter) return false;
      }
      return true;
    });

    switch (sortOption) {
      case "grade-desc":
        filtered.sort((a, b) => b.gradeScore - a.gradeScore);
        break;
      case "grade-asc":
        filtered.sort((a, b) => a.gradeScore - b.gradeScore);
        break;
      case "position":
        filtered.sort(
          (a, b) => (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9)
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [rosterIds, ageGroup, playerSearch, sortOption, positionFilter]);

  /* ---- Analytics calculations ---- */
  const grades = rosterPlayers.map((p) => p.gradeScore);
  const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  const fivePointRating = avgGrade / 2;
  const ratingInfo = teamRatingInfo(fivePointRating);

  const capacityPct = capacity > 0 ? Math.round((rosterPlayers.length / capacity) * 100) : 0;

  /* Position counts */
  const positionCounts = useMemo(() => {
    const counts: Record<PositionShort, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    rosterPlayers.forEach((p) => {
      const short = POSITION_SHORT[p.position as PositionKey];
      if (short) counts[short]++;
    });
    return counts;
  }, [rosterPlayers]);

  const idealRanges = getIdealPositionRanges(capacity);

  /* Skill spread */
  const skillSpread = useMemo(() => {
    if (rosterPlayers.length === 0)
      return { lowest: null, highest: null, avg: 0, stdDev: 0, label: "No players" };

    const sorted = [...rosterPlayers].sort((a, b) => a.gradeScore - b.gradeScore);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    const stdDev = calcStdDev(grades);

    let label: string;
    if (stdDev < 0.6) label = "Tight spread";
    else if (stdDev < 1.0) label = "Moderate spread";
    else label = "Wide spread";

    return { lowest, highest, avg, stdDev, label };
  }, [rosterPlayers, grades]);

  /* Balance score (0-100%) */
  const balanceScore = useMemo(() => {
    if (rosterPlayers.length === 0) return { score: 0, label: "No players" };

    /* Factor 1: Position coverage (40%) */
    let posScore = 0;
    const positions: PositionShort[] = ["GK", "DEF", "MID", "FWD"];
    positions.forEach((pos) => {
      const count = positionCounts[pos];
      const [min, max] = idealRanges[pos];
      if (count >= min && count <= max) posScore += 25;
      else if (count > 0) posScore += 12;
    });
    const positionFactor = posScore / 100;

    /* Factor 2: Skill evenness (30%) — lower std dev = better */
    const stdDev = skillSpread.stdDev;
    const skillFactor = Math.max(0, 1 - stdDev / 3);

    /* Factor 3: Capacity utilisation (30%) */
    const capFactor = Math.min(rosterPlayers.length / capacity, 1);

    const total = Math.round(positionFactor * 40 + skillFactor * 30 + capFactor * 30);

    let label: string;
    if (total >= 75) label = "Well Balanced";
    else if (total >= 50) label = "Needs Attention";
    else label = "Unbalanced";

    return { score: total, label };
  }, [rosterPlayers, positionCounts, idealRanges, skillSpread, capacity]);

  /* Impact preview calculations */
  function calcRatingAfterAdd(playerId: number): number {
    const player = ALL_PLAYERS.find((p) => p.id === playerId);
    if (!player) return fivePointRating;
    const newTotal = grades.reduce((a, b) => a + b, 0) + player.gradeScore;
    return newTotal / (grades.length + 1) / 2;
  }

  function calcRatingAfterRemove(playerId: number): number {
    const player = ALL_PLAYERS.find((p) => p.id === playerId);
    if (!player || grades.length <= 1) return 0;
    const newTotal = grades.reduce((a, b) => a + b, 0) - player.gradeScore;
    return newTotal / (grades.length - 1) / 2;
  }

  /* ---- Handlers ---- */
  const addPlayer = (playerId: number) => {
    if (rosterPlayers.length >= capacity) {
      addToast("Team is at full capacity", "warning");
      return;
    }
    setRosterIds((prev) => [...prev, playerId]);
    const player = ALL_PLAYERS.find((p) => p.id === playerId);
    if (player) {
      addToast(`${player.name} added to roster`, "success");
    }
  };

  const removePlayer = (playerId: number) => {
    setRosterIds((prev) => prev.filter((id) => id !== playerId));
    const player = ALL_PLAYERS.find((p) => p.id === playerId);
    if (player) {
      addToast(`${player.name} removed from roster`, "success");
    }
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
          <div className="space-y-6">
            {/* ============================================================ */}
            {/*  Team Intelligence Panel                                      */}
            {/* ============================================================ */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* ---- Card 1: Team Rating ---- */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <Star className="h-3.5 w-3.5" />
                  Team Rating
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={cn("text-3xl font-bold tabular-nums", ratingInfo.colour)}>
                    {rosterPlayers.length > 0 ? fivePointRating.toFixed(1) : "--"}
                  </span>
                  <span className="text-sm text-gray-400">/ 5.0</span>
                </div>
                {rosterPlayers.length > 0 && (
                  <>
                    <Badge variant={ratingInfo.variant} className="mt-2">
                      {ratingInfo.label}
                    </Badge>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn("h-full rounded-full transition-all", ratingInfo.bgColour)}
                        style={{ width: `${Math.min((fivePointRating / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Avg of {rosterPlayers.length} player grade{rosterPlayers.length !== 1 ? "s" : ""} / 2
                </p>
              </div>

              {/* ---- Card 2: Position Balance ---- */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <Shield className="h-3.5 w-3.5" />
                  Position Balance
                </div>
                <div className="mt-3 space-y-2">
                  {(["GK", "DEF", "MID", "FWD"] as PositionShort[]).map((pos) => {
                    const count = positionCounts[pos];
                    const [min, max] = idealRanges[pos];
                    const inRange = count >= min && count <= max;
                    const message =
                      count < min
                        ? `Need ${min - count} more`
                        : count > max
                          ? `${count - max} over ideal`
                          : null;

                    return (
                      <div key={pos} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {inRange ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-[#B45309]" />
                          )}
                          <span className="font-medium text-[#0B2545]">{pos}</span>
                          <span className="tabular-nums text-gray-500">
                            {count}
                          </span>
                        </div>
                        <div>
                          {message ? (
                            <span className="text-xs text-[#B45309]">{message}</span>
                          ) : (
                            <span className="text-xs text-[#15803D]">
                              {min}-{max} ideal
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- Card 3: Skill Spread ---- */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Skill Spread
                </div>
                {rosterPlayers.length > 0 ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5 text-[#B45309]" />
                        <span className="text-gray-600">Low</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold tabular-nums text-[#0B2545]">
                          {skillSpread.lowest?.gradeScore.toFixed(1)}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          {skillSpread.lowest?.name.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-[#15803D]" />
                        <span className="text-gray-600">High</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold tabular-nums text-[#0B2545]">
                          {skillSpread.highest?.gradeScore.toFixed(1)}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          {skillSpread.highest?.name.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg</span>
                      <span className="font-semibold tabular-nums text-[#0B2545]">
                        {skillSpread.avg.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-1 border-t border-gray-100 pt-2">
                      <Badge
                        variant={
                          skillSpread.stdDev < 0.6
                            ? "success"
                            : skillSpread.stdDev < 1.0
                              ? "info"
                              : "warning"
                        }
                      >
                        {skillSpread.label}
                      </Badge>
                      <span className="ml-2 text-xs text-gray-400">
                        SD: {skillSpread.stdDev.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">No players to analyse</p>
                )}
              </div>

              {/* ---- Card 4: Balance Score ---- */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <Target className="h-3.5 w-3.5" />
                  Balance Indicator
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-3xl font-bold tabular-nums",
                      balanceScore.score >= 75
                        ? "text-[#15803D]"
                        : balanceScore.score >= 50
                          ? "text-[#B45309]"
                          : "text-[#B91C1C]"
                    )}
                  >
                    {rosterPlayers.length > 0 ? `${balanceScore.score}%` : "--"}
                  </span>
                </div>
                {rosterPlayers.length > 0 && (
                  <>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          balanceScore.score >= 75
                            ? "bg-[#15803D]"
                            : balanceScore.score >= 50
                              ? "bg-[#B45309]"
                              : "bg-[#B91C1C]"
                        )}
                        style={{ width: `${balanceScore.score}%` }}
                      />
                    </div>
                    <Badge
                      variant={
                        balanceScore.score >= 75
                          ? "success"
                          : balanceScore.score >= 50
                            ? "warning"
                            : "danger"
                      }
                      className="mt-2"
                    >
                      {balanceScore.label}
                    </Badge>
                  </>
                )}
                <div className="mt-2 space-y-0.5 text-xs text-gray-400">
                  <p>Position coverage + Skill evenness</p>
                  <p>+ Capacity utilisation</p>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/*  Two-panel layout: Available Players & Team Roster            */}
            {/* ============================================================ */}
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

                {/* Search + Sort controls */}
                <div className="space-y-3 border-b border-gray-100 px-4 py-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search players..."
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      options={[
                        { label: "Grade (High\u2192Low)", value: "grade-desc" },
                        { label: "Grade (Low\u2192High)", value: "grade-asc" },
                        { label: "Position", value: "position" },
                        { label: "Name", value: "name" },
                      ]}
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                    />
                  </div>
                  {/* Position filter chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {(["All", "GK", "DEF", "MID", "FWD"] as PositionFilter[]).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setPositionFilter(filter)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          positionFilter === filter
                            ? "bg-[#1D4ED8] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Pos</th>
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
                        availablePlayers.map((player) => {
                          const isHovered = hoveredPlayerId === player.id;
                          const newRating = isHovered ? calcRatingAfterAdd(player.id) : 0;

                          return (
                            <tr
                              key={player.id}
                              className="border-t border-gray-50 transition-colors hover:bg-blue-50/40"
                              onMouseEnter={() => setHoveredPlayerId(player.id)}
                              onMouseLeave={() => setHoveredPlayerId(null)}
                              onFocus={() => setHoveredPlayerId(player.id)}
                              onBlur={() => setHoveredPlayerId(null)}
                            >
                              <td className="px-4 py-2.5">
                                <div className="font-medium text-[#0B2545]">{player.name}</div>
                                {isHovered && rosterPlayers.length > 0 && (
                                  <div className="text-xs text-[#1D4ED8]">
                                    Rating: {fivePointRating.toFixed(1)} → {newRating.toFixed(1)}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600">
                                {POSITION_SHORT[player.position as PositionKey] ?? player.position}
                              </td>
                              <td className="px-4 py-2.5">
                                <Badge variant={gradeVariant(player.gradeScore)}>
                                  <Star className="mr-0.5 inline h-3 w-3" />
                                  {(player.gradeScore / 2).toFixed(1)}
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
                          );
                        })
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
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium tabular-nums text-gray-600">
                              {rosterPlayers.length}/{capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-[#B45309]" />
                            <span className={cn("text-sm font-semibold tabular-nums", ratingInfo.colour)}>
                              {rosterPlayers.length > 0 ? `${fivePointRating.toFixed(1)}/5` : "--"}
                            </span>
                          </div>
                        </div>
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

                  <div className="max-h-[420px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          <th className="px-4 py-2 w-10">#</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Pos</th>
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
                          rosterPlayers.map((player, idx) => {
                            const isHovered = hoveredRemoveId === player.id;
                            const newRating = isHovered
                              ? calcRatingAfterRemove(player.id)
                              : 0;

                            return (
                              <tr
                                key={player.id}
                                className="border-t border-gray-50 transition-colors hover:bg-blue-50/40"
                                onMouseEnter={() => setHoveredRemoveId(player.id)}
                                onMouseLeave={() => setHoveredRemoveId(null)}
                                onFocus={() => setHoveredRemoveId(player.id)}
                                onBlur={() => setHoveredRemoveId(null)}
                              >
                                <td className="px-4 py-2.5 text-gray-400 tabular-nums">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-[#0B2545]">{player.name}</div>
                                  {isHovered && rosterPlayers.length > 1 && (
                                    <div className="text-xs text-[#B91C1C]">
                                      Rating: {fivePointRating.toFixed(1)} → {newRating.toFixed(1)}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2.5">
                                  <Badge variant="default">
                                    {POSITION_SHORT[player.position as PositionKey] ?? player.position}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2.5">
                                  <Badge variant={gradeVariant(player.gradeScore)}>
                                    <Star className="mr-0.5 inline h-3 w-3" />
                                    {(player.gradeScore / 2).toFixed(1)}
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
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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
          </div>

          {/* Submit Roster confirmation */}
          <ConfirmDialog
            open={submitOpen}
            onOpenChange={(open) => setSubmitOpen(open)}
            onConfirm={handleSubmitRoster}
            title="Submit Roster"
            description={`Confirm the roster for ${teamName || team.name} with ${rosterPlayers.length} player${rosterPlayers.length !== 1 ? "s" : ""}. Team rating: ${fivePointRating.toFixed(1)}/5.0 (${ratingInfo.label}). This will finalise the team lineup.`}
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
