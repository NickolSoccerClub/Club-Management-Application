"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/committee/shared/page-header";
import { StatCard } from "@/components/committee/shared/stat-card";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
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
  const [isLoading, setIsLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState("All");
  const [roundFilter, setRoundFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showImport, setShowImport] = useState(false);

  // Confirm dialog states
  const [publishAllOpen, setPublishAllOpen] = useState(false);
  const [publishSelectedOpen, setPublishSelectedOpen] = useState(false);
  const [cancelSelectedOpen, setCancelSelectedOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleRow | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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

  /* -- Confirm handlers -- */

  const handlePublishAll = () => {
    addToast("All games published", "success");
  };

  const handlePublishSelected = () => {
    addToast(`${selected.size} games published`, "success");
    setSelected(new Set());
  };

  const handleCancelSelected = () => {
    addToast(`${selected.size} games cancelled`, "success");
    setSelected(new Set());
  };

  const handleDeleteGame = () => {
    if (deleteTarget) {
      addToast(`Game deleted: ${deleteTarget.home} vs ${deleteTarget.away}`, "success");
      setDeleteTarget(null);
    }
  };

  /* -- Select options -- */

  const ageOptions = AGE_GROUPS.map((v) => ({ label: v, value: v }));
  const roundOptions = ROUNDS.map((v) => ({ label: v, value: v }));
  const statusOptions = ["All", ...STATUSES].map((v) => ({ label: v, value: v }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Schedule Management"
        subtitle="Manage game fixtures and publish schedules"
      >
        <Button variant="secondary" size="sm" onClick={() => setShowImport(!showImport)}>
          <Upload className="mr-1.5 h-4 w-4" />
          Import Schedule
        </Button>
        <Button variant="accent" size="sm" onClick={() => setPublishAllOpen(true)}>
          <Send className="mr-1.5 h-4 w-4" />
          Publish All
        </Button>
      </PageHeader>

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
        <StatCard
          label="Total Games"
          value={stats.total}
          icon={CalendarDays}
          iconColor="text-[#1D4ED8]"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Published"
          value={stats.published}
          icon={CheckCircle2}
          iconColor="text-[#15803D]"
          iconBg="bg-[#F0FDF4]"
        />
        <StatCard
          label="Unpublished"
          value={stats.unpublished}
          icon={Clock}
          iconColor="text-[#B45309]"
          iconBg="bg-[#FFFBEB]"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          iconColor="text-[#B91C1C]"
          iconBg="bg-[#FEF2F2]"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <Select
          label="Age Group"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          options={ageOptions}
        />
        <Select
          label="Round"
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          options={roundOptions}
        />
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-[#1D4ED8]/20 bg-blue-50 px-4 py-3">
          <span className="text-sm font-medium text-[#1D4ED8]">{selected.size} selected</span>
          <Button variant="accent" size="sm" onClick={() => setPublishSelectedOpen(true)}>
            Publish Selected
          </Button>
          <Button variant="danger" size="sm" onClick={() => setCancelSelectedOpen(true)}>
            Cancel Selected
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={6} />
      ) : (
        /* Data table */
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
                  <td colSpan={11}>
                    <EmptyState
                      title="No games found"
                      description="No games match the current filters. Try adjusting your filter criteria."
                      className="border-0 rounded-none"
                    />
                  </td>
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
                        <button
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-[#B91C1C]"
                          onClick={() => setDeleteTarget(game)}
                        >
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
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={publishAllOpen}
        onOpenChange={setPublishAllOpen}
        title="Publish All Games"
        description="Are you sure you want to publish all draft games? This will make them visible to players and parents."
        confirmLabel="Publish All"
        variant="accent"
        onConfirm={handlePublishAll}
      />

      <ConfirmDialog
        open={publishSelectedOpen}
        onOpenChange={setPublishSelectedOpen}
        title="Publish Selected Games"
        description={`Are you sure you want to publish ${selected.size} selected game${selected.size === 1 ? "" : "s"}? This will make them visible to players and parents.`}
        confirmLabel="Publish Selected"
        variant="accent"
        onConfirm={handlePublishSelected}
      />

      <ConfirmDialog
        open={cancelSelectedOpen}
        onOpenChange={setCancelSelectedOpen}
        title="Cancel Selected Games"
        description={`Are you sure you want to cancel ${selected.size} selected game${selected.size === 1 ? "" : "s"}? Affected teams will be notified.`}
        confirmLabel="Cancel Games"
        variant="danger"
        onConfirm={handleCancelSelected}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Game"
        description={
          deleteTarget
            ? `Are you sure you want to delete the game between ${deleteTarget.home} and ${deleteTarget.away}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteGame}
      />
    </div>
  );
}
