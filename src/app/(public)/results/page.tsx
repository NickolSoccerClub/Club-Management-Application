"use client";

import { useState, useMemo } from "react";
import { Trophy, CalendarDays, MapPin, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

interface Result {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  ageGroup: string;
  round: number;
  homeScore: number;
  awayScore: number;
}

const mockResults: Result[] = [
  { id: 1, date: "2026-03-28", time: "09:00", home: "Nickol SC Blue", away: "Dampier United", venue: "Nickol West Oval", ageGroup: "U9", round: 1, homeScore: 3, awayScore: 1 },
  { id: 2, date: "2026-03-28", time: "10:00", home: "Roebourne FC", away: "Nickol SC Gold", venue: "Roebourne Oval", ageGroup: "U11", round: 1, homeScore: 2, awayScore: 2 },
  { id: 3, date: "2026-03-21", time: "08:30", home: "Nickol SC Blue", away: "Pilbara Lions", venue: "Nickol West Oval", ageGroup: "U13", round: 1, homeScore: 4, awayScore: 0 },
  { id: 4, date: "2026-03-21", time: "10:00", home: "Karratha FC", away: "Nickol SC Gold", venue: "Karratha Leisureplex", ageGroup: "U15", round: 1, homeScore: 1, awayScore: 3 },
  { id: 5, date: "2026-03-14", time: "09:00", home: "Nickol SC Blue", away: "Roebourne FC", venue: "Nickol West Oval", ageGroup: "U7", round: 1, homeScore: 5, awayScore: 2 },
  { id: 6, date: "2026-03-14", time: "10:30", home: "Dampier United", away: "Nickol SC Blue", venue: "Dampier Oval", ageGroup: "U17", round: 1, homeScore: 2, awayScore: 3 },
  { id: 7, date: "2026-03-07", time: "08:30", home: "Pilbara Lions", away: "Nickol SC Gold", venue: "Bulgarra Oval", ageGroup: "U9", round: 0, homeScore: 1, awayScore: 1 },
  { id: 8, date: "2026-03-07", time: "10:00", home: "Nickol SC Blue", away: "Karratha FC", venue: "Nickol West Oval", ageGroup: "U11", round: 0, homeScore: 6, awayScore: 0 },
];

const allAgeGroups = ["All", "U7", "U9", "U11", "U13", "U15", "U17"];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ResultsPage() {
  const [ageFilter, setAgeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockResults
      .filter((g) => {
        if (ageFilter !== "All" && g.ageGroup !== ageFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!g.home.toLowerCase().includes(q) && !g.away.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [ageFilter, search]);

  function getResultLabel(game: Result) {
    const nickolHome = game.home.includes("Nickol");
    const nickolAway = game.away.includes("Nickol");
    if (!nickolHome && !nickolAway) return null;
    const nickolScore = nickolHome ? game.homeScore : game.awayScore;
    const oppScore = nickolHome ? game.awayScore : game.homeScore;
    if (nickolScore > oppScore) return "Win";
    if (nickolScore < oppScore) return "Loss";
    return "Draw";
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-6">
            <h1 className="text-3xl font-bold text-[#0B2545] sm:text-4xl">Match Results</h1>
            <p className="mt-2 text-gray-600">Final scores from completed matches across all age groups.</p>
          </div>

          {/* Filter bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="w-full sm:w-40">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Age Group</label>
                  <select
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30"
                  >
                    {allAgeGroups.map((ag) => (
                      <option key={ag} value={ag}>{ag === "All" ? "All Ages" : ag}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Search Team</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by team name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30"
                    />
                  </div>
                </div>
                {(ageFilter !== "All" || search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setAgeFilter("All"); setSearch(""); }}
                    className="shrink-0"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Filter className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-gray-500">No results found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((game) => {
                const resultLabel = getResultLabel(game);
                return (
                  <Card key={game.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(game.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="info">{game.ageGroup}</Badge>
                          {resultLabel && (
                            <Badge
                              variant={
                                resultLabel === "Win" ? "success" : resultLabel === "Loss" ? "danger" : "warning"
                              }
                            >
                              {resultLabel}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex-1 text-right">
                          <p className={cn("text-sm font-semibold text-[#0B2545]", game.home.includes("Nickol") && "text-[#1D4ED8]")}>
                            {game.home}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-[#0B2545] px-4 py-2">
                          <span className="text-xl font-bold text-white">{game.homeScore}</span>
                          <span className="text-xs text-white/50">-</span>
                          <span className="text-xl font-bold text-white">{game.awayScore}</span>
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-semibold text-[#0B2545]", game.away.includes("Nickol") && "text-[#1D4ED8]")}>
                            {game.away}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{game.venue}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
