"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/lib/stores/toast-store";
import type { DrillFull } from "@/lib/data/drills";
import {
  X,
  Edit,
  Clock,
  Users,
  Target,
  Package,
  ListOrdered,
  MessageSquare,
  Trophy,
  Image,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                     */
/* ------------------------------------------------------------------ */

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-[#15803D] bg-[#F0FDF4]",
  "Beginner-Intermediate": "text-[#1D4ED8] bg-blue-50",
  Intermediate: "text-[#B45309] bg-[#FFFBEB]",
  "Intermediate-Advanced": "text-[#B91C1C] bg-[#FEF2F2]",
  Advanced: "text-[#B91C1C] bg-[#FEF2F2]",
};

const CATEGORY_COLOR: Record<string, string> = {
  Dribbling: "text-[#1D4ED8] bg-blue-50",
  Passing: "text-[#15803D] bg-[#F0FDF4]",
  Shooting: "text-[#B91C1C] bg-[#FEF2F2]",
  Defending: "text-[#B45309] bg-[#FFFBEB]",
  Fitness: "text-purple-700 bg-purple-50",
  Tactical: "text-gray-700 bg-gray-100",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface DrillDetailPanelProps {
  drill: DrillFull | null;
  open: boolean;
  onClose: () => void;
}

export function DrillDetailPanel({ drill, open, onClose }: DrillDetailPanelProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [lastDrillId, setLastDrillId] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  // Reset image when drill changes
  if (drill && drill.drill_id !== lastDrillId) {
    setLastDrillId(drill.drill_id);
    setGeneratedImage(null);
  }

  const handleGenerateImage = useCallback(async () => {
    if (!drill) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/drills/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillName: drill.name,
          description: `${drill.ai_image_description}\n\nDrill setup: ${drill.setup}\nInstructions: ${drill.instructions}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to generate image", "error");
        return;
      }
      setGeneratedImage(data.image);
      addToast("Drill diagram generated", "success");
    } catch {
      addToast("Failed to generate image", "error");
    } finally {
      setGenerating(false);
    }
  }, [drill, addToast]);

  const handleDownloadImage = useCallback(() => {
    if (!generatedImage || !drill) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `${drill.drill_id}-${drill.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.click();
  }, [generatedImage, drill]);

  if (!drill) return null;

  const instructions = drill.instructions
    .split(/\d+\.\s*/)
    .filter(Boolean)
    .map((s) => s.trim());

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full sm:w-[500px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-gray-400">{drill.drill_id}</p>
              <h3 className="text-lg font-bold text-[#0B2545]">{drill.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={CATEGORY_COLOR[drill.skill_category] || ""}>{drill.skill_category}</Badge>
                <Badge className={DIFFICULTY_COLOR[drill.difficulty] || ""}>{drill.difficulty}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm">
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Drill Diagram Image */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
              <Image className="h-4 w-4 text-[#1D4ED8]" />
              Drill Diagram
            </h4>

            {generatedImage ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={generatedImage}
                    alt={`Tactical diagram for ${drill.name}`}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={generating}
                  >
                    <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", generating && "animate-spin")} />
                    Regenerate
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownloadImage}>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                {generating ? (
                  <div className="space-y-3">
                    <Loader2 className="mx-auto h-8 w-8 text-[#1D4ED8] animate-spin" />
                    <p className="text-sm font-medium text-[#0B2545]">Generating drill diagram...</p>
                    <p className="text-xs text-gray-500">This may take 10-15 seconds</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Image className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No diagram generated yet</p>
                    <Button variant="accent" size="sm" onClick={handleGenerateImage}>
                      <Image className="mr-1.5 h-4 w-4" />
                      Generate Diagram
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <Clock className="mx-auto h-4 w-4 text-gray-400" />
              <p className="mt-1 text-sm font-bold text-[#0B2545]">{drill.duration_minutes} min</p>
              <p className="text-[10px] text-gray-500">Duration</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <Users className="mx-auto h-4 w-4 text-gray-400" />
              <p className="mt-1 text-sm font-bold text-[#0B2545]">{drill.age_groups}</p>
              <p className="text-[10px] text-gray-500">Ages</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <Target className="mx-auto h-4 w-4 text-gray-400" />
              <p className="mt-1 text-sm font-bold text-[#0B2545]">{drill.skill_category}</p>
              <p className="text-[10px] text-gray-500">Category</p>
            </div>
          </div>

          {/* Equipment & Setup */}
          <Section icon={Package} title="Equipment & Setup">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Equipment</p>
                <p className="text-sm text-[#0B2545]">{drill.equipment}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Setup</p>
                <p className="text-sm text-[#0B2545]">{drill.setup}</p>
              </div>
            </div>
          </Section>

          {/* Instructions */}
          <Section icon={ListOrdered} title="Instructions">
            <ol className="space-y-2">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="text-[#0B2545] pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Coaching Points */}
          <Section icon={MessageSquare} title="Coaching Points">
            <p className="text-sm text-[#0B2545] leading-relaxed">{drill.coach_role}</p>
          </Section>

          {/* Targeted Results */}
          <Section icon={Trophy} title="Targeted Results">
            <p className="text-sm text-[#0B2545] leading-relaxed">{drill.targeted_results}</p>
          </Section>

          {/* AI Image Prompt (collapsible) */}
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600">
              <Image className="h-4 w-4" />
              AI Image Prompt (technical)
            </summary>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-md p-3 border border-gray-100">
              {drill.ai_image_description}
            </p>
          </details>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
        <Icon className="h-4 w-4 text-[#1D4ED8]" />
        {title}
      </h4>
      {children}
    </section>
  );
}
