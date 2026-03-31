"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import {
  Trophy,
  Target,
  Dumbbell,
  Star,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SkillScore {
  name: string;
  score: number; // 1-5
}

interface CoachAssessment {
  id: string;
  date: string;
  coachName: string;
  note: string;
  skills: SkillScore[];
}

interface SeasonComparison {
  metric: string;
  lastSeason: number;
  thisSeason: number;
  unit?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data — Emma (U9)                                              */
/* ------------------------------------------------------------------ */

const SEASON_SUMMARY = [
  { label: "Games Played", value: "12", icon: Trophy, color: "text-[#1D4ED8]", bg: "bg-blue-50" },
  { label: "Goals", value: "4", icon: Target, color: "text-[#15803D]", bg: "bg-green-50" },
  { label: "Training Attendance", value: "87%", icon: Dumbbell, color: "text-[#B45309]", bg: "bg-amber-50" },
  { label: "Coach Rating", value: "3.8/5.0", icon: Star, color: "text-[#7C3AED]", bg: "bg-purple-50" },
];

const RADAR_SKILLS: SkillScore[] = [
  { name: "Passing", score: 3.5 },
  { name: "Shooting", score: 2.8 },
  { name: "Dribbling", score: 4.0 },
  { name: "Defending", score: 2.5 },
  { name: "Teamwork", score: 4.2 },
  { name: "Fitness", score: 3.6 },
];

const SKILL_BREAKDOWN: SkillScore[] = [
  { name: "Passing", score: 3.5 },
  { name: "Shooting", score: 2.8 },
  { name: "Dribbling", score: 4.0 },
  { name: "Defending", score: 2.5 },
  { name: "Teamwork", score: 4.2 },
  { name: "Fitness", score: 3.6 },
];

const COACH_ASSESSMENTS: CoachAssessment[] = [
  {
    id: "a1",
    date: "22 Mar 2026",
    coachName: "Coach Sarah Mitchell",
    note: "Emma is showing real confidence on the ball this term. Her close control has improved markedly and she's starting to pick out passes that weren't in her game before. Keep encouraging her to use both feet.",
    skills: [
      { name: "Dribbling", score: 4 },
      { name: "Passing", score: 3.5 },
    ],
  },
  {
    id: "a2",
    date: "8 Mar 2026",
    coachName: "Coach Sarah Mitchell",
    note: "Great attitude at training today. Emma was first to arrive and helped set up the cones. Defensively she's still learning positional discipline, but her effort is 100% every session.",
    skills: [
      { name: "Teamwork", score: 4.5 },
      { name: "Defending", score: 2.5 },
    ],
  },
  {
    id: "a3",
    date: "23 Feb 2026",
    coachName: "Coach Sarah Mitchell",
    note: "Scored a lovely goal from outside the box in Saturday's match. She's gaining the confidence to shoot from distance, which is a big step for a U9 player. Fitness levels are good — she can run the full game without tiring.",
    skills: [
      { name: "Shooting", score: 3 },
      { name: "Fitness", score: 3.5 },
    ],
  },
];

const SEASON_COMPARISON: SeasonComparison[] = [
  { metric: "Goals", lastSeason: 2, thisSeason: 4 },
  { metric: "Assists", lastSeason: 1, thisSeason: 3 },
  { metric: "Attendance", lastSeason: 72, thisSeason: 87, unit: "%" },
  { metric: "Coach Rating", lastSeason: 3.2, thisSeason: 3.8 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function skillBarColor(score: number): string {
  if (score >= 4) return "bg-[#15803D]";
  if (score >= 3) return "bg-[#1D4ED8]";
  if (score >= 2) return "bg-[#B45309]";
  return "bg-[#B91C1C]";
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.3;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
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
/*  SVG Radar Chart                                                    */
/* ------------------------------------------------------------------ */

function RadarChart({ skills }: { skills: SkillScore[] }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 110;
  const levels = 5;
  const n = skills.length;

  // Angle per skill (starting from top, going clockwise)
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function polarToCartesian(angle: number, radius: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  // Grid rings
  const rings = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * maxRadius;
    const points = Array.from({ length: n }, (_, j) => {
      const angle = startAngle + j * angleStep;
      const p = polarToCartesian(angle, r);
      return `${p.x},${p.y}`;
    }).join(" ");
    return points;
  });

  // Data polygon
  const dataPoints = skills.map((skill, i) => {
    const angle = startAngle + i * angleStep;
    const r = (skill.score / 5) * maxRadius;
    const p = polarToCartesian(angle, r);
    return `${p.x},${p.y}`;
  });

  // Label positions
  const labels = skills.map((skill, i) => {
    const angle = startAngle + i * angleStep;
    const p = polarToCartesian(angle, maxRadius + 22);
    return { ...skill, x: p.x, y: p.y };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto w-full max-w-[280px]"
      aria-label="Skills radar chart"
    >
      {/* Grid rings */}
      {rings.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const p = polarToCartesian(angle, maxRadius);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints.join(" ")}
        fill="rgba(29,78,216,0.15)"
        stroke="#1D4ED8"
        strokeWidth={2}
      />

      {/* Data points */}
      {skills.map((skill, i) => {
        const angle = startAngle + i * angleStep;
        const r = (skill.score / 5) * maxRadius;
        const p = polarToCartesian(angle, r);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#1D4ED8"
            stroke="white"
            strokeWidth={2}
          />
        );
      })}

      {/* Labels */}
      {labels.map((label) => (
        <text
          key={label.name}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#0B2545] text-[11px] font-medium"
        >
          {label.name}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ParentStatsPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---- Section 1: Season Summary ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Season Summary
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SEASON_SUMMARY.map((stat) => (
            <Card key={stat.label}>
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
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-[#0B2545]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Section 2: Skills Radar Chart ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Skills Overview
        </h2>
        <Card>
          <CardContent className="p-4">
            <RadarChart skills={RADAR_SKILLS} />
            <p className="mt-2 text-center text-xs text-gray-400">
              Scores out of 5.0 — based on coach assessments
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ---- Section 3: Skill Breakdown ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Skill Breakdown
        </h2>
        <Card>
          <CardContent className="space-y-4 p-4">
            {SKILL_BREAKDOWN.map((skill) => {
              const pct = (skill.score / 5) * 100;
              return (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0B2545]">
                      {skill.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      {skill.score}/5
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        skillBarColor(skill.score)
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

      {/* ---- Section 4: Coach Assessments ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Coach Assessments
        </h2>
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

          {COACH_ASSESSMENTS.map((assessment, idx) => (
            <div key={assessment.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline dot */}
              <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B2545]">
                <User className="h-4 w-4 text-white" />
              </div>

              {/* Content */}
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#0B2545]">
                      {assessment.coachName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {assessment.date}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-600">
                    {assessment.note}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {assessment.skills.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 border border-gray-200"
                      >
                        <span className="text-xs font-medium text-[#0B2545]">
                          {s.name}
                        </span>
                        <StarRating value={s.score} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Section 5: Season Comparison ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Season Comparison
        </h2>
        <Card>
          <CardContent className="space-y-4 p-4">
            {SEASON_COMPARISON.map((comp) => {
              const improved = comp.thisSeason > comp.lastSeason;
              const declined = comp.thisSeason < comp.lastSeason;
              const diff = comp.thisSeason - comp.lastSeason;
              const maxVal = Math.max(comp.lastSeason, comp.thisSeason, 1);
              const lastPct = (comp.lastSeason / (maxVal * 1.2)) * 100;
              const thisPct = (comp.thisSeason / (maxVal * 1.2)) * 100;

              return (
                <div key={comp.metric}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0B2545]">
                      {comp.metric}
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
                        {Number.isInteger(diff) ? diff : diff.toFixed(1)}
                        {comp.unit ?? ""}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-gray-400">Last</span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-400"
                          style={{ width: `${lastPct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-xs font-medium text-gray-500">
                        {comp.lastSeason}{comp.unit ?? ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-[#1D4ED8]">This</span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            improved
                              ? "bg-[#15803D]"
                              : declined
                              ? "bg-[#B91C1C]"
                              : "bg-[#1D4ED8]"
                          )}
                          style={{ width: `${thisPct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-xs font-semibold text-[#0B2545]">
                        {comp.thisSeason}{comp.unit ?? ""}
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
