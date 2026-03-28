"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  X,
  Search,
  Plus,
  Minus,
  Users,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TeamPlayer {
  id: number;
  name: string;
  ageGroup: string;
  position: string;
  gradeScore: number;
}

export interface TeamForBuilder {
  id: number;
  name: string;
  ageGroup: string;
  division: string;
  coach: string;
  capacity: number;
  roster: TeamPlayer[];
}

interface TeamBuilderProps {
  open: boolean;
  onClose: () => void;
  team: TeamForBuilder | null;
  availablePlayers: TeamPlayer[];
  onSubmit: (teamId: number, roster: TeamPlayer[]) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TeamBuilder({ open, onClose, team, availablePlayers, onSubmit }: TeamBuilderProps) {
  const [roster, setRoster] = useState<TeamPlayer[]>([]);
  const [search, setSearch] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  // Sync roster when team changes
  React.useEffect(() => {
    if (team) {
      setRoster(team.roster);
      setSearch("");
    }
  }, [team]);

  const rosterIds = useMemo(() => new Set(roster.map((p) => p.id)), [roster]);

  const filteredAvailable = useMemo(() => {
    if (!team) return [];
    return availablePlayers
      .filter((p) => p.ageGroup === team.ageGroup && !rosterIds.has(p.id))
      .filter((p) => {
        if (!search) return true;
        return p.name.toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => b.gradeScore - a.gradeScore);
  }, [team, availablePlayers, rosterIds, search]);

  const addPlayer = (player: TeamPlayer) => {
    if (team && roster.length >= team.capacity) {
      addToast("Team is at full capacity", "warning");
      return;
    }
    setRoster((prev) => [...prev, player]);
  };

  const removePlayer = (playerId: number) => {
    setRoster((prev) => prev.filter((p) => p.id !== playerId));
  };

  const handleSubmit = () => {
    if (team) {
      onSubmit(team.id, roster);
      addToast(`${team.name} roster submitted with ${roster.length} players`, "success");
      setSubmitOpen(false);
      onClose();
    }
  };

  if (!open || !team) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Full-screen dialog */}
      <div className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl lg:inset-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0B2545] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{team.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="info">{team.ageGroup}</Badge>
              <span className="text-sm text-white/60">{team.division} Division</span>
              <span className="text-sm text-white/60">Coach: {team.coach}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="accent" size="sm" onClick={() => setSubmitOpen(true)}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Submit Team
            </Button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close builder"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Available Players */}
          <div className="flex flex-1 flex-col border-r border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-[#0B2545]">
                Available Players
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({filteredAvailable.length} players)
                </span>
              </h3>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
                    <th className="px-4 py-2">Player Name</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2 text-right">Grade</th>
                    <th className="px-4 py-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailable.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No available players for {team.ageGroup}
                      </td>
                    </tr>
                  ) : (
                    filteredAvailable.map((player, idx) => (
                      <tr
                        key={player.id}
                        className={cn(
                          "border-b border-gray-100 transition-colors hover:bg-blue-50/40",
                          idx % 2 === 1 && "bg-gray-50/50"
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-[#0B2545]">{player.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{player.position}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={cn(
                            "font-semibold",
                            player.gradeScore >= 8 ? "text-[#15803D]" : player.gradeScore >= 6 ? "text-[#1D4ED8]" : "text-[#B45309]"
                          )}>
                            {player.gradeScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => addPlayer(player)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/80 transition-colors"
                            aria-label={`Add ${player.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Team Roster */}
          <div className="flex w-full flex-1 flex-col">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0B2545]">
                  Team Roster
                </h3>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className={cn(
                    "text-sm font-bold",
                    roster.length >= team.capacity ? "text-[#B45309]" : "text-[#0B2545]"
                  )}>
                    {roster.length}/{team.capacity}
                  </span>
                </div>
              </div>
              {/* Capacity bar */}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    roster.length >= team.capacity
                      ? "bg-[#B45309]"
                      : roster.length >= team.capacity * 0.75
                      ? "bg-[#1D4ED8]"
                      : "bg-[#15803D]"
                  )}
                  style={{ width: `${Math.min((roster.length / team.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Player Name</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2 text-right">Grade</th>
                    <th className="px-4 py-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {roster.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No players assigned yet. Add players from the left panel.
                      </td>
                    </tr>
                  ) : (
                    roster.map((player, idx) => (
                      <tr
                        key={player.id}
                        className={cn(
                          "border-b border-gray-100 transition-colors hover:bg-red-50/30",
                          idx % 2 === 1 && "bg-gray-50/50"
                        )}
                      >
                        <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-medium text-[#0B2545]">{player.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{player.position}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-[#0B2545]">
                          {player.gradeScore.toFixed(1)}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#B91C1C] text-white hover:bg-[#B91C1C]/80 transition-colors"
                            aria-label={`Remove ${player.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation */}
      <ConfirmDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onConfirm={handleSubmit}
        title="Submit Team Roster"
        description={`Submit ${team.name} with ${roster.length} players assigned? Players will be locked to this team for the season.`}
        variant="accent"
        confirmLabel="Submit Team"
      />
    </>
  );
}
