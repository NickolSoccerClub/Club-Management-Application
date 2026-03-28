"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
  Target,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface SkillAssessment {
  passing: number;
  shooting: number;
  dribbling: number;
  defending: number;
  teamwork: number;
  fitness: number;
}

interface PlayerDev {
  id: number;
  name: string;
  team: string;
  ageGroup: string;
  skills: SkillAssessment;
  coachNotes: string;
  goals: string[];
  avatar: string;
}

const MOCK_PLAYERS: PlayerDev[] = [
  {
    id: 1, name: "Liam Carter", team: "Sharks", ageGroup: "U12",
    skills: { passing: 7, shooting: 5, dribbling: 6, defending: 4, teamwork: 8, fitness: 6 },
    coachNotes: "Excellent vision and passing range. Needs to work on defensive positioning and weak foot shooting.",
    goals: ["Improve weak foot accuracy", "Increase defensive contribution"],
    avatar: "LC",
  },
  {
    id: 2, name: "Olivia Bennett", team: "Dolphins", ageGroup: "U10",
    skills: { passing: 6, shooting: 7, dribbling: 8, defending: 5, teamwork: 7, fitness: 7 },
    coachNotes: "Natural dribbler with good pace. Working on decision-making in the final third.",
    goals: ["Better shot selection", "Improve passing in tight spaces"],
    avatar: "OB",
  },
  {
    id: 3, name: "Noah Patel", team: "Eagles", ageGroup: "U14",
    skills: { passing: 8, shooting: 6, dribbling: 5, defending: 7, teamwork: 9, fitness: 8 },
    coachNotes: "Strong leader and excellent communicator. Captain material. Working on first touch under pressure.",
    goals: ["First touch improvement", "Long-range passing accuracy"],
    avatar: "NP",
  },
  {
    id: 4, name: "Emma Nguyen", team: "Sharks", ageGroup: "U12",
    skills: { passing: 5, shooting: 8, dribbling: 7, defending: 3, teamwork: 6, fitness: 5 },
    coachNotes: "Clinical finisher with natural goal-scoring instinct. Needs to work on defensive work rate and stamina.",
    goals: ["Improve fitness levels", "Track back more consistently"],
    avatar: "EN",
  },
  {
    id: 5, name: "Oliver Smith", team: "Thunder", ageGroup: "U16",
    skills: { passing: 7, shooting: 7, dribbling: 6, defending: 8, teamwork: 8, fitness: 9 },
    coachNotes: "Versatile player who can play multiple positions. Very fit and committed. Working on composure on the ball.",
    goals: ["Composure under pressure", "Develop leadership skills"],
    avatar: "OS",
  },
  {
    id: 6, name: "Charlotte Jones", team: "Dolphins", ageGroup: "U10",
    skills: { passing: 4, shooting: 3, dribbling: 5, defending: 6, teamwork: 7, fitness: 6 },
    coachNotes: "Enthusiastic and improving rapidly. Good defensive awareness for her age. Building confidence with the ball.",
    goals: ["Build confidence in possession", "Shooting technique"],
    avatar: "CJ",
  },
];

const SKILL_LABELS: (keyof SkillAssessment)[] = ["passing", "shooting", "dribbling", "defending", "teamwork", "fitness"];

/* ------------------------------------------------------------------ */
/*  Radar Chart (SVG)                                                  */
/* ------------------------------------------------------------------ */

function SkillRadar({ skills }: { skills: SkillAssessment }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 55;
  const levels = 5;

  // Generate hexagon points
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPaths = Array.from({ length: levels }, (_, lvl) => {
    const val = ((lvl + 1) / levels) * 10;
    const pts = SKILL_LABELS.map((_, i) => getPoint(i, val));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";
  });

  const dataPoints = SKILL_LABELS.map((key, i) => getPoint(i, skills[key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  const labelPoints = SKILL_LABELS.map((_, i) => getPoint(i, 12.5));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
      ))}
      {/* Axes */}
      {SKILL_LABELS.map((_, i) => {
        const p = getPoint(i, 10);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      {/* Data */}
      <path d={dataPath} fill="rgba(29,78,216,0.15)" stroke="#1D4ED8" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#1D4ED8" />
      ))}
      {/* Labels */}
      {SKILL_LABELS.map((label, i) => (
        <text
          key={label}
          x={labelPoints[i].x}
          y={labelPoints[i].y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-500"
          fontSize="7"
          fontWeight="500"
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlayerDevelopmentPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PLAYERS.filter(
      (p) => !q || p.name.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-[#0B2545]">Player Development</h2>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search player by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((player) => (
          <Card key={player.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-sm font-bold text-white">
                  {player.avatar}
                </div>
                <div>
                  <CardTitle className="text-base">{player.name}</CardTitle>
                  <div className="mt-1 flex gap-1.5">
                    <Badge variant="info">{player.ageGroup}</Badge>
                    <Badge>{player.team}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Radar Chart */}
              <div className="mx-auto h-40 w-40">
                <SkillRadar skills={player.skills} />
              </div>

              {/* Skill scores */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {SKILL_LABELS.map((key) => (
                  <div key={key} className="rounded-md bg-gray-50 px-2 py-1.5">
                    <p className="font-semibold text-[#0B2545]">{player.skills[key]}/10</p>
                    <p className="text-gray-500 capitalize">{key}</p>
                  </div>
                ))}
              </div>

              {/* Coach Notes */}
              <div>
                <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#0B2545]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Coach Notes
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">{player.coachNotes}</p>
              </div>

              {/* Goals */}
              <div>
                <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#0B2545]">
                  <Target className="h-3.5 w-3.5" />
                  Development Goals
                </h4>
                <ul className="space-y-1">
                  {player.goals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                      <ChevronRight className="h-3 w-3 text-[#1D4ED8]" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <TrendingUp className="mb-3 h-10 w-10" />
          <p className="text-sm">No players match your search.</p>
        </div>
      )}
    </div>
  );
}
