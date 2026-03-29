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
  Loader2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Brain,
  CheckCircle2,
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
/*  Team Competency Data                                               */
/* ------------------------------------------------------------------ */

interface TeamCompetency {
  team: string;
  rating: number;
  skills: Record<string, number>;
}

const TEAM_COMPETENCY: TeamCompetency[] = [
  { team: "Nickol Thunder U7", rating: 3.2, skills: { "Ball Familiarity": 3.8, "Movement": 3.5, "Listening": 2.8, "Enthusiasm": 4.1, "Spatial Awareness": 2.3 } },
  { team: "Nickol Storm U9", rating: 3.5, skills: { "First Touch": 3.2, "Passing": 4.0, "Dribbling": 3.8, "Shooting": 2.6, "Defending": 2.4, "Game Awareness": 3.1, "Communication": 3.5, "Work Rate": 4.2 } },
  { team: "Nickol Titans U11", rating: 3.1, skills: { "First Touch": 3.4, "Passing": 3.8, "Dribbling": 3.2, "Shooting": 2.4, "Defending": 2.1, "Game Awareness": 2.8, "Communication": 3.0, "Work Rate": 4.1 } },
  { team: "Nickol Hawks U13", rating: 3.8, skills: { "First Touch": 4.2, "Passing": 4.0, "Dribbling": 3.6, "Shooting": 3.4, "Defending": 3.2, "Game Awareness": 3.8, "Communication": 4.1, "Work Rate": 4.3 } },
  { team: "Nickol Eagles U15", rating: 3.4, skills: { "First Touch": 3.6, "Passing": 3.8, "Dribbling": 3.2, "Shooting": 3.0, "Defending": 2.8, "Game Awareness": 3.4, "Communication": 3.6, "Work Rate": 4.0 } },
];

/* ------------------------------------------------------------------ */
/*  AI Recommendation Types                                            */
/* ------------------------------------------------------------------ */

interface AIRecommendedPlan {
  summary: string;
  warmUp: DrillFull | null;
  mainDrills: DrillFull[];
  coolDown: DrillFull | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ratingBadgeVariant(score: number): "success" | "info" | "warning" | "danger" {
  if (score >= 4.0) return "success";
  if (score >= 3.0) return "info";
  if (score >= 2.0) return "warning";
  return "danger";
}

function ratingColorClass(score: number): string {
  if (score >= 4.0) return "text-[#15803D]";
  if (score >= 3.0) return "text-[#1D4ED8]";
  if (score >= 2.0) return "text-[#B45309]";
  return "text-[#B91C1C]";
}

function getWeakestSkills(skills: Record<string, number>, count: number): [string, number][] {
  return Object.entries(skills)
    .sort(([, a], [, b]) => a - b)
    .slice(0, count);
}

function getStrongestSkills(skills: Record<string, number>, count: number): [string, number][] {
  return Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count);
}

/** Map a skill area name to possible drill library categories */
function skillToDrillCategory(skill: string): string[] {
  const map: Record<string, string[]> = {
    "Ball Familiarity": ["Dribbling"],
    "Movement": ["Dribbling", "Passing"],
    "Listening": ["Passing"],
    "Enthusiasm": ["Dribbling"],
    "Spatial Awareness": ["Dribbling", "Passing"],
    "First Touch": ["Passing", "Dribbling"],
    "Passing": ["Passing"],
    "Dribbling": ["Dribbling"],
    "Shooting": ["Passing", "Dribbling"],
    "Defending": ["Passing", "Dribbling"],
    "Game Awareness": ["Passing"],
    "Communication": ["Passing"],
    "Work Rate": ["Dribbling"],
  };
  return map[skill] || ["Passing", "Dribbling"];
}

/* ------------------------------------------------------------------ */
/*  Age-group mapping helper                                           */
/* ------------------------------------------------------------------ */

const AGE_GROUP_MAP: Record<string, string[]> = {
  U6: ["4-6"],
  U7: ["4-6", "7-9"],
  U8: ["4-6", "7-9"],
  U9: ["7-9"],
  U10: ["7-9", "10-13"],
  U11: ["10-13"],
  U12: ["10-13"],
  U13: ["10-13", "14-17"],
  U14: ["10-13", "14-17"],
  U15: ["14-17"],
  U16: ["14-17"],
};

function drillMatchesAgeGroup(drill: DrillFull, ageGroup: string): boolean {
  if (!ageGroup) return true;
  const ranges = AGE_GROUP_MAP[ageGroup] || [];
  return ranges.some((range) => drill.age_groups.includes(range));
}

