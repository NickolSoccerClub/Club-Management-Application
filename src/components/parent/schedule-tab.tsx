"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Trophy,
  MapPin,
  Clock,
  CalendarPlus,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                 */
/* ------------------------------------------------------------------ */

interface CalendarEvent {
  id: string;
  day: number;
  type: "training" | "match" | "cancelled";
  title: string;
  time: string;
  location: string;
  rsvp: "available" | "maybe" | "unavailable" | null;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "s1", day: 1, type: "training", title: "Team Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: "available" },
  { id: "s2", day: 4, type: "match", title: "vs Karratha Kickers", time: "9:00 AM", location: "Bulgarra Oval", rsvp: null },
  { id: "s3", day: 8, type: "training", title: "Team Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
  { id: "s4", day: 11, type: "match", title: "vs Dampier Dolphins", time: "10:30 AM", location: "Dampier Oval", rsvp: null },
  { id: "s5", day: 15, type: "training", title: "Team Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
  { id: "s6", day: 18, type: "match", title: "vs Roebourne Rangers", time: "9:00 AM", location: "Nickol West Oval", rsvp: null },
  { id: "s7", day: 22, type: "cancelled", title: "Training Cancelled", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
  { id: "s8", day: 25, type: "match", title: "vs Hedland Heat", time: "10:00 AM", location: "Bulgarra Oval", rsvp: null },
  { id: "s9", day: 29, type: "training", title: "Team Training", time: "4:30 PM", location: "Nickol West Oval", rsvp: null },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------------------------------------------ */
/*  Mini calendar                                                     */
/* ------------------------------------------------------------------ */

function MiniCalendar({
  selectedDay,
  onSelectDay,
  events,
}: {
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  events: CalendarEvent[];
}) {
  const daysInMonth = 30;
  // April 2026 starts on a Wednesday (index 2)
  const startOffset = 2;
  const eventDays = new Map(events.map((e) => [e.day, e.type]));

  const dotColor = (type: string) => {
    if (type === "training") return "bg-[#15803D]";
    if (type === "match") return "bg-[#1D4ED8]";
    return "bg-gray-400";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <CardTitle className="text-base">April 2026</CardTitle>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-xs font-medium text-gray-400"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const eventType = eventDays.get(day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                className={cn(
                  "relative flex flex-col items-center justify-center aspect-square rounded-lg text-sm transition-colors",
                  "min-h-[44px] min-w-[44px]",
                  isSelected
                    ? "bg-[#0B2545] text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                )}
                onClick={() => onSelectDay(day)}
              >
                {day}
                {eventType && (
                  <div
                    className={cn(
                      "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-white" : dotColor(eventType)
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#15803D]" />
            Training
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
            Match
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            Cancelled
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Schedule Tab                                                      */
/* ------------------------------------------------------------------ */

export function ScheduleTab() {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(4);
  const [rsvps, setRsvps] = React.useState<Record<string, string>>({
    s1: "available",
  });

  const dayEvents = selectedDay
    ? MOCK_EVENTS.filter((e) => e.day === selectedDay)
    : [];

  const handleRsvp = (eventId: string, status: string) => {
    setRsvps((prev) => ({ ...prev, [eventId]: status }));
  };

  return (
    <div className="space-y-4">
      <MiniCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        events={MOCK_EVENTS}
      />

      {/* Events for selected day */}
      {selectedDay && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#0B2545]">
            Events on {selectedDay} April
          </h3>

          {dayEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No events on this day
            </p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => {
                const currentRsvp = rsvps[event.id] || null;

                return (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      {/* Event header */}
                      <div className="mb-3 flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            event.type === "training"
                              ? "bg-green-50 text-[#15803D]"
                              : event.type === "match"
                              ? "bg-blue-50 text-[#1D4ED8]"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {event.type === "training" ? (
                            <Dumbbell className="h-5 w-5" />
                          ) : event.type === "cancelled" ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <Trophy className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "font-medium",
                              event.type === "cancelled"
                                ? "text-gray-400 line-through"
                                : "text-[#0B2545]"
                            )}
                          >
                            {event.title}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RSVP buttons */}
                      {event.type !== "cancelled" && (
                        <div className="flex gap-2">
                          {(
                            [
                              ["available", "Available", "success"],
                              ["maybe", "Maybe", "warning"],
                              ["unavailable", "Unavailable", "danger"],
                            ] as const
                          ).map(([value, label, variant]) => (
                            <Button
                              key={value}
                              variant={
                                currentRsvp === value ? "primary" : "secondary"
                              }
                              size="lg"
                              className={cn(
                                "flex-1 min-h-[48px] text-sm",
                                currentRsvp === value &&
                                  variant === "success" &&
                                  "bg-[#15803D] hover:bg-[#15803D]/90",
                                currentRsvp === value &&
                                  variant === "warning" &&
                                  "bg-[#B45309] hover:bg-[#B45309]/90",
                                currentRsvp === value &&
                                  variant === "danger" &&
                                  "bg-[#B91C1C] hover:bg-[#B91C1C]/90"
                              )}
                              onClick={() => handleRsvp(event.id, value)}
                            >
                              {label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Add to calendar */}
                      {event.type !== "cancelled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 gap-1.5 text-xs text-gray-500 min-h-[44px]"
                        >
                          <CalendarPlus className="h-4 w-4" />
                          Add to Calendar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
