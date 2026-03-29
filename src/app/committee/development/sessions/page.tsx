"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Loader2,
  Globe,
  Sparkles,
  Plus,
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
  BookOpen,
  ExternalLink,
  Save,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface Drill {
  name: string;
  description: string;
  duration: string;
}

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
  drills: Drill[];
  coolDown: { name: string; description: string; duration: string };
  coachNotes: string;
}

interface DrillGenerated {
  drill_id: string;
  name: string;
  age_groups: string;
  skill_category: string;
  difficulty: string;
  duration_minutes: number;
  equipment: string;
  setup: string;
  instructions: string;
  coach_role: string;
  targeted_results: string;
  ai_image_description: string;
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
    {
      name: "Triangle Passing",
      description: "Players form triangles of 3. Pass and move to the next cone. Focus on weight of pass, first touch, and body positioning. Progress: add a defender in the middle.",
      duration: "12 min",
    },
    {
      name: "Through Ball Channel",
      description: "Two channels with attackers and defenders. Attackers must play a through ball to a runner. Emphasis on timing of pass and run. Rotate roles every 3 minutes.",
      duration: "12 min",
    },
    {
      name: "Possession Box (4v2)",
      description: "4 attackers keep possession in a 12x12m grid against 2 defenders. If defenders win the ball, swap with the player who lost it. Focus on quick passing and finding angles.",
      duration: "10 min",
    },
    {
      name: "Small-Sided Game (4v4)",
      description: "4v4 game with a condition: must make 3 passes before scoring. Encourages combination play and patient build-up. Regular goals with small goal areas.",
      duration: "12 min",
    },
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
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DRILL_CATEGORIES = ["Passing", "Shooting", "Defending", "Dribbling", "Fitness", "Tactical", "Warm-Up", "Cool-Down"];

const FOCUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  Passing: "info",
  Shooting: "danger",
  Defending: "success",
  Dribbling: "warning",
  Fitness: "default",
  Tactical: "info",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SessionBuilderPage() {
  const [ageGroup, setAgeGroup] = useState("U12");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [focusArea, setFocusArea] = useState("Passing");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // Import from Web state
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<{ content: string; title: string; url: string } | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [scrapeAgeGroup, setScrapeAgeGroup] = useState("U12");
  const [scrapeFocusArea, setScrapeFocusArea] = useState("Passing");
  const [scrapeDifficulty, setScrapeDifficulty] = useState("Intermediate");
  const [generatingDrill, setGeneratingDrill] = useState(false);
  const [generatedDrill, setGeneratedDrill] = useState<DrillGenerated | null>(null);
  const [drillForm, setDrillForm] = useState<{
    name: string;
    category: string;
    ageGroups: string;
    difficulty: string;
    duration: string;
    equipment: string;
    setup: string;
    instructions: string;
    coachRole: string;
    targetedResults: string;
  } | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  // Skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  const handleDeleteSession = () => {
    // In a real app, delete the session by deleteSessionId
    setDeleteSessionId(null);
    addToast("Session deleted", "success");
  };

  const handlePublishSession = () => {
    addToast("Session published", "success");
  };

  const handleSaveDraft = () => {
    addToast("Draft saved", "success");
  };

