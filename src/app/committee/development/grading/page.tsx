"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/committee/shared/page-header";
import { StatCard } from "@/components/committee/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import { BIB_COLOURS, BIB_COLOUR_HEX } from "@/lib/data/grading-criteria";
import {
  Search,
  ClipboardList,
  Users,
  PlayCircle,
  BarChart3,
  Calendar,
  UserCheck,
  Eye,
  Sparkles,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface Grader {
  id: string;
  name: string;
  role: string;
  accredited: boolean;
}

interface GradingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  ageGroup: string;
  type: "training" | "formal";
  status: "scheduled" | "in_progress" | "completed";
  totalPlayers: number;
  playersGraded: number;
  assignedGraders: string[];
  gradingGroups: Record<string, number>;
}

// Approved graders master list
const APPROVED_GRADERS: Grader[] = [
  { id: "g1", name: "Sarah Mitchell", role: "Head Coach", accredited: true },
  { id: "g2", name: "David Chen", role: "Assistant Coach", accredited: true },
  { id: "g3", name: "Karen Williams", role: "Development Officer", accredited: true },
  { id: "g4", name: "Peter Reynolds", role: "Senior Coach", accredited: true },
  { id: "g5", name: "Lisa Thompson", role: "Coach", accredited: true },
  { id: "g6", name: "Robert Nguyen", role: "Coach", accredited: true },
  { id: "g7", name: "James Anderson", role: "External Assessor", accredited: true },
  { id: "g8", name: "Mark Davies", role: "Coach", accredited: true },
];

// Auto-created sessions from registrations
const MOCK_SESSIONS: GradingSession[] = [
  { id: "gs-1", title: "U7 Pre-Season Grading", date: "2026-04-05", time: "09:00", ageGroup: "U7", type: "formal", status: "completed", totalPlayers: 13, playersGraded: 13, assignedGraders: ["g1", "g3"], gradingGroups: { blue: 3, red: 3, green: 3, orange: 2, pink: 2 } },
  { id: "gs-2", title: "U9 Pre-Season Grading", date: "2026-04-05", time: "11:00", ageGroup: "U9", type: "formal", status: "completed", totalPlayers: 15, playersGraded: 15, assignedGraders: ["g1", "g2", "g4"], gradingGroups: { blue: 3, red: 3, green: 3, orange: 3, pink: 3 } },
  { id: "gs-3", title: "U11 Pre-Season Grading", date: "2026-04-06", time: "09:00", ageGroup: "U11", type: "formal", status: "in_progress", totalPlayers: 14, playersGraded: 8, assignedGraders: ["g2", "g4", "g5", "g6"], gradingGroups: { blue: 3, red: 3, green: 3, orange: 3, pink: 2 } },
  { id: "gs-4", title: "U13 Pre-Season Grading", date: "2026-04-12", time: "09:00", ageGroup: "U13", type: "formal", status: "scheduled", totalPlayers: 16, playersGraded: 0, assignedGraders: ["g1", "g4", "g7"], gradingGroups: { blue: 4, red: 3, green: 3, orange: 3, pink: 3 } },
  { id: "gs-5", title: "U15 Pre-Season Grading", date: "2026-04-19", time: "10:00", ageGroup: "U15", type: "formal", status: "scheduled", totalPlayers: 14, playersGraded: 0, assignedGraders: [], gradingGroups: { blue: 3, red: 3, green: 3, orange: 3, pink: 2 } },
  { id: "gs-6", title: "U7 Training Assessment", date: "2026-04-22", time: "16:00", ageGroup: "U7", type: "training", status: "scheduled", totalPlayers: 13, playersGraded: 0, assignedGraders: ["g1"], gradingGroups: { blue: 3, red: 3, green: 3, orange: 2, pink: 2 } },
];

const AGE_GROUPS = ["All", "U7", "U9", "U11", "U13", "U15"];
const STATUS_OPTIONS = ["All", "Scheduled", "In Progress", "Completed"];

const STATUS_MAP: Record<string, GradingSession["status"]> = {
  Scheduled: "scheduled",
  "In Progress": "in_progress",
  Completed: "completed",
};

const STATUS_BADGE_VARIANT: Record<GradingSession["status"], "default" | "info" | "success"> = {
  scheduled: "default",
  in_progress: "info",
  completed: "success",
};

const STATUS_LABEL: Record<GradingSession["status"], string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
};

const TYPE_BADGE_VARIANT: Record<GradingSession["type"], "info" | "warning"> = {
  training: "info",
  formal: "warning",
};

/* ------------------------------------------------------------------ */
/*  Helper: get grader names from IDs                                  */
/* ------------------------------------------------------------------ */

