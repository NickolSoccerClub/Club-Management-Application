"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import { DRILL_LIBRARY, type DrillFull } from "@/lib/data/drills";
import {
  Plus,
  Minus,
  Clock,
  Target,
  Users,
  Eye,
  Edit,
  Copy,
  FileText,
  Flame,
  Snowflake,
  Dumbbell,
  Trash2,
  Search,
  GripVertical,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface Session {
  id: number;
  title: string;
  ageGroup: string;
  skillLevel: string;
  focusArea: string;
  drillCount: number;
  duration: string;
  createdDate: string;
  status: "Published" | "Draft";
}

interface AISession {
  title: string;
  ageGroup: string;
  duration: string;
  warmUp: { name: string; description: string; duration: string };
  drills: { name: string; description: string; duration: string }[];
  coolDown: { name: string; description: string; duration: string };
  coachNotes: string;
}

const MOCK_SESSIONS: Session[] = [
  { id: 1, title: "U12 Passing Fundamentals", ageGroup: "U12", skillLevel: "Beginner", focusArea: "Passing", drillCount: 4, duration: "60 min", createdDate: "2026-03-10", status: "Published" },
  { id: 2, title: "U14 Defensive Shape", ageGroup: "U14", skillLevel: "Intermediate", focusArea: "Defending", drillCount: 5, duration: "75 min", createdDate: "2026-03-08", status: "Published" },
  { id: 3, title: "U10 Fun with Dribbling", ageGroup: "U10", skillLevel: "Beginner", focusArea: "Dribbling", drillCount: 4, duration: "45 min", createdDate: "2026-03-05", status: "Published" },
  { id: 4, title: "U16 Shooting Accuracy", ageGroup: "U16", skillLevel: "Advanced", focusArea: "Shooting", drillCount: 5, duration: "90 min", createdDate: "2026-02-28", status: "Published" },
];

const MOCK_AI_SESSION: AISession = {
  title: "U12 Passing & Movement Session",
  ageGroup: "U12",
  duration: "60 minutes",
  warmUp: {
    name: "Dynamic Warm-Up Circuit",
    description: "Players jog around the grid performing dynamic stretches: high knees, butt kicks, side shuffles, and arm circles. Progress to light passing in pairs on the move.",
    duration: "10 min",
  },
  drills: [
    { name: "Triangle Passing", description: "Players form triangles of 3. Pass and move to the next cone. Focus on weight of pass, first touch, and body positioning. Progress: add a defender in the middle.", duration: "12 min" },
    { name: "Through Ball Channel", description: "Two channels with attackers and defenders. Attackers must play a through ball to a runner. Emphasis on timing of pass and run. Rotate roles every 3 minutes.", duration: "12 min" },
    { name: "Possession Box (4v2)", description: "4 attackers keep possession in a 12x12m grid against 2 defenders. If defenders win the ball, swap with the player who lost it. Focus on quick passing and finding angles.", duration: "10 min" },
    { name: "Small-Sided Game (4v4)", description: "4v4 game with a condition: must make 3 passes before scoring. Encourages combination play and patient build-up. Regular goals with small goal areas.", duration: "12 min" },
  ],
  coolDown: {
    name: "Cool-Down & Reflection",
    description: "Light jog and static stretching. Ask players: What type of pass was most effective today? When should you pass vs dribble? Finish with a quick recap of key learning points.",
    duration: "4 min",
  },
  coachNotes: "Ensure all players get equal time in each drill role. Watch for players who consistently use only their dominant foot - encourage weak foot use during triangle passing. If the group struggles with through balls, reduce the channel width.",
};

const FOCUS_AREAS = ["Passing", "Shooting", "Defending", "Dribbling", "Fitness", "Tactical"];
const AGE_GROUPS = ["U6", "U8", "U10", "U12", "U14", "U16"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TARGET_DURATIONS = ["45 min", "60 min", "75 min", "90 min"];

const FOCUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  Passing: "info",
  Shooting: "danger",
  Defending: "success",
  Dribbling: "warning",
  Fitness: "default",
  Tactical: "info",
};

const CATEGORY_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  Passing: "info",
  Shooting: "danger",
  Defending: "success",
  Dribbling: "warning",
  Fitness: "default",
  Tactical: "info",
  "Warm-Up": "warning",
  "Cool-Down": "info",
};

/* ------------------------------------------------------------------ */
/*  Age-group mapping helper                                           */
/* ------------------------------------------------------------------ */

const AGE_GROUP_MAP: Record<string, string[]> = {
  U6: ["4-6"],
  U8: ["4-6", "7-9"],
  U10: ["7-9", "10-13"],
  U12: ["10-13"],
  U14: ["10-13", "14-17"],
  U16: ["14-17"],
};

