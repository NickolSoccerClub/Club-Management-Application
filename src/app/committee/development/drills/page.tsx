"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToastStore } from "@/lib/stores/toast-store";
import { DRILL_LIBRARY, DRILL_CATEGORIES, type DrillFull } from "@/lib/data/drills";
import { DrillDetailPanel } from "@/components/committee/development/drill-detail-panel";
import {
  Plus,
  Search,
  Target,
  Clock,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Loader2,
  ExternalLink,
  Save,
  RefreshCw,
  BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DrillForm {
  name: string;
  skill_category: string;
  age_groups: string;
  difficulty: string;
  duration_minutes: string;
  equipment: string;
  setup: string;
  instructions: string;
  coach_role: string;
  targeted_results: string;
}

/* ------------------------------------------------------------------ */
/*  Constants & Helpers                                                */
/* ------------------------------------------------------------------ */

const PER_PAGE = 12;

const FOCUS_AREA_OPTIONS = [
  { label: "Select Focus Area", value: "" },
  { label: "Passing", value: "Passing" },
  { label: "Shooting", value: "Shooting" },
  { label: "Defending", value: "Defending" },
  { label: "Dribbling", value: "Dribbling" },
  { label: "Fitness", value: "Fitness" },
  { label: "Tactical", value: "Tactical" },
  { label: "Goalkeeping", value: "Goalkeeping" },
  { label: "Set Pieces", value: "Set Pieces" },
];

const GEN_AGE_GROUP_OPTIONS = [
  { label: "Select Age Group", value: "" },
  { label: "U6", value: "U6" },
  { label: "U8", value: "U8" },
  { label: "U10", value: "U10" },
  { label: "U12", value: "U12" },
  { label: "U14", value: "U14" },
  { label: "U16", value: "U16" },
];

const GEN_DIFFICULTY_OPTIONS = [
  { label: "Select Difficulty", value: "" },
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-[#15803D] bg-[#F0FDF4]",
  "Beginner-Intermediate": "text-[#1D4ED8] bg-blue-50",
  Intermediate: "text-[#B45309] bg-[#FFFBEB]",
  "Intermediate-Advanced": "text-[#B91C1C] bg-[#FEF2F2]",
  Advanced: "text-[#B91C1C] bg-[#FEF2F2]",
};

const DIFFICULTY_STAR_COLOR: Record<string, string> = {
  Beginner: "fill-green-500 text-green-500",
  "Beginner-Intermediate": "fill-blue-500 text-blue-500",
  Intermediate: "fill-amber-500 text-amber-500",
  "Intermediate-Advanced": "fill-red-500 text-red-500",
  Advanced: "fill-red-500 text-red-500",
};

const CATEGORY_COLOR: Record<string, string> = {
  Dribbling: "text-[#1D4ED8] bg-blue-50",
  Passing: "text-[#15803D] bg-[#F0FDF4]",
  Shooting: "text-[#B91C1C] bg-[#FEF2F2]",
  Defending: "text-[#B45309] bg-[#FFFBEB]",
  Fitness: "text-purple-700 bg-purple-50",
  Tactical: "text-gray-700 bg-gray-100",
};

/** Extract all unique age group tokens from the library */
const ALL_AGE_GROUPS = Array.from(
  new Set(
    DRILL_LIBRARY.flatMap((d) =>
      d.age_groups.split(",").map((g) => g.trim())
    )
  )
).sort((a, b) => {
  const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
  const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
  return numA - numB;
});

/** Extract all unique difficulties from the library */
const ALL_DIFFICULTIES = Array.from(
  new Set(DRILL_LIBRARY.map((d) => d.difficulty))
);

const EMPTY_DRILL_FORM: DrillForm = {
  name: "",
  skill_category: "",
  age_groups: "",
  difficulty: "",
  duration_minutes: "",
  equipment: "",
  setup: "",
  instructions: "",
  coach_role: "",
  targeted_results: "",
};

/* ------------------------------------------------------------------ */
/*  Difficulty Star                                                    */
/* ------------------------------------------------------------------ */

function DifficultyIndicator({ difficulty }: { difficulty: string }) {
  const color = DIFFICULTY_STAR_COLOR[difficulty] || "fill-gray-400 text-gray-400";
  return (
    <div className="flex items-center gap-1.5">
      <Star className={cn("h-3.5 w-3.5", color)} />
      <span className="text-xs text-gray-600">{difficulty}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generated Drill Review Form                                        */
/* ------------------------------------------------------------------ */

function DrillReviewForm({
  drillForm,
  setDrillForm,
  onSave,
  onRegenerate,
  saving,
  regenerating,
}: {
  drillForm: DrillForm;
  setDrillForm: React.Dispatch<React.SetStateAction<DrillForm>>;
  onSave: () => void;
  onRegenerate: () => void;
  saving: boolean;
  regenerating: boolean;
}) {
  const updateField = (field: keyof DrillForm, value: string) => {
    setDrillForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#1D4ED8]" />
        <h3 className="text-lg font-semibold text-[#0B2545]">
          Generated Drill — Review & Edit
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Drill Name"
          value={drillForm.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <Input
          label="Category"
          value={drillForm.skill_category}
          onChange={(e) => updateField("skill_category", e.target.value)}
        />
        <Input
          label="Age Groups"
          value={drillForm.age_groups}
          onChange={(e) => updateField("age_groups", e.target.value)}
          placeholder="e.g. U10, U12"
        />
        <Input
          label="Difficulty"
          value={drillForm.difficulty}
          onChange={(e) => updateField("difficulty", e.target.value)}
        />
        <Input
          label="Duration (minutes)"
          value={drillForm.duration_minutes}
          onChange={(e) => updateField("duration_minutes", e.target.value)}
        />
        <Input
          label="Equipment"
          value={drillForm.equipment}
          onChange={(e) => updateField("equipment", e.target.value)}
        />
      </div>

      <Textarea
        label="Setup"
        rows={3}
        value={drillForm.setup}
        onChange={(e) => updateField("setup", e.target.value)}
      />
      <Textarea
        label="Instructions"
        rows={5}
        value={drillForm.instructions}
        onChange={(e) => updateField("instructions", e.target.value)}
      />
      <Textarea
        label="Coaching Points"
        rows={3}
        value={drillForm.coach_role}
        onChange={(e) => updateField("coach_role", e.target.value)}
      />
      <Textarea
        label="Targeted Results"
        rows={3}
        value={drillForm.targeted_results}
        onChange={(e) => updateField("targeted_results", e.target.value)}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="accent"
          size="sm"
          onClick={onSave}
          disabled={saving || !drillForm.name.trim()}
        >
          {saving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          Save to Library
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRegenerate}
          disabled={regenerating}
        >
          {regenerating ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-1.5 h-4 w-4" />
          )}
          Regenerate
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DrillLibraryPage() {
  /* ---- Library state ---- */
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedDrill, setSelectedDrill] = useState<DrillFull | null>(null);

  /* ---- Web scraping state ---- */
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  /* ---- Generation state (shared between Import + AI tabs) ---- */
  const [genAgeGroup, setGenAgeGroup] = useState("");
  const [genFocusArea, setGenFocusArea] = useState("");
  const [genDifficulty, setGenDifficulty] = useState("");
  const [generatingDrill, setGeneratingDrill] = useState(false);
  const [generatedDrill, setGeneratedDrill] = useState<Record<string, unknown> | null>(null);
  const [drillForm, setDrillForm] = useState<DrillForm>(EMPTY_DRILL_FORM);
  const [savingDrill, setSavingDrill] = useState(false);

  /* ---- AI-only generation state (separate selectors for Tab 3) ---- */
  const [aiAgeGroup, setAiAgeGroup] = useState("");
  const [aiFocusArea, setAiFocusArea] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedDrill, setAiGeneratedDrill] = useState<Record<string, unknown> | null>(null);
  const [aiDrillForm, setAiDrillForm] = useState<DrillForm>(EMPTY_DRILL_FORM);
  const [aiSaving, setAiSaving] = useState(false);

  /* ---- Active tab ---- */
  const [activeTab, setActiveTab] = useState("library");

  const addToast = useToastStore((s) => s.addToast);

  // Skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, ageFilter, difficultyFilter]);

  /* ---- Library filtering ---- */
  const filtered = useMemo(() => {
    return DRILL_LIBRARY.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.instructions.toLowerCase().includes(q) ||
        d.skill_category.toLowerCase().includes(q);
      const matchCategory =
        categoryFilter === "All" || d.skill_category === categoryFilter;
      const matchAge =
        ageFilter === "All" ||
        d.age_groups
          .split(",")
          .map((g) => g.trim())
          .includes(ageFilter);
      const matchDifficulty =
        difficultyFilter === "All" || d.difficulty === difficultyFilter;
      return matchSearch && matchCategory && matchAge && matchDifficulty;
    });
  }, [search, categoryFilter, ageFilter, difficultyFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ---- Filter option builders ---- */
  const categoryOptions = [
    { label: "All Categories", value: "All" },
    ...DRILL_CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  const ageOptions = [
    { label: "All Ages", value: "All" },
    ...ALL_AGE_GROUPS.map((ag) => ({ label: ag, value: ag })),
  ];

  const difficultyOptions = [
    { label: "All Levels", value: "All" },
    ...ALL_DIFFICULTIES.map((d) => ({ label: d, value: d })),
  ];

  const handleAddDrill = () => {
    addToast("Drill added successfully", "success");
  };

  /* ---- Populate form from generated drill ---- */
  const populateForm = (
    drill: Record<string, unknown>,
    setter: React.Dispatch<React.SetStateAction<DrillForm>>
  ) => {
    setter({
      name: String(drill.name || ""),
      skill_category: String(drill.skill_category || drill.category || ""),
      age_groups: String(drill.age_groups || ""),
      difficulty: String(drill.difficulty || ""),
      duration_minutes: String(drill.duration_minutes || drill.duration || ""),
      equipment: String(drill.equipment || ""),
      setup: String(drill.setup || ""),
      instructions: String(drill.instructions || ""),
      coach_role: String(drill.coach_role || drill.coaching_points || ""),
      targeted_results: String(drill.targeted_results || ""),
    });
  };

  /* ---- Web scrape handler ---- */
  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      addToast("Please enter a URL to scrape", "error");
      return;
    }
    setScraping(true);
    setScrapedContent(null);
    setGeneratedDrill(null);
    setDrillForm(EMPTY_DRILL_FORM);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      if (!res.ok) throw new Error("Failed to scrape content");
      const data = await res.json();
      setScrapedContent({
        title: data.title || "Untitled",
        content: data.content || "",
      });
      addToast("Content scraped successfully", "success");
    } catch {
      addToast("Failed to scrape content from URL", "error");
    } finally {
      setScraping(false);
    }
  };

  /* ---- Generate drill (web import tab) ---- */
  const handleGenerateFromWeb = async () => {
    if (!genFocusArea || !genAgeGroup || !genDifficulty) {
      addToast("Please select age group, focus area, and difficulty", "error");
      return;
    }
    setGeneratingDrill(true);
    setGeneratedDrill(null);
    setDrillForm(EMPTY_DRILL_FORM);
    try {
      const res = await fetch("/api/drills/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scrapedContent: scrapedContent?.content || "",
          focusArea: genFocusArea,
          ageGroup: genAgeGroup,
          difficulty: genDifficulty,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate drill");
      const data = await res.json();
      const drill = data.drill || data;
      setGeneratedDrill(drill);
      populateForm(drill, setDrillForm);
      addToast("Drill generated successfully", "success");
    } catch {
      addToast("Failed to generate drill", "error");
    } finally {
      setGeneratingDrill(false);
    }
  };

  /* ---- Generate drill (AI-only tab) ---- */
  const handleGenerateAI = async () => {
    if (!aiFocusArea || !aiAgeGroup || !aiDifficulty) {
      addToast("Please select age group, focus area, and difficulty", "error");
      return;
    }
    setAiGenerating(true);
    setAiGeneratedDrill(null);
    setAiDrillForm(EMPTY_DRILL_FORM);
    try {
      const res = await fetch("/api/drills/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusArea: aiFocusArea,
          ageGroup: aiAgeGroup,
          difficulty: aiDifficulty,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate drill");
      const data = await res.json();
      const drill = data.drill || data;
      setAiGeneratedDrill(drill);
      populateForm(drill, setAiDrillForm);
      addToast("Drill generated by Coach Niko", "success");
    } catch {
      addToast("Failed to generate drill", "error");
    } finally {
      setAiGenerating(false);
    }
  };

  /* ---- Save drill to library ---- */
  const handleSaveDrill = async (
    form: DrillForm,
    setSaving: React.Dispatch<React.SetStateAction<boolean>>,
    setGenDrill: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>,
    setForm: React.Dispatch<React.SetStateAction<DrillForm>>
  ) => {
    if (!form.name.trim()) {
      addToast("Drill name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/drills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save drill");
      addToast("Drill saved to library", "success");
      setGenDrill(null);
      setForm(EMPTY_DRILL_FORM);
    } catch {
      addToast("Failed to save drill", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Drill Library"
        subtitle={`${filtered.length} drill${filtered.length !== 1 ? "s" : ""}`}
      >
        <Button variant="accent" size="sm" onClick={handleAddDrill}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Drill
        </Button>
      </PageHeader>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="library">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="import">
            <Globe className="mr-1.5 h-4 w-4" />
            Import from Web
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="mr-1.5 h-4 w-4" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  Tab 1: Library                                               */}
        {/* ============================================================ */}
        <TabsContent value="library">
          <div className="space-y-6">
            {/* Search + Filters */}
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
              <div className="relative flex-1">
                <Input
                  placeholder="Search drills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
                <Select
                  label="Age Group"
                  options={ageOptions}
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                />
                <Select
                  label="Difficulty"
                  options={difficultyOptions}
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No drills found"
                description="No drills match the current filters. Try adjusting your search or filter criteria."
              />
            ) : (
              <>
                {/* Drill Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((drill) => (
                    <Card
                      key={drill.drill_id}
                      className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDrill(drill)}
                    >
                      {/* Diagram placeholder */}
                      <div className="flex h-32 items-center justify-center bg-gray-100">
                        <Target className="h-10 w-10 text-gray-300" />
                      </div>
                      <CardContent className="space-y-3 p-4">
                        {/* Drill ID + Name */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="block text-[10px] font-mono text-gray-400">
                              {drill.drill_id}
                            </span>
                            <h3 className="text-sm font-semibold text-[#0B2545] truncate">
                              {drill.name}
                            </h3>
                          </div>
                          <Badge
                            className={cn(
                              "shrink-0",
                              CATEGORY_COLOR[drill.skill_category] || ""
                            )}
                          >
                            {drill.skill_category}
                          </Badge>
                        </div>

                        {/* Age Group badges */}
                        <div className="flex flex-wrap gap-1">
                          {drill.age_groups
                            .split(",")
                            .map((ag) => ag.trim())
                            .map((ag) => (
                              <Badge key={ag} variant="info" className="text-[10px]">
                                {ag}
                              </Badge>
                            ))}
                        </div>

                        {/* Difficulty */}
                        <DifficultyIndicator difficulty={drill.difficulty} />

                        {/* Duration + Equipment */}
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {drill.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Package className="h-3 w-3 shrink-0" />
                            <span className="truncate">{drill.equipment}</span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <p className="text-sm text-gray-600">
                      Showing {(page - 1) * PER_PAGE + 1}
                      {" - "}
                      {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                      {filtered.length} drills
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm font-medium text-[#0B2545]">
                        {page} / {totalPages}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Tab 2: Import from Web                                       */}
        {/* ============================================================ */}
        <TabsContent value="import">
          <div className="space-y-6">
            {/* URL Input */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#1D4ED8]" />
                <h3 className="text-lg font-semibold text-[#0B2545]">
                  Import Drill from Web
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Paste a URL to a drill or training article. We will scrape the content
                and use AI to generate a structured drill from it.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    placeholder="https://example.com/soccer-drill..."
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="pl-9"
                  />
                  <ExternalLink className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleScrape}
                  disabled={scraping || !scrapeUrl.trim()}
                >
                  {scraping ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="mr-1.5 h-4 w-4" />
                  )}
                  Scrape Content
                </Button>
              </div>
            </div>

            {/* Scraped Content Preview */}
            {scrapedContent && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
                <h4 className="font-semibold text-[#0B2545]">
                  {scrapedContent.title}
                </h4>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {showFullContent
                    ? scrapedContent.content
                    : scrapedContent.content.slice(0, 500) +
                      (scrapedContent.content.length > 500 ? "..." : "")}
                </div>
                {scrapedContent.content.length > 500 && (
                  <button
                    type="button"
                    className="text-sm font-medium text-[#1D4ED8] hover:underline"
                    onClick={() => setShowFullContent((prev) => !prev)}
                  >
                    {showFullContent ? "Show less" : "Show full content"}
                  </button>
                )}
              </div>
            )}

            {/* Generation Options */}
            {scrapedContent && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                <h4 className="font-semibold text-[#0B2545]">
                  Configure Drill Generation
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Select
                    label="Age Group"
                    options={GEN_AGE_GROUP_OPTIONS}
                    value={genAgeGroup}
                    onChange={(e) => setGenAgeGroup(e.target.value)}
                  />
                  <Select
                    label="Focus Area"
                    options={FOCUS_AREA_OPTIONS}
                    value={genFocusArea}
                    onChange={(e) => setGenFocusArea(e.target.value)}
                  />
                  <Select
                    label="Difficulty"
                    options={GEN_DIFFICULTY_OPTIONS}
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                  />
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleGenerateFromWeb}
                  disabled={generatingDrill || !genFocusArea || !genAgeGroup || !genDifficulty}
                >
                  {generatingDrill ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-1.5 h-4 w-4" />
                  )}
                  Generate Drill
                </Button>
              </div>
            )}

            {/* Generated Drill Review Form */}
            {generatedDrill && (
              <DrillReviewForm
                drillForm={drillForm}
                setDrillForm={setDrillForm}
                onSave={() =>
                  handleSaveDrill(
                    drillForm,
                    setSavingDrill,
                    setGeneratedDrill,
                    setDrillForm
                  )
                }
                onRegenerate={handleGenerateFromWeb}
                saving={savingDrill}
                regenerating={generatingDrill}
              />
            )}

            {/* Empty state when no content scraped yet */}
            {!scrapedContent && !scraping && (
              <EmptyState
                icon={Globe}
                title="No content imported"
                description="Enter a URL above and click 'Scrape Content' to import a drill from the web."
              />
            )}
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Tab 3: AI Generate                                           */}
        {/* ============================================================ */}
        <TabsContent value="ai">
          <div className="space-y-6">
            {/* AI Generation Panel */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1D4ED8]" />
                <h3 className="text-lg font-semibold text-[#0B2545]">
                  Generate with Coach Niko
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Let Coach Niko create a custom drill for you. Select the parameters
                below and our AI will generate a complete, structured drill.
              </p>
              <div className="flex flex-wrap gap-3">
                <Select
                  label="Age Group"
                  options={GEN_AGE_GROUP_OPTIONS}
                  value={aiAgeGroup}
                  onChange={(e) => setAiAgeGroup(e.target.value)}
                />
                <Select
                  label="Focus Area"
                  options={FOCUS_AREA_OPTIONS}
                  value={aiFocusArea}
                  onChange={(e) => setAiFocusArea(e.target.value)}
                />
                <Select
                  label="Difficulty"
                  options={GEN_DIFFICULTY_OPTIONS}
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                />
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={handleGenerateAI}
                disabled={aiGenerating || !aiFocusArea || !aiAgeGroup || !aiDifficulty}
              >
                {aiGenerating ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                Generate with Coach Niko
              </Button>
            </div>

            {/* Generated Drill Review Form */}
            {aiGeneratedDrill && (
              <DrillReviewForm
                drillForm={aiDrillForm}
                setDrillForm={setAiDrillForm}
                onSave={() =>
                  handleSaveDrill(
                    aiDrillForm,
                    setAiSaving,
                    setAiGeneratedDrill,
                    setAiDrillForm
                  )
                }
                onRegenerate={handleGenerateAI}
                saving={aiSaving}
                regenerating={aiGenerating}
              />
            )}

            {/* Empty state when no drill generated yet */}
            {!aiGeneratedDrill && !aiGenerating && (
              <EmptyState
                icon={Sparkles}
                title="No drill generated yet"
                description="Select your parameters above and click 'Generate with Coach Niko' to create a new drill."
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Drill Detail Slide-over */}
      <DrillDetailPanel
        drill={selectedDrill}
        open={selectedDrill !== null}
        onClose={() => setSelectedDrill(null)}
      />
    </div>
  );
}
