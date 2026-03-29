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
  type CriteriaWithDescriptors,
} from "@/lib/data/grading-criteria";
import type { BibColour } from "@/types/grading";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  X,
  Plus,
  Settings,
  Target,
  Zap,
  Shield,
  Eye,
  MessageCircle,
  Flame,
  Crosshair,
  Hand,
  Brain,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Observation {
  id: string;
  score: number;
  feedback: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Mock session players keyed by "{colour}-{number}"
// ---------------------------------------------------------------------------

const MOCK_BIB_PLAYERS: Record<
  string,
  { name: string; ageGroup: string; team: string }
> = {
  "blue-1": { name: "Liam Carter", ageGroup: "U11", team: "Titans" },
  "blue-2": { name: "Charlotte Jones", ageGroup: "U11", team: "Titans" },
  "blue-3": { name: "Evelyn Garcia", ageGroup: "U11", team: "Titans" },
  "red-1": { name: "Olivia Bennett", ageGroup: "U11", team: "Titans" },
  "red-2": { name: "Benjamin Martinez", ageGroup: "U11", team: "Titans" },
  "red-3": { name: "Abigail Robinson", ageGroup: "U11", team: "Titans" },
  "green-1": { name: "Noah Patel", ageGroup: "U11", team: "Titans" },
  "green-2": { name: "Mia Jackson", ageGroup: "U11", team: "Titans" },
  "green-3": { name: "Jack Clark", ageGroup: "U11", team: "Titans" },
  "orange-1": { name: "Emma Nguyen", ageGroup: "U11", team: "Titans" },
  "orange-2": { name: "Henry White", ageGroup: "U11", team: "Titans" },
  "orange-3": { name: "Emily Lewis", ageGroup: "U11", team: "Titans" },
  "pink-1": { name: "Oliver Smith", ageGroup: "U11", team: "Titans" },
  "pink-2": { name: "Sophia Anderson", ageGroup: "U11", team: "Titans" },
};

const TOTAL_PLAYERS = Object.keys(MOCK_BIB_PLAYERS).length;

// ---------------------------------------------------------------------------
// Station icons mapping
// ---------------------------------------------------------------------------

const STATION_ICONS: Record<string, React.ReactNode> = {
  "First Touch": <Hand className="h-6 w-6" />,
  "Passing Accuracy": <Target className="h-6 w-6" />,
  "Dribbling & Ball Control": <Zap className="h-6 w-6" />,
  "Shooting Technique": <Crosshair className="h-6 w-6" />,
  "Defensive Positioning": <Shield className="h-6 w-6" />,
  "Game Awareness": <Eye className="h-6 w-6" />,
  Communication: <MessageCircle className="h-6 w-6" />,
  "Work Rate & Attitude": <Flame className="h-6 w-6" />,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function phaseIndexForAge(ageGroup: string): number {
  const num = parseInt(ageGroup.replace(/\D/g, ""), 10);
  if (num <= 9) return 0;
  if (num <= 13) return 1;
  return 2;
}

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

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Spider Chart SVG Component
// ---------------------------------------------------------------------------

function SpiderChart({
  scores,
  labels,
  size = 200,
  colour = "#2563EB",
}: {
  scores: number[];
  labels: string[];
  size?: number;
  colour?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;
  const n = labels.length;
  if (n < 3) return null;

  const angleStep = (2 * Math.PI) / n;
  const levels = [2, 4, 6, 8, 10];

  function polarToCart(angle: number, r: number): [number, number] {
    return [cx + r * Math.cos(angle - Math.PI / 2), cy + r * Math.sin(angle - Math.PI / 2)];
  }

  // Grid rings
  const rings = levels.map((lvl) => {
    const r = (lvl / 10) * radius;
    const points = Array.from({ length: n }, (_, i) => polarToCart(i * angleStep, r));
    return (
      <polygon
        key={lvl}
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  });

  // Axis lines
  const axes = Array.from({ length: n }, (_, i) => {
    const [x, y] = polarToCart(i * angleStep, radius);
    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth={1} />;
  });

  // Data polygon
  const dataPoints = scores.map((s, i) => polarToCart(i * angleStep, (s / 5) * radius));
  const dataPolygon = (
    <polygon
      points={dataPoints.map((p) => p.join(",")).join(" ")}
      fill={`${colour}33`}
      stroke={colour}
      strokeWidth={2}
    />
  );

  // Data dots
  const dots = dataPoints.map(([x, y], i) => (
    <circle key={i} cx={x} cy={y} r={3} fill={colour} />
  ));

  // Labels
  const labelTexts = labels.map((label, i) => {
    const [x, y] = polarToCart(i * angleStep, radius + 18);
    const short = label.length > 12 ? label.slice(0, 11) + "..." : label;
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-600"
        style={{ fontSize: 8, fontWeight: 600 }}
      >
        {short}
      </text>
    );
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {rings}
      {axes}
      {dataPolygon}
      {dots}
      {labelTexts}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LiveGradingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  // ── State ───────────────────────────────────────────────────────────
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stationLocked, setStationLocked] = useState(false);
  const [selectedColour, setSelectedColour] = useState<BibColour | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [observations, setObservations] = useState<Record<string, Observation[]>>({});
  const [completedPlayers, setCompletedPlayers] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showStationSettings, setShowStationSettings] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────
  const bibKey =
    selectedColour && selectedNumber
      ? `${selectedColour}-${selectedNumber}`
      : null;
  const player = bibKey ? MOCK_BIB_PLAYERS[bibKey] ?? null : null;

  const criteria: CriteriaWithDescriptors[] = useMemo(() => {
    // Use first player's age group to determine phase, default U11
    const idx = phaseIndexForAge("U11");
    return GRADING_CRITERIA[idx]?.criteria ?? [];
  }, []);

  const stationCriteria = useMemo(() => {
    if (!selectedStation) return null;
    return criteria.find((c) => c.name === selectedStation) ?? null;
  }, [selectedStation, criteria]);

  const colourHex = selectedColour ? BIB_COLOUR_HEX[selectedColour] : "#0B2545";

  const totalObservations = useMemo(() => {
    return Object.values(observations).reduce((sum, obs) => sum + obs.length, 0);
  }, [observations]);

  const playerObservations = bibKey ? observations[bibKey] ?? [] : [];

  // ── Handlers ────────────────────────────────────────────────────────
  const handleStationSelect = useCallback((stationName: string) => {
    setSelectedStation(stationName);
    setStationLocked(true);
    addToast(`Station set: ${stationName}`, "success");
  }, [addToast]);

  const handleChangeStation = useCallback(() => {
    setShowStationSettings(false);
    setStationLocked(false);
    setSelectedStation(null);
    setSelectedColour(null);
    setSelectedNumber(null);
    setCurrentScore(null);
    setCurrentFeedback("");
  }, []);

  const handleColourSelect = useCallback((colour: BibColour) => {
    setSelectedColour(colour);
    setSelectedNumber(null);
    setCurrentScore(null);
    setCurrentFeedback("");
  }, []);

  const handleNumberSelect = useCallback((num: number) => {
    setSelectedNumber(num);
    setCurrentScore(null);
    setCurrentFeedback("");
  }, []);

  const handleChangePlayer = useCallback(() => {
    setSelectedColour(null);
    setSelectedNumber(null);
    setCurrentScore(null);
    setCurrentFeedback("");
  }, []);

  const handleAddObservation = useCallback(() => {
    if (!bibKey || currentScore === null || currentFeedback.trim().length < 3) {
      if (currentScore === null) {
        addToast("Select a score before adding", "warning");
        return;
      }
      if (currentFeedback.trim().length < 3) {
        addToast("Add a few words of feedback", "warning");
        return;
      }
      return;
    }

    const obs: Observation = {
      id: generateId(),
      score: currentScore,
      feedback: currentFeedback.trim(),
      timestamp: formatTime(new Date()),
    };

    setObservations((prev) => ({
      ...prev,
      [bibKey]: [...(prev[bibKey] ?? []), obs],
    }));

    setCurrentScore(null);
    setCurrentFeedback("");
    addToast("Observation added", "success");
  }, [bibKey, currentScore, currentFeedback, addToast]);

  const handleDeleteObservation = useCallback(
    (obsId: string) => {
      if (!bibKey) return;
      setObservations((prev) => ({
        ...prev,
        [bibKey]: (prev[bibKey] ?? []).filter((o) => o.id !== obsId),
      }));
    },
    [bibKey]
  );

  const handleFinishPlayer = useCallback(() => {
    if (!bibKey || !player) return;
    const playerObs = observations[bibKey] ?? [];
    if (playerObs.length === 0) {
      addToast("Add at least one observation first", "warning");
      return;
    }
    setCompletedPlayers((prev) => new Set(prev).add(bibKey));
    addToast(`Finished grading ${player.name}`, "success");
    setSelectedColour(null);
    setSelectedNumber(null);
    setCurrentScore(null);
    setCurrentFeedback("");
  }, [bibKey, player, observations, addToast]);

  const handleGenerateAISummary = useCallback(() => {
    addToast("AI analysis will be available when connected", "info");
  }, [addToast]);

  // ── Results aggregation ─────────────────────────────────────────────
  const playerResults = useMemo(() => {
    const results: {
      key: string;
      name: string;
      colour: BibColour;
      number: number;
      avgScore: number;
      obsCount: number;
    }[] = [];

    for (const [key, player] of Object.entries(MOCK_BIB_PLAYERS)) {
      const obs = observations[key] ?? [];
      if (obs.length === 0) continue;
      const avg = obs.reduce((sum, o) => sum + o.score, 0) / obs.length;
      const [colour, numStr] = key.split("-") as [BibColour, string];
      results.push({
        key,
        name: player.name,
        colour,
        number: parseInt(numStr, 10),
        avgScore: Math.round(avg * 10) / 10,
        obsCount: obs.length,
      });
    }

    return results.sort((a, b) => b.avgScore - a.avgScore);
  }, [observations]);

  const allPlayersObserved = completedPlayers.size === TOTAL_PLAYERS;

  // ====================================================================
  // Render
  // ====================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-4 py-3 text-white shadow-md"
        style={{ backgroundColor: "#0B2545" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center flex-1 mx-3 min-w-0">
            <h1 className="text-sm font-bold tracking-tight truncate">
              U11 Pre-Season Grading
              {selectedStation && ` — ${selectedStation} Station`}
            </h1>
          </div>

          {stationLocked && (
            <button
              onClick={() => setShowStationSettings(!showStationSettings)}
              className="text-white/80 hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-white/70">
          <span>Grader: Sarah Mitchell</span>
          {selectedStation && (
            <Badge className="bg-white/20 text-white text-[10px] border-0">
              {completedPlayers.size}/{TOTAL_PLAYERS} players
            </Badge>
          )}
        </div>
      </div>

      {/* ── Station settings dropdown ──────────────────────────────── */}
      {showStationSettings && (
        <div className="mx-4 mt-2 rounded-xl bg-white p-4 shadow-lg border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-2">Station Settings</p>
          <p className="text-xs text-gray-500 mb-3">
            Current station: <span className="font-semibold text-gray-700">{selectedStation}</span>
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={handleChangeStation}
            className="w-full"
          >
            Change Station
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-[600px] px-4 pb-32 pt-4 space-y-5">
        {/* ============================================================
            STATION SELECTION (shown when no station selected)
            ============================================================ */}
        {!stationLocked && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Select Your Station
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose the skill station you are assigned to grade. This will be
              locked for the session.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {criteria.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleStationSelect(c.name)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm border-2 border-gray-100 transition-all hover:border-blue-400 hover:shadow-md active:scale-95"
                  style={{ height: 80 }}
                >
                  <span className="text-gray-600">
                    {STATION_ICONS[c.name] ?? <Brain className="h-6 w-6" />}
                  </span>
                  <span className="text-xs font-bold text-gray-900 text-center leading-tight">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            MAIN GRADING INTERFACE (after station selected)
            ============================================================ */}
        {stationLocked && !showResults && (
          <>
            {/* ── Bib Colour Selector ────────────────────────────── */}
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Select Player — Bib Colour
              </p>
              <div className="grid grid-cols-5 gap-2">
                {BIB_COLOURS.map((colour) => {
                  const isSelected = selectedColour === colour;
                  // Count how many players of this colour are completed at this station
                  const completedInColour = Array.from({ length: 10 }, (_, i) => `${colour}-${i + 1}`)
                    .filter((k) => completedPlayers.has(k)).length;
                  const totalInColour = Array.from({ length: 10 }, (_, i) => `${colour}-${i + 1}`)
                    .filter((k) => !!MOCK_BIB_PLAYERS[k]).length;

                  return (
                    <button
                      key={colour}
                      onClick={() => handleColourSelect(colour)}
                      className="relative flex flex-col items-center justify-center rounded-xl text-white text-sm font-bold transition-all active:scale-95"
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
                      {completedInColour > 0 && (
                        <span className="text-[10px] font-normal text-white/80">
                          {completedInColour}/{totalInColour}
                        </span>
                      )}
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

            {/* ── Number Grid ────────────────────────────────────── */}
            {selectedColour && !selectedNumber && (
              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Bib Number
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                    const key = `${selectedColour}-${num}`;
                    const exists = !!MOCK_BIB_PLAYERS[key];
                    const isCompleted = completedPlayers.has(key);
                    const hasObs = (observations[key] ?? []).length > 0;
                    return (
                      <button
                        key={num}
                        onClick={() => exists && handleNumberSelect(num)}
                        disabled={!exists}
                        className="relative flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          width: 56,
                          height: 56,
                          backgroundColor: exists
                            ? `${BIB_COLOUR_HEX[selectedColour]}22`
                            : "#f3f4f6",
                          color: exists ? BIB_COLOUR_HEX[selectedColour] : "#d1d5db",
                          border: isCompleted
                            ? `3px solid #16A34A`
                            : exists
                            ? `2px solid ${BIB_COLOUR_HEX[selectedColour]}44`
                            : "2px solid #e5e7eb",
                        }}
                      >
                        {num}
                        {isCompleted && (
                          <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-green-600 text-white p-0.5" />
                        )}
                        {!isCompleted && hasObs && (
                          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                            {(observations[key] ?? []).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Player Card ────────────────────────────────────── */}
            {player && selectedColour && selectedNumber && (
              <>
                <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <div className="h-2" style={{ backgroundColor: colourHex }} />

                  <div className="flex items-center gap-4 p-4">
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

                  <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
                    <button
                      onClick={handleChangePlayer}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Change Player
                    </button>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: colourHex }}>
                      {STATION_ICONS[selectedStation!] ?? <Brain className="h-4 w-4" />}
                      <span>{selectedStation}</span>
                    </div>
                  </div>
                </section>

                {/* ── Observation List ─────────────────────────── */}
                {playerObservations.length > 0 && (
                  <section>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Observations ({playerObservations.length})
                    </p>
                    <div className="space-y-2">
                      {playerObservations.map((obs) => (
                        <div
                          key={obs.id}
                          className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm"
                        >
                          <div
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                            style={{ backgroundColor: colourHex }}
                          >
                            {obs.score}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-snug">
                              &ldquo;{obs.feedback}&rdquo;
                            </p>
                            <p className="mt-1 text-[10px] text-gray-400 font-medium">
                              {obs.timestamp}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteObservation(obs.id)}
                            className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── New Observation Entry ────────────────────── */}
                <section className="rounded-2xl bg-white p-4 shadow-sm space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    New Observation
                  </p>

                  {/* Score buttons 1-5 */}
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-900">Score</p>
                    <div className="flex gap-2">
                      {[
                        { score: 1, label: "Basic" },
                        { score: 2, label: "" },
                        { score: 3, label: "Competent" },
                        { score: 4, label: "" },
                        { score: 5, label: "Expert" },
                      ].map(({ score: s, label }) => {
                        const isSelected = currentScore === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setCurrentScore(s)}
                            className="flex flex-col items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-90"
                            style={{
                              width: 56,
                              height: 56,
                              backgroundColor: isSelected ? colourHex : "#f3f4f6",
                              color: isSelected ? "#ffffff" : "#6b7280",
                              boxShadow: isSelected
                                ? `0 2px 8px ${colourHex}55`
                                : "none",
                            }}
                          >
                            <span className="text-lg">{s}</span>
                            {label && <span className="text-[8px] font-medium opacity-80">{label}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Descriptor hint */}
                    {currentScore && stationCriteria && (() => {
                      const desc = closestDescriptor(stationCriteria.descriptors, currentScore);
                      if (!desc) return null;
                      return (
                        <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-700">
                          <span
                            className="mr-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                            style={{ backgroundColor: colourHex }}
                          >
                            L{desc.level}
                          </span>
                          {desc.text}
                        </p>
                      );
                    })()}
                  </div>

                  {/* Feedback input */}
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-900">Feedback</p>
                    <input
                      type="text"
                      value={currentFeedback}
                      onChange={(e) => setCurrentFeedback(e.target.value)}
                      placeholder="What did you observe? (required)"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddObservation();
                      }}
                    />
                  </div>

                  {/* Add observation button */}
                  <Button
                    variant="accent"
                    onClick={handleAddObservation}
                    className="w-full rounded-xl text-sm font-bold"
                    style={{ height: 48 }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Observation
                  </Button>
                </section>

                {/* ── Finish Player Button ─────────────────────── */}
                <section>
                  <Button
                    variant="primary"
                    onClick={handleFinishPlayer}
                    className="w-full rounded-xl text-base font-bold"
                    style={{ height: 56 }}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Finish &amp; Next Player
                  </Button>
                </section>
              </>
            )}

            {/* ── All Players Observed Message ────────────────────── */}
            {allPlayersObserved && (
              <div className="rounded-2xl bg-green-50 border-2 border-green-200 p-4 text-center">
                <Check className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm font-bold text-green-800">
                  All players graded at this station!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {totalObservations} total observations recorded
                </p>
              </div>
            )}
          </>
        )}

        {/* ============================================================
            RESULTS VIEW
            ============================================================ */}
        {showResults && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Session Results
              </h2>
              <button
                onClick={() => setShowResults(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Back to Grading
              </button>
            </div>

            {playerResults.length === 0 && (
              <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
                <p className="text-gray-500">No observations recorded yet.</p>
              </div>
            )}

            {playerResults.map((pr) => {
              const obs = observations[pr.key] ?? [];
              // For spider chart, we only have one station's data, show it as a segment
              const stationIdx = criteria.findIndex((c) => c.name === selectedStation);
              const chartScores = criteria.map((_, i) => {
                if (i === stationIdx) return pr.avgScore;
                return 0;
              });

              return (
                <div
                  key={pr.key}
                  className="rounded-2xl bg-white p-4 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-extrabold text-white"
                      style={{ backgroundColor: BIB_COLOUR_HEX[pr.colour] }}
                    >
                      {pr.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{pr.name}</p>
                      <p className="text-xs text-gray-500">
                        {pr.obsCount} observations
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold" style={{ color: BIB_COLOUR_HEX[pr.colour] }}>
                        {pr.avgScore}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">AVG SCORE</p>
                    </div>
                  </div>

                  {/* Spider chart placeholder — shows data for this station */}
                  <div className="flex justify-center">
                    <SpiderChart
                      scores={chartScores}
                      labels={criteria.map((c) => c.name)}
                      size={180}
                      colour={BIB_COLOUR_HEX[pr.colour]}
                    />
                  </div>

                  {/* Individual observations */}
                  <div className="mt-3 space-y-1">
                    {obs.map((o) => (
                      <div key={o.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: BIB_COLOUR_HEX[pr.colour] }}
                        >
                          {o.score}
                        </span>
                        <span className="flex-1 truncate">{o.feedback}</span>
                        <span className="text-gray-400 flex-shrink-0">{o.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {playerResults.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleGenerateAISummary}
                className="w-full rounded-xl"
                style={{ height: 48 }}
              >
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Summary
              </Button>
            )}
          </section>
        )}
      </div>

      {/* ── Bottom Progress Bar ───────────────────────────────────────── */}
      {stationLocked && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
          <div className="mx-auto max-w-[600px] flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="font-bold" style={{ color: "#0B2545" }}>
                {selectedStation}
              </span>
              <span className="text-gray-300">|</span>
              <span>
                <span className="font-semibold text-gray-900">{completedPlayers.size}</span>/{TOTAL_PLAYERS} players
              </span>
              <span className="text-gray-300">|</span>
              <span>
                <span className="font-semibold text-gray-900">{totalObservations}</span> obs
              </span>
            </div>
            <button
              onClick={() => setShowResults(!showResults)}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors active:scale-95"
              style={{ backgroundColor: "#0B2545" }}
            >
              {showResults ? "Grade" : "Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
