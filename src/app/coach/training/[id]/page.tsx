"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Users,
  Send,
  Save,
  Sparkles,
  Plus,
  Flame,
  Dumbbell,
  Wind,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Player {
  id: string;
  name: string;
  number: number;
  rsvp: "available" | "maybe" | "unavailable" | "no-reply";
  attended: boolean;
}

interface DrillItem {
  id: string;
  name: string;
  duration: number;
  description: string;
  section: "warm-up" | "main" | "cool-down";
  completed: boolean;
}

interface DrillFeedback {
  drillId: string;
  score: number;
  notes: string;
}

interface PlayerFeedbackEntry {
  playerId: string;
  drills: DrillFeedback[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_PLAYERS: Player[] = [
  { id: "p-1", name: "Liam Carter", number: 1, rsvp: "available", attended: true },
  { id: "p-2", name: "Noah Thompson", number: 2, rsvp: "available", attended: true },
  { id: "p-3", name: "Oliver James", number: 3, rsvp: "available", attended: true },
  { id: "p-4", name: "Jack Williams", number: 4, rsvp: "available", attended: true },
  { id: "p-5", name: "Charlie Brown", number: 5, rsvp: "available", attended: true },
  { id: "p-6", name: "Leo Martin", number: 6, rsvp: "available", attended: true },
  { id: "p-7", name: "Henry Davis", number: 7, rsvp: "available", attended: false },
  { id: "p-8", name: "Ethan Wilson", number: 8, rsvp: "available", attended: true },
  { id: "p-9", name: "Mason Taylor", number: 9, rsvp: "available", attended: true },
  { id: "p-10", name: "Archie Moore", number: 10, rsvp: "available", attended: true },
  { id: "p-11", name: "Oscar White", number: 11, rsvp: "available", attended: true },
  { id: "p-12", name: "Lucas Harris", number: 12, rsvp: "available", attended: true },
  { id: "p-13", name: "Thomas Clark", number: 13, rsvp: "maybe", attended: false },
  { id: "p-14", name: "James Lewis", number: 14, rsvp: "unavailable", attended: false },
];

const MOCK_SESSION = {
  id: "ts-1",
  title: "Passing & Movement",
  date: "2026-04-01",
  time: "16:00",
  location: "Nickol West Oval",
  focusArea: "Passing",
  status: "upcoming" as const,
};

const MOCK_DRILLS: DrillItem[] = [
  { id: "d-1", name: "Toe Taps", duration: 5, description: "Warm up with alternating toe taps on the ball. Build rhythm and get feet moving.", section: "warm-up", completed: false },
  { id: "d-2", name: "Partner Passing Lines", duration: 10, description: "Pairs stand 8-10m apart, passing with the inside of the foot. Focus on accuracy and soft first touch.", section: "main", completed: false },
  { id: "d-3", name: "Passing Gates", duration: 12, description: "Pass through scattered cone gates with a partner. Count successful passes in 90 seconds.", section: "main", completed: false },
  { id: "d-4", name: "Triangle Passing", duration: 10, description: "Groups of 3 in a triangle. Pass and follow to the next cone. Switch direction every 2 minutes.", section: "main", completed: false },
  { id: "d-5", name: "Sole Rolls Cool Down", duration: 5, description: "Gentle sole rolls and stretching with the ball. Bring heart rate down and reflect on session.", section: "cool-down", completed: false },
];

const MOCK_SAVED_FEEDBACK: PlayerFeedbackEntry[] = [
  {
    playerId: "p-1",
    drills: [
      { drillId: "d-2", score: 4, notes: "Great weight of pass. Needs to open body more on receive." },
      { drillId: "d-3", score: 3, notes: "Good accuracy but rushed at times." },
      { drillId: "d-4", score: 4, notes: "Excellent movement after the pass." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const RSVP_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  available: { label: "Available", variant: "success" },
  maybe: { label: "Maybe", variant: "warning" },
  unavailable: { label: "Unavailable", variant: "danger" },
  "no-reply": { label: "No Reply", variant: "default" },
};

const SECTION_CONFIG = {
  "warm-up": { label: "Warm-Up", border: "border-l-amber-400", bg: "bg-amber-50/50", icon: Flame, iconColor: "text-amber-500" },
  main: { label: "Main Drills", border: "border-l-blue-500", bg: "bg-blue-50/50", icon: Dumbbell, iconColor: "text-blue-500" },
  "cool-down": { label: "Cool-Down", border: "border-l-sky-400", bg: "bg-sky-50/50", icon: Wind, iconColor: "text-sky-500" },
};

const SCORE_LABELS: Record<number, string> = {
  1: "Basic",
  2: "Developing",
  3: "Competent",
  4: "Proficient",
  5: "Expert",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${suffix}`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrainingSessionDetailPage() {
  const params = useParams();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);

  // Session plan state
  const [drills, setDrills] = useState<DrillItem[]>(MOCK_DRILLS);

  // RSVP state
  const [players] = useState<Player[]>(MOCK_PLAYERS);

  // Feedback state
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [feedbackScores, setFeedbackScores] = useState<Record<string, number>>({});
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [savedFeedback, setSavedFeedback] = useState<PlayerFeedbackEntry[]>(MOCK_SAVED_FEEDBACK);

  // Attendance state
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_PLAYERS.map((p) => [p.id, p.attended]))
  );

  // Notes state
  const [sessionNotes, setSessionNotes] = useState(
    "Good energy from the group today. Focus on passing weight next session."
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Load saved feedback when player changes
  useEffect(() => {
    if (selectedPlayer) {
      const existing = savedFeedback.find((f) => f.playerId === selectedPlayer);
      if (existing) {
        const scores: Record<string, number> = {};
        const notes: Record<string, string> = {};
        existing.drills.forEach((d) => {
          scores[d.drillId] = d.score;
          notes[d.drillId] = d.notes;
        });
        setFeedbackScores(scores);
        setFeedbackNotes(notes);
      } else {
        setFeedbackScores({});
        setFeedbackNotes({});
      }
    }
  }, [selectedPlayer, savedFeedback]);

  /* ---- Handlers ---- */

  const toggleDrillComplete = (drillId: string) => {
    setDrills((prev) =>
      prev.map((d) => (d.id === drillId ? { ...d, completed: !d.completed } : d))
    );
  };

  const completedCount = drills.filter((d) => d.completed).length;
  const totalDrills = drills.length;

  const handleSaveFeedback = () => {
    if (!selectedPlayer) return;
    const drillFeedback: DrillFeedback[] = drills
      .filter((d) => d.section === "main")
      .map((d) => ({
        drillId: d.id,
        score: feedbackScores[d.id] || 0,
        notes: feedbackNotes[d.id] || "",
      }))
      .filter((f) => f.score > 0);

    setSavedFeedback((prev) => {
      const filtered = prev.filter((f) => f.playerId !== selectedPlayer);
      return [...filtered, { playerId: selectedPlayer, drills: drillFeedback }];
    });
    addToast("Feedback saved successfully", "success");
  };

  const handleSaveAttendance = () => {
    addToast("Attendance saved successfully", "success");
  };

  const handleSaveNotes = () => {
    addToast("Session notes saved", "success");
  };

  const handleSendReminder = () => {
    addToast("Reminder sent to players who haven't replied", "info");
  };

  const attendedCount = Object.values(attendance).filter(Boolean).length;

  const availableCount = players.filter((p) => p.rsvp === "available").length;
  const maybeCount = players.filter((p) => p.rsvp === "maybe").length;
  const unavailableCount = players.filter((p) => p.rsvp === "unavailable").length;

  /* ----- Loading ----- */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ----- Render sections by type ----- */
  const renderDrillSection = (section: "warm-up" | "main" | "cool-down") => {
    const config = SECTION_CONFIG[section];
    const sectionDrills = drills.filter((d) => d.section === section);
    if (sectionDrills.length === 0) return null;

    const Icon = config.icon;

    return (
      <div key={section} className="mb-5">
        <div className="mb-2 flex items-center gap-2">
          <Icon className={cn("h-4 w-4", config.iconColor)} />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {config.label}
          </h3>
        </div>
        <div className="space-y-2">
          {sectionDrills.map((drill) => (
            <div
              key={drill.id}
              className={cn(
                "rounded-xl border border-gray-200 border-l-4 p-4 transition-colors",
                config.border,
                drill.completed ? "bg-gray-50 opacity-75" : config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleDrillComplete(drill.id)}
                  className="mt-0.5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={drill.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {drill.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "font-semibold text-[#0B2545]",
                      drill.completed && "line-through text-gray-400"
                    )}>
                      {drill.name}
                    </span>
                    <Badge variant="default">{drill.duration} min</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{drill.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/coach/training"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0B2545] transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Training
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-[#0B2545] md:text-3xl">
            {MOCK_SESSION.title}
          </h1>
          <Badge variant={MOCK_SESSION.status === "upcoming" ? "info" : "success"}>
            {MOCK_SESSION.status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
          <Badge variant={
            MOCK_SESSION.focusArea === "Passing" ? "info" :
            MOCK_SESSION.focusArea === "Shooting" ? "danger" :
            MOCK_SESSION.focusArea === "Defending" ? "warning" :
            MOCK_SESSION.focusArea === "Dribbling" ? "success" : "default"
          }>
            {MOCK_SESSION.focusArea}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(MOCK_SESSION.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatTime(MOCK_SESSION.time)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {MOCK_SESSION.location}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plan">
        <TabsList className="mb-4 flex w-full overflow-x-auto">
          <TabsTrigger value="plan" className="min-h-[44px] px-4">Plan</TabsTrigger>
          <TabsTrigger value="rsvp" className="min-h-[44px] px-4">RSVP</TabsTrigger>
          <TabsTrigger value="feedback" className="min-h-[44px] px-4">Feedback</TabsTrigger>
          <TabsTrigger value="attendance" className="min-h-[44px] px-4">Attendance</TabsTrigger>
          <TabsTrigger value="notes" className="min-h-[44px] px-4">Notes</TabsTrigger>
        </TabsList>

        {/* ============ PLAN TAB ============ */}
        <TabsContent value="plan">
          {/* Progress bar */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Session Progress
              </span>
              <span className="text-sm font-semibold text-[#0B2545]">
                {completedCount}/{totalDrills} drills
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-[#1D4ED8] transition-all duration-300"
                style={{ width: `${totalDrills > 0 ? (completedCount / totalDrills) * 100 : 0}%` }}
              />
            </div>
          </div>

          {renderDrillSection("warm-up")}
          {renderDrillSection("main")}
          {renderDrillSection("cool-down")}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="secondary" size="md" className="gap-2 min-h-[44px]">
              <Plus className="h-4 w-4" />
              Add Drill
            </Button>
            <Button variant="accent" size="md" className="gap-2 min-h-[44px]">
              <Sparkles className="h-4 w-4" />
              Ask Niko
            </Button>
          </div>
        </TabsContent>

        {/* ============ RSVP TAB ============ */}
        <TabsContent value="rsvp">
          {/* Summary */}
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium text-gray-700">Summary:</span>
              <Badge variant="success">{availableCount} available</Badge>
              <Badge variant="warning">{maybeCount} maybe</Badge>
              <Badge variant="danger">{unavailableCount} unavailable</Badge>
            </div>
          </div>

          {/* Player list */}
          <div className="space-y-2">
            {players.map((player) => {
              const rsvpConfig = RSVP_CONFIG[player.rsvp];
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-[#0B2545]">
                      {player.number}
                    </div>
                    <span className="font-medium text-[#0B2545]">{player.name}</span>
                  </div>
                  <Badge variant={rsvpConfig.variant}>{rsvpConfig.label}</Badge>
                </div>
              );
            })}
          </div>

          {/* Send reminder */}
          {players.some((p) => p.rsvp === "no-reply") && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="md"
                className="gap-2 min-h-[44px]"
                onClick={handleSendReminder}
              >
                <Send className="h-4 w-4" />
                Send Reminder
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ============ FEEDBACK TAB ============ */}
        <TabsContent value="feedback">
          {/* Player selector */}
          <div className="mb-5">
            <Select
              label="Select Player"
              placeholder="Choose a player..."
              options={players
                .filter((p) => p.rsvp === "available" || p.rsvp === "maybe")
                .map((p) => ({ label: `#${p.number} ${p.name}`, value: p.id }))}
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            />
          </div>

          {selectedPlayer && (
            <>
              {/* Feedback per drill (main drills only) */}
              <div className="space-y-4">
                {drills
                  .filter((d) => d.section === "main")
                  .map((drill) => {
                    const currentScore = feedbackScores[drill.id] || 0;
                    return (
                      <div
                        key={drill.id}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <h4 className="font-semibold text-[#0B2545] mb-3">
                          {drill.name}
                        </h4>

                        {/* Score buttons */}
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 mb-2 block">
                            Rating
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                onClick={() =>
                                  setFeedbackScores((prev) => ({
                                    ...prev,
                                    [drill.id]: score,
                                  }))
                                }
                                className={cn(
                                  "flex flex-col items-center rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all min-h-[44px] min-w-[60px]",
                                  currentScore === score
                                    ? score <= 2
                                      ? "border-amber-400 bg-amber-50 text-amber-700"
                                      : score <= 3
                                      ? "border-blue-400 bg-blue-50 text-blue-700"
                                      : "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                <span className="text-lg font-bold">{score}</span>
                                <span className="text-[10px]">{SCORE_LABELS[score]}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <Textarea
                          label="Notes"
                          placeholder="Add feedback notes..."
                          rows={2}
                          value={feedbackNotes[drill.id] || ""}
                          onChange={(e) =>
                            setFeedbackNotes((prev) => ({
                              ...prev,
                              [drill.id]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    );
                  })}
              </div>

              {/* Save button */}
              <div className="mt-5">
                <Button
                  variant="accent"
                  size="md"
                  className="gap-2 min-h-[44px]"
                  onClick={handleSaveFeedback}
                >
                  <Save className="h-4 w-4" />
                  Save Feedback
                </Button>
              </div>

              {/* Previously saved feedback */}
              {savedFeedback.find((f) => f.playerId === selectedPlayer) && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Saved Feedback
                  </h4>
                  <div className="space-y-2">
                    {savedFeedback
                      .find((f) => f.playerId === selectedPlayer)
                      ?.drills.map((df) => {
                        const drill = drills.find((d) => d.id === df.drillId);
                        return (
                          <div
                            key={df.drillId}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[#0B2545] text-sm">
                                {drill?.name || df.drillId}
                              </span>
                              <Badge variant={
                                df.score >= 4 ? "success" : df.score >= 3 ? "info" : "warning"
                              }>
                                {df.score}/5 — {SCORE_LABELS[df.score]}
                              </Badge>
                            </div>
                            {df.notes && (
                              <p className="text-sm text-gray-500">{df.notes}</p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}

          {!selectedPlayer && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
              Select a player above to add or view feedback.
            </div>
          )}
        </TabsContent>

        {/* ============ ATTENDANCE TAB ============ */}
        <TabsContent value="attendance">
          {/* Summary */}
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {attendedCount} of {players.length} attended
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${(attendedCount / players.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Player checkboxes */}
          <div className="space-y-2">
            {players.map((player) => (
              <label
                key={player.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-[#0B2545]">
                    {player.number}
                  </div>
                  <span className="font-medium text-[#0B2545]">{player.name}</span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={attendance[player.id] || false}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [player.id]: e.target.checked,
                      }))
                    }
                    className="h-6 w-6 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]/30 cursor-pointer"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-5">
            <Button
              variant="accent"
              size="md"
              className="gap-2 min-h-[44px]"
              onClick={handleSaveAttendance}
            >
              <Save className="h-4 w-4" />
              Save Attendance
            </Button>
          </div>
        </TabsContent>

        {/* ============ NOTES TAB ============ */}
        <TabsContent value="notes">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <Textarea
              label="Session Notes"
              placeholder="Write your notes about this training session..."
              rows={8}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <Button
              variant="accent"
              size="md"
              className="gap-2 min-h-[44px]"
              onClick={handleSaveNotes}
            >
              <Save className="h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
