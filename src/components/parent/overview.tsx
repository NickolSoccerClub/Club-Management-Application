"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  BarChart3,
  Trophy,
  Calendar,
  FileText,
  Dumbbell,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle,
  Circle,
  Megaphone,
} from "lucide-react";
import type { ChildProfile } from "./child-selector";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const QUICK_STATS = [
  {
    label: "Training Attendance",
    value: "92%",
    icon: Dumbbell,
    color: "text-[#15803D]",
    bg: "bg-green-50",
    ring: "ring-[#15803D]/20",
  },
  {
    label: "Match Attendance",
    value: "88%",
    icon: Trophy,
    color: "text-[#1D4ED8]",
    bg: "bg-blue-50",
    ring: "ring-[#1D4ED8]/20",
  },
  {
    label: "Upcoming Events",
    value: "4",
    icon: Calendar,
    color: "text-[#7C3AED]",
    bg: "bg-purple-50",
    ring: "ring-[#7C3AED]/20",
  },
  {
    label: "Latest Coach Note",
    value: "Great effort at training. Keep working on...",
    icon: FileText,
    color: "text-[#B45309]",
    bg: "bg-amber-50",
    ring: "ring-[#B45309]/20",
    truncate: true,
  },
];

interface ScheduleEvent {
  id: string;
  type: "training" | "match";
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpStatus: "confirmed" | "maybe" | "pending";
}

const UPCOMING_EVENTS: ScheduleEvent[] = [
  {
    id: "e1",
    type: "training",
    title: "Team Training",
    date: "Tue 29 Mar",
    time: "4:30 PM",
    location: "Nickol West Oval",
    rsvpStatus: "confirmed",
  },
  {
    id: "e2",
    type: "match",
    title: "vs Karratha Kickers",
    date: "Sat 2 Apr",
    time: "9:00 AM",
    location: "Bulgarra Oval",
    rsvpStatus: "pending",
  },
  {
    id: "e3",
    type: "training",
    title: "Team Training",
    date: "Tue 5 Apr",
    time: "4:30 PM",
    location: "Nickol West Oval",
    rsvpStatus: "pending",
  },
];

interface Notice {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  unread: boolean;
}

const NOTICES: Notice[] = [
  {
    id: "n1",
    title: "New Season Photo Day",
    excerpt: "Team photos will be taken this Saturday before the match. Please wear full kit.",
    date: "25 Mar",
    unread: true,
  },
  {
    id: "n2",
    title: "Training Venue Change",
    excerpt: "Due to oval maintenance, training on 5 Apr will be at Bulgarra Oval instead.",
    date: "23 Mar",
    unread: true,
  },
  {
    id: "n3",
    title: "End of Season Presentation",
    excerpt: "Save the date: our end of season awards night will be held on 18 June at the Nickol clubhouse.",
    date: "20 Mar",
    unread: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Helper components                                                 */
/* ------------------------------------------------------------------ */

function RsvpStatusBadge({ status }: { status: ScheduleEvent["rsvpStatus"] }) {
  const config = {
    confirmed: {
      variant: "success" as const,
      label: "Going",
      Icon: CheckCircle,
    },
    maybe: {
      variant: "warning" as const,
      label: "Maybe",
      Icon: HelpCircle,
    },
    pending: {
      variant: "default" as const,
      label: "No Reply",
      Icon: Circle,
    },
  }[status];

  return (
    <Badge variant={config.variant} className="gap-1">
      <config.Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview                                                          */
/* ------------------------------------------------------------------ */

interface OverviewProps {
  child: ChildProfile;
}

export function Overview({ child }: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Profile summary */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4 md:p-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: child.accentColor }}
          >
            {child.initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#0B2545]">
              {child.name}
            </h2>
            <p className="text-sm text-gray-500">
              {child.teamName} &middot; #{child.jerseyNumber} &middot;{" "}
              {child.coachName}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats - horizontal scroll on mobile */}
      <div className="-mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 snap-x">
          {QUICK_STATS.map((stat) => (
            <Card
              key={stat.label}
              className="min-w-[150px] shrink-0 snap-start md:min-w-0"
            >
              <CardContent className="p-4">
                <div
                  className={cn(
                    "mb-2 flex h-9 w-9 items-center justify-center rounded-lg",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "mt-1 font-semibold text-[#0B2545]",
                    stat.truncate
                      ? "text-xs leading-relaxed line-clamp-2"
                      : "text-lg"
                  )}
                >
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-[#1D4ED8]" />
            Upcoming (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 md:px-6 md:pb-6">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 md:p-4"
            >
              {/* Event type icon */}
              <div
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  event.type === "training"
                    ? "bg-green-50 text-[#15803D]"
                    : "bg-blue-50 text-[#1D4ED8]"
                )}
              >
                {event.type === "training" ? (
                  <Dumbbell className="h-5 w-5" />
                ) : (
                  <Trophy className="h-5 w-5" />
                )}
              </div>

              {/* Event info */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#0B2545]">{event.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.date}, {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
                <div className="mt-2">
                  <RsvpStatusBadge status={event.rsvpStatus} />
                </div>
              </div>

              {/* RSVP button */}
              {event.rsvpStatus === "pending" && (
                <Button
                  variant="accent"
                  size="sm"
                  className="shrink-0 min-h-[44px] min-w-[44px]"
                >
                  RSVP
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-[#B45309]" />
            Team Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4 md:px-6 md:pb-6">
          {NOTICES.map((notice) => (
            <button
              key={notice.id}
              type="button"
              className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50 min-h-[44px]"
            >
              {/* Unread dot */}
              <div className="mt-1.5 shrink-0">
                {notice.unread ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#1D4ED8]" />
                ) : (
                  <div className="h-2.5 w-2.5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm",
                      notice.unread
                        ? "font-semibold text-[#0B2545]"
                        : "font-medium text-gray-600"
                    )}
                  >
                    {notice.title}
                  </p>
                  <span className="shrink-0 text-xs text-gray-400">
                    {notice.date}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                  {notice.excerpt}
                </p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
