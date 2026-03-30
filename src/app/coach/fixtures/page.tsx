"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SkeletonTable } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                   */
/* ------------------------------------------------------------------ */

interface Fixture {
  id: string;
  date: string;
  time: string;
  opponent: string;
  venue: string;
  homeAway: "Home" | "Away";
  result: string | null;
  status: "upcoming" | "won" | "drew" | "lost";
}

const FIXTURES: Fixture[] = [
  { id: "f-1", date: "2026-04-05", time: "09:30", opponent: "Karratha City U9", venue: "Nickol West Oval", homeAway: "Home", result: null, status: "upcoming" },
  { id: "f-2", date: "2026-04-12", time: "09:30", opponent: "Dampier Bay U9", venue: "Millstream Park", homeAway: "Away", result: null, status: "upcoming" },
  { id: "f-3", date: "2026-04-19", time: "09:30", opponent: "Pilbara United U9", venue: "Nickol West Oval", homeAway: "Home", result: null, status: "upcoming" },
  { id: "f-4", date: "2026-03-29", time: "09:30", opponent: "Karratha Rangers U9", venue: "Nickol West Oval", homeAway: "Home", result: "3-1", status: "won" },
  { id: "f-5", date: "2026-03-22", time: "09:30", opponent: "Dampier Sharks U9", venue: "Dampier Oval", homeAway: "Away", result: "2-2", status: "drew" },
  { id: "f-6", date: "2026-03-15", time: "09:30", opponent: "Karratha City U9", venue: "Millstream Park", homeAway: "Away", result: "1-3", status: "lost" },
  { id: "f-7", date: "2026-03-08", time: "09:30", opponent: "Pilbara United U9", venue: "Nickol West Oval", homeAway: "Home", result: "4-0", status: "won" },
  { id: "f-8", date: "2026-03-01", time: "09:30", opponent: "Dampier Bay U9", venue: "Dampier Oval", homeAway: "Away", result: "2-1", status: "won" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS_BADGE: Record<string, { variant: "info" | "success" | "warning" | "danger"; label: string }> = {
  upcoming: { variant: "info", label: "Upcoming" },
  won: { variant: "success", label: "Won" },
  drew: { variant: "warning", label: "Drew" },
  lost: { variant: "danger", label: "Lost" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

const FILTER_OPTIONS = [
  { label: "All Fixtures", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function FixturesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "upcoming") return FIXTURES.filter((f) => f.status === "upcoming");
    if (filter === "completed") return FIXTURES.filter((f) => f.status !== "upcoming");
    return FIXTURES;
  }, [filter]);

  /* Season record */
  const wins = FIXTURES.filter((f) => f.status === "won").length;
  const draws = FIXTURES.filter((f) => f.status === "drew").length;
  const losses = FIXTURES.filter((f) => f.status === "lost").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#0B2545]">Fixtures</h2>
          <Badge variant="info" className="text-xs">
            {wins}W - {draws}D - {losses}L
          </Badge>
        </div>
        <div className="w-48">
          <Select
            options={FILTER_OPTIONS}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} cols={7} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Opponent</th>
                <th className="px-4 py-3 hidden sm:table-cell">Venue</th>
                <th className="px-4 py-3">H/A</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fixture, idx) => {
                const badge = STATUS_BADGE[fixture.status];
                return (
                  <tr
                    key={fixture.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-blue-50/50",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                    onClick={() => router.push(`/coach/fixtures/${fixture.id}`)}
                    style={{ minHeight: 56 }}
                  >
                    <td className="px-4 py-3.5 font-medium text-[#0B2545]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0 hidden md:block" />
                        {formatDate(fixture.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400 shrink-0 hidden md:block" />
                        {fixture.time}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#0B2545]">{fixture.opponent}</td>
                    <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{fixture.venue}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={fixture.homeAway === "Home" ? "success" : "info"}>
                        {fixture.homeAway}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#0B2545]">
                      {fixture.result || "--"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Trophy className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No fixtures match the current filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
