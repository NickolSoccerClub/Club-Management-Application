"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  Trophy,
  ChevronRight,
  Star,
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

/* Mock team rating data */
const TEAM_RATINGS: Record<string, number> = {
  "team-u9": 3.4,
  "team-u12": 3.8,
};

interface TeamSelectorProps {
  onSelectTeam: (team: CoachTeam) => void;
}

export function TeamSelector({ onSelectTeam }: TeamSelectorProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-bold text-[#0B2545] md:text-3xl">
        Welcome, Coach
      </h1>
      <p className="mb-8 text-gray-500">Select a team to manage</p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_TEAMS.map((team) => {
            const rating = TEAM_RATINGS[team.id] ?? 0;

            return (
              <button
                key={team.id}
                type="button"
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 focus-visible:ring-offset-2 rounded-lg"
                onClick={() => onSelectTeam(team)}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md hover:border-[#1D4ED8]/40 active:scale-[0.98]",
                    "min-h-[240px] overflow-hidden"
                  )}
                >
                  {/* Coloured top bar */}
                  <div className="h-1.5 w-full bg-[#1D4ED8]" />

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

                    {/* Team Rating Badge */}
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                      <Star className="h-4 w-4 text-[#1D4ED8]" />
                      <span className="text-sm font-medium text-[#0B2545]">
                        Team Rating:{" "}
                        <span className="text-[#1D4ED8]">
                          {rating.toFixed(1)}/5.0
                        </span>
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2.5 min-h-[36px]">
                        <Users className="h-4 w-4 shrink-0 text-[#1D4ED8]" />
                        <span>
                          <span className="font-medium text-[#0B2545]">
                            {team.playerCount}
                          </span>{" "}
                          Players
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 min-h-[36px]">
                        <Calendar className="h-4 w-4 shrink-0 text-[#15803D]" />
                        <span>
                          Next Training:{" "}
                          <span className="font-medium text-[#0B2545]">
                            {team.nextTraining}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 min-h-[36px]">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
