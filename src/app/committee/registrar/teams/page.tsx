"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  UserPlus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type TeamStatus = "Active" | "Draft" | "Full";

interface Player {
  id: number;
  name: string;
  ageGroup: string;
}

interface Team {
  id: number;
  name: string;
  ageGroup: string;
  division: string;
  coach: string;
  players: Player[];
  capacity: number;
  status: TeamStatus;
}

const MOCK_TEAMS: Team[] = [
  {
    id: 1, name: "Nickol Thunder", ageGroup: "U7", division: "Mixed",
    coach: "Sarah Mitchell", capacity: 10, status: "Active",
    players: [
      { id: 1, name: "Liam Carter", ageGroup: "U7" },
      { id: 2, name: "Olivia Bennett", ageGroup: "U7" },
      { id: 3, name: "Noah Patel", ageGroup: "U7" },
      { id: 4, name: "Emma Nguyen", ageGroup: "U7" },
      { id: 5, name: "Oliver Smith", ageGroup: "U7" },
      { id: 6, name: "Charlotte Jones", ageGroup: "U7" },
      { id: 7, name: "William Brown", ageGroup: "U7" },
    ],
  },
  {
    id: 2, name: "Nickol Lightning", ageGroup: "U7", division: "Mixed",
    coach: "Mark Davies", capacity: 10, status: "Active",
    players: [
      { id: 8, name: "Amelia Wilson", ageGroup: "U7" },
      { id: 9, name: "James Taylor", ageGroup: "U7" },
      { id: 10, name: "Sophia Anderson", ageGroup: "U7" },
      { id: 11, name: "Lucas Thomas", ageGroup: "U7" },
      { id: 12, name: "Mia Jackson", ageGroup: "U7" },
      { id: 13, name: "Henry White", ageGroup: "U7" },
    ],
  },
  {
    id: 3, name: "Nickol Storm", ageGroup: "U9", division: "A",
    coach: "David Chen", capacity: 12, status: "Active",
    players: [
      { id: 14, name: "Harper Harris", ageGroup: "U9" },
      { id: 15, name: "Alexander Martin", ageGroup: "U9" },
      { id: 16, name: "Evelyn Garcia", ageGroup: "U9" },
      { id: 17, name: "Benjamin Martinez", ageGroup: "U9" },
      { id: 18, name: "Abigail Robinson", ageGroup: "U9" },
      { id: 19, name: "Jack Clark", ageGroup: "U9" },
      { id: 20, name: "Emily Lewis", ageGroup: "U9" },
      { id: 21, name: "Daniel Walker", ageGroup: "U9" },
      { id: 22, name: "Aria Hall", ageGroup: "U9" },
      { id: 23, name: "Michael Allen", ageGroup: "U9" },
    ],
  },
  {
    id: 4, name: "Nickol Blaze", ageGroup: "U9", division: "B",
    coach: "Lisa Thompson", capacity: 12, status: "Draft",
    players: [
      { id: 24, name: "Chloe Young", ageGroup: "U9" },
      { id: 25, name: "Ethan King", ageGroup: "U9" },
      { id: 26, name: "Grace Wright", ageGroup: "U9" },
      { id: 27, name: "Mason Lopez", ageGroup: "U9" },
      { id: 28, name: "Zoe Hill", ageGroup: "U9" },
    ],
  },
  {
    id: 5, name: "Nickol Titans", ageGroup: "U11", division: "A",
    coach: "Robert Nguyen", capacity: 16, status: "Active",
    players: [
      { id: 29, name: "Ella Scott", ageGroup: "U11" },
      { id: 30, name: "Logan Green", ageGroup: "U11" },
      { id: 31, name: "Scarlett Adams", ageGroup: "U11" },
      { id: 32, name: "Jacob Baker", ageGroup: "U11" },
      { id: 33, name: "Lily Nelson", ageGroup: "U11" },
      { id: 34, name: "Owen Carter", ageGroup: "U11" },
      { id: 35, name: "Riley Mitchell", ageGroup: "U11" },
      { id: 36, name: "Layla Perez", ageGroup: "U11" },
      { id: 37, name: "Luke Roberts", ageGroup: "U11" },
      { id: 38, name: "Nora Turner", ageGroup: "U11" },
      { id: 39, name: "Caleb Phillips", ageGroup: "U11" },
      { id: 40, name: "Hannah Campbell", ageGroup: "U11" },
      { id: 41, name: "Isaac Parker", ageGroup: "U11" },
      { id: 42, name: "Stella Evans", ageGroup: "U11" },
    ],
  },
  {
    id: 6, name: "Nickol Hawks", ageGroup: "U13", division: "A",
    coach: "Karen Williams", capacity: 16, status: "Full",
    players: [
      { id: 43, name: "Aiden Edwards", ageGroup: "U13" },
      { id: 44, name: "Victoria Collins", ageGroup: "U13" },
      { id: 45, name: "Sebastian Stewart", ageGroup: "U13" },
      { id: 46, name: "Penelope Morris", ageGroup: "U13" },
      { id: 47, name: "Mateo Sanchez", ageGroup: "U13" },
      { id: 48, name: "Aurora Rogers", ageGroup: "U13" },
      { id: 49, name: "Leo Reed", ageGroup: "U13" },
      { id: 50, name: "Hazel Cook", ageGroup: "U13" },
      { id: 51, name: "Nathan Morgan", ageGroup: "U13" },
      { id: 52, name: "Violet Bell", ageGroup: "U13" },
      { id: 53, name: "Ezra Murphy", ageGroup: "U13" },
      { id: 54, name: "Savannah Bailey", ageGroup: "U13" },
      { id: 55, name: "Thomas Rivera", ageGroup: "U13" },
      { id: 56, name: "Ellie Cooper", ageGroup: "U13" },
      { id: 57, name: "Hudson Richardson", ageGroup: "U13" },
      { id: 58, name: "Paisley Cox", ageGroup: "U13" },
    ],
  },
  {
    id: 7, name: "Nickol Eagles", ageGroup: "U15", division: "A",
    coach: "Peter Reynolds", capacity: 18, status: "Active",
    players: [
      { id: 59, name: "Jackson Howard", ageGroup: "U15" },
      { id: 60, name: "Addison Ward", ageGroup: "U15" },
      { id: 61, name: "Lincoln Torres", ageGroup: "U15" },
      { id: 62, name: "Brooklyn Peterson", ageGroup: "U15" },
      { id: 63, name: "Gabriel Gray", ageGroup: "U15" },
      { id: 64, name: "Madison Ramirez", ageGroup: "U15" },
      { id: 65, name: "Julian James", ageGroup: "U15" },
      { id: 66, name: "Natalie Watson", ageGroup: "U15" },
      { id: 67, name: "Levi Brooks", ageGroup: "U15" },
      { id: 68, name: "Samantha Kelly", ageGroup: "U15" },
      { id: 69, name: "Anthony Sanders", ageGroup: "U15" },
      { id: 70, name: "Leah Price", ageGroup: "U15" },
      { id: 71, name: "Dylan Bennett", ageGroup: "U15" },
      { id: 72, name: "Aubrey Ross", ageGroup: "U15" },
    ],
  },
  {
    id: 8, name: "Nickol Wolves", ageGroup: "U17", division: "A",
    coach: "James Anderson", capacity: 18, status: "Active",
    players: [
      { id: 73, name: "Christopher Powell", ageGroup: "U17" },
      { id: 74, name: "Zoey Long", ageGroup: "U17" },
      { id: 75, name: "Andrew Patterson", ageGroup: "U17" },
      { id: 76, name: "Bella Hughes", ageGroup: "U17" },
      { id: 77, name: "Ryan Flores", ageGroup: "U17" },
      { id: 78, name: "Claire Washington", ageGroup: "U17" },
      { id: 79, name: "Tyler Butler", ageGroup: "U17" },
      { id: 80, name: "Lucy Simmons", ageGroup: "U17" },
      { id: 81, name: "Brandon Foster", ageGroup: "U17" },
      { id: 82, name: "Sophie Gonzales", ageGroup: "U17" },
      { id: 83, name: "Kevin Bryant", ageGroup: "U17" },
      { id: 84, name: "Anna Alexander", ageGroup: "U17" },
    ],
  },
];

