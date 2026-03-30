"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/ui/skeleton";
import {
  Plus,
  Clock,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TrainingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  focusArea: string;
  location: string;
  rsvpYes: number;
  rsvpTotal: number;
  status: "upcoming" | "completed";
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_SESSIONS: TrainingSession[] = [
  { id: "ts-1", title: "Passing & Movement", date: "2026-04-01", time: "16:00", focusArea: "Passing", location: "Nickol West Oval", rsvpYes: 12, rsvpTotal: 14, status: "upcoming" },
  { id: "ts-2", title: "Shooting & Finishing", date: "2026-04-03", time: "16:00", focusArea: "Shooting", location: "Nickol West Oval", rsvpYes: 10, rsvpTotal: 14, status: "upcoming" },
  { id: "ts-3", title: "Defending Fundamentals", date: "2026-03-27", time: "16:00", focusArea: "Defending", location: "Nickol West Oval", rsvpYes: 13, rsvpTotal: 14, status: "completed" },
  { id: "ts-4", title: "Dribbling Under Pressure", date: "2026-03-25", time: "16:00", focusArea: "Dribbling", location: "Nickol West Oval", rsvpYes: 11, rsvpTotal: 14, status: "completed" },
  { id: "ts-5", title: "Game Awareness & Positioning", date: "2026-03-20", time: "16:00", focusArea: "Tactical", location: "Nickol West Oval", rsvpYes: 14, rsvpTotal: 14, status: "completed" },
  { id: "ts-6", title: "First Touch Control", date: "2026-03-18", time: "16:00", focusArea: "Dribbling", location: "Nickol West Oval", rsvpYes: 12, rsvpTotal: 14, status: "completed" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type FilterValue = "upcoming" | "past" | "all";

const FOCUS_BADGE_VARIANT: Record<string, "info" | "success" | "warning" | "danger" | "default"> = {
  Passing: "info",
  Shooting: "danger",
  Defending: "warning",
  Dribbling: "success",
  Tactical: "default",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${suffix}`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrainingSessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("upcoming");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = MOCK_SESSIONS.filter((s) => {
    if (filter === "upcoming") return s.status === "upcoming";
    if (filter === "past") return s.status === "completed";
    return true;
  });

  /* ----- Loading skeleton ----- */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-52 animate-pulse rounded-md bg-gray-200" />
          <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  /* ----- Loaded ----- */
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#0B2545] md:text-3xl">
          Training Sessions
        </h1>
        <Link href="/coach/training/create">
          <Button variant="accent" size="md" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Session
          </Button>
        </Link>
      </div>

      {/* Filter toggle */}
      <div className="mb-5 flex gap-2">
        {(["upcoming", "past", "all"] as FilterValue[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors min-h-[44px]",
              filter === f
                ? "bg-[#0B2545] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {f === "upcoming" ? "Upcoming" : f === "past" ? "Past" : "All"}
          </button>
        ))}
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Focus Area</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">RSVP</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((session, idx) => (
              <tr
                key={session.id}
                onClick={() => router.push(`/coach/training/${session.id}`)}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-blue-50/50 active:bg-blue-50",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                )}
              >
                <td className="px-4 py-3 font-medium text-[#0B2545]">
                  {formatDate(session.date)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatTime(session.time)}
                </td>
                <td className="px-4 py-3 font-medium text-[#0B2545]">
                  {session.title}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={FOCUS_BADGE_VARIANT[session.focusArea] || "default"}>
                    {session.focusArea}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{session.location}</td>
                <td className="px-4 py-3 text-gray-600">
                  {session.rsvpYes}/{session.rsvpTotal}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={session.status === "upcoming" ? "info" : "success"}>
                    {session.status === "upcoming" ? "Upcoming" : "Completed"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            No training sessions found for this filter.
          </div>
        )}
      </div>

      {/* Card list — mobile / tablet */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
            No training sessions found for this filter.
          </div>
        )}
        {filtered.map((session) => (
          <Link
            key={session.id}
            href={`/coach/training/${session.id}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#0B2545] truncate">
                  {session.title}
                </span>
                <Badge variant={session.status === "upcoming" ? "info" : "success"} className="shrink-0">
                  {session.status === "upcoming" ? "Upcoming" : "Completed"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(session.date)}, {formatTime(session.time)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {session.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {session.rsvpYes}/{session.rsvpTotal}
                </span>
              </div>
              <div className="mt-1.5">
                <Badge variant={FOCUS_BADGE_VARIANT[session.focusArea] || "default"}>
                  {session.focusArea}
                </Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}
