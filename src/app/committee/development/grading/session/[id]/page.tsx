"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  GRADING_CRITERIA,
  BIB_COLOURS,
  BIB_COLOUR_HEX,
  BIB_COLOUR_BG,
  type CriteriaWithDescriptors,
} from "@/lib/data/grading-criteria";
import type { BibColour } from "@/types/grading";
import {
  ArrowLeft,
  Video,
  Check,
  ChevronLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock session players keyed by "{colour}-{number}"
// ---------------------------------------------------------------------------

// Bibs are auto-assigned rotating through colours:
// Registration order: Player 1→Blue 1, Player 2→Red 1, Player 3→Green 1,
// Player 4→Orange 1, Player 5→Pink 1, Player 6→Blue 2, Player 7→Red 2, etc.
// This creates natural grading groups — all Blues graded together, all Reds together.
const MOCK_BIB_PLAYERS: Record<
  string,
  { name: string; ageGroup: string; team: string }
> = {
  // Group Blue (graded together)
  "blue-1": { name: "Liam Carter", ageGroup: "U11", team: "Titans" },
  "blue-2": { name: "Charlotte Jones", ageGroup: "U11", team: "Titans" },
  "blue-3": { name: "Evelyn Garcia", ageGroup: "U11", team: "Titans" },
  // Group Red (graded together)
  "red-1": { name: "Olivia Bennett", ageGroup: "U11", team: "Titans" },
  "red-2": { name: "Benjamin Martinez", ageGroup: "U11", team: "Titans" },
  "red-3": { name: "Abigail Robinson", ageGroup: "U11", team: "Titans" },
  // Group Green (graded together)
  "green-1": { name: "Noah Patel", ageGroup: "U11", team: "Titans" },
  "green-2": { name: "Mia Jackson", ageGroup: "U11", team: "Titans" },
  "green-3": { name: "Jack Clark", ageGroup: "U11", team: "Titans" },
  // Group Orange (graded together)
  "orange-1": { name: "Emma Nguyen", ageGroup: "U11", team: "Titans" },
  "orange-2": { name: "Henry White", ageGroup: "U11", team: "Titans" },
  "orange-3": { name: "Emily Lewis", ageGroup: "U11", team: "Titans" },
  // Group Pink (graded together)
  "pink-1": { name: "Oliver Smith", ageGroup: "U11", team: "Titans" },
  "pink-2": { name: "Sophia Anderson", ageGroup: "U11", team: "Titans" },
};

const TOTAL_PLAYERS = Object.keys(MOCK_BIB_PLAYERS).length;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map an age-group string like "U12" to the right grading phase index */
function phaseIndexForAge(ageGroup: string): number {
  const num = parseInt(ageGroup.replace(/\D/g, ""), 10);
  if (num <= 9) return 0; // discovery
  if (num <= 13) return 1; // skill_acquisition
  return 2; // game_training
}

/** Find the closest descriptor to a given score */
function closestDescriptor(
  descriptors: { level: number; text: string }[],
  score: number
): { level: number; text: string } | null {
  if (!descriptors.length) return null;
  let best = descriptors[0];
  let bestDist = Math.abs(score - best.level);
  for (const d of descriptors) {
    const dist = Math.abs(score - d.level);
    if (dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}

/** Capitalise the first letter */
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LiveGradingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  // ── State ───────────────────────────────────────────────────────────
  const [selectedColour, setSelectedColour] = useState<BibColour | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [gradedCount, setGradedCount] = useState(0);

  // ── Derived ─────────────────────────────────────────────────────────
  const bibKey =
    selectedColour && selectedNumber
      ? `${selectedColour}-${selectedNumber}`
      : null;
  const player = bibKey ? MOCK_BIB_PLAYERS[bibKey] ?? null : null;

  const criteria: CriteriaWithDescriptors[] = useMemo(() => {
    if (!player) return [];
    const idx = phaseIndexForAge(player.ageGroup);
    return GRADING_CRITERIA[idx]?.criteria ?? [];
  }, [player]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleColourSelect = useCallback((colour: BibColour) => {
    setSelectedColour(colour);
    setSelectedNumber(null);
    setScores({});
    setNotes("");
  }, []);

  const handleNumberSelect = useCallback((num: number) => {
    setSelectedNumber(num);
    setScores({});
    setNotes("");
  }, []);

  const handleScoreChange = useCallback((criteriaName: string, score: number) => {
    setScores((prev) => ({ ...prev, [criteriaName]: score }));
  }, []);

  const handleChangePlayer = useCallback(() => {
    setSelectedColour(null);
    setSelectedNumber(null);
    setScores({});
    setNotes("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!player) return;
    addToast(`Grading saved for ${player.name}`, "success");
    setGradedCount((c) => c + 1);
    setSelectedColour(null);
    setSelectedNumber(null);
    setScores({});
    setNotes("");
  }, [player, addToast]);

  const handleRecordVideo = useCallback(() => {
    addToast("Video recording not yet available", "info");
  }, [addToast]);

  // ── Colour config for inline styles ─────────────────────────────────
  const colourHex = selectedColour ? BIB_COLOUR_HEX[selectedColour] : "#6B7280";

  // ====================================================================
  // Render
  // ====================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 text-white shadow-md"
        style={{ backgroundColor: selectedColour ? colourHex : "#0B2545" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/90 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-base font-bold tracking-tight">Live Grading</h1>

        <Badge className="bg-white/20 text-white text-xs border-0">
          {gradedCount}/{TOTAL_PLAYERS}
        </Badge>
      </div>

      <div className="mx-auto max-w-[600px] px-4 pb-32 pt-4 space-y-5">
        {/* ============================================================
            STEP 1 — Bib Colour Selector
            ============================================================ */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Bib Colour
          </p>
          <div className="grid grid-cols-5 gap-2">
            {BIB_COLOURS.map((colour) => {
              const isSelected = selectedColour === colour;
              return (
                <button
                  key={colour}
                  onClick={() => handleColourSelect(colour)}
                  className="relative flex items-center justify-center rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                  style={{
                    backgroundColor: BIB_COLOUR_HEX[colour],
                    height: 60,
                    boxShadow: isSelected
                      ? `0 0 0 3px white, 0 0 0 5px ${BIB_COLOUR_HEX[colour]}`
                      : "0 2px 6px rgba(0,0,0,0.15)",
                    opacity: selectedColour && !isSelected ? 0.5 : 1,
                  }}
                >
                  {cap(colour)}
                  {isSelected && (
                    <Check className="absolute right-1.5 top-1.5 h-4 w-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {!selectedColour && (
            <p className="mt-3 text-center text-sm text-gray-400 italic">
              Tap a bib colour to begin
            </p>
          )}
        </section>

        {/* ============================================================
            STEP 2 — Number Grid
            ============================================================ */}
        {selectedColour && !selectedNumber && (
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bib Number
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                const key = `${selectedColour}-${num}`;
                const exists = !!MOCK_BIB_PLAYERS[key];
                return (
                  <button
                    key={num}
                    onClick={() => exists && handleNumberSelect(num)}
                    disabled={!exists}
                    className="flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: exists
                        ? `${BIB_COLOUR_HEX[selectedColour]}22`
                        : "#f3f4f6",
                      color: exists ? BIB_COLOUR_HEX[selectedColour] : "#d1d5db",
                      border: exists
                        ? `2px solid ${BIB_COLOUR_HEX[selectedColour]}44`
                        : "2px solid #e5e7eb",
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================
            STEP 3 — Player Card
            ============================================================ */}
        {player && selectedColour && selectedNumber && (
          <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
            {/* Colour bar */}
            <div className="h-2" style={{ backgroundColor: colourHex }} />

            <div className="flex items-center gap-4 p-4">
              {/* Bib circle */}
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow-md"
                style={{ backgroundColor: colourHex }}
              >
                {selectedNumber}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold text-gray-900">
                  {player.name}
                </h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="info">{player.ageGroup}</Badge>
                  <Badge variant="default">{player.team}</Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-4 py-2">
              <button
                onClick={handleChangePlayer}
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Change Player
              </button>
            </div>
          </section>
        )}

        {/* ============================================================
            STEP 4 — Scoring Section
            ============================================================ */}
        {player && criteria.length > 0 && (
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assessment Criteria
            </p>

            {criteria.map((c) => {
              const current = scores[c.name] ?? null;
              const desc = current ? closestDescriptor(c.descriptors, current) : null;

              return (
                <div
                  key={c.name}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <p className="mb-1 text-sm font-bold text-gray-900">
                    {c.name}
                  </p>
                  <p className="mb-3 text-xs text-gray-500">{c.description}</p>

                  {/* Score buttons row */}
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => {
                      const isSelected = current === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleScoreChange(c.name, s)}
                          className="flex items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-90"
                          style={{
                            width: 36,
                            height: 36,
                            backgroundColor: isSelected ? colourHex : "#f3f4f6",
                            color: isSelected ? "#ffffff" : "#6b7280",
                            boxShadow: isSelected
                              ? `0 2px 8px ${colourHex}55`
                              : "none",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>

                  {/* Descriptor text */}
                  {desc && (
                    <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-700">
                      <span
                        className="mr-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: colourHex }}
                      >
                        L{desc.level}
                      </span>
                      {desc.text}
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* ============================================================
            STEP 5 — Notes & Video
            ============================================================ */}
        {player && (
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Notes & Video
            </p>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for this player..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <button
              onClick={handleRecordVideo}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 active:bg-gray-50"
            >
              <Video className="h-5 w-5" />
              Record Video
            </button>
          </section>
        )}

        {/* ============================================================
            STEP 6 — Submit
            ============================================================ */}
        {player && (
          <section className="space-y-3">
            <Button
              variant="accent"
              onClick={handleSubmit}
              className="w-full rounded-xl text-base font-bold"
              style={{ height: 56 }}
            >
              <Check className="mr-2 h-5 w-5" />
              Submit &amp; Grade Next Player
            </Button>

            <p className="text-center text-sm text-gray-400">
              <span className="font-semibold text-gray-600">{gradedCount}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">
                {TOTAL_PLAYERS}
              </span>{" "}
              players graded
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
