"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import {
  Clipboard,
  Trophy,
  Users,
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  BarChart3,
  Star,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Section card data                                                  */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  {
    title: "Training",
    href: "/coach/training",
    icon: Clipboard,
    colour: "#1D4ED8",
    bg: "bg-blue-50",
    subtitle: "Manage sessions & drills",
    badge: "2 this week",
  },
  {
    title: "Fixtures",
    href: "/coach/fixtures",
    icon: Trophy,
    colour: "#15803D",
    bg: "bg-green-50",
    subtitle: "Matches & match day",
    badge: "Next: Sat 5 Apr",
  },
  {
    title: "Players",
    href: "/coach/players",
    icon: Users,
    colour: "#B45309",
    bg: "bg-amber-50",
    subtitle: "Roster & development",
    badge: "14 players",
  },
  {
    title: "Drills",
    href: "/coach/drills",
    icon: BookOpen,
    colour: "#7C3AED",
    bg: "bg-purple-50",
    subtitle: "Browse drill library",
    badge: "23 drills",
  },
  {
    title: "Coach Niko",
    href: "/coach/niko",
    icon: Brain,
    colour: "#0B2545",
    bg: "bg-slate-100",
    subtitle: "AI coaching assistant",
    badge: "sparkles",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Quick stat data                                                    */
/* ------------------------------------------------------------------ */

const QUICK_STATS = [
  {
    label: "Next Training",
    value: "Tue 1 Apr, 4:00 PM",
    icon: Calendar,
    colour: "#1D4ED8",
  },
  {
    label: "Season Record",
    value: "5W - 1D - 2L",
    icon: TrendingUp,
    colour: "#15803D",
  },
  {
    label: "Attendance Rate",
    value: "87%",
    icon: BarChart3,
    colour: "#B45309",
  },
  {
    label: "Team Rating",
    value: "3.4 / 5.0",
    icon: Star,
    colour: "#7C3AED",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function CoachPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* ----- Loading skeleton ----- */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
        {/* Welcome skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
          <div className="h-5 w-64 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Quick stats skeleton */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[160px] flex-1 animate-pulse rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
              <div className="h-5 w-28 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Section cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="min-h-[140px]" />
          ))}
        </div>
      </div>
    );
  }

  /* ----- Loaded content ----- */
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      {/* ---- Welcome header ---- */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0B2545] md:text-3xl">
            G&apos;day, Sarah
          </h1>
          <Badge variant="info" className="hidden sm:inline-flex">
            Season 2026
          </Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500 md:text-base">
          Nickol Thunder — U9 Division 1
        </p>
      </div>

      {/* ---- Quick stats row ---- */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {QUICK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="min-w-[160px] flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-1 flex items-center gap-2">
              <stat.icon
                className="h-4 w-4"
                style={{ color: stat.colour }}
              />
              <span className="text-xs font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#0B2545] md:text-base">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Section cards ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            {/* Badge — top right */}
            <div className="absolute right-4 top-4">
              {section.badge === "sparkles" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-[#0B2545]">
                  <Sparkles className="h-3 w-3" />
                  AI
                </span>
              ) : (
                <Badge variant="default">{section.badge}</Badge>
              )}
            </div>

            {/* Icon + text */}
            <div>
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                  section.bg
                )}
              >
                <section.icon
                  className="h-6 w-6"
                  style={{ color: section.colour }}
                />
              </div>
              <h2 className="text-lg font-bold text-[#0B2545]">
                {section.title}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {section.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
