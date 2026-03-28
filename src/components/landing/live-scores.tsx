"use client";

import { cn } from "@/lib/utils";

interface Game {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "live" | "final" | "upcoming";
  time: string;
}

const mockGames: Game[] = [
  {
    id: 1,
    homeTeam: "Nickol SC U10",
    awayTeam: "Karratha FC U10",
    homeScore: 3,
    awayScore: 2,
    status: "live",
    time: "62'",
  },
  {
    id: 2,
    homeTeam: "Nickol SC U14",
    awayTeam: "Dampier FC U14",
    homeScore: 1,
    awayScore: 1,
    status: "final",
    time: "FT",
  },
  {
    id: 3,
    homeTeam: "Roebourne FC U12",
    awayTeam: "Nickol SC U12",
    homeScore: 0,
    awayScore: 4,
    status: "live",
    time: "35'",
  },
  {
    id: 4,
    homeTeam: "Nickol SC Seniors",
    awayTeam: "Wickham FC",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    time: "3:00 PM",
  },
];

function StatusBadge({ status, time }: { status: Game["status"]; time: string }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
        </span>
        Live &middot; {time}
      </span>
    );
  }
  if (status === "final") {
    return (
      <span className="inline-flex items-center rounded-full bg-navy/10 px-2.5 py-1 text-xs font-semibold text-navy">
        Final
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
      {time}
    </span>
  );
}

export function LiveScores() {
  return (
    <section className="bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Live Scores
        </h2>

        {/* Horizontally scrollable container */}
        <div className="mt-8 -mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {mockGames.map((game) => (
              <div
                key={game.id}
                className={cn(
                  "min-w-[260px] shrink-0 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:min-w-0",
                  game.status === "live" && "border-danger/20 ring-1 ring-danger/10"
                )}
              >
                <div className="mb-3 flex justify-center">
                  <StatusBadge status={game.status} time={game.time} />
                </div>

                <div className="flex items-center justify-between gap-3 text-center">
                  {/* Home team */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy leading-tight">
                      {game.homeTeam}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-1.5">
                    <span className="text-xl font-bold text-navy tabular-nums">
                      {game.homeScore}
                    </span>
                    <span className="text-sm text-navy/40">-</span>
                    <span className="text-xl font-bold text-navy tabular-nums">
                      {game.awayScore}
                    </span>
                  </div>

                  {/* Away team */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy leading-tight">
                      {game.awayTeam}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
