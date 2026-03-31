"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import { useActiveChild } from "@/components/parent/active-child-context";
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EventType = "Training" | "Match";
type RsvpStatus = "available" | "maybe" | "unavailable" | null;
type FilterType = "all" | "Training" | "Match";

interface ScheduleEvent {
  id: string;
  date: string;         // ISO "2026-04-DD"
  dayOfWeek: string;
  type: EventType;
  title: string;
  time: string;
  location: string;
  rsvp: RsvpStatus;
  cancelled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock events — April 2026                                           */
/* ------------------------------------------------------------------ */

function createMockEvents(childId: string): ScheduleEvent[] {
  if (childId === "c1") {
    return [
      { id: "s1", date: "2026-04-02", dayOfWeek: "Thursday", type: "Training", title: "Thursday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: "available" },
      { id: "s2", date: "2026-04-05", dayOfWeek: "Sunday", type: "Match", title: "vs Karratha FC", time: "9:00 AM", location: "Karratha Leisureplex", rsvp: "available" },
      { id: "s3", date: "2026-04-07", dayOfWeek: "Tuesday", type: "Training", title: "Tuesday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
      { id: "s4", date: "2026-04-09", dayOfWeek: "Thursday", type: "Training", title: "Thursday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
      { id: "s5", date: "2026-04-12", dayOfWeek: "Sunday", type: "Match", title: "vs Dampier United", time: "9:00 AM", location: "Bulgarra Oval", rsvp: null },
      { id: "s6", date: "2026-04-14", dayOfWeek: "Tuesday", type: "Training", title: "Tuesday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
      { id: "s7", date: "2026-04-19", dayOfWeek: "Sunday", type: "Match", title: "vs Roebourne FC", time: "10:00 AM", location: "Nickol West Oval", rsvp: null },
      { id: "s8", date: "2026-04-21", dayOfWeek: "Tuesday", type: "Training", title: "Tuesday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null, cancelled: true },
      { id: "s9", date: "2026-04-23", dayOfWeek: "Thursday", type: "Training", title: "Thursday Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
      { id: "s10", date: "2026-04-26", dayOfWeek: "Sunday", type: "Match", title: "vs Wickham Wolves", time: "9:00 AM", location: "Karratha Leisureplex", rsvp: null },
    ];
  }
  return [
    { id: "s11", date: "2026-04-01", dayOfWeek: "Wednesday", type: "Training", title: "Wednesday Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: "available" },
    { id: "s12", date: "2026-04-04", dayOfWeek: "Saturday", type: "Match", title: "vs Hedland Lions", time: "11:00 AM", location: "Karratha Leisureplex", rsvp: "maybe" },
    { id: "s13", date: "2026-04-08", dayOfWeek: "Wednesday", type: "Training", title: "Wednesday Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
    { id: "s14", date: "2026-04-11", dayOfWeek: "Saturday", type: "Match", title: "vs Karratha FC U12", time: "11:00 AM", location: "Bulgarra Oval", rsvp: null },
    { id: "s15", date: "2026-04-15", dayOfWeek: "Wednesday", type: "Training", title: "Wednesday Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
    { id: "s16", date: "2026-04-18", dayOfWeek: "Saturday", type: "Match", title: "vs Dampier U12", time: "10:00 AM", location: "Karratha Leisureplex", rsvp: null },
    { id: "s17", date: "2026-04-22", dayOfWeek: "Wednesday", type: "Training", title: "Wednesday Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
    { id: "s18", date: "2026-04-25", dayOfWeek: "Saturday", type: "Match", title: "vs Roebourne U12", time: "11:00 AM", location: "Bulgarra Oval", rsvp: null, cancelled: true },
    { id: "s19", date: "2026-04-27", dayOfWeek: "Monday", type: "Training", title: "Make-up Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
    { id: "s20", date: "2026-04-29", dayOfWeek: "Wednesday", type: "Training", title: "Wednesday Training", time: "5:00 PM", location: "Bulgarra Oval", rsvp: null },
  ];
}

/* ------------------------------------------------------------------ */
/*  Calendar helpers                                                   */
/* ------------------------------------------------------------------ */

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function SchedulePage() {
  const { activeChild } = useActiveChild();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [calYear] = useState(2026);
  const [calMonth] = useState(3); // April (0-indexed)

  // Load events on child change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setEvents(createMockEvents(activeChild.id));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeChild.id]);

  // Calendar data
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  // Build event date lookup for calendar indicators
  const eventDayMap = useMemo(() => {
    const map: Record<number, { type: EventType; cancelled?: boolean }> = {};
    events.forEach((ev) => {
      const day = parseInt(ev.date.split("-")[2], 10);
      // Priority: cancelled > match > training
      if (ev.cancelled) {
        map[day] = { type: ev.type, cancelled: true };
      } else if (!map[day] || (ev.type === "Match" && !map[day].cancelled)) {
        map[day] = { type: ev.type };
      }
    });
    return map;
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((ev) => ev.type === filter);
  }, [events, filter]);

  // RSVP handler
  function handleRsvp(eventId: string, status: RsvpStatus) {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, rsvp: status } : ev))
    );
    const event = events.find((ev) => ev.id === eventId);
    const statusLabel =
      status === "available" ? "Available" : status === "maybe" ? "Maybe" : "Unavailable";
    addToast(
      `RSVP updated — ${statusLabel} for ${event?.title ?? "event"}`,
      "success"
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard className="min-h-[280px]" />
        <SkeletonCard className="min-h-[60px]" />
        <SkeletonCard className="min-h-[120px]" />
        <SkeletonCard className="min-h-[120px]" />
        <SkeletonCard className="min-h-[120px]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ---- Mini Calendar ---- */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Month header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-[#0B2545]">
            {MONTH_NAMES[calMonth]} {calYear}
          </h3>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {DAY_LABELS.map((d) => (
            <span key={d} className="py-1 text-[10px] font-medium text-gray-400">
              {d}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const eventInfo = eventDayMap[day];
            const isToday = day === 31 && calMonth === 2; // March 31 — current date context

            return (
              <div
                key={day}
                className="flex h-10 flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                    isToday && "bg-[#0B2545] text-white"
                  )}
                >
                  {day}
                </span>
                {/* Event indicator dot */}
                {eventInfo && (
                  <span
                    className={cn(
                      "mt-0.5 h-1.5 w-1.5 rounded-full",
                      eventInfo.cancelled
                        ? "bg-[#B91C1C]"
                        : eventInfo.type === "Match"
                          ? "bg-[#15803D]"
                          : "bg-[#1D4ED8]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" /> Training
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#15803D]" /> Match
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#B91C1C]" /> Cancelled
          </span>
        </div>
      </div>

      {/* ---- Filter ---- */}
      <div className="flex items-center gap-2">
        {(["all", "Training", "Match"] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px]",
              filter === f
                ? "bg-[#0B2545] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "Training" ? "Training" : "Matches"}
          </button>
        ))}
      </div>

      {/* ---- Event List ---- */}
      <div className="space-y-3">
        {filteredEvents.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-10 text-center">
            <p className="text-sm text-gray-400">No events found.</p>
          </div>
        )}

        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              "rounded-xl border bg-white p-4 shadow-sm",
              event.cancelled
                ? "border-[#B91C1C]/20 opacity-60"
                : "border-gray-200"
            )}
          >
            {/* Top row: date + type */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Date block */}
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50 text-center">
                  <span className="text-[9px] font-medium uppercase text-gray-400">
                    {event.dayOfWeek.slice(0, 3)}
                  </span>
                  <span className="text-sm font-bold text-[#0B2545]">
                    {parseInt(event.date.split("-")[2], 10)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    {event.cancelled ? (
                      <Badge variant="danger">Cancelled</Badge>
                    ) : (
                      <Badge variant={event.type === "Match" ? "success" : "info"}>
                        {event.type}
                      </Badge>
                    )}
                  </div>
                  <h4 className={cn(
                    "mt-0.5 text-sm font-medium",
                    event.cancelled ? "text-gray-400 line-through" : "text-[#0B2545]"
                  )}>
                    {event.title}
                  </h4>
                </div>
              </div>

              {/* Current RSVP indicator */}
              {event.rsvp && !event.cancelled && (
                <div className="shrink-0">
                  {event.rsvp === "available" && (
                    <Badge variant="success">Going</Badge>
                  )}
                  {event.rsvp === "maybe" && (
                    <Badge variant="warning">Maybe</Badge>
                  )}
                  {event.rsvp === "unavailable" && (
                    <Badge variant="danger">Can&apos;t Go</Badge>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {event.location}
              </span>
            </div>

            {/* RSVP buttons */}
            {!event.cancelled && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors min-h-[40px]",
                    event.rsvp === "available"
                      ? "bg-[#F0FDF4] text-[#15803D] ring-1 ring-[#15803D]/30"
                      : "bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-[#15803D]"
                  )}
                  onClick={() => handleRsvp(event.id, "available")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Available
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors min-h-[40px]",
                    event.rsvp === "maybe"
                      ? "bg-[#FFFBEB] text-[#B45309] ring-1 ring-[#B45309]/30"
                      : "bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-[#B45309]"
                  )}
                  onClick={() => handleRsvp(event.id, "maybe")}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Maybe
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors min-h-[40px]",
                    event.rsvp === "unavailable"
                      ? "bg-[#FEF2F2] text-[#B91C1C] ring-1 ring-[#B91C1C]/30"
                      : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-[#B91C1C]"
                  )}
                  onClick={() => handleRsvp(event.id, "unavailable")}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Unavailable
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
