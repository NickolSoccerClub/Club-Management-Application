"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  ChevronLeft,
  Star,
  Plus,
  Sparkles,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  Calendar,
  Shield,
  Heart,
  Camera,
  Phone,
  Mail,
  User,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                   */
/* ------------------------------------------------------------------ */

interface PlayerDetail {
  id: string;
  name: string;
  position: string;
  age: number;
  jerseyNumber: number;
  dob: string;
  ageGroup: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  medicalNotes: string | null;
  photoConsent: boolean;
  gradeScores: {
    ballFamiliarity: number;
    movementCoordination: number;
    listeningFocus: number;
    enthusiasmEffort: number;
    spatialAwareness: number;
  };
}

interface FeedbackEntry {
  id: string;
  date: string;
  sessionName: string;
  drillName: string;
  score: number;
  feedback: string;
}

interface DevGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "in-progress" | "achieved" | "not-started";
}

interface AttendanceRecord {
  id: string;
  date: string;
  type: "training" | "match";
  name: string;
  attended: boolean;
}

const PLAYER: PlayerDetail = {
  id: "p-1",
  name: "Liam Carter",
  position: "FWD",
  age: 8,
  jerseyNumber: 9,
  dob: "2018-05-14",
  ageGroup: "U9",
  guardianName: "Sarah Carter",
  guardianEmail: "sarah.carter@email.com",
  guardianPhone: "0412 345 678",
  medicalNotes: "Mild asthma — carries inhaler. Ensure water breaks every 15 minutes in hot weather.",
  photoConsent: true,
  gradeScores: {
    ballFamiliarity: 4.5,
    movementCoordination: 4.0,
    listeningFocus: 3.5,
    enthusiasmEffort: 5.0,
    spatialAwareness: 3.8,
  },
};

const FEEDBACK: FeedbackEntry[] = [
  { id: "fb-1", date: "2026-03-27", sessionName: "Thursday Session", drillName: "Cone Weaving", score: 4, feedback: "Excellent close control through the cones. Starting to use both feet more naturally. Challenge him to increase speed next session." },
  { id: "fb-2", date: "2026-03-25", sessionName: "Tuesday Session", drillName: "Partner Passing Lines", score: 3, feedback: "Passing accuracy is improving but still favours right foot. Needs more reps on left-foot passing." },
  { id: "fb-3", date: "2026-03-20", sessionName: "Thursday Session", drillName: "Sharks and Minnows", score: 5, feedback: "Standout performance. Great awareness of space and shielding. Natural leader in this drill." },
  { id: "fb-4", date: "2026-03-18", sessionName: "Tuesday Session", drillName: "Red Light Green Light", score: 4, feedback: "Good reactions and ball control. Needs to work on stopping cleanly with left foot." },
  { id: "fb-5", date: "2026-03-13", sessionName: "Thursday Session", drillName: "1v1 Dribbling to Gate", score: 4, feedback: "Confident in 1v1. Uses body feints well. Could improve on using the weaker foot to beat defenders." },
  { id: "fb-6", date: "2026-03-11", sessionName: "Tuesday Session", drillName: "Triangle Passing", score: 3, feedback: "First touch is good but body shape when receiving needs attention. Encourage opening up to the field." },
];

const DEV_GOALS: DevGoal[] = [
  { id: "dg-1", title: "Left Foot Development", description: "Increase confidence and accuracy using left foot in drills and matches.", progress: 45, status: "in-progress" },
  { id: "dg-2", title: "Spatial Awareness", description: "Improve ability to find open space during game play. Target: consistent scanning.", progress: 60, status: "in-progress" },
  { id: "dg-3", title: "Listening & Focus", description: "Maintain focus through full training sessions without reminders.", progress: 70, status: "in-progress" },
  { id: "dg-4", title: "Heading Introduction", description: "Introduce basic heading technique using soft balls in controlled drills.", progress: 0, status: "not-started" },
];