  /* ---- Import from Web handlers ---- */

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setScrapedContent(null);
    setGeneratedDrill(null);
    setDrillForm(null);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setScrapedContent({
          content: data.content || "",
          title: data.title || "Untitled Page",
          url: scrapeUrl,
        });
      } else {
        addToast(data.error || "Failed to scrape content", "error");
      }
    } catch {
      addToast("Failed to scrape content", "error");
    } finally {
      setScraping(false);
    }
  };

  const handleGenerateDrill = async () => {
    if (!scrapedContent) return;
    setGeneratingDrill(true);
    setGeneratedDrill(null);
    setDrillForm(null);
    try {
      const res = await fetch("/api/drills/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scrapedContent: scrapedContent.content,
          focusArea: scrapeFocusArea,
          ageGroup: scrapeAgeGroup,
          difficulty: scrapeDifficulty,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const drill: DrillGenerated = data.drill || data;
        setGeneratedDrill(drill);
        setDrillForm({
          name: drill.name || "",
          category: drill.skill_category || "",
          ageGroups: drill.age_groups || "",
          difficulty: drill.difficulty || "",
          duration: String(drill.duration_minutes || ""),
          equipment: drill.equipment || "",
          setup: drill.setup || "",
          instructions: drill.instructions || "",
          coachRole: drill.coach_role || "",
          targetedResults: drill.targeted_results || "",
        });
      } else {
        addToast(data.error || "Failed to generate drill", "error");
      }
    } catch {
      addToast("Failed to generate drill", "error");
    } finally {
      setGeneratingDrill(false);
    }
  };

  const handleSaveDrill = () => {
    addToast("Drill saved to library", "success");
  };

  const updateDrillForm = (field: string, value: string) => {
    setDrillForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Session Builder">
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
        <Tabs defaultValue="published">
          <TabsList>
            <TabsTrigger value="published">Published Sessions</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="ai">AI Generated</TabsTrigger>
          </TabsList>

          {/* Published Sessions */}
          <TabsContent value="published">
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

          {/* Drafts */}
          <TabsContent value="drafts">
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="mb-3 h-10 w-10" />
              <p className="text-sm">No draft sessions.</p>
            </div>
          </TabsContent>

          {/* AI Generated */}
          <TabsContent value="ai">
            <div className="space-y-6">

              {/* ============================================================ */}
              {/* Section 1: Import from Web                                    */}
              {/* ============================================================ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-5 w-5 text-[#1D4ED8]" />
                    Import from Web
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* URL Input */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter coaching website URL..."
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleScrape}
                      disabled={scraping || !scrapeUrl.trim()}
                    >
                      {scraping ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-1.5 h-4 w-4" />
                          Scrape Content
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Scraped Content Preview */}
                  {scrapedContent && !generatingDrill && !drillForm && (
                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-[#0B2545]">{scrapedContent.title}</h4>
                          <a
                            href={scrapedContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center gap-1 text-xs text-[#1D4ED8] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {scrapedContent.url}
                          </a>
                        </div>
                        <Badge variant="info">Scraped</Badge>
                      </div>

                      <div className="rounded-md bg-gray-100 p-3">
                        <p className="whitespace-pre-wrap text-sm text-gray-600">
                          {showFullContent
                            ? scrapedContent.content
                            : scrapedContent.content.slice(0, 500) +
                              (scrapedContent.content.length > 500 ? "..." : "")}
                        </p>
                        {scrapedContent.content.length > 500 && (
                          <button
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
                            onClick={() => setShowFullContent(!showFullContent)}
                          >
                            <Eye className="h-3 w-3" />
                            {showFullContent ? "Show Less" : "View Full Content"}
                          </button>
                        )}
                      </div>

                      {/* Selection Controls */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Select
                          label="Age Group"
                          options={AGE_GROUPS.map((ag) => ({ label: ag, value: ag }))}
                          value={scrapeAgeGroup}
                          onChange={(e) => setScrapeAgeGroup(e.target.value)}
                        />
                        <Select
                          label="Focus Area"
                          options={FOCUS_AREAS.map((fa) => ({ label: fa, value: fa }))}
                          value={scrapeFocusArea}
                          onChange={(e) => setScrapeFocusArea(e.target.value)}
                        />
                        <Select
                          label="Difficulty"
                          options={DIFFICULTIES.map((d) => ({ label: d, value: d }))}
                          value={scrapeDifficulty}
                          onChange={(e) => setScrapeDifficulty(e.target.value)}
                        />
                      </div>

                      <Button
                        variant="accent"
                        size="sm"
                        onClick={handleGenerateDrill}
                        disabled={generatingDrill}
                      >
                        <Sparkles className="mr-1.5 h-4 w-4" />
                        Generate Drill from This
                      </Button>
                    </div>
                  )}

                  {/* Generating Drill Spinner */}
                  {generatingDrill && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-gray-400">
                      <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#1D4ED8]" />
                      <p className="text-sm text-gray-500">Generating drill...</p>
                    </div>
                  )}

                  {/* Generated Drill Review Form */}
                  {drillForm && !generatingDrill && (
                    <div className="space-y-4 rounded-lg border-2 border-[#1D4ED8]/30 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                          <BookOpen className="h-4 w-4 text-[#1D4ED8]" />
                          Generated Drill — Review &amp; Edit
                        </h4>
                        <Badge variant="info">AI Generated</Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                          label="Name"
                          value={drillForm.name}
                          onChange={(e) => updateDrillForm("name", e.target.value)}
                        />
                        <Select
                          label="Category"
                          options={DRILL_CATEGORIES.map((c) => ({ label: c, value: c }))}
                          value={drillForm.category}
                          onChange={(e) => updateDrillForm("category", e.target.value)}
                        />
                        <Input
                          label="Age Groups"
                          value={drillForm.ageGroups}
                          onChange={(e) => updateDrillForm("ageGroups", e.target.value)}
                        />
                        <Select
                          label="Difficulty"
                          options={DIFFICULTIES.map((d) => ({ label: d, value: d }))}
                          value={drillForm.difficulty}
                          onChange={(e) => updateDrillForm("difficulty", e.target.value)}
                        />
                        <Input
                          label="Duration (minutes)"
                          value={drillForm.duration}
                          onChange={(e) => updateDrillForm("duration", e.target.value)}
                        />
                      </div>

                      <Textarea
                        label="Equipment"
                        value={drillForm.equipment}
                        onChange={(e) => updateDrillForm("equipment", e.target.value)}
                      />
                      <Textarea
                        label="Setup"
                        value={drillForm.setup}
                        onChange={(e) => updateDrillForm("setup", e.target.value)}
                      />
                      <Textarea
                        label="Instructions"
                        value={drillForm.instructions}
                        onChange={(e) => updateDrillForm("instructions", e.target.value)}
                      />
                      <Textarea
                        label="Coaching Points"
                        value={drillForm.coachRole}
                        onChange={(e) => updateDrillForm("coachRole", e.target.value)}
                      />
                      <Textarea
                        label="Targeted Results"
                        value={drillForm.targetedResults}
                        onChange={(e) => updateDrillForm("targetedResults", e.target.value)}
                      />

                      <div className="flex gap-2 border-t border-gray-200 pt-4">
                        <Button variant="accent" size="sm" onClick={handleSaveDrill}>
                          <Save className="mr-1.5 h-3.5 w-3.5" />
                          Save to Library
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleGenerateDrill}
                          disabled={generatingDrill}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ============================================================ */}
              {/* Section 2: AI Session Generator (EXISTING)                    */}
              {/* ============================================================ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-[#1D4ED8]" />
                    Generate Session with AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Select
                      label="Age Group"
                      options={AGE_GROUPS.map((ag) => ({ label: ag, value: ag }))}
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                    />
                    <Select
                      label="Skill Level"
                      options={SKILL_LEVELS.map((sl) => ({ label: sl, value: sl }))}
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                    />
                    <Select
                      label="Focus Area"
                      options={FOCUS_AREAS.map((fa) => ({ label: fa, value: fa }))}
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleGenerate}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* AI Preview */}
              {showPreview && (
                <Card className="border-[#1D4ED8]/30 border-2">
                  <CardHeader className="bg-blue-50/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#1D4ED8]" />
                        {MOCK_AI_SESSION.title}
                      </CardTitle>
                      <Badge variant="info">AI Generated</Badge>
                    </div>
                    <div className="mt-2 flex gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {MOCK_AI_SESSION.ageGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {MOCK_AI_SESSION.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-5">
                    {/* Warm-up */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Warm-Up &middot; {MOCK_AI_SESSION.warmUp.duration}
                      </h4>
                      <div className="rounded-lg bg-orange-50 p-3">
                        <p className="text-sm font-medium text-[#0B2545]">{MOCK_AI_SESSION.warmUp.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{MOCK_AI_SESSION.warmUp.description}</p>
                      </div>
                    </div>

                    {/* Main Drills */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Dumbbell className="h-4 w-4 text-[#1D4ED8]" />
                        Main Drills
                      </h4>
                      <div className="space-y-3">
                        {MOCK_AI_SESSION.drills.map((drill, idx) => (
                          <div key={idx} className="rounded-lg border border-gray-200 p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                                <Target className="h-6 w-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-[#0B2545]">{drill.name}</p>
                                  <Badge>{drill.duration}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{drill.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cool-down */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                        <Snowflake className="h-4 w-4 text-sky-500" />
                        Cool-Down &middot; {MOCK_AI_SESSION.coolDown.duration}
                      </h4>
                      <div className="rounded-lg bg-sky-50 p-3">
                        <p className="text-sm font-medium text-[#0B2545]">{MOCK_AI_SESSION.coolDown.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{MOCK_AI_SESSION.coolDown.description}</p>
                      </div>
                    </div>

                    {/* Coach Notes */}
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-[#0B2545]">Coach Notes</h4>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">{MOCK_AI_SESSION.coachNotes}</p>
                      </div>
                    </div>

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
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={generating}
                      >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!showPreview && !generating && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16 text-gray-400">
                  <Sparkles className="mb-3 h-10 w-10" />
                  <p className="text-sm">Click &ldquo;Generate with AI&rdquo; to create a session plan</p>
                </div>
              )}

              {generating && !showPreview && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16 text-gray-400">
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-[#1D4ED8]" />
                  <p className="text-sm text-gray-500">Generating your session plan...</p>
                </div>
              )}
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
