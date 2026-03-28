"use client";

import { useState, useMemo } from "react";
import { CalendarDays, MapPin, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

type GameStatus = "Upcoming" | "Live" | "Completed" | "Cancelled";

interface Game {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  ageGroup: string;
  round: number;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
}

const mockGames: Game[] = [
  { id: 1, date: "2026-04-04", time: "08:30", home: "Nickol SC Blue", away: "Karratha FC", venue: "Nickol West Oval", ageGroup: "U9", round: 1, status: "Upcoming" },
  { id: 2, date: "2026-04-04", time: "09:30", home: "Nickol SC Gold", away: "Dampier United", venue: "Nickol West Oval", ageGroup: "U11", round: 1, status: "Upcoming" },
  { id: 3, date: "2026-04-04", time: "10:30", home: "Pilbara Lions", away: "Nickol SC Blue", venue: "Bulgarra Oval", ageGroup: "U13", round: 1, status: "Live" },
  { id: 4, date: "2026-04-05", time: "08:00", home: "Nickol SC Gold", away: "Roebourne FC", venue: "Nickol West Oval", ageGroup: "U7", round: 1, status: "Upcoming" },
  { id: 5, date: "2026-04-05", time: "10:00", home: "Karratha FC", away: "Nickol SC Blue", venue: "Karratha Leisureplex", ageGroup: "U15", round: 1, status: "Upcoming" },
  { id: 6, date: "2026-03-28", time: "09:00", home: "Nickol SC Blue", away: "Dampier United", venue: "Nickol West Oval", ageGroup: "U9", round: 0, status: "Completed", homeScore: 3, awayScore: 1 },
  { id: 7, date: "2026-03-28", time: "10:00", home: "Roebourne FC", away: "Nickol SC Gold", venue: "Roebourne Oval", ageGroup: "U11", round: 0, status: "Completed", homeScore: 2, awayScore: 2 },
  { id: 8, date: "2026-04-11", time: "08:30", home: "Nickol SC Blue", away: "Pilbara Lions", venue: "Nickol West Oval", ageGroup: "U13", round: 2, status: "Upcoming" },
  { id: 9, date: "2026-04-11", time: "10:00", home: "Dampier United", away: "Nickol SC Gold", venue: "Dampier Oval", ageGroup: "U15", round: 2, status: "Upcoming" },
  { id: 10, date: "2026-04-05", time: "14:00", home: "Nickol SC Blue", away: "Roebourne FC", venue: "Nickol West Oval", ageGroup: "U17", round: 1, status: "Cancelled" },
];

const allAgeGroups = ["All", "U7", "U9", "U11", "U13", "U15", "U17"];
const allRounds = ["All", "Pre-season", "Round 1", "Round 2"];

const statusConfig: Record<GameStatus, { variant: "info" | "success" | "warning" | "danger" | "default" }> = {
  Upcoming: { variant: "info" },
  Live: { variant: "danger" },
  Completed: { variant: "success" },
  Cancelled: { variant: "default" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

export default function SchedulePage() {
  const [ageFilter, setAgeFilter] = useState("All");
  const [roundFilter, setRoundFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockGames.filter((g) => {
      if (ageFilter !== "All" && g.ageGroup !== ageFilter) return false;
      if (roundFilter !== "All") {
        if (roundFilter === "Pre-season" && g.round !== 0) return false;
        if (roundFilter.startsWith("Round") && g.round !== parseInt(roundFilter.split(" ")[1])) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!g.home.toLowerCase().includes(q) && !g.away.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [ageFilter, roundFilter, search]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-6">
            <h1 className="text-3xl font-bold text-[#0B2545] sm:text-4xl">Match Schedule</h1>
            <p className="mt-2 text-gray-600">View upcoming fixtures and past results across all age groups.</p>
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
                <div className="w-full sm:w-40">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Round</label>
                  <select
                    value={roundFilter}
                    onChange={(e) => setRoundFilter(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30"
                  >
                    {allRounds.map((r) => (
                      <option key={r} value={r}>{r === "All" ? "All Rounds" : r}</option>
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
                {(ageFilter !== "All" || roundFilter !== "All" || search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setAgeFilter("All"); setRoundFilter("All"); setSearch(""); }}
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
              <p className="mt-3 text-gray-500">No matches found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((game) => (
                <Card key={game.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    {/* Top row: date/time + badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDate(game.date)} &middot; {formatTime(game.time)}</span>
                      </div>
                      <Badge variant={statusConfig[game.status].variant}>
                        {game.status === "Live" && <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                        {game.status}
                      </Badge>
                    </div>

                    {/* Teams */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 text-right">
                        <p className={cn("text-sm font-semibold text-[#0B2545]", game.home.includes("Nickol") && "text-[#1D4ED8]")}>
                          {game.home}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        {game.status === "Completed" || game.status === "Live" ? (
                          <div className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1">
                            <span className="text-lg font-bold text-[#0B2545]">{game.homeScore}</span>
                            <span className="text-xs text-gray-400">-</span>
                            <span className="text-lg font-bold text-[#0B2545]">{game.awayScore}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">VS</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-semibold text-[#0B2545]", game.away.includes("Nickol") && "text-[#1D4ED8]")}>
                          {game.away}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{game.venue}</span>
                      </div>
                      <Badge variant="info">{game.ageGroup}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