const ATTENDANCE: AttendanceRecord[] = [
  { id: "a-1", date: "2026-03-29", type: "match", name: "vs Karratha Rangers U9", attended: true },
  { id: "a-2", date: "2026-03-27", type: "training", name: "Thursday Session", attended: true },
  { id: "a-3", date: "2026-03-25", type: "training", name: "Tuesday Session", attended: true },
  { id: "a-4", date: "2026-03-22", type: "match", name: "vs Dampier Sharks U9", attended: true },
  { id: "a-5", date: "2026-03-20", type: "training", name: "Thursday Session", attended: true },
  { id: "a-6", date: "2026-03-18", type: "training", name: "Tuesday Session", attended: false },
  { id: "a-7", date: "2026-03-15", type: "match", name: "vs Karratha City U9", attended: true },
  { id: "a-8", date: "2026-03-13", type: "training", name: "Thursday Session", attended: true },
  { id: "a-9", date: "2026-03-11", type: "training", name: "Tuesday Session", attended: true },
  { id: "a-10", date: "2026-03-08", type: "match", name: "vs Pilbara United U9", attended: false },
  { id: "a-11", date: "2026-03-06", type: "training", name: "Thursday Session", attended: true },
  { id: "a-12", date: "2026-03-04", type: "training", name: "Tuesday Session", attended: true },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function gradeVariant(score: number): "success" | "warning" | "danger" | "info" {
  if (score >= 4.0) return "success";
  if (score >= 3.0) return "info";
  if (score >= 2.0) return "warning";
  return "danger";
}

/* ------------------------------------------------------------------ */
/*  Radar / Spider Chart (SVG)                                          */
/* ------------------------------------------------------------------ */

function SkillsRadar({ scores }: { scores: PlayerDetail["gradeScores"] }) {
  const labels = [
    { key: "ballFamiliarity", label: "Ball Familiarity" },
    { key: "movementCoordination", label: "Movement" },
    { key: "listeningFocus", label: "Listening" },
    { key: "enthusiasmEffort", label: "Enthusiasm" },
    { key: "spatialAwareness", label: "Spatial" },
  ];
  const cx = 150;
  const cy = 150;
  const maxR = 100;
  const levels = 5;

  function polarToCart(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const angleStep = 360 / labels.length;

  // Grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, lvl) => {
    const r = (maxR / levels) * (lvl + 1);
    const points = labels
      .map((_, i) => {
        const p = polarToCart(i * angleStep, r);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    return points;
  });

  // Data polygon
  const dataPoints = labels.map((l, i) => {
    const val = scores[l.key as keyof typeof scores] || 0;
    const r = (val / 5) * maxR;
    return polarToCart(i * angleStep, r);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {labels.map((_, i) => {
        const end = polarToCart(i * angleStep, maxR);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        );
      })}
      {/* Data area */}
      <polygon
        points={dataPolygon}
        fill="rgba(29,78,216,0.15)"
        stroke="#1D4ED8"
        strokeWidth={2}
      />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#1D4ED8" />
      ))}
      {/* Labels */}
      {labels.map((l, i) => {
        const p = polarToCart(i * angleStep, maxR + 24);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 text-[10px]"
          >
            {l.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Feedback Form                                                   */
/* ------------------------------------------------------------------ */

const DRILL_OPTIONS = [
  { label: "Select drill...", value: "" },
  { label: "Toe Taps", value: "Toe Taps" },
  { label: "Cone Weaving", value: "Cone Weaving" },
  { label: "Sharks and Minnows", value: "Sharks and Minnows" },
  { label: "Partner Passing Lines", value: "Partner Passing Lines" },
  { label: "1v1 Dribbling to Gate", value: "1v1 Dribbling to Gate" },
  { label: "Triangle Passing", value: "Triangle Passing" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  /* Feedback form state */
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [fbDrill, setFbDrill] = useState("");
  const [fbScore, setFbScore] = useState(0);
  const [fbNotes, setFbNotes] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddFeedback = () => {
    if (!fbDrill || fbScore === 0) {
      addToast("Please select a drill and score", "warning");
      return;
    }
    addToast("Feedback added", "success");
    setShowFeedbackForm(false);
    setFbDrill("");
    setFbScore(0);
    setFbNotes("");
  };

  const handleGenerateDevPlan = () => {
    addToast("AI Development Plan generation coming soon", "info");
  };

  /* Attendance stats */
  const trainingSessions = ATTENDANCE.filter((a) => a.type === "training");
  const matchSessions = ATTENDANCE.filter((a) => a.type === "match");
  const trainingAttended = trainingSessions.filter((a) => a.attended).length;
  const matchAttended = matchSessions.filter((a) => a.attended).length;
  const trainingPct = Math.round((trainingAttended / trainingSessions.length) * 100);
  const matchPct = Math.round((matchAttended / matchSessions.length) * 100);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const p = PLAYER;
  const avgGrade =
    Object.values(p.gradeScores).reduce((s, v) => s + v, 0) /
    Object.values(p.gradeScores).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#0B2545]">{p.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="info">{p.position}</Badge>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B2545] text-xs font-bold text-white">
              {p.jerseyNumber}
            </span>
            <Badge variant={gradeVariant(avgGrade)}>
              Grade {avgGrade.toFixed(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* ---- Tabs ---- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex-wrap">
          <TabsTrigger value="overview" className="flex-1 min-h-[44px]">Overview</TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 min-h-[44px]">Feedback</TabsTrigger>
          <TabsTrigger value="development" className="flex-1 min-h-[44px]">Development</TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-h-[44px]">Attendance</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  Overview Tab                                                  */}
        {/* ============================================================ */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Personal Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-semibold text-[#0B2545]">Personal Information</h3>
              <div className="space-y-3">
                <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(p.dob)} />
                <InfoRow icon={Users} label="Age Group" value={p.ageGroup} />
                <InfoRow icon={User} label="Guardian" value={p.guardianName} />
                <InfoRow icon={Mail} label="Email" value={p.guardianEmail} />
                <InfoRow icon={Phone} label="Phone" value={p.guardianPhone} />
                <div className="flex items-center gap-3">
                  <Camera className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Photo Consent</p>
                    <p className="text-sm font-medium text-[#0B2545]">
                      {p.photoConsent ? (
                        <span className="flex items-center gap-1 text-[#15803D]">
                          <CheckCircle2 className="h-4 w-4" /> Granted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#B91C1C]">
                          <XCircle className="h-4 w-4" /> Not Granted
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical */}
              {p.medicalNotes && (
                <div className="rounded-lg border-2 border-[#B91C1C]/20 bg-[#FEF2F2] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-[#B91C1C]" />
                    <p className="text-sm font-semibold text-[#B91C1C]">Medical Notes</p>
                  </div>
                  <p className="text-sm text-[#B91C1C]">{p.medicalNotes}</p>
                </div>
              )}
            </div>

            {/* Skills Radar */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-4">Skills Profile</h3>
              <SkillsRadar scores={p.gradeScores} />

              {/* Score breakdown */}
              <div className="mt-4 space-y-2">
                {[
                  { label: "Ball Familiarity", val: p.gradeScores.ballFamiliarity },
                  { label: "Movement & Coordination", val: p.gradeScores.movementCoordination },
                  { label: "Listening & Focus", val: p.gradeScores.listeningFocus },
                  { label: "Enthusiasm & Effort", val: p.gradeScores.enthusiasmEffort },
                  { label: "Spatial Awareness", val: p.gradeScores.spatialAwareness },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <Badge variant={gradeVariant(item.val)}>{item.val.toFixed(1)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Feedback Tab                                                  */}
        {/* ============================================================ */}
        <TabsContent value="feedback">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="accent"
                size="lg"
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                style={{ minHeight: 48 }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Feedback
              </Button>
            </div>

            {/* Add Feedback Form */}
            {showFeedbackForm && (
              <div className="rounded-lg border border-[#1D4ED8]/20 bg-blue-50/30 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-[#0B2545]">New Feedback</h3>
                <Select
                  label="Drill"
                  options={DRILL_OPTIONS}
                  value={fbDrill}
                  onChange={(e) => setFbDrill(e.target.value)}
                />
                <div>
                  <p className="mb-1.5 text-sm font-medium text-gray-700">Score</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setFbScore(v)}
                        className="p-1"
                        style={{ minHeight: 40, minWidth: 40 }}
                      >
                        <Star
                          className={cn(
                            "h-6 w-6",
                            fbScore >= v ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  label="Notes"
                  rows={3}
                  placeholder="Observations, strengths, areas to improve..."
                  value={fbNotes}
                  onChange={(e) => setFbNotes(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button variant="accent" size="lg" onClick={handleAddFeedback} style={{ minHeight: 48 }}>
                    Save Feedback
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowFeedbackForm(false)}
                    style={{ minHeight: 48 }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Feedback Timeline */}
            <div className="space-y-4">
              {FEEDBACK.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">{formatDate(fb.date)} &middot; {fb.sessionName}</p>
                      <p className="text-sm font-semibold text-[#0B2545]">{fb.drillName}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Star
                          key={v}
                          className={cn(
                            "h-4 w-4",
                            fb.score >= v ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{fb.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Development Tab                                               */}
        {/* ============================================================ */}
        <TabsContent value="development">
          <div className="space-y-6">
            {/* Current Grade Scores */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-4">Current Grade Scores</h3>
              <div className="space-y-3">
                {[
                  { label: "Ball Familiarity", val: p.gradeScores.ballFamiliarity },
                  { label: "Movement & Coordination", val: p.gradeScores.movementCoordination },
                  { label: "Listening & Focus", val: p.gradeScores.listeningFocus },
                  { label: "Enthusiasm & Effort", val: p.gradeScores.enthusiasmEffort },
                  { label: "Spatial Awareness", val: p.gradeScores.spatialAwareness },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-semibold text-[#0B2545]">{item.val.toFixed(1)} / 5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          item.val >= 4 ? "bg-[#15803D]" : item.val >= 3 ? "bg-[#1D4ED8]" : item.val >= 2 ? "bg-[#B45309]" : "bg-[#B91C1C]"
                        )}
                        style={{ width: `${(item.val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Goals */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-4">Development Goals</h3>
              <div className="space-y-4">
                {DEV_GOALS.map((goal) => (
                  <div key={goal.id} className="rounded-lg border border-gray-100 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#0B2545]">{goal.title}</p>
                        <p className="text-xs text-gray-500">{goal.description}</p>
                      </div>
                      <Badge
                        variant={
                          goal.status === "achieved"
                            ? "success"
                            : goal.status === "in-progress"
                            ? "info"
                            : "default"
                        }
                      >
                        {goal.status === "in-progress"
                          ? "In Progress"
                          : goal.status === "achieved"
                          ? "Achieved"
                          : "Not Started"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-[#1D4ED8] transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Dev Plan */}
            <Button
              variant="accent"
              size="lg"
              onClick={handleGenerateDevPlan}
              style={{ minHeight: 48 }}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate AI Development Plan
            </Button>

            {/* Season Notes */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#0B2545] mb-2">Season Progression Notes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Liam has shown significant improvement this season, particularly in ball familiarity and enthusiasm.
                His natural attacking instinct makes him effective in forward positions. Key development areas remain
                left-foot confidence and maintaining focus during longer sessions. Recommended for continued 1v1
                development drills and left-foot specific exercises.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Attendance Tab                                                */}
        {/* ============================================================ */}
        <TabsContent value="attendance">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">Training Attendance</p>
                <p className="mt-1 text-2xl font-bold text-[#0B2545]">
                  {trainingAttended} / {trainingSessions.length}
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#1D4ED8] transition-all"
                    style={{ width: `${trainingPct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{trainingPct}% attendance rate</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">Match Attendance</p>
                <p className="mt-1 text-2xl font-bold text-[#0B2545]">
                  {matchAttended} / {matchSessions.length}
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#15803D] transition-all"
                    style={{ width: `${matchPct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{matchPct}% attendance rate</p>
              </div>
            </div>

            {/* Attendance List */}
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Session / Match</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE.map((record, idx) => (
                    <tr
                      key={record.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-4 py-3 text-gray-600">{formatDate(record.date)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={record.type === "match" ? "info" : "default"}>
                          {record.type === "match" ? "Match" : "Training"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0B2545]">{record.name}</td>
                      <td className="px-4 py-3">
                        {record.attended ? (
                          <span className="flex items-center gap-1 text-[#15803D]">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-medium">Attended</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#B91C1C]">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Missed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Info Row Helper                                                     */
/* ------------------------------------------------------------------ */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-gray-400 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-[#0B2545]">{value}</p>
      </div>
    </div>
  );
}