const UNASSIGNED_PLAYERS: Player[] = [
  { id: 101, name: "Max Henderson", ageGroup: "U9" },
  { id: 102, name: "Ruby Barnes", ageGroup: "U11" },
  { id: 103, name: "Oscar Fisher", ageGroup: "U7" },
  { id: 104, name: "Ivy Coleman", ageGroup: "U13" },
  { id: 105, name: "Felix Chapman", ageGroup: "U15" },
  { id: 106, name: "Daisy Murray", ageGroup: "U9" },
];

const STATUS_VARIANT: Record<TeamStatus, "success" | "default" | "warning"> = {
  Active: "success",
  Draft: "default",
  Full: "warning",
};

const SEASONS = ["2026", "2025", "2024"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TeamManagementPage() {
  const [season, setSeason] = useState("2026");
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedTeam((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Team Management</h2>
          <p className="text-sm text-gray-500">{MOCK_TEAMS.length} teams configured for Season {season}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
          <Button variant="accent" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_TEAMS.map((team) => {
          const pct = Math.round((team.players.length / team.capacity) * 100);
          const isExpanded = expandedTeam === team.id;

          return (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{team.name}</CardTitle>
                  <Badge variant={STATUS_VARIANT[team.status]}>{team.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="info">{team.ageGroup}</Badge>
                  <Badge>{team.division} Division</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-[#0B2545]">Coach:</span> {team.coach}
                </div>

                {/* Capacity bar */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      <Users className="mr-1 inline h-3.5 w-3.5" />
                      {team.players.length}/{team.capacity} players
                    </span>
                    <span className="font-medium text-gray-600">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        pct >= 100 ? "bg-[#B45309]" : pct >= 75 ? "bg-[#1D4ED8]" : "bg-[#15803D]"
                      )}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Manage Players toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => toggleExpand(team.id)}
                >
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    Manage Players
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {/* Expandable player list */}
                {isExpanded && (
                  <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
                    {team.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow-sm"
                      >
                        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" />
                        <span className="font-medium text-[#0B2545]">{player.name}</span>
                        <Badge className="ml-auto text-[10px]">{player.ageGroup}</Badge>
                      </div>
                    ))}
                    {team.players.length === 0 && (
                      <p className="py-4 text-center text-xs text-gray-400">No players assigned</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unassigned players */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Unassigned Players</CardTitle>
              <p className="mt-1 text-sm text-gray-500">{UNASSIGNED_PLAYERS.length} players not yet allocated to a team</p>
            </div>
            <Button variant="accent" size="sm">
              <Sparkles className="mr-1.5 h-4 w-4" />
              Auto-Assign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {UNASSIGNED_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#0B2545]">{player.name}</p>
                  <p className="text-xs text-gray-500">{player.ageGroup}</p>
                </div>
                <Button variant="ghost" size="sm">Assign</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
