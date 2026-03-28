"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Send,
  Edit2,
  Trash2,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type GameStatus = "Published" | "Draft" | "Cancelled";

interface ScheduleRow {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  field: string;
  ageGroup: string;
  round: string;
  status: GameStatus;
}

const MOCK_SCHEDULE: ScheduleRow[] = [
  { id: 1, date: "05 Apr 2026", time: "08:00", home: "Nickol Thunder", away: "Karratha United U7", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U7", round: "Round 1", status: "Published" },
  { id: 2, date: "05 Apr 2026", time: "08:00", home: "Nickol Lightning", away: "Dampier Sharks U7", venue: "Nickol West Oval", field: "Field 2", ageGroup: "U7", round: "Round 1", status: "Published" },
  { id: 3, date: "05 Apr 2026", time: "09:30", home: "Nickol Storm", away: "Karratha City U9", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U9", round: "Round 1", status: "Published" },
  { id: 4, date: "05 Apr 2026", time: "09:30", home: "Nickol Blaze", away: "Dampier Bay U9", venue: "Nickol West Oval", field: "Field 2", ageGroup: "U9", round: "Round 1", status: "Draft" },
  { id: 5, date: "05 Apr 2026", time: "11:00", home: "Nickol Titans", away: "Karratha Rangers U11", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U11", round: "Round 1", status: "Published" },
  { id: 6, date: "12 Apr 2026", time: "08:00", home: "Karratha United U7", away: "Nickol Thunder", venue: "Millstream Park", field: "Main", ageGroup: "U7", round: "Round 2", status: "Draft" },
  { id: 7, date: "12 Apr 2026", time: "09:30", home: "Karratha City U9", away: "Nickol Storm", venue: "Millstream Park", field: "Main", ageGroup: "U9", round: "Round 2", status: "Draft" },
  { id: 8, date: "12 Apr 2026", time: "11:00", home: "Nickol Hawks", away: "Dampier Eagles U13", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U13", round: "Round 1", status: "Published" },
  { id: 9, date: "12 Apr 2026", time: "13:00", home: "Nickol Eagles", away: "Karratha FC U15", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U15", round: "Round 1", status: "Published" },
  { id: 10, date: "12 Apr 2026", time: "15:00", home: "Nickol Wolves", away: "Pilbara United U17", venue: "Nickol West Oval", field: "Field 1", ageGroup: "U17", round: "Round 1", status: "Draft" },
  { id: 11, date: "19 Apr 2026", time: "08:00", home: "Dampier Sharks U7", away: "Nickol Lightning", venue: "Dampier Oval", field: "South", ageGroup: "U7", round: "Round 2", status: "Draft" },
  { id: 12, date: "19 Apr 2026", time: "09:30", home: "Nickol Blaze", away: "Karratha City U9", venue: "Nickol West Oval", field: "Field 2", ageGroup: "U9", round: "Round 2", status: "Cancelled" },
  { id: 13, date: "19 Apr 2026", time: "11:00", home: "Karratha Rangers U11", away: "Nickol Titans", venue: "Millstream Park", field: "Main", ageGroup: "U11", round: "Round 2", status: "Draft" },
  { id: 14, date: "26 Apr 2026", time: "13:00", home: "Karratha FC U15", away: "Nickol Eagles", venue: "Millstream Park", field: "Main", ageGroup: "U15", round: "Round 2", status: "Draft" },
  { id: 15, date: "26 Apr 2026", time: "15:00", home: "Pilbara United U17", away: "Nickol Wolves", venue: "Pilbara Sports Complex", field: "A", ageGroup: "U17", round: "Round 2", status: "Draft" },
];

const STATUS_VARIANT: Record<GameStatus, "success" | "default" | "danger"> = {
  Published: "success",
  Draft: "default",
  Cancelled: "danger",
};

const AGE_GROUPS = ["All", "U7", "U9", "U11", "U13", "U15", "U17"];
const ROUNDS = ["All", "Round 1", "Round 2"];
const STATUSES: GameStatus[] = ["Published", "Draft", "Cancelled"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ScheduleManagementPage() {
  const [ageFilter, setAgeFilter] = useState("All");
  const [roundFilter, setRoundFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_SCHEDULE.filter((g) => {
      const matchAge = ageFilter === "All" || g.ageGroup === ageFilter;
      const matchRound = roundFilter === "All" || g.round === roundFilter;
      const matchStatus = statusFilter === "All" || g.status === statusFilter;
      return matchAge && matchRound && matchStatus;
    });
  }, [ageFilter, roundFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: MOCK_SCHEDULE.length,
    published: MOCK_SCHEDULE.filter((g) => g.status === "Published").length,
    unpublished: MOCK_SCHEDULE.filter((g) => g.status === "Draft").length,
    cancelled: MOCK_SCHEDULE.filter((g) => g.status === "Cancelled").length,
  }), []);

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((g) => g.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Schedule Management</h2>
          <p className="text-sm text-gray-500">Manage game fixtures and publish schedules</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowImport(!showImport)}>
            <Upload className="mr-1.5 h-4 w-4" />
            Import Schedule
          </Button>
          <Button variant="accent" size="sm">
            <Send className="mr-1.5 h-4 w-4" />
            Publish All
          </Button>
        </div>
      </div>

      {/* Import area */}
      {showImport && (
        <div className="rounded-lg border-2 border-dashed border-[#1D4ED8]/30 bg-blue-50/50 p-8 text-center">
          <Upload className="mx-auto h-10 w-10 text-[#1D4ED8]/50" />
          <p className="mt-3 text-sm font-medium text-[#0B2545]">
            Drop your schedule file here or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Accepts .xlsx and .csv files exported from league management
          </p>
          <Button variant="accent" size="sm" className="mt-4">
            Select File
          </Button>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Games", value: stats.total, icon: CalendarDays, color: "#1D4ED8", bg: "#EFF6FF" },
          { label: "Published", value: stats.published, icon: CheckCircle2, color: "#15803D", bg: "#F0FDF4" },
          { label: "Unpublished", value: stats.unpublished, icon: Clock, color: "#B45309", bg: "#FFFBEB" },
          { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "#B91C1C", bg: "#FEF2F2" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: s.bg }}>
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-[#0B2545]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
        {[
          { label: "Age Group", value: ageFilter, setter: setAgeFilter, options: AGE_GROUPS },
          { label: "Round", value: roundFilter, setter: setRoundFilter, options: ROUNDS },
          { label: "Status", value: statusFilter, setter: setStatusFilter, options: ["All", ...STATUSES] },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1 block text-xs font-medium text-gray-500">{f.label}</label>
            <select
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-[#1D4ED8]/20 bg-blue-50 px-4 py-3">
          <span className="text-sm font-medium text-[#1D4ED8]">{selected.size} selected</span>
          <Button variant="accent" size="sm">Publish Selected</Button>
          <Button variant="danger" size="sm">Cancel Selected</Button>
        </div>
      )}

      {/* Data table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3">Away</th>
              <th className="px-4 py-3 hidden lg:table-cell">Venue</th>
              <th className="px-4 py-3 hidden xl:table-cell">Field</th>
              <th className="px-4 py-3 hidden md:table-cell">Age Group</th>
              <th className="px-4 py-3 hidden md:table-cell">Round</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">No games match the current filters.</td>
              </tr>
            ) : (
              filtered.map((game, idx) => (
                <tr
                  key={game.id}
                  className={cn(
                    "border-t border-gray-100 transition-colors hover:bg-blue-50/40",
                    idx % 2 === 1 && "bg-[#F8FAFC]",
                    selected.has(game.id) && "bg-blue-50"
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(game.id)}
                      onChange={() => toggleRow(game.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{game.date}</td>
                  <td className="px-4 py-3 text-gray-600">{game.time}</td>
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{game.home}</td>
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{game.away}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{game.venue}</td>
                  <td className="px-4 py-3 text-gray-500 hidden xl:table-cell">{game.field}</td>
                  <td className="px-4 py-3 hidden md:table-cell"><Badge variant="info">{game.ageGroup}</Badge></td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{game.round}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[game.status]}>{game.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-[#B91C1C]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
