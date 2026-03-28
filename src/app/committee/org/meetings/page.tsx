"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  ClipboardList,
  Loader2,
  Trash2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type AgendaStatus = "Draft" | "Final";
type MinutesStatus = "Draft" | "Approved";

interface AgendaItem {
  id: number;
  title: string;
  presenter: string;
  duration: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "upcoming" | "past";
  agendaStatus?: AgendaStatus;
  minutesStatus?: MinutesStatus;
  attendees: number;
  totalMembers: number;
  actionItems?: number;
  agenda: AgendaItem[];
  notes?: string;
}

const MOCK_MEETINGS: Meeting[] = [
  {
    id: 1, title: "April Committee Meeting", date: "2026-04-08", time: "7:00 PM", location: "Nickol Clubhouse",
    type: "upcoming", agendaStatus: "Draft", attendees: 0, totalMembers: 8,
    agenda: [
      { id: 1, title: "Welcome & Apologies", presenter: "President", duration: "5 min" },
      { id: 2, title: "Minutes of Previous Meeting", presenter: "Secretary", duration: "5 min" },
      { id: 3, title: "Treasurer's Report", presenter: "Treasurer", duration: "10 min" },
      { id: 4, title: "Season Registration Update", presenter: "Registrar", duration: "10 min" },
      { id: 5, title: "Coaching Workshop Planning", presenter: "Development Officer", duration: "15 min" },
      { id: 6, title: "Sponsorship Proposals", presenter: "Sponsorship Coordinator", duration: "10 min" },
      { id: 7, title: "General Business", presenter: "All", duration: "15 min" },
    ],
  },
  {
    id: 2, title: "Special Meeting - Season Launch", date: "2026-04-20", time: "6:00 PM", location: "Community Centre",
    type: "upcoming", agendaStatus: "Final", attendees: 0, totalMembers: 8,
    agenda: [
      { id: 1, title: "Season Launch Logistics", presenter: "President", duration: "15 min" },
      { id: 2, title: "Team Announcements", presenter: "Registrar", duration: "20 min" },
      { id: 3, title: "Coach Introductions", presenter: "Development Officer", duration: "15 min" },
    ],
  },
  {
    id: 3, title: "March Committee Meeting", date: "2026-03-11", time: "7:00 PM", location: "Nickol Clubhouse",
    type: "past", minutesStatus: "Approved", attendees: 7, totalMembers: 8, actionItems: 5,
    agenda: [
      { id: 1, title: "Welcome & Apologies", presenter: "President", duration: "5 min" },
      { id: 2, title: "February Minutes Approval", presenter: "Secretary", duration: "5 min" },
      { id: 3, title: "Financial Update", presenter: "Treasurer", duration: "10 min" },
      { id: 4, title: "Registration Progress", presenter: "Registrar", duration: "10 min" },
      { id: 5, title: "Ground Allocation", presenter: "President", duration: "15 min" },
    ],
    notes: "All action items from February have been completed. Ground allocation confirmed with council.",
  },
  {
    id: 4, title: "February Committee Meeting", date: "2026-02-11", time: "7:00 PM", location: "Nickol Clubhouse",
    type: "past", minutesStatus: "Approved", attendees: 8, totalMembers: 8, actionItems: 4,
    agenda: [
      { id: 1, title: "Welcome & Apologies", presenter: "President", duration: "5 min" },
      { id: 2, title: "January Minutes Approval", presenter: "Secretary", duration: "5 min" },
      { id: 3, title: "Pre-season Planning", presenter: "Development Officer", duration: "20 min" },
    ],
  },
  {
    id: 5, title: "January Committee Meeting", date: "2026-01-14", time: "7:00 PM", location: "Nickol Clubhouse",
    type: "past", minutesStatus: "Approved", attendees: 6, totalMembers: 8, actionItems: 6,
    agenda: [
      { id: 1, title: "Welcome & Year Ahead", presenter: "President", duration: "10 min" },
      { id: 2, title: "Budget Approval 2026", presenter: "Treasurer", duration: "20 min" },
    ],
  },
  {
    id: 6, title: "AGM & December Meeting", date: "2025-12-10", time: "6:00 PM", location: "Community Centre",
    type: "past", minutesStatus: "Draft", attendees: 8, totalMembers: 8, actionItems: 8,
    agenda: [
      { id: 1, title: "AGM Proceedings", presenter: "President", duration: "60 min" },
      { id: 2, title: "Committee Handover", presenter: "Secretary", duration: "30 min" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Meeting Card                                                       */
/* ------------------------------------------------------------------ */

function MeetingCard({
  meeting,
  onDelete,
  onFinalize,
  onApprove,
}: {
  meeting: Meeting;
  onDelete: (meeting: Meeting) => void;
  onFinalize: (meeting: Meeting) => void;
  onApprove: (meeting: Meeting) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const isUpcoming = meeting.type === "upcoming";

  const handleGenerateAI = () => {
    setAiLoading(true);
    setTimeout(() => setAiLoading(false), 1500);
  };

  return (
    <Card className={cn(isUpcoming && "border-[#1D4ED8]/30")}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#0B2545]">{meeting.title}</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {meeting.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {meeting.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {isUpcoming ? `${meeting.totalMembers} members` : `${meeting.attendees}/${meeting.totalMembers} attended`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUpcoming && meeting.agendaStatus && (
              <Badge variant={meeting.agendaStatus === "Final" ? "success" : "warning"}>
                Agenda: {meeting.agendaStatus}
              </Badge>
            )}
            {!isUpcoming && meeting.minutesStatus && (
              <Badge variant={meeting.minutesStatus === "Approved" ? "success" : "warning"}>
                Minutes: {meeting.minutesStatus}
              </Badge>
            )}
            {!isUpcoming && meeting.actionItems !== undefined && (
              <Badge variant="info">
                <CheckSquare className="mr-1 h-3 w-3" />
                {meeting.actionItems} actions
              </Badge>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          {isUpcoming ? (
            <>
              <Button variant="secondary" size="sm">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                View Agenda
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={aiLoading}
                onClick={handleGenerateAI}
              >
                {aiLoading ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#1D4ED8]" />
                )}
                {aiLoading ? "Generating..." : "Generate with AI"}
              </Button>
              {meeting.agendaStatus === "Draft" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onFinalize(meeting)}
                >
                  Finalize Agenda
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(meeting)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5 text-red-500" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                View Minutes
              </Button>
              {meeting.minutesStatus === "Draft" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onApprove(meeting)}
                >
                  Approve Minutes
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(meeting)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5 text-red-500" />
                Delete
              </Button>
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            {expanded ? "Hide Details" : "Show Details"}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Agenda Items
              </h4>
              <div className="space-y-1.5">
                {meeting.agenda.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-[#0B2545]">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.presenter}</span>
                      <Badge>{item.duration}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {meeting.notes && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Notes
                </h4>
                <p className="text-sm text-gray-600">{meeting.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MeetingsPage() {
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [pendingMeeting, setPendingMeeting] = useState<Meeting | null>(null);
  const [pendingAction, setPendingAction] = useState<"delete" | "finalize" | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const upcoming = MOCK_MEETINGS.filter((m) => m.type === "upcoming");
  const past = MOCK_MEETINGS.filter((m) => m.type === "past");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (meeting: Meeting) => {
    setPendingMeeting(meeting);
    setPendingAction("delete");
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    addToast("Meeting deleted", "success");
    setPendingMeeting(null);
    setPendingAction(null);
  };

  const handleFinalizeClick = (meeting: Meeting) => {
    setPendingMeeting(meeting);
    setPendingAction("finalize");
    setFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = () => {
    addToast("Agenda finalized", "success");
    setPendingMeeting(null);
    setPendingAction(null);
  };

  const handleApprove = () => {
    addToast("Minutes approved", "success");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Committee Meetings" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Committee Meetings">
        <Button variant="accent" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Schedule Meeting
        </Button>
      </PageHeader>

      {/* Upcoming */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
          <ClipboardList className="h-4 w-4 text-[#1D4ED8]" />
          Upcoming Meetings ({upcoming.length})
        </h3>
        <div className="space-y-3">
          {upcoming.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onDelete={handleDeleteClick}
              onFinalize={handleFinalizeClick}
              onApprove={handleApprove}
            />
          ))}
        </div>
      </div>

      {/* Past */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
          <FileText className="h-4 w-4 text-gray-400" />
          Past Meetings ({past.length})
        </h3>
        <div className="space-y-3">
          {past.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onDelete={handleDeleteClick}
              onFinalize={handleFinalizeClick}
              onApprove={handleApprove}
            />
          ))}
        </div>
      </div>

      {/* Confirm dialog for delete */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setPendingMeeting(null);
            setPendingAction(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Meeting"
        description={`Are you sure you want to delete "${pendingMeeting?.title ?? "this meeting"}"? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />

      {/* Confirm dialog for finalize agenda */}
      <ConfirmDialog
        open={finalizeDialogOpen}
        onOpenChange={(open) => {
          setFinalizeDialogOpen(open);
          if (!open) {
            setPendingMeeting(null);
            setPendingAction(null);
          }
        }}
        onConfirm={handleFinalizeConfirm}
        title="Finalize Agenda"
        description={`Are you sure you want to finalize the agenda for "${pendingMeeting?.title ?? "this meeting"}"? Once finalized, members will be notified.`}
        variant="danger"
        confirmLabel="Finalize"
      />
    </div>
  );
}