function getGraderNames(ids: string[]): string[] {
  return ids
    .map((id) => APPROVED_GRADERS.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GradingHubPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sessions, setSessions] = useState<GradingSession[]>(MOCK_SESSIONS);

  // Collapsible graders section
  const [gradersExpanded, setGradersExpanded] = useState(false);

  // Assign graders dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTargetSession, setAssignTargetSession] = useState<GradingSession | null>(null);
  const [selectedGraderIds, setSelectedGraderIds] = useState<string[]>([]);

  // Edit time dialog
  const [editTimeDialogOpen, setEditTimeDialogOpen] = useState(false);
  const [editTimeSession, setEditTimeSession] = useState<GradingSession | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const addToast = useToastStore((s) => s.addToast);

  // Loading skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* ---- Stats ---- */

  const totalPlayersRegistered = sessions.reduce((sum, s) => sum + s.totalPlayers, 0);
  const totalSessions = sessions.length;
  const playersGraded = sessions.reduce((sum, s) => sum + s.playersGraded, 0);
  const approvedGradersCount = APPROVED_GRADERS.length;

  /* ---- Filtered sessions ---- */

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const q = search.toLowerCase();
      if (q && !s.title.toLowerCase().includes(q) && !s.ageGroup.toLowerCase().includes(q)) return false;
      if (ageGroupFilter !== "All" && s.ageGroup !== ageGroupFilter) return false;
      if (statusFilter !== "All" && s.status !== STATUS_MAP[statusFilter]) return false;
      return true;
    });
  }, [sessions, search, ageGroupFilter, statusFilter]);

  /* ---- Assign Graders ---- */

  const openAssignDialog = (session: GradingSession) => {
    setAssignTargetSession(session);
    setSelectedGraderIds([...session.assignedGraders]);
    setAssignDialogOpen(true);
  };

  const toggleGraderSelection = (graderId: string) => {
    setSelectedGraderIds((prev) =>
      prev.includes(graderId) ? prev.filter((id) => id !== graderId) : [...prev, graderId]
    );
  };

  const handleSaveGraders = () => {
    if (!assignTargetSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === assignTargetSession.id ? { ...s, assignedGraders: [...selectedGraderIds] } : s
      )
    );
    addToast(`Graders assigned to ${assignTargetSession.title}`, "success");
    setAssignDialogOpen(false);
    setAssignTargetSession(null);
  };

  /* ---- Edit Time ---- */

  const openEditTimeDialog = (session: GradingSession) => {
    setEditTimeSession(session);
    setEditDate(session.date);
    setEditTime(session.time);
    setEditTimeDialogOpen(true);
  };

  const handleSaveTime = () => {
    if (!editTimeSession || !editDate || !editTime) {
      addToast("Please enter both date and time", "warning");
      return;
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.id === editTimeSession.id ? { ...s, date: editDate, time: editTime } : s
      )
    );
    addToast(`Schedule updated for ${editTimeSession.title}`, "success");
    setEditTimeDialogOpen(false);
    setEditTimeSession(null);
  };

  /* ---- AI Summary handler ---- */

  const handleGenerateAISummary = (session: GradingSession) => {
    addToast(`AI summary generated for ${session.title}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header — no create button, sessions are auto-created */}
      <PageHeader
        title="Player Grading"
        subtitle="Manage grading sessions and assign assessors"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm text-blue-800">
              Grading sessions are automatically created when player registrations are confirmed.
              Assign graders and set times below to prepare for each session.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Players Registered"
              value={totalPlayersRegistered}
              icon={Users}
              iconColor="text-[#1D4ED8]"
              iconBg="bg-blue-50"
            />
            <StatCard
              label="Sessions This Season"
              value={totalSessions}
              icon={ClipboardList}
              iconColor="text-[#15803D]"
              iconBg="bg-green-50"
            />
            <StatCard
              label="Players Graded"
              value={playersGraded}
              icon={BarChart3}
              iconColor="text-[#D97706]"
              iconBg="bg-amber-50"
            />
            <StatCard
              label="Approved Graders"
              value={approvedGradersCount}
              icon={UserCheck}
              iconColor="text-[#7C3AED]"
              iconBg="bg-purple-50"
            />
          </div>

          {/* Approved Graders Section — Collapsible */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Approved Graders</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => addToast("Manage Graders panel coming soon", "info")}>
                    Manage Graders
                  </Button>
                  <button
                    type="button"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    onClick={() => setGradersExpanded((prev) => !prev)}
                    aria-label={gradersExpanded ? "Collapse graders list" : "Expand graders list"}
                  >
                    {gradersExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>
            {gradersExpanded && (
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {APPROVED_GRADERS.map((grader) => (
                    <div
                      key={grader.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D4ED8]/10 text-sm font-semibold text-[#1D4ED8]">
                        {grader.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{grader.name}</p>
                        <p className="truncate text-xs text-gray-500">{grader.role}</p>
                      </div>
                      {grader.accredited && (
                        <Badge variant="success" className="shrink-0">
                          <Shield className="mr-1 h-3 w-3" />
                          Accredited
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <Select
              options={AGE_GROUPS.map((ag) => ({ label: ag, value: ag }))}
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
            />
            <Select
              options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          {/* Session Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((session) => {
              const graderNames = getGraderNames(session.assignedGraders);
              const hasNoGraders = session.assignedGraders.length === 0;
              const isUpcoming = session.status === "scheduled";
              const progressPct =
                session.totalPlayers > 0
                  ? Math.round((session.playersGraded / session.totalPlayers) * 100)
                  : 0;

              return (
                <Card key={session.id}>
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-base">{session.title}</CardTitle>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge variant="info">{session.ageGroup}</Badge>
                        <Badge variant={TYPE_BADGE_VARIANT[session.type]}>
                          {session.type === "training" ? "Training" : "Formal"}
                        </Badge>
                        <Badge variant={STATUS_BADGE_VARIANT[session.status]}>
                          {STATUS_LABEL[session.status]}
                        </Badge>
                        {hasNoGraders && isUpcoming && (
                          <Badge variant="warning">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            No Graders
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Date / time / player count */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {session.totalPlayers} players
                      </span>
                    </div>

                    {/* Grading Groups Visual */}
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Grading Groups
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {BIB_COLOURS.map((colour) => {
                          const count = session.gradingGroups[colour] ?? 0;
                          if (count === 0) return null;
                          return (
                            <div
                              key={colour}
                              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1"
                            >
                              <span
                                className="inline-block h-3 w-3 rounded-full"
                                style={{ backgroundColor: BIB_COLOUR_HEX[colour] }}
                              />
                              <span className="text-xs font-medium text-gray-700 capitalize">
                                {colour}: {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {session.playersGraded} of {session.totalPlayers} players graded
                        </span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#1D4ED8] transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Graders */}
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Assigned Graders
                      </p>
                      {graderNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {graderNames.map((name) => (
                            <Badge key={name} variant="default">
                              <UserCheck className="mr-1 h-3 w-3" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-amber-600 italic">No graders assigned</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      <Button variant="secondary" size="sm" onClick={() => openAssignDialog(session)}>
                        <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                        Assign Graders
                      </Button>

                      {session.status !== "completed" && (
                        <Button variant="secondary" size="sm" onClick={() => openEditTimeDialog(session)}>
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          Edit Time
                        </Button>
                      )}

                      {(session.status === "scheduled" || session.status === "in_progress") && (
                        <Link href={`/committee/development/grading/session/${session.id}`}>
                          <Button variant="accent" size="sm">
                            <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                            Start Grading
                          </Button>
                        </Link>
                      )}

                      {session.status === "completed" && (
                        <>
                          <Link href={`/committee/development/grading/session/${session.id}`}>
                            <Button variant="secondary" size="sm">
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              View Results
                            </Button>
                          </Link>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleGenerateAISummary(session)}
                          >
                            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                            Generate AI Summary
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ClipboardList className="mb-3 h-10 w-10" />
              <p className="text-sm">No grading sessions match your filters.</p>
            </div>
          )}
        </>
      )}

      {/* Assign Graders Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Assign Graders</DialogTitle>
          <DialogDescription>
            Select graders for{" "}
            <span className="font-medium text-gray-700">
              {assignTargetSession?.title}
            </span>
          </DialogDescription>

          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
            {APPROVED_GRADERS.map((grader) => {
              const isSelected = selectedGraderIds.includes(grader.id);
              return (
                <label
                  key={grader.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-[#1D4ED8] bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                    checked={isSelected}
                    onChange={() => toggleGraderSelection(grader.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{grader.name}</p>
                    <p className="text-xs text-gray-500">{grader.role}</p>
                  </div>
                  {grader.accredited && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  )}
                </label>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={handleSaveGraders}>
              Save Graders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Time Dialog */}
      <Dialog open={editTimeDialogOpen} onOpenChange={setEditTimeDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Edit Session Time</DialogTitle>
          <DialogDescription>
            Update the date and time for{" "}
            <span className="font-medium text-gray-700">
              {editTimeSession?.title}
            </span>
          </DialogDescription>

          <div className="mt-4 space-y-3">
            <Input
              label="Date"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
            <Input
              label="Time"
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setEditTimeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={handleSaveTime}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
