"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Trophy,
  Dumbbell,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

interface SkillRating {
  name: string;
  rating: number;
  maxRating: number;
}

interface CoachAssessment {
  id: string;
  date: string;
  coachName: string;
  note: string;
  skills: string[];
}

interface SeasonComparison {
  category: string;
  lastSeason: number;
  thisSeason: number;
}

const CHILD_INFO = {
  name: "Emma Richardson",
  team: "Nickol Thunder",
  ageGroup: "Under 9s",
  jerseyNumber: 8,
};

const SEASON_STATS = [
  { label: "Games Played", value: "8", icon: Trophy, color: "text-[#1D4ED8]", bg: "bg-blue-50" },
  { label: "Goals Scored", value: "5", icon: BarChart3, color: "text-[#15803D]", bg: "bg-green-50" },
  { label: "Training Att.", value: "87%", icon: Dumbbell, color: "text-[#B45309]", bg: "bg-amber-50" },
  { label: "Coach Rating", value: "4.2", icon: Star, color: "text-[#7C3AED]", bg: "bg-purple-50", isStarRating: true },
];

const SKILLS: SkillRating[] = [
  { name: "Passing", rating: 7, maxRating: 10 },
  { name: "Shooting", rating: 6, maxRating: 10 },
  { name: "Dribbling", rating: 8, maxRating: 10 },
  { name: "Defending", rating: 5, maxRating: 10 },
  { name: "Teamwork", rating: 9, maxRating: 10 },
  { name: "Fitness", rating: 7, maxRating: 10 },
];

const ASSESSMENTS: CoachAssessment[] = [
  {
    id: "ca1",
    date: "25 Mar 2026",
    coachName: "Coach Josh",
    note: "Emma showed great improvement in her passing this week. She was confident playing one-touch passes and her positioning off the ball was excellent. Keep encouraging her to try through-balls.",
    skills: ["Passing", "Teamwork"],
  },
  {
    id: "ca2",
    date: "18 Mar 2026",
    coachName: "Coach Josh",
    note: "Solid performance in the match. Emma made some brave tackles in midfield and distributed the ball well. Could work on shooting with her weaker foot.",
    skills: ["Defending", "Shooting"],
  },
  {
    id: "ca3",
    date: "11 Mar 2026",
    coachName: "Coach Josh",
    note: "Emma was player of the training session today. Her dribbling in tight spaces has come on leaps and bounds. She's a great role model for the younger players in terms of effort and attitude.",
    skills: ["Dribbling", "Teamwork", "Fitness"],
  },
];

const SEASON_COMPARISON: SeasonComparison[] = [
  { category: "Goals", lastSeason: 3, thisSeason: 5 },
  { category: "Assists", lastSeason: 2, thisSeason: 4 },
  { category: "Attendance %", lastSeason: 75, thisSeason: 87 },
  { category: "Coach Rating", lastSeason: 3.5, thisSeason: 4.2 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function skillColor(rating: number) {
  if (rating >= 8) return "bg-[#15803D]";
  if (rating >= 5) return "bg-[#1D4ED8]";
  return "bg-[#B45309]";
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.3;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < full
              ? "fill-[#B45309] text-[#B45309]"
              : i === full && hasHalf
              ? "fill-[#B45309]/40 text-[#B45309]"
              : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StatsTab() {
  return (
    <div className="space-y-6">
      {/* ---- Child Profile Header ---- */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-xl font-bold text-white">
            {CHILD_INFO.jerseyNumber}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0B2545]">
              {CHILD_INFO.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="info">{CHILD_INFO.ageGroup}</Badge>
              <Badge>{CHILD_INFO.team}</Badge>
              <Badge variant="default">#{CHILD_INFO.jerseyNumber}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Season Stats (horizontal scroll) ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Season Stats
        </h2>
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 snap-x">
            {SEASON_STATS.map((stat) => (
              <Card
                key={stat.label}
                className="min-w-[140px] shrink-0 snap-start md:min-w-0"
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        stat.bg
                      )}
                    >
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </p>
                  {stat.isStarRating ? (
                    <div className="mt-1">
                      <StarRating value={parseFloat(stat.value)} />
                      <p className="mt-0.5 text-sm text-gray-500">
                        {stat.value} / 5
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-[#0B2545]">
                      {stat.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Skill Development ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Skill Development
        </h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            {SKILLS.map((skill) => {
              const pct = (skill.rating / skill.maxRating) * 100;
              return (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0B2545]">
                      {skill.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      {skill.rating}/{skill.maxRating}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        skillColor(skill.rating)
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* ---- Coach Assessments ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Coach Assessments
        </h2>
        <div className="space-y-2">
          {ASSESSMENTS.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B2545]">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#0B2545]">
                      {a.coachName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{a.date}</span>
                </div>
                <p className="mb-2 text-sm text-gray-600 leading-relaxed">
                  {a.note}
                </p>
                <div className="flex flex-wrap gap-1">
                  {a.skills.map((s) => (
                    <Badge key={s} variant="info">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Season Comparison ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          This Season vs Last Season
        </h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            {SEASON_COMPARISON.map((comp) => {
              const improved = comp.thisSeason > comp.lastSeason;
              const declined = comp.thisSeason < comp.lastSeason;
              const maxVal = Math.max(comp.lastSeason, comp.thisSeason, 1);
              const lastPct = (comp.lastSeason / (maxVal * 1.2)) * 100;
              const thisPct = (comp.thisSeason / (maxVal * 1.2)) * 100;

              return (
                <div key={comp.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0B2545]">
                      {comp.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {improved ? (
                        <TrendingUp className="h-4 w-4 text-[#15803D]" />
                      ) : declined ? (
                        <TrendingDown className="h-4 w-4 text-[#B91C1C]" />
                      ) : null}
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          improved
                            ? "text-[#15803D]"
                            : declined
                            ? "text-[#B91C1C]"
                            : "text-gray-400"
                        )}
                      >
                        {improved ? "+" : ""}
                        {(comp.thisSeason - comp.lastSeason).toFixed(
                          Number.isInteger(comp.thisSeason - comp.lastSeason)
                            ? 0
                            : 1
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-gray-400">
                        Last
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-400"
                          style={{ width: `${lastPct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-gray-500">
                        {comp.lastSeason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-[#1D4ED8]">
                        This
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            improved ? "bg-[#15803D]" : declined ? "bg-[#B91C1C]" : "bg-[#1D4ED8]"
                          )}
                          style={{ width: `${thisPct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-semibold text-[#0B2545]">
                        {comp.thisSeason}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
