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
import {
  Plus,
  Search,
  Target,
  Clock,
  Users,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type DrillCategory = "Passing" | "Shooting" | "Defending" | "Dribbling" | "Fitness" | "Tactical" | "Warm-up" | "Cool-down";

interface Drill {
  id: number;
  name: string;
  category: DrillCategory;
  ageGroups: string[];
  difficulty: number; // 1-5
  duration: string;
  playerCount: string;
  description: string;
}

const MOCK_DRILLS: Drill[] = [
  { id: 1, name: "Triangle Passing", category: "Passing", ageGroups: ["U10", "U12"], difficulty: 2, duration: "12 min", playerCount: "6-12", description: "Players form triangles and practice one-touch and two-touch passing. Focus on weight of pass, body shape, and communication." },
  { id: 2, name: "1v1 Finishing", category: "Shooting", ageGroups: ["U12", "U14", "U16"], difficulty: 3, duration: "15 min", playerCount: "8-16", description: "Attackers receive the ball and take on the goalkeeper 1v1. Emphasise composure, shot placement, and quick decision-making." },
  { id: 3, name: "Defensive Block", category: "Defending", ageGroups: ["U14", "U16"], difficulty: 4, duration: "20 min", playerCount: "10-16", description: "A back four practices maintaining shape against attacking overloads. Focus on communication, pressing triggers, and covering positions." },
  { id: 4, name: "Cone Slalom Dribble", category: "Dribbling", ageGroups: ["U6", "U8", "U10"], difficulty: 1, duration: "10 min", playerCount: "4-20", description: "Players dribble through a slalom of cones using different techniques: inside foot, outside foot, sole roll. Progressions add speed and competition." },
  { id: 5, name: "Speed & Agility Circuit", category: "Fitness", ageGroups: ["U12", "U14", "U16"], difficulty: 3, duration: "15 min", playerCount: "6-20", description: "Circuit stations including ladder drills, shuttle runs, plyometric jumps, and reaction sprints. 30 seconds work, 20 seconds rest." },
  { id: 6, name: "Positional Play Grid", category: "Tactical", ageGroups: ["U14", "U16"], difficulty: 5, duration: "25 min", playerCount: "12-16", description: "Rondo-style possession game in defined zones. Players must maintain positional discipline while building play through thirds." },
  { id: 7, name: "Dynamic Warm-Up", category: "Warm-up", ageGroups: ["U6", "U8", "U10", "U12", "U14", "U16"], difficulty: 1, duration: "8 min", playerCount: "4-30", description: "Progressive warm-up including jogging, dynamic stretches, and light ball work to prepare players physically and mentally." },
  { id: 8, name: "Stretch & Review", category: "Cool-down", ageGroups: ["U6", "U8", "U10", "U12", "U14", "U16"], difficulty: 1, duration: "5 min", playerCount: "4-30", description: "Static stretching routine followed by a coach-led review of the session. Players share one thing they learned." },
  { id: 9, name: "Wall Pass Combination", category: "Passing", ageGroups: ["U12", "U14"], difficulty: 3, duration: "15 min", playerCount: "8-14", description: "Pairs practice wall pass (give-and-go) combinations moving towards goal. Progress to adding a defender and finishing with a shot." },
];

const CATEGORIES: DrillCategory[] = ["Passing", "Shooting", "Defending", "Dribbling", "Fitness", "Tactical", "Warm-up", "Cool-down"];
const AGE_GROUPS = ["All", "U6", "U8", "U10", "U12", "U14", "U16"];
const DIFFICULTIES = ["All", "1", "2", "3", "4", "5"];

const CATEGORY_VARIANT: Record<DrillCategory, "default" | "success" | "warning" | "danger" | "info"> = {
  Passing: "info",
  Shooting: "danger",
  Defending: "success",
  Dribbling: "warning",
  Fitness: "default",
  Tactical: "info",
  "Warm-up": "warning",
  "Cool-down": "success",
};

/* ------------------------------------------------------------------ */
/*  Stars Component                                                    */
/* ------------------------------------------------------------------ */

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < level ? "fill-amber-400 text-amber-400" : "text-gray-200"
          )}
        />
      ))}
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

  const addToast = useToastStore((s) => s.addToast);

  // Skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_DRILLS.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      const matchCategory = categoryFilter === "All" || d.category === categoryFilter;
      const matchAge = ageFilter === "All" || d.ageGroups.includes(ageFilter);
      const matchDifficulty = difficultyFilter === "All" || d.difficulty === Number(difficultyFilter);
      return matchSearch && matchCategory && matchAge && matchDifficulty;
    });
  }, [search, categoryFilter, ageFilter, difficultyFilter]);

  const categoryOptions = [
    { label: "All", value: "All" },
    ...CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  const ageOptions = AGE_GROUPS.map((ag) => ({ label: ag, value: ag }));

  const difficultyOptions = DIFFICULTIES.map((d) => ({
    label: d === "All" ? "All" : `${d} Star${d !== "1" ? "s" : ""}`,
    value: d,
  }));

  const handleAddDrill = () => {
    addToast("Drill added successfully", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Drill Library" subtitle={`${filtered.length} drills`}>
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
        /* Drill Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((drill) => (
            <Card key={drill.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Diagram placeholder */}
              <div className="flex h-32 items-center justify-center bg-gray-100">
                <Target className="h-10 w-10 text-gray-300" />
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#0B2545]">{drill.name}</h3>
                  <Badge variant={CATEGORY_VARIANT[drill.category]}>{drill.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {drill.ageGroups.map((ag) => (
                    <Badge key={ag} variant="info" className="text-[10px]">{ag}</Badge>
                  ))}
                </div>
                <DifficultyStars level={drill.difficulty} />
                <p className="text-sm text-gray-600 line-clamp-2">{drill.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {drill.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {drill.playerCount} players
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
