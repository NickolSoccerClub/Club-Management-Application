"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export interface ChildProfile {
  id: string;
  name: string;
  initials: string;
  ageGroup: string;
  teamName: string;
  jerseyNumber: number;
  coachName: string;
  nextEvent: string;
  accentColor: string;
}

const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: "child-1",
    name: "Emma Richardson",
    initials: "ER",
    ageGroup: "Under 9s",
    teamName: "Nickol Thunder",
    jerseyNumber: 8,
    coachName: "Coach Josh",
    nextEvent: "Tue 29 Mar, 4:30 PM",
    accentColor: "#1D4ED8",
  },
  {
    id: "child-2",
    name: "Jack Richardson",
    initials: "JR",
    ageGroup: "Under 12s",
    teamName: "Nickol Storm",
    jerseyNumber: 10,
    coachName: "Coach Mel",
    nextEvent: "Wed 30 Mar, 5:00 PM",
    accentColor: "#7C3AED",
  },
];

interface ChildSelectorProps {
  onSelectChild: (child: ChildProfile) => void;
  selectedChildId?: string;
}

export function ChildSelector({
  onSelectChild,
  selectedChildId,
}: ChildSelectorProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-8 md:max-w-2xl md:px-6">
      <h1 className="mb-2 text-2xl font-bold text-[#0B2545]">
        Welcome Back
      </h1>
      <p className="mb-8 text-gray-500">Select a child to view their info</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_CHILDREN.map((child) => {
          const isSelected = selectedChildId === child.id;

          return (
            <button
              key={child.id}
              type="button"
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 focus-visible:ring-offset-2 rounded-xl"
              onClick={() => onSelectChild(child)}
            >
              <div
                className={cn(
                  "rounded-xl border-2 bg-white p-5 transition-all hover:shadow-md active:scale-[0.98]",
                  "min-h-[160px] flex flex-col items-center text-center",
                  isSelected
                    ? "shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                )}
                style={
                  isSelected
                    ? { borderColor: child.accentColor }
                    : undefined
                }
              >
                {/* Avatar */}
                <div
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ backgroundColor: child.accentColor }}
                >
                  {child.initials}
                </div>

                {/* Name */}
                <h2 className="text-lg font-semibold text-[#0B2545]">
                  {child.name}
                </h2>

                {/* Team + Age */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  <Badge variant="info">{child.ageGroup}</Badge>
                  <Badge>{child.teamName}</Badge>
                </div>

                {/* Next event */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Next: {child.nextEvent}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { MOCK_CHILDREN };
