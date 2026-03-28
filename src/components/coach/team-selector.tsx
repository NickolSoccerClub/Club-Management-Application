"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Trophy,
  ChevronRight,
} from "lucide-react";

export interface CoachTeam {
  id: string;
  name: string;
  ageGroup: string;
  division: string;
  playerCount: number;
  nextTraining: string;
  nextFixture: string;
  fixtureOpponent: string;
}

const MOCK_TEAMS: CoachTeam[] = [
  {
    id: "team-u9",
    name: "Nickol Thunder",
    ageGroup: "Under 9s",
    division: "Division 1",
    playerCount: 14,
    nextTraining: "Tue 29 Mar, 4:30 PM",
    nextFixture: "Sat 2 Apr, 9:00 AM",
    fixtureOpponent: "Karratha Kickers",
  },
  {
    id: "team-u12",
    name: "Nickol Storm",
    ageGroup: "Under 12s",
    division: "Division 2",
    playerCount: 16,
    nextTraining: "Wed 30 Mar, 5:00 PM",
    nextFixture: "Sat 2 Apr, 10:30 AM",
    fixtureOpponent: "Dampier Dolphins",
  },
];

interface TeamSelectorProps {
  onSelectTeam: (team: CoachTeam) => void;
}

export function TeamSelector({ onSelectTeam }: TeamSelectorProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-bold text-[#0B2545] md:text-3xl">
        Welcome, Coach
      </h1>
      <p className="mb-8 text-gray-500">Select a team to manage</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_TEAMS.map((team) => (
          <button
            key={team.id}
            type="button"
            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 focus-visible:ring-offset-2 rounded-lg"
            onClick={() => onSelectTeam(team)}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-[#1D4ED8]/40 active:scale-[0.98]",
                "min-h-[200px]"
              )}
            >
              <CardContent className="p-5 md:p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#0B2545] md:text-xl">
                      {team.name}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="info">{team.ageGroup}</Badge>
                      <Badge>{team.division}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
                </div>

                {/* Stats */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 shrink-0 text-[#1D4ED8]" />
                    <span>
                      <span className="font-medium text-[#0B2545]">
                        {team.playerCount}
                      </span>{" "}
                      Players
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 shrink-0 text-[#15803D]" />
                    <span>
                      Next Training:{" "}
                      <span className="font-medium text-[#0B2545]">
                        {team.nextTraining}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Trophy className="h-4 w-4 shrink-0 text-[#B45309]" />
                    <span>
                      Next Match:{" "}
                      <span className="font-medium text-[#0B2545]">
                        vs {team.fixtureOpponent}
                      </span>
                      <span className="ml-1 text-gray-400">
                        {team.nextFixture}
                      </span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
