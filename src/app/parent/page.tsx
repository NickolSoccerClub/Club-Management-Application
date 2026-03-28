"use client";

import * as React from "react";
import { useParentNav } from "@/components/parent/parent-nav-context";
import { Overview } from "@/components/parent/overview";
import { ScheduleTab } from "@/components/parent/schedule-tab";
import { MediaUpload } from "@/components/parent/media-upload";
import { MOCK_CHILDREN, type ChildProfile } from "@/components/parent/child-selector";
import { BarChart3, Settings } from "lucide-react";
import { StatsTab } from "@/components/parent/stats-tab";
import { SettingsTab } from "@/components/parent/settings-tab";

/* ------------------------------------------------------------------ */
/*  Full child profiles (enriched from child-selector mock data)      */
/* ------------------------------------------------------------------ */

const CHILD_PROFILES: ChildProfile[] = MOCK_CHILDREN;

/* ------------------------------------------------------------------ */
/*  Placeholder for tabs not yet built                                */
/* ------------------------------------------------------------------ */

function Placeholder({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="mb-3 h-12 w-12" />
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-sm">Coming soon</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ParentPage() {
  const { activeTab, activeChildId } = useParentNav();

  const child = CHILD_PROFILES.find((c) => c.id === activeChildId) ?? CHILD_PROFILES[0];

  switch (activeTab) {
    case "overview":
      return <Overview child={child} />;
    case "schedule":
      return <ScheduleTab />;
    case "media":
      return <MediaUpload />;
    case "stats":
      return <StatsTab />;
    case "settings":
      return <SettingsTab />;
    default:
      return <Overview child={child} />;
  }
}
