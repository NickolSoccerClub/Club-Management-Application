"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useActiveChild } from "@/components/parent/active-child-context";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Upload,
  ChevronRight,
  User,
  Shirt,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data per child                                                */
/* ------------------------------------------------------------------ */

interface ChildDashboard {
  jerseyNumber: number;
  coachName: string;
  nextEvent: string;
  trainingAttendance: number;
  matchAttendance: number;
  upcomingEvents: number;
  seasonGoals: number;
  schedule: ScheduleEvent[];
  announcements: Announcement[];
}

interface ScheduleEvent {
  id: string;
  date: string;
  dayOfWeek: string;
  type: "Training" | "Match";
  time: string;
  location: string;
  rsvp: "available" | "maybe" | "unavailable" | null;
}

interface Announcement {
  id: string;
  from: string;
  message: string;
  time: string;
  unread: boolean;
}

const DASHBOARD_DATA: Record<string, ChildDashboard> = {
  c1: {
    jerseyNumber: 8,
    coachName: "Coach Josh",
    nextEvent: "Tue 7 Apr, 4:30 PM",
    trainingAttendance: 87,
    matchAttendance: 92,
    upcomingEvents: 3,
    seasonGoals: 4,
    schedule: [
      { id: "e1", date: "Tue 7 Apr", dayOfWeek: "Tuesday", type: "Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: "available" },
      { id: "e2", date: "Sat 11 Apr", dayOfWeek: "Saturday", type: "Match", time: "9:00 AM", location: "Karratha Leisureplex", rsvp: null },
      { id: "e3", date: "Tue 14 Apr", dayOfWeek: "Tuesday", type: "Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
    ],
    announcements: [
      { id: "a1", from: "Coach Josh", message: "Great effort at training today! Remember shin pads next week.", time: "2h ago", unread: true },
      { id: "a2", from: "Coach Josh", message: "Saturday match moved to 9am due to heat policy. Please arrive by 8:30.", time: "1d ago", unread: true },
      { id: "a3", from: "Club Admin", message: "Team photos scheduled for April 19th. More details coming soon.", time: "3d ago", unread: false },
    ],
  },
  c2: {
    jerseyNumber: 10,
    coachName: "Coach Mel",
    nextEvent: "Wed 8 Apr, 5:00 PM",
    trainingAttendance: 91,
    matchAttendance: 88,
    upcomingEvents: 4,
    seasonGoals: 7,
    schedule: [
      { id: "e4", date: "Wed 8 Apr", dayOfWeek: "Wednesday", type: "Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: "available" },
      { id: "e5", date: "Sat 11 Apr", dayOfWeek: "Saturday", type: "Match", time: "11:00 AM", location: "Karratha Leisureplex", rsvp: "maybe" },
      { id: "e6", date: "Wed 15 Apr", dayOfWeek: "Wednesday", type: "Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
    ],
    announcements: [
      { id: "a4", from: "Coach Mel", message: "U12 trials for representative team next month. Let me know if interested.", time: "5h ago", unread: true },
      { id: "a5", from: "Coach Mel", message: "Well done on the win last weekend! Keep up the intensity at training.", time: "2d ago", unread: false },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ParentHomePage() {
  const { activeChild } = useActiveChild();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeChild.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard className="min-h-[160px]" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard className="min-h-[100px]" />
          <SkeletonCard className="min-h-[100px]" />
          <SkeletonCard className="min-h-[100px]" />
          <SkeletonCard className="min-h-[100px]" />
        </div>
        <SkeletonCard className="min-h-[200px]" />
        <SkeletonCard className="min-h-[140px]" />
      </div>
    );
  }

  const data = DASHBOARD_DATA[activeChild.id] ?? DASHBOARD_DATA.c1;

  return (
    <div className="space-y-5">
      {/* ---- Child Profile Card ---- */}
      <div
        className="rounded-xl border bg-white p-4 shadow-sm"
        style={{ borderLeftWidth: 4, borderLeftColor: activeChild.color }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: activeChild.color }}
          >
            {activeChild.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#0B2545]">{activeChild.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="info">{activeChild.ageGroup}</Badge>
              <Badge variant="default">{activeChild.team}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shirt className="h-3.5 w-3.5" /> #{data.jerseyNumber}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {data.coachName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Next: {data.nextEvent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Quick Stats ---- */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={CheckCircle2}
          label="Training Attendance"
          value={`${data.trainingAttendance}%`}
          color="#1D4ED8"
          bg="bg-blue-50"
        />
        <StatCard
          icon={Trophy}
          label="Match Attendance"
          value={`${data.matchAttendance}%`}
          color="#15803D"
          bg="bg-green-50"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value={String(data.upcomingEvents)}
          color="#B45309"
          bg="bg-amber-50"
        />
        <StatCard
          icon={Target}
          label="Season Goals"
          value={String(data.seasonGoals)}
          color="#7C3AED"
          bg="bg-purple-50"
        />
      </div>

      {/* ---- Upcoming Schedule ---- */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0B2545]">Upcoming Schedule</h3>
          <Link
            href="/parent/schedule"
            className="flex items-center gap-0.5 text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {data.schedule.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              {/* Date block */}
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50 text-center">
                <span className="text-[10px] font-medium text-gray-400">
                  {event.date.split(" ")[0]}
                </span>
                <span className="text-base font-bold text-[#0B2545]">
                  {event.date.split(" ")[1]}
                </span>
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant={event.type === "Match" ? "success" : "info"}>
                    {event.type}
                  </Badge>
                  <span className="text-sm font-medium text-[#0B2545]">
                    {event.dayOfWeek} {event.type}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> {event.time}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> {event.location}
                  </span>
                </div>
              </div>

              {/* RSVP status */}
              <div className="shrink-0">
                {event.rsvp === "available" && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0FDF4]">
                    <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  </span>
                )}
                {event.rsvp === "maybe" && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFBEB]">
                    <HelpCircle className="h-4 w-4 text-[#B45309]" />
                  </span>
                )}
                {event.rsvp === "unavailable" && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF2F2]">
                    <XCircle className="h-4 w-4 text-[#B91C1C]" />
                  </span>
                )}
                {event.rsvp === null && (
                  <span className="text-[10px] font-medium text-gray-400">RSVP</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Team Announcements ---- */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#0B2545]">Team Announcements</h3>
        <div className="space-y-2">
          {data.announcements.map((ann) => (
            <div
              key={ann.id}
              className={cn(
                "rounded-xl border bg-white p-3 shadow-sm",
                ann.unread ? "border-[#1D4ED8]/20 bg-blue-50/30" : "border-gray-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#0B2545]">{ann.from}</span>
                    {ann.unread && (
                      <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600 line-clamp-2">{ann.message}</p>
                </div>
                <span className="shrink-0 text-[10px] text-gray-400">{ann.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Quick Actions ---- */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#0B2545]">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/parent/schedule"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98] min-h-[80px] justify-center"
          >
            <Calendar className="h-5 w-5 text-[#1D4ED8]" />
            <span className="text-xs font-medium text-gray-700">View Schedule</span>
          </Link>
          <Link
            href="/parent/media"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98] min-h-[80px] justify-center"
          >
            <Upload className="h-5 w-5 text-[#15803D]" />
            <span className="text-xs font-medium text-gray-700">Upload Photo</span>
          </Link>
          <Link
            href="/parent/messages"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98] min-h-[80px] justify-center"
          >
            <MessageSquare className="h-5 w-5 text-[#7C3AED]" />
            <span className="text-xs font-medium text-gray-700">Message Coach</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card sub-component                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#0B2545]">{value}</p>
    </div>
  );
}