/** Extract age group from team name like "Nickol Titans U11" -> "U11" */
function extractAgeGroup(teamName: string): string {
  const match = teamName.match(/U\d+/);
  return match ? match[0] : "U12";
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

  // AI Recommendation state
  const [selectedTeam, setSelectedTeam] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<AIRecommendedPlan | null>(null);

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

  // Selected team competency data
  const selectedTeamData = useMemo(() => {
    return TEAM_COMPETENCY.find((t) => t.team === selectedTeam) || null;
  }, [selectedTeam]);

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

  /* ---- AI Session Generation ---- */

  const handleGenerateAIPlan = () => {
    if (!selectedTeamData) return;

    setAiLoading(true);
    setAiPlan(null);

    setTimeout(() => {
      const ageGroup = extractAgeGroup(selectedTeamData.team);
      const weakest = getWeakestSkills(selectedTeamData.skills, 2);
      const weakCategories = weakest.flatMap(([skill]) => skillToDrillCategory(skill));

      // Get drills matching the age group
      const ageMatchedDrills = DRILL_LIBRARY.filter((d) => drillMatchesAgeGroup(d, ageGroup));

      // Find drills matching weakness categories
      const weaknessDrills = ageMatchedDrills.filter((d) =>
        weakCategories.includes(d.skill_category)
      );

      // Pick drills for each section (avoid duplicates)
      const usedIds = new Set<string>();

      // Warm-up: pick a short beginner drill
      const warmUpCandidates = ageMatchedDrills
        .filter((d) => d.difficulty === "Beginner" && d.duration_minutes <= 8)
        .sort((a, b) => a.duration_minutes - b.duration_minutes);
      const warmUp = warmUpCandidates[0] || ageMatchedDrills[0] || null;
      if (warmUp) usedIds.add(warmUp.drill_id);

      // Main drills: pick 2-3 from weakness-matched drills
      const mainCandidates = (weaknessDrills.length > 0 ? weaknessDrills : ageMatchedDrills)
        .filter((d) => !usedIds.has(d.drill_id));
      const selectedMain: DrillFull[] = [];
      for (const drill of mainCandidates) {
        if (selectedMain.length >= 3) break;
        if (!usedIds.has(drill.drill_id)) {
          selectedMain.push(drill);
          usedIds.add(drill.drill_id);
        }
      }

      // Cool-down: pick a short drill
      const coolDownCandidates = ageMatchedDrills
        .filter((d) => !usedIds.has(d.drill_id) && d.duration_minutes <= 8)
        .sort((a, b) => a.duration_minutes - b.duration_minutes);
      const coolDown = coolDownCandidates[0] || null;

      const weakNames = weakest.map(([name]) => name).join(" and ");
      const summary = `Based on ${selectedTeamData.team}'s competency profile, this session focuses on ${weakNames} \u2014 the two weakest areas. Drills are selected to build confidence and technique in these areas while maintaining engagement.`;

      setAiPlan({
        summary,
        warmUp,
        mainDrills: selectedMain,
        coolDown,
      });
      setAiLoading(false);
    }, 1500);
  };

  const handleApplyAIPlan = () => {
    if (!aiPlan) return;

    // Clear current session drills and apply AI recommendations
    const newWarmUp = aiPlan.warmUp ? [aiPlan.warmUp] : [];
    const newMain = aiPlan.mainDrills;
    const newCoolDown = aiPlan.coolDown ? [aiPlan.coolDown] : [];

    setWarmUpDrills(newWarmUp);
    setMainDrills(newMain);
    setCoolDownDrills(newCoolDown);

    // Update session details based on team
    if (selectedTeamData) {
      const ageGroup = extractAgeGroup(selectedTeamData.team);
      setSessionAgeGroup(ageGroup);
      const weakest = getWeakestSkills(selectedTeamData.skills, 1);
      if (weakest.length > 0) {
        const weakSkill = weakest[0][0];
        const categories = skillToDrillCategory(weakSkill);
        // Try to match to a focus area
        const matchedFocus = FOCUS_AREAS.find((fa) => categories.includes(fa));
        if (matchedFocus) setSessionFocusArea(matchedFocus);
      }
      setSessionTitle(`${selectedTeamData.team} - Targeted Development Session`);
    }

    addToast("AI session plan applied to builder", "success");
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
              {/* AI Session Recommendation */}
              <Card className="border-[#1D4ED8]/20 bg-gradient-to-br from-blue-50/50 to-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8]/10">
                      <Brain className="h-4 w-4 text-[#1D4ED8]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">AI Session Recommendation</CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">Generate a session plan tailored to your team&apos;s competency profile</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Team Selector */}
                  <div className="max-w-sm">
                    <Select
                      label="Select Team"
                      options={[
                        { label: "Choose a team...", value: "" },
                        ...TEAM_COMPETENCY.map((t) => ({ label: t.team, value: t.team })),
                      ]}
                      value={selectedTeam}
                      onChange={(e) => {
                        setSelectedTeam(e.target.value);
                        setAiPlan(null);
                      }}
                    />
                  </div>

                  {/* Team Competency Display */}
                  {selectedTeamData && (
                    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                      {/* Rating row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#0B2545]">{selectedTeamData.team}</p>
                            <p className="text-xs text-gray-500">Team Overall Rating</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${ratingColorClass(selectedTeamData.rating)}`}>
                            {selectedTeamData.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-400">/ 5.0</span>
                          <Badge variant={ratingBadgeVariant(selectedTeamData.rating)}>
                            {selectedTeamData.rating >= 4.0 ? "Strong" : selectedTeamData.rating >= 3.0 ? "Developing" : "Needs Work"}
                          </Badge>
                        </div>
                      </div>

                      {/* Skills breakdown */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Weakest Areas */}
                        <div className="rounded-lg border border-red-100 bg-red-50/30 p-3">
                          <h5 className="flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C] mb-2">
                            <TrendingDown className="h-3.5 w-3.5" />
                            Weakest Areas
                          </h5>
                          <div className="space-y-1.5">
                            {getWeakestSkills(selectedTeamData.skills, 2).map(([skill, score]) => (
                              <div key={skill} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{skill}</span>
                                <Badge variant="danger">{score.toFixed(1)}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strongest Areas */}
                        <div className="rounded-lg border border-green-100 bg-green-50/30 p-3">
                          <h5 className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D] mb-2">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Strongest Areas
                          </h5>
                          <div className="space-y-1.5">
                            {getStrongestSkills(selectedTeamData.skills, 2).map(([skill, score]) => (
                              <div key={skill} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{skill}</span>
                                <Badge variant="success">{score.toFixed(1)}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={handleGenerateAIPlan}
                        disabled={aiLoading}
                        className="w-full sm:w-auto"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            Generating Session Plan...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1.5 h-4 w-4" />
                            Generate AI Session Plan
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* AI Generated Plan */}
                  {aiPlan && (
                    <div className="rounded-lg border border-[#1D4ED8]/20 bg-blue-50/30 p-4 space-y-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" />
                        <p className="text-sm text-gray-700">{aiPlan.summary}</p>
                      </div>

                      {/* Recommended Drills */}
                      <div className="space-y-3">
                        {/* Warm-Up */}
                        {aiPlan.warmUp && (
                          <div className="rounded-lg border border-orange-200 bg-orange-50/30 p-3">
                            <h5 className="flex items-center gap-1.5 text-xs font-semibold text-[#B45309] mb-1.5">
                              <Flame className="h-3.5 w-3.5" />
                              Warm-Up
                            </h5>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#0B2545]">{aiPlan.warmUp.name}</p>
                                <p className="text-xs text-gray-500">{aiPlan.warmUp.duration_minutes} min &middot; {aiPlan.warmUp.difficulty}</p>
                              </div>
                              <Badge variant={CATEGORY_VARIANT[aiPlan.warmUp.skill_category] || "default"} className="text-xs">
                                {aiPlan.warmUp.skill_category}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Main Drills */}
                        {aiPlan.mainDrills.length > 0 && (
                          <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
                            <h5 className="flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] mb-1.5">
                              <Dumbbell className="h-3.5 w-3.5" />
                              Main Drills ({aiPlan.mainDrills.length})
                            </h5>
                            <div className="space-y-2">
                              {aiPlan.mainDrills.map((drill) => (
                                <div key={drill.drill_id} className="flex items-center justify-between rounded-md bg-white/60 px-2.5 py-1.5">
                                  <div>
                                    <p className="text-sm font-medium text-[#0B2545]">{drill.name}</p>
                                    <p className="text-xs text-gray-500">{drill.duration_minutes} min &middot; {drill.difficulty}</p>
                                  </div>
                                  <Badge variant={CATEGORY_VARIANT[drill.skill_category] || "default"} className="text-xs">
                                    {drill.skill_category}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cool-Down */}
                        {aiPlan.coolDown && (
                          <div className="rounded-lg border border-sky-200 bg-sky-50/30 p-3">
                            <h5 className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 mb-1.5">
                              <Snowflake className="h-3.5 w-3.5" />
                              Cool-Down
                            </h5>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#0B2545]">{aiPlan.coolDown.name}</p>
                                <p className="text-xs text-gray-500">{aiPlan.coolDown.duration_minutes} min &middot; {aiPlan.coolDown.difficulty}</p>
                              </div>
                              <Badge variant={CATEGORY_VARIANT[aiPlan.coolDown.skill_category] || "default"} className="text-xs">
                                {aiPlan.coolDown.skill_category}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Apply Button */}
                      <Button variant="accent" size="sm" onClick={handleApplyAIPlan}>
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Apply to Session
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

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
