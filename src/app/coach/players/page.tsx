"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SkeletonTable } from "@/components/ui/skeleton";
import {
  Search,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                   */
/* ------------------------------------------------------------------ */

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  jerseyNumber: number;
  gradeScore: number;
  medicalAlert: boolean;
  rsvpStatus: "confirmed" | "declined" | "pending";
}

const PLAYERS: Player[] = [
  { id: "p-1", name: "Liam Carter", position: "FWD", age: 8, jerseyNumber: 9, gradeScore: 4.2, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-2", name: "Noah Williams", position: "MID", age: 8, jerseyNumber: 8, gradeScore: 3.8, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-3", name: "Ethan Brown", position: "DEF", age: 9, jerseyNumber: 4, gradeScore: 3.5, medicalAlert: true, rsvpStatus: "confirmed" },
  { id: "p-4", name: "Oliver Smith", position: "GK", age: 9, jerseyNumber: 1, gradeScore: 4.0, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-5", name: "Jack Taylor", position: "DEF", age: 8, jerseyNumber: 5, gradeScore: 3.2, medicalAlert: false, rsvpStatus: "pending" },
  { id: "p-6", name: "Lucas Martin", position: "MID", age: 9, jerseyNumber: 10, gradeScore: 4.5, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-7", name: "Henry Jones", position: "FWD", age: 8, jerseyNumber: 11, gradeScore: 3.9, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-8", name: "Mason Wilson", position: "DEF", age: 8, jerseyNumber: 3, gradeScore: 3.0, medicalAlert: false, rsvpStatus: "declined" },
  { id: "p-9", name: "James Anderson", position: "MID", age: 9, jerseyNumber: 7, gradeScore: 3.7, medicalAlert: true, rsvpStatus: "confirmed" },
  { id: "p-10", name: "Leo Thomas", position: "DEF", age: 8, jerseyNumber: 2, gradeScore: 2.8, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-11", name: "Charlie Jackson", position: "FWD", age: 9, jerseyNumber: 14, gradeScore: 3.4, medicalAlert: false, rsvpStatus: "pending" },
  { id: "p-12", name: "Archie White", position: "MID", age: 8, jerseyNumber: 6, gradeScore: 3.1, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-13", name: "Oscar Harris", position: "DEF", age: 9, jerseyNumber: 12, gradeScore: 2.5, medicalAlert: false, rsvpStatus: "confirmed" },
  { id: "p-14", name: "George Clark", position: "FWD", age: 8, jerseyNumber: 13, gradeScore: 3.6, medicalAlert: false, rsvpStatus: "confirmed" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function gradeVariant(score: number): "success" | "warning" | "danger" | "info" {
  if (score >= 4.0) return "success";
  if (score >= 3.0) return "info";
  if (score >= 2.0) return "warning";
  return "danger";
}

const RSVP_CONFIG: Record<string, { icon: React.ElementType; className: string; label: string }> = {
  confirmed: { icon: CheckCircle2, className: "text-[#15803D]", label: "Yes" },
  declined: { icon: XCircle, className: "text-[#B91C1C]", label: "No" },
  pending: { icon: Clock, className: "text-[#B45309]", label: "Pending" },
};

const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name" },
  { label: "Grade (High-Low)", value: "grade" },
  { label: "Position", value: "position" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function PlayersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let results = PLAYERS.filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.jerseyNumber.toString().includes(q)
      );
    });

    results.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "grade") return b.gradeScore - a.gradeScore;
      if (sortBy === "position") return a.position.localeCompare(b.position);
      return 0;
    });

    return results;
  }, [search, sortBy]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#0B2545]">Players</h2>
          <Badge variant="info" className="text-xs">
            {PLAYERS.length} players
          </Badge>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-48">
          <Select
            label="Sort by"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3 hidden sm:table-cell">Age</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3 hidden md:table-cell">Medical</th>
                <th className="px-4 py-3">RSVP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player, idx) => {
                const rsvp = RSVP_CONFIG[player.rsvpStatus];
                const RsvpIcon = rsvp.icon;
                return (
                  <tr
                    key={player.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-blue-50/50",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                    onClick={() => router.push(`/coach/players/${player.id}`)}
                    style={{ minHeight: 56 }}
                  >
                    <td className="px-4 py-3.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[#0B2545]">
                        {player.jerseyNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#0B2545]">{player.name}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="default">{player.position}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">{player.age}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={gradeVariant(player.gradeScore)}>
                        {player.gradeScore.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {player.medicalAlert && (
                        <div className="flex items-center gap-1 text-[#B91C1C]">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Alert</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={cn("flex items-center gap-1", rsvp.className)}>
                        <RsvpIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{rsvp.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No players match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
