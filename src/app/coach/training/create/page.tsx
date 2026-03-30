"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToastStore } from "@/lib/stores/toast-store";
import { DRILL_LIBRARY } from "@/lib/data/drills";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Trash2,
  GripVertical,
  Flame,
  Dumbbell,
  Wind,
  Loader2,
  BookOpen,
  Save,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PlanSection = "warm-up" | "main" | "cool-down";

interface PlanDrill {
  id: string;
  drillId: string;
  name: string;
  duration: number;
  description: string;
  section: PlanSection;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const FOCUS_OPTIONS = [
  { label: "Passing", value: "Passing" },
  { label: "Shooting", value: "Shooting" },
  { label: "Defending", value: "Defending" },
  { label: "Dribbling", value: "Dribbling" },
  { label: "Tactical", value: "Tactical" },
  { label: "Fitness", value: "Fitness" },
  { label: "Set Pieces", value: "Set Pieces" },
  { label: "Goalkeeping", value: "Goalkeeping" },
];

const SECTION_CONFIG: Record<PlanSection, { label: string; border: string; bg: string; icon: React.ElementType; iconColor: string }> = {
  "warm-up": { label: "Warm-Up", border: "border-l-amber-400", bg: "bg-amber-50/50", icon: Flame, iconColor: "text-amber-500" },
  main: { label: "Main Drills", border: "border-l-blue-500", bg: "bg-blue-50/50", icon: Dumbbell, iconColor: "text-blue-500" },
  "cool-down": { label: "Cool-Down", border: "border-l-sky-400", bg: "bg-sky-50/50", icon: Wind, iconColor: "text-sky-500" },
};

const NIKO_GENERATED_PLAN: PlanDrill[] = [
  { id: "gen-1", drillId: "DRB-001", name: "Toe Taps", duration: 5, description: "Warm up with alternating toe taps on the ball. Build rhythm and get feet moving.", section: "warm-up" },
  { id: "gen-2", drillId: "PASS-001", name: "Partner Passing Lines", duration: 10, description: "Pairs stand 8-10m apart, passing with the inside of the foot. Focus on accuracy and soft first touch.", section: "main" },
  { id: "gen-3", drillId: "PASS-002", name: "Passing Gates", duration: 12, description: "Pass through scattered cone gates with a partner. Count successful passes in 90 seconds.", section: "main" },
  { id: "gen-4", drillId: "PASS-003", name: "Triangle Passing", duration: 10, description: "Groups of 3 in a triangle. Pass and follow to the next cone. Switch direction every 2 minutes.", section: "main" },
  { id: "gen-5", drillId: "DRB-002", name: "Sole Rolls Cool Down", duration: 5, description: "Gentle sole rolls and stretching with the ball. Bring heart rate down and reflect on session.", section: "cool-down" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CreateTrainingSessionPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("16:00");
  const [location, setLocation] = useState("Nickol West Oval");
  const [focusArea, setFocusArea] = useState("");

  // Plan builder
  const [planDrills, setPlanDrills] = useState<PlanDrill[]>([]);
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [pickerSection, setPickerSection] = useState<PlanSection>("main");
  const [pickerFilter, setPickerFilter] = useState("");

  // AI generation
  const [generating, setGenerating] = useState(false);

  /* ---- Drill picker ---- */

  const filteredLibrary = DRILL_LIBRARY.filter((drill) => {
    const search = pickerFilter.toLowerCase();
    return (
      drill.name.toLowerCase().includes(search) ||
      drill.skill_category.toLowerCase().includes(search)
    );
  });

  const addDrillFromLibrary = (drill: typeof DRILL_LIBRARY[0], section: PlanSection) => {
    const newDrill: PlanDrill = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      drillId: drill.drill_id,
      name: drill.name,
      duration: drill.duration_minutes,
      description: drill.instructions.split(".").slice(0, 2).join(".") + ".",
      section,
    };
    setPlanDrills((prev) => [...prev, newDrill]);
    addToast(`Added "${drill.name}" to ${SECTION_CONFIG[section].label}`, "success");
  };

  const removeDrill = (id: string) => {
    setPlanDrills((prev) => prev.filter((d) => d.id !== id));
  };

  /* ---- AI generation ---- */

  const handleGenerateWithNiko = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlanDrills(NIKO_GENERATED_PLAN);
      setGenerating(false);
      addToast("Coach Niko generated a session plan!", "success");
    }, 1500);
  };

  /* ---- Save handlers ---- */

  const handleSaveDraft = () => {
    addToast("Session saved as draft", "success");
    router.push("/coach/training");
  };

  const handlePublish = () => {
    if (!title || !date || !focusArea) {
      addToast("Please fill in title, date, and focus area", "error");
      return;
    }
    addToast("Training session published!", "success");
    router.push("/coach/training");
  };

  /* ---- Render helpers ---- */

  const totalDuration = planDrills.reduce((sum, d) => sum + d.duration, 0);

  const renderPlanSection = (section: PlanSection) => {
    const config = SECTION_CONFIG[section];
    const sectionDrills = planDrills.filter((d) => d.section === section);
    const Icon = config.icon;

    return (
      <div key={section} className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", config.iconColor)} />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {config.label}
            </h3>
            {sectionDrills.length > 0 && (
              <Badge variant="default">
                {sectionDrills.reduce((s, d) => s + d.duration, 0)} min
              </Badge>
            )}
          </div>
          <button
            onClick={() => {
              setPickerSection(section);
              setShowDrillPicker(true);
              setPickerFilter("");
            }}
            className="flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline min-h-[44px] px-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {sectionDrills.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
            No drills added yet. Click &quot;Add&quot; to browse the drill library.
          </div>
        ) : (
          <div className="space-y-2">
            {sectionDrills.map((drill) => (
              <div
                key={drill.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-gray-200 border-l-4 p-4",
                  config.border,
                  config.bg
                )}
              >
                <GripVertical className="mt-1 h-4 w-4 shrink-0 text-gray-300" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#0B2545]">{drill.name}</span>
                    <Badge variant="default">{drill.duration} min</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{drill.description}</p>
                </div>
                <button
                  onClick={() => removeDrill(drill.id)}
                  className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remove drill"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/coach/training"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0B2545] transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Training
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-[#0B2545] md:text-3xl">
        Create Training Session
      </h1>

      {/* ---- Session details form ---- */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0B2545]">Session Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Title"
              placeholder="e.g. Passing & Movement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <Input
            label="Location"
            placeholder="e.g. Nickol West Oval"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Select
            label="Focus Area"
            placeholder="Select focus area..."
            options={FOCUS_OPTIONS}
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </div>
      </div>

      {/* ---- Session plan builder ---- */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0B2545]">Session Plan</h2>
            {planDrills.length > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">
                {planDrills.length} drills — {totalDuration} minutes total
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              className="gap-2 min-h-[44px]"
              onClick={() => {
                setPickerSection("main");
                setShowDrillPicker(true);
                setPickerFilter("");
              }}
            >
              <BookOpen className="h-4 w-4" />
              Browse Drill Library
            </Button>
            <Button
              variant="accent"
              size="md"
              className="gap-2 min-h-[44px]"
              onClick={handleGenerateWithNiko}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating..." : "Generate with Coach Niko"}
            </Button>
          </div>
        </div>

        {/* Plan sections */}
        {renderPlanSection("warm-up")}
        {renderPlanSection("main")}
        {renderPlanSection("cool-down")}
      </div>

      {/* ---- Drill picker modal/panel ---- */}
      {showDrillPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDrillPicker(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#0B2545]">
                  Add Drill to {SECTION_CONFIG[pickerSection].label}
                </h3>
                <button
                  onClick={() => setShowDrillPicker(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* Section selector */}
              <div className="flex gap-2 mb-3">
                {(["warm-up", "main", "cool-down"] as PlanSection[]).map((s) => {
                  const cfg = SECTION_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setPickerSection(s)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors min-h-[40px]",
                        pickerSection === s
                          ? "bg-[#0B2545] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              <Input
                placeholder="Search drills..."
                value={pickerFilter}
                onChange={(e) => setPickerFilter(e.target.value)}
              />
            </div>

            {/* Drill list */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {filteredLibrary.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No drills found matching your search.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLibrary.map((drill) => {
                    const alreadyAdded = planDrills.some(
                      (pd) => pd.drillId === drill.drill_id && pd.section === pickerSection
                    );
                    return (
                      <div
                        key={drill.drill_id}
                        className="flex items-center justify-between rounded-xl border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-[#0B2545] text-sm">
                              {drill.name}
                            </span>
                            <Badge variant="default">{drill.duration_minutes} min</Badge>
                            <Badge
                              variant={
                                drill.skill_category === "Passing" ? "info" :
                                drill.skill_category === "Dribbling" ? "success" :
                                drill.skill_category === "Shooting" ? "danger" :
                                drill.skill_category === "Defending" ? "warning" : "default"
                              }
                            >
                              {drill.skill_category}
                            </Badge>
                            <Badge variant="default">{drill.difficulty}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                            {drill.instructions.split(".").slice(0, 2).join(".") + "."}
                          </p>
                        </div>
                        <Button
                          variant={alreadyAdded ? "ghost" : "accent"}
                          size="sm"
                          className="shrink-0 min-h-[44px] min-w-[44px]"
                          disabled={alreadyAdded}
                          onClick={() => addDrillFromLibrary(drill, pickerSection)}
                        >
                          {alreadyAdded ? "Added" : <Plus className="h-4 w-4" />}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-3 flex justify-end">
              <Button
                variant="secondary"
                size="md"
                className="min-h-[44px]"
                onClick={() => setShowDrillPicker(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Save buttons ---- */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="gap-2 min-h-[48px]"
          onClick={handleSaveDraft}
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          variant="accent"
          size="lg"
          className="gap-2 min-h-[48px]"
          onClick={handlePublish}
        >
          <Send className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
