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
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Plus,
  Search,
  ClipboardList,
  Users,
  PlayCircle,
  BarChart3,
  Calendar,
  UserCheck,
  Eye,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface GradingSession {
  id: string;
  title: string;
  date: string;
  ageGroup: string;
  type: "training" | "formal";
  status: "scheduled" | "in_progress" | "completed";
  playersGraded: number;
  assessors: number;
}

const MOCK_SESSIONS: GradingSession[] = [
  { id: "gs-1", title: "U9 Pre-Season Grading Day", date: "2026-04-05", ageGroup: "U9", type: "formal", status: "completed", playersGraded: 28, assessors: 4 },
  { id: "gs-2", title: "U11 Pre-Season Grading Day", date: "2026-04-06", ageGroup: "U11", type: "formal", status: "completed", playersGraded: 22, assessors: 3 },
  { id: "gs-3", title: "U13 Formal Grading", date: "2026-04-12", ageGroup: "U13", type: "formal", status: "in_progress", playersGraded: 14, assessors: 4 },
  { id: "gs-4", title: "U7 Training Assessment", date: "2026-04-08", ageGroup: "U7", type: "training", status: "completed", playersGraded: 18, assessors: 1 },
  { id: "gs-5", title: "U15 Pre-Season Grading", date: "2026-04-19", ageGroup: "U15", type: "formal", status: "scheduled", playersGraded: 0, assessors: 0 },
  { id: "gs-6", title: "U9 Training Review", date: "2026-04-15", ageGroup: "U9", type: "training", status: "scheduled", playersGraded: 0, assessors: 0 },
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GradingHubPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newAgeGroup, setNewAgeGroup] = useState("U9");
  const [newType, setNewType] = useState("training");

  const [sessions, setSessions] = useState<GradingSession[]>(MOCK_SESSIONS);

  const addToast = useToastStore((s) => s.addToast);

  // Loading skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* ---- Stats ---- */

  const totalSessions = sessions.length;
  const playersGraded = sessions.reduce((sum, s) => sum + s.playersGraded, 0);
  const activeSessions = sessions.filter((s) => s.status === "in_progress").length;
  const completedWithPlayers = sessions.filter((s) => s.status === "completed" && s.playersGraded > 0);
  const averageScore = completedWithPlayers.length > 0
    ? Math.round((completedWithPlayers.reduce((sum, s) => sum + s.playersGraded, 0) / completedWithPlayers.length))
    : 0;

  /* ---- Filtered sessions ---- */

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const q = search.toLowerCase();
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (ageGroupFilter !== "All" && s.ageGroup !== ageGroupFilter) return false;
      if (statusFilter !== "All" && s.status !== STATUS_MAP[statusFilter]) return false;
      return true;
    });
  }, [sessions, search, ageGroupFilter, statusFilter]);

  /* ---- Create session handler ---- */

  const handleCreateSession = () => {
    if (!newTitle.trim() || !newDate) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    const newSession: GradingSession = {
      id: `gs-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      ageGroup: newAgeGroup,
      type: newType as "training" | "formal",
      status: "scheduled",
      playersGraded: 0,
      assessors: 0,
    };

    setSessions((prev) => [newSession, ...prev]);
    setNewTitle("");
    setNewDate("");
    setNewAgeGroup("U9");
    setNewType("training");
    setShowCreateForm(false);
    addToast("Grading session created", "success");
  };

  /* ---- AI Summary handler ---- */

  const handleGenerateAISummary = (session: GradingSession) => {
    addToast(`AI summary generated for ${session.title}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Player Grading" subtitle="Manage grading sessions and assess player development">
        <Button variant="accent" size="sm" onClick={() => setShowCreateForm((prev) => !prev)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Grading Session
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              icon={ClipboardList}
              iconColor="text-[#1D4ED8]"
              iconBg="bg-blue-50"
            />
            <StatCard
              label="Players Graded"
              value={playersGraded}
              icon={Users}
              iconColor="text-[#15803D]"
              iconBg="bg-green-50"
            />
            <StatCard
              label="Active Sessions"
              value={activeSessions}
              icon={PlayCircle}
              iconColor="text-[#D97706]"
              iconBg="bg-amber-50"
            />
            <StatCard
              label="Average Score"
              value={averageScore}
              icon={BarChart3}
              iconColor="text-[#7C3AED]"
              iconBg="bg-purple-50"
            />
          </div>

          {/* Create Session Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create New Grading Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Session Title"
                    placeholder="e.g. U12 Pre-Season Grading"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                  <Select
                    label="Age Group"
                    options={["U7", "U9", "U11", "U13", "U15"].map((ag) => ({ label: ag, value: ag }))}
                    value={newAgeGroup}
                    onChange={(e) => setNewAgeGroup(e.target.value)}
                  />
                  <Select
                    label="Type"
                    options={[
                      { label: "Training", value: "training" },
                      { label: "Formal", value: "formal" },
                    ]}
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" onClick={handleCreateSession}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create Session
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
            {filtered.map((session) => (
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {session.playersGraded} players
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      {session.assessors} assessors
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
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
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ClipboardList className="mb-3 h-10 w-10" />
              <p className="text-sm">No grading sessions match your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
