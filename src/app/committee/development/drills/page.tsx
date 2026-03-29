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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants & Helpers                                                 */
/* ------------------------------------------------------------------ */

const PER_PAGE = 12;

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

/* ------------------------------------------------------------------ */
/*  Difficulty Star                                                     */
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DrillLibraryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedDrill, setSelectedDrill] = useState<DrillFull | null>(null);

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

  /* --- Filter option builders --- */

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

      {/* Drill Detail Slide-over */}
      <DrillDetailPanel
        drill={selectedDrill}
        open={selectedDrill !== null}
        onClose={() => setSelectedDrill(null)}
      />
    </div>
  );
}
