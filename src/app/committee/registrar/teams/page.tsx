"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { Pagination } from "@/components/committee/shared/pagination";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { AgeGroupSettings, type AgeGroupCap } from "@/components/committee/registrar/age-group-settings";
import { TeamBuilder, type TeamForBuilder, type TeamPlayer } from "@/components/committee/registrar/team-builder";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Search,
  Plus,
  Settings2,
  Sparkles,
  AlertTriangle,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type TeamStatus = "Active" | "Draft" | "Full";

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
  // U7 — 13 players
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
  // U9 — 15 players
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
  // U11 — 14 players
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
  // U13 — 16 players
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
  // U15 — 14 players
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
  // U17 — 12 players
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

/* Map of team id → set of player ids assigned to that team */
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

const STATUS_VARIANT: Record<TeamStatus, "success" | "default" | "warning"> = {
  Active: "success",
  Draft: "default",
  Full: "warning",
};

const SEASONS = ["2026", "2025", "2024"];
const SEASON_OPTIONS = SEASONS.map((s) => ({ label: `Season ${s}`, value: s }));

const AGE_GROUPS = ["All", "U7", "U9", "U11", "U13", "U15", "U17"];
const STATUSES = ["All", "Active", "Draft", "Full"];

const ageGroupOptions = AGE_GROUPS.map((ag) => ({ label: ag, value: ag }));
const statusOptions = STATUSES.map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TeamManagementPage() {
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [season, setSeason] = useState("2026");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const perPage = 10;

  /* Dialog states */
  const [autoCreateOpen, setAutoCreateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [builderTeam, setBuilderTeam] = useState<TeamForBuilder | null>(null);

  /* Age group caps */
  const [ageGroupCaps, setAgeGroupCaps] = useState<Record<string, number>>({
    U7: 10,
    U9: 12,
    U11: 16,
    U13: 16,
    U15: 18,
    U17: 18,
  });

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* ---- Filtering ---- */
  const filtered = useMemo(() => {
    return MOCK_TEAMS.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q);
      const matchAge = ageFilter === "All" || t.ageGroup === ageFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchAge && matchStatus;
    });
  }, [search, ageFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---- Smart alerts: detect overflowing age groups ---- */
  const overflowWarnings = useMemo(() => {
    const warnings: string[] = [];
    const playersByAg: Record<string, number> = {};
    const capByAg: Record<string, number> = {};

    ALL_PLAYERS.forEach((p) => {
      playersByAg[p.ageGroup] = (playersByAg[p.ageGroup] || 0) + 1;
    });

    MOCK_TEAMS.forEach((t) => {
      capByAg[t.ageGroup] = (capByAg[t.ageGroup] || 0) + t.capacity;
    });

    for (const ag of Object.keys(playersByAg)) {
      const totalPlayers = playersByAg[ag];
      const totalCapacity = capByAg[ag] || 0;
      if (totalPlayers > totalCapacity) {
        warnings.push(
          `${ag} has ${totalPlayers} players but only ${totalCapacity} team spots available`
        );
      }
    }

    return warnings;
  }, []);

  /* ---- Caps computed for AgeGroupSettings ---- */
  const ageGroupCapData: AgeGroupCap[] = useMemo(() => {
    const agSet = new Set(MOCK_TEAMS.map((t) => t.ageGroup));
    return Array.from(agSet)
      .sort()
      .map((ag) => {
        const teams = MOCK_TEAMS.filter((t) => t.ageGroup === ag);
        const totalPlayers = teams.reduce((sum, t) => sum + t.playerCount, 0);
        return {
          ageGroup: ag,
          maxPerTeam: ageGroupCaps[ag] ?? 16,
          currentTeams: teams.length,
          totalPlayers,
        };
      });
  }, [ageGroupCaps]);

  /* ---- Team Builder: open for a specific team ---- */
  const openTeamBuilder = (team: Team) => {
    const rosterIds = TEAM_PLAYER_MAP[team.id] || [];
    const roster = ALL_PLAYERS.filter((p) => rosterIds.includes(p.id));

    const teamForBuilder: TeamForBuilder = {
      id: team.id,
      name: team.name,
      ageGroup: team.ageGroup,
      division: team.division,
      coach: team.coach,
      capacity: team.capacity,
      roster,
    };

    setBuilderTeam(teamForBuilder);
  };

  /* ---- Handlers ---- */
  const handleAutoCreate = () => {
    addToast("Teams auto-created based on registration demand", "success");
    setAutoCreateOpen(false);
  };

  const handleBuilderSubmit = () => {
    addToast("Team roster updated successfully", "success");
    setBuilderTeam(null);
  };

  const handleCapsChange = (caps: AgeGroupCap[]) => {
    const next: Record<string, number> = {};
    caps.forEach((c) => {
      next[c.ageGroup] = c.maxPerTeam;
    });
    setAgeGroupCaps(next);
    addToast("Age group caps updated", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Team Management"
        subtitle={`${MOCK_TEAMS.length} teams configured for Season ${season}`}
      >
        <Select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          options={SEASON_OPTIONS}
          className="w-40"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings2 className="mr-1.5 h-4 w-4" />
          Age Group Settings
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setAutoCreateOpen(true)}
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          Auto-Create Teams
        </Button>
        <Button
          variant="accent"
          size="sm"
          onClick={() => addToast("Create team dialog opened", "info")}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Team
        </Button>
      </PageHeader>

      {/* Smart overflow warnings */}
      {overflowWarnings.length > 0 && (
        <div className="rounded-lg border border-[#B45309]/30 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#B45309]">
                Capacity Warning
              </p>
              {overflowWarnings.map((w, i) => (
                <p key={i} className="text-sm text-amber-700">
                  {w}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search team name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Age Group
            </label>
            <Select
              options={ageGroupOptions}
              value={ageFilter}
              onChange={(e) => {
                setAgeFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Status
            </label>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Data table */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={7} />
      ) : paged.length === 0 ? (
        <EmptyState
          title="No teams found"
          description="No teams match the current filters. Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-4 py-3">Team Name</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3 hidden sm:table-cell">Division</th>
                <th className="px-4 py-3 hidden md:table-cell">Coach</th>
                <th className="px-4 py-3">Players</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-20">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((team, idx) => {
                const pct = Math.round(
                  (team.playerCount / team.capacity) * 100
                );

                return (
                  <tr
                    key={team.id}
                    onClick={() => openTeamBuilder(team)}
                    className={cn(
                      "border-t border-gray-100 transition-colors hover:bg-blue-50/40 cursor-pointer",
                      idx % 2 === 1 && "bg-[#F8FAFC]"
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-[#0B2545]">
                      {team.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {team.ageGroup}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {team.division}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {team.coach}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600 tabular-nums">
                          {team.playerCount}/{team.capacity}
                        </span>
                        <div className="hidden sm:block h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              pct >= 100
                                ? "bg-[#B45309]"
                                : pct >= 75
                                  ? "bg-[#1D4ED8]"
                                  : "bg-[#15803D]"
                            )}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[team.status]}>
                        {team.status}
                      </Badge>
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openTeamBuilder(team)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          perPage={perPage}
          onPageChange={setPage}
        />
      )}

      {/* Team Builder dialog */}
      {builderTeam && (
        <TeamBuilder
          team={builderTeam}
          availablePlayers={ALL_PLAYERS}
          open={builderTeam !== null}
          onClose={() => setBuilderTeam(null)}
          onSubmit={handleBuilderSubmit}
        />
      )}

      {/* Age Group Settings dialog */}
      <AgeGroupSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        caps={ageGroupCapData}
        onSave={handleCapsChange}
      />

      {/* Auto-Create Teams confirmation dialog */}
      <ConfirmDialog
        open={autoCreateOpen}
        onOpenChange={setAutoCreateOpen}
        onConfirm={handleAutoCreate}
        title="Auto-Create Teams"
        description="This will analyse current registrations and automatically create teams to meet demand across all age groups. Existing teams will not be affected. Continue?"
        variant="accent"
        confirmLabel="Auto-Create"
      />
    </div>
  );
}
