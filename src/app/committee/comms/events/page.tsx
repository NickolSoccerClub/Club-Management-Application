"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  CalendarDays,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type EventType = "Training" | "Social" | "Fundraiser" | "AGM";
type EventStatus = "Upcoming" | "In Progress" | "Completed";

interface ClubEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  rsvpCount: number;
  rsvpCapacity: number;
  status: EventStatus;
}

const MOCK_EVENTS: ClubEvent[] = [
  { id: 1, name: "Season Launch BBQ", date: "04 Apr 2026", time: "12:00 PM", location: "Nickol West Oval Pavilion", type: "Social", rsvpCount: 87, rsvpCapacity: 150, status: "Upcoming" },
  { id: 2, name: "Coach Accreditation Weekend", date: "11 Apr 2026", time: "9:00 AM", location: "Karratha Leisure Centre", type: "Training", rsvpCount: 12, rsvpCapacity: 20, status: "Upcoming" },
  { id: 3, name: "Bunnings Sausage Sizzle Fundraiser", date: "18 Apr 2026", time: "8:00 AM", location: "Bunnings Karratha", type: "Fundraiser", rsvpCount: 24, rsvpCapacity: 30, status: "Upcoming" },
  { id: 4, name: "Annual General Meeting 2026", date: "25 Apr 2026", time: "6:00 PM", location: "Nickol Clubhouse", type: "AGM", rsvpCount: 34, rsvpCapacity: 50, status: "Upcoming" },
  { id: 5, name: "Pre-Season Skills Clinic - U7/U9", date: "28 Mar 2026", time: "4:00 PM", location: "Nickol West Oval", type: "Training", rsvpCount: 42, rsvpCapacity: 50, status: "In Progress" },
  { id: 6, name: "Trivia Night Fundraiser", date: "15 Mar 2026", time: "7:00 PM", location: "Tambrey Tavern", type: "Fundraiser", rsvpCount: 68, rsvpCapacity: 80, status: "Completed" },
];

const TYPE_VARIANT: Record<EventType, "info" | "success" | "warning" | "default"> = {
  Training: "info",
  Social: "success",
  Fundraiser: "warning",
  AGM: "default",
};

const STATUS_VARIANT: Record<EventStatus, "info" | "success" | "default"> = {
  Upcoming: "info",
  "In Progress": "success",
  Completed: "default",
};

/* ------------------------------------------------------------------ */
/*  Calendar helper                                                    */
/* ------------------------------------------------------------------ */

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

// Event days in April 2026
const EVENT_DAYS = [4, 11, 18, 25];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EventsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [calMonth, setCalMonth] = useState(3); // April = 3 (0-indexed)
  const [calYear] = useState(2026);

  const days = getCalendarDays(calYear, calMonth);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Events</h2>
          <p className="text-sm text-gray-500">Manage club events, training sessions, and social activities</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Create Event form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Event Name" placeholder="Enter event name..." />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Date" type="date" />
              <Input label="Time" type="time" />
              <Input label="Location" placeholder="Venue name..." />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Type</label>
                <select className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
                  <option>Training</option>
                  <option>Social</option>
                  <option>Fundraiser</option>
                  <option>AGM</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">RSVP Required</label>
                <div className="flex h-10 items-center gap-3">
                  <button className="relative h-6 w-11 rounded-full bg-[#1D4ED8] transition-colors">
                    <span className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
                  </button>
                  <span className="text-sm text-gray-600">Yes</span>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                placeholder="Event description..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="accent" size="sm">Create Event</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{monthNames[calMonth]} {calYear}</CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setCalMonth((p) => Math.max(0, p - 1))}
                className="rounded p-1.5 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCalMonth((p) => Math.min(11, p + 1))}
                className="rounded p-1.5 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="pb-2 text-center text-xs font-semibold text-gray-400">{d}</div>
            ))}
            {days.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex h-10 items-center justify-center rounded-md text-sm",
                  day === null && "bg-transparent",
                  day !== null && "hover:bg-gray-50",
                  day !== null && EVENT_DAYS.includes(day) && calMonth === 3 && "font-bold text-[#1D4ED8]"
                )}
              >
                {day !== null && (
                  <div className="relative">
                    {day}
                    {EVENT_DAYS.includes(day) && calMonth === 3 && (
                      <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1D4ED8]" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#0B2545]">All Events</h3>
        <div className="space-y-3">
          {MOCK_EVENTS.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-[#0B2545]">{event.name}</h4>
                      <Badge variant={TYPE_VARIANT[event.type]}>{event.type}</Badge>
                      <Badge variant={STATUS_VARIANT[event.status]}>{event.status}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#0B2545]">
                        <Users className="h-4 w-4 text-gray-400" />
                        {event.rsvpCount}/{event.rsvpCapacity}
                      </div>
                      <p className="text-xs text-gray-400">RSVPs</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
