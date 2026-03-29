"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Difficulty helpers                                                  */
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

          {/* AI Image Description */}
          <Section icon={Image} title="AI Image Prompt">
            <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-md p-3 border border-gray-100">
              {drill.ai_image_description}
            </p>
          </Section>
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