function drillMatchesAgeGroup(drill: DrillFull, ageGroup: string): boolean {
  if (!ageGroup) return true;
  const ranges = AGE_GROUP_MAP[ageGroup] || [];
  return ranges.some((range) => drill.age_groups.includes(range));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SessionBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // Build Session state
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionAgeGroup, setSessionAgeGroup] = useState("U12");
  const [sessionSkillLevel, setSessionSkillLevel] = useState("Beginner");
  const [sessionFocusArea, setSessionFocusArea] = useState("Passing");
  const [sessionDuration, setSessionDuration] = useState("60 min");
  const [drillSearch, setDrillSearch] = useState("");

  const [warmUpDrills, setWarmUpDrills] = useState<DrillFull[]>([]);
  const [mainDrills, setMainDrills] = useState<DrillFull[]>([]);
  const [coolDownDrills, setCoolDownDrills] = useState<DrillFull[]>([]);

  const addToast = useToastStore((s) => s.addToast);

  // Skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // IDs of drills already added to the session
  const addedDrillIds = useMemo(() => {
    const ids = new Set<string>();
    warmUpDrills.forEach((d) => ids.add(d.drill_id));
    mainDrills.forEach((d) => ids.add(d.drill_id));
    coolDownDrills.forEach((d) => ids.add(d.drill_id));
    return ids;
  }, [warmUpDrills, mainDrills, coolDownDrills]);

  // Filtered drill library
  const availableDrills = useMemo(() => {
    return DRILL_LIBRARY.filter((drill) => {
      if (addedDrillIds.has(drill.drill_id)) return false;
      if (!drillMatchesAgeGroup(drill, sessionAgeGroup)) return false;
      if (drillSearch.trim()) {
        const q = drillSearch.toLowerCase();
        return (
          drill.name.toLowerCase().includes(q) ||
          drill.skill_category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessionAgeGroup, drillSearch, addedDrillIds]);

  // Running total duration
  const totalDuration = useMemo(() => {
    let total = 0;
    warmUpDrills.forEach((d) => (total += d.duration_minutes));
    mainDrills.forEach((d) => (total += d.duration_minutes));
    coolDownDrills.forEach((d) => (total += d.duration_minutes));
    return total;
  }, [warmUpDrills, mainDrills, coolDownDrills]);

  /* ---- Handlers ---- */

  const handleDeleteSession = () => {
    setDeleteSessionId(null);
    addToast("Session deleted", "success");
  };

  const handlePublishSession = () => {
    addToast("Session published", "success");
  };

  const handleSaveDraft = () => {
    addToast("Draft saved", "success");
  };

  const addDrillToSection = (drill: DrillFull, section: "warmUp" | "main" | "coolDown") => {
    if (section === "warmUp") setWarmUpDrills((prev) => [...prev, drill]);
    else if (section === "main") setMainDrills((prev) => [...prev, drill]);
    else setCoolDownDrills((prev) => [...prev, drill]);
  };

  const removeDrillFromSection = (drillId: string, section: "warmUp" | "main" | "coolDown") => {
    if (section === "warmUp") setWarmUpDrills((prev) => prev.filter((d) => d.drill_id !== drillId));
    else if (section === "main") setMainDrills((prev) => prev.filter((d) => d.drill_id !== drillId));
    else setCoolDownDrills((prev) => prev.filter((d) => d.drill_id !== drillId));
  };

  /* ---- Drill row in the available list ---- */
  const renderAvailableDrill = (drill: DrillFull) => (
    <div
      key={drill.drill_id}
      className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm hover:border-gray-200 hover:bg-gray-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#0B2545]">{drill.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant={CATEGORY_VARIANT[drill.skill_category] || "default"} className="text-xs">
            {drill.skill_category}
          </Badge>
          <span className="text-xs text-gray-400">{drill.duration_minutes} min</span>
          <span className="text-xs text-gray-400">&middot;</span>
          <span className="text-xs text-gray-400">{drill.difficulty}</span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="secondary"
          size="sm"
          className="h-7 px-2 text-xs"
          title="Add to Warm-Up"
          onClick={() => addDrillToSection(drill, "warmUp")}
        >
          <Flame className="mr-1 h-3 w-3 text-orange-500" />
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 px-2 text-xs"
          title="Add to Main Drills"
          onClick={() => addDrillToSection(drill, "main")}
        >
          <Dumbbell className="mr-1 h-3 w-3 text-[#1D4ED8]" />
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 px-2 text-xs"
          title="Add to Cool-Down"
          onClick={() => addDrillToSection(drill, "coolDown")}
        >
          <Snowflake className="mr-1 h-3 w-3 text-sky-500" />
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  /* ---- Drill row in a session section ---- */
  const renderSessionDrill = (drill: DrillFull, section: "warmUp" | "main" | "coolDown") => (
    <div
      key={drill.drill_id}
      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm"
    >
      <GripVertical className="h-4 w-4 shrink-0 text-gray-300" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#0B2545]">{drill.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Badge variant={CATEGORY_VARIANT[drill.skill_category] || "default"} className="text-xs">
            {drill.skill_category}
          </Badge>
          <span className="text-xs text-gray-400">{drill.duration_minutes} min</span>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="h-7 w-7 shrink-0 p-0"
        onClick={() => removeDrillFromSection(drill.drill_id, section)}
      >
        <Minus className="h-3.5 w-3.5 text-red-500" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Session Builder" subtitle="Build training sessions from the drill library">
        <Button variant="accent" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Create New Session
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="sessions">
          <TabsList>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="build">Build Session</TabsTrigger>
          </TabsList>

          {/* ============================================================ */}
          {/* Tab 1: Sessions                                               */}
          {/* ============================================================ */}
          <TabsContent value="sessions">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {MOCK_SESSIONS.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{session.title}</CardTitle>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <Badge variant="info">{session.ageGroup}</Badge>
                          <Badge variant={FOCUS_VARIANT[session.focusArea] || "default"}>
                            {session.focusArea}
                          </Badge>
                          <Badge>{session.skillLevel}</Badge>
                          <Badge variant={session.status === "Published" ? "success" : "default"}>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        {session.drillCount} drills
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {session.createdDate}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                      <Button variant="secondary" size="sm">
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Duplicate
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setDeleteSessionId(session.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ============================================================ */}
          {/* Tab 2: Build Session                                          */}
          {/* ============================================================ */}
          <TabsContent value="build">
            <div className="space-y-6">
              {/* Session Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Session Title"
                    placeholder="e.g. U12 Passing & Movement"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Select
                      label="Age Group"
                      options={AGE_GROUPS.map((ag) => ({ label: ag, value: ag }))}
                      value={sessionAgeGroup}
                      onChange={(e) => setSessionAgeGroup(e.target.value)}
                    />
                    <Select
                      label="Skill Level"
                      options={SKILL_LEVELS.map((sl) => ({ label: sl, value: sl }))}
                      value={sessionSkillLevel}
                      onChange={(e) => setSessionSkillLevel(e.target.value)}
                    />
                    <Select
                      label="Focus Area"
                      options={FOCUS_AREAS.map((fa) => ({ label: fa, value: fa }))}
                      value={sessionFocusArea}
                      onChange={(e) => setSessionFocusArea(e.target.value)}
                    />
                    <Select
                      label="Target Duration"
                      options={TARGET_DURATIONS.map((d) => ({ label: d, value: d }))}
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Two-Panel Layout */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left: Available Drills */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Available Drills</CardTitle>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search drills..."
                        value={drillSearch}
                        onChange={(e) => setDrillSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                      {availableDrills.length > 0 ? (
                        availableDrills.map(renderAvailableDrill)
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <Target className="mb-2 h-8 w-8" />
                          <p className="text-sm">No matching drills found.</p>
                          <p className="text-xs">Try adjusting the age group or search term.</p>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-gray-400">
                      Showing {availableDrills.length} drill{availableDrills.length !== 1 ? "s" : ""} for {sessionAgeGroup}
                    </p>
                  </CardContent>
                </Card>

                {/* Right: Session Plan */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Session Plan</CardTitle>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-[#0B2545]">
                          {totalDuration} min
                        </span>
                        <span className="text-xs text-gray-400">
                          / {sessionDuration}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Warm-Up Section */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Warm-Up
                        <span className="text-xs font-normal text-gray-400">(5-10 min)</span>
                      </h4>
                      <div className="space-y-2 rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/30 p-3">
                        {warmUpDrills.length > 0 ? (
                          warmUpDrills.map((d) => renderSessionDrill(d, "warmUp"))
                        ) : (
                          <p className="py-4 text-center text-xs text-gray-400">
                            Add a warm-up drill from the library
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Main Drills Section */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Dumbbell className="h-4 w-4 text-[#1D4ED8]" />
                        Main Drills
                      </h4>
                      <div className="space-y-2 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 p-3">
                        {mainDrills.length > 0 ? (
                          mainDrills.map((d) => renderSessionDrill(d, "main"))
                        ) : (
                          <p className="py-4 text-center text-xs text-gray-400">
                            Add drills from the library to build your session
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cool-Down Section */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Snowflake className="h-4 w-4 text-sky-500" />
                        Cool-Down
                        <span className="text-xs font-normal text-gray-400">(5-10 min)</span>
                      </h4>
                      <div className="space-y-2 rounded-lg border-2 border-dashed border-sky-200 bg-sky-50/30 p-3">
                        {coolDownDrills.length > 0 ? (
                          coolDownDrills.map((d) => renderSessionDrill(d, "coolDown"))
                        ) : (
                          <p className="py-4 text-center text-xs text-gray-400">
                            Add a cool-down drill from the library
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                      <Button variant="accent" size="sm" onClick={handleSaveDraft}>
                        Save as Draft
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setPublishDialogOpen(true)}
                      >
                        Publish Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
        onConfirm={handleDeleteSession}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />

      {/* Confirm Publish Dialog */}
      <ConfirmDialog
        open={publishDialogOpen}
        onOpenChange={(open) => setPublishDialogOpen(open)}
        onConfirm={handlePublishSession}
        title="Publish Session"
        description="Are you sure you want to publish this session? It will be visible to all coaches."
        variant="primary"
        confirmLabel="Publish"
      />
    </div>
  );
}
