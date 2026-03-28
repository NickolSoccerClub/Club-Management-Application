"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type Priority = "High" | "Medium" | "Low";
type ActionStatus = "To Do" | "In Progress" | "Completed";

interface ActionItem {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  assignedInitials: string;
  dueDate: string;
  priority: Priority;
  source: string;
  status: ActionStatus;
  overdue: boolean;
}

const MOCK_ACTIONS: ActionItem[] = [
  { id: 1, title: "Submit ground allocation form to council", description: "Complete and lodge the 2026 season ground allocation request form with the City of Karratha.", assignedTo: "John Henderson", assignedInitials: "JH", dueDate: "2026-03-20", priority: "High", source: "March Meeting", status: "To Do", overdue: true },
  { id: 2, title: "Confirm coaching workshop venue", description: "Book venue for April coaching workshop. Check availability at community centre.", assignedTo: "Sarah Mitchell", assignedInitials: "SM", dueDate: "2026-04-01", priority: "High", source: "March Meeting", status: "To Do", overdue: false },
  { id: 3, title: "Draft sponsorship proposal for BHP", description: "Prepare a sponsorship package proposal for BHP including tiered options.", assignedTo: "Lisa Patel", assignedInitials: "LP", dueDate: "2026-04-15", priority: "Medium", source: "March Meeting", status: "To Do", overdue: false },
  { id: 4, title: "Order new training bibs", description: "Red bibs need replacing. Get quotes from 3 suppliers for 20 bibs.", assignedTo: "David Kim", assignedInitials: "DK", dueDate: "2026-03-25", priority: "Low", source: "March Meeting", status: "To Do", overdue: true },
  { id: 5, title: "Update website with 2026 season info", description: "Add registration details, season dates, and team information to the club website.", assignedTo: "Peter Wright", assignedInitials: "PW", dueDate: "2026-04-05", priority: "High", source: "February Meeting", status: "In Progress", overdue: false },
  { id: 6, title: "Finalise team allocations", description: "Complete player-to-team allocations based on registration numbers and age groups.", assignedTo: "David Kim", assignedInitials: "DK", dueDate: "2026-03-28", priority: "High", source: "March Meeting", status: "In Progress", overdue: false },
  { id: 7, title: "Arrange first aid training", description: "Organise St John first aid refresher for all coaches before season start.", assignedTo: "Sarah Mitchell", assignedInitials: "SM", dueDate: "2026-04-10", priority: "Medium", source: "February Meeting", status: "In Progress", overdue: false },
  { id: 8, title: "Review insurance policy renewal", description: "Compare current policy with alternatives. Ensure adequate public liability coverage.", assignedTo: "Rebecca Clarke", assignedInitials: "RC", dueDate: "2026-03-30", priority: "Medium", source: "January Meeting", status: "In Progress", overdue: false },
  { id: 9, title: "Send welcome email to new registrations", description: "Draft and send welcome email pack to all newly registered players and families.", assignedTo: "Peter Wright", assignedInitials: "PW", dueDate: "2026-03-10", priority: "Medium", source: "February Meeting", status: "Completed", overdue: false },
  { id: 10, title: "Lodge 2026 budget with state body", description: "Submit the approved 2026 operating budget to Football West.", assignedTo: "Rebecca Clarke", assignedInitials: "RC", dueDate: "2026-02-28", priority: "High", source: "January Meeting", status: "Completed", overdue: false },
  { id: 11, title: "Complete WWCC audit for all coaches", description: "Verify all coaches have current Working With Children Checks on file.", assignedTo: "Sarah Mitchell", assignedInitials: "SM", dueDate: "2026-03-01", priority: "High", source: "January Meeting", status: "Completed", overdue: false },
  { id: 12, title: "Book photographer for season photos", description: "Arrange team and individual photos for the 2026 season.", assignedTo: "Peter Wright", assignedInitials: "PW", dueDate: "2026-03-15", priority: "Low", source: "February Meeting", status: "Completed", overdue: false },
];

const PRIORITY_VARIANT: Record<Priority, "danger" | "warning" | "default"> = {
  High: "danger",
  Medium: "warning",
  Low: "default",
};

const COLUMNS: ActionStatus[] = ["To Do", "In Progress", "Completed"];

const COLUMN_STYLE: Record<ActionStatus, { bg: string; icon: React.ElementType; color: string }> = {
  "To Do": { bg: "bg-gray-100", icon: Clock, color: "text-gray-600" },
  "In Progress": { bg: "bg-blue-50", icon: ArrowRight, color: "text-[#1D4ED8]" },
  "Completed": { bg: "bg-green-50", icon: CheckCircle2, color: "text-[#15803D]" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ActionsPage() {
  const [loading, setLoading] = useState(true);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [meetingFilter, setMeetingFilter] = useState("All");
  const [confirmAction, setConfirmAction] = useState<ActionItem | null>(null);
  const [confirmNewStatus, setConfirmNewStatus] = useState<ActionStatus | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const assignees = useMemo(() => {
    const names = [...new Set(MOCK_ACTIONS.map((a) => a.assignedTo))];
    return ["All", ...names.sort()];
  }, []);

  const meetings = useMemo(() => {
    const sources = [...new Set(MOCK_ACTIONS.map((a) => a.source))];
    return ["All", ...sources];
  }, []);

  const filtered = useMemo(() => {
    return MOCK_ACTIONS.filter((a) => {
      const matchAssignee = assigneeFilter === "All" || a.assignedTo === assigneeFilter;
      const matchPriority = priorityFilter === "All" || a.priority === priorityFilter;
      const matchMeeting = meetingFilter === "All" || a.source === meetingFilter;
      return matchAssignee && matchPriority && matchMeeting;
    });
  }, [assigneeFilter, priorityFilter, meetingFilter]);

  const handleStatusChange = (action: ActionItem, newStatus: ActionStatus) => {
    setConfirmAction(action);
    setConfirmNewStatus(newStatus);
  };

  const handleConfirmStatusChange = () => {
    if (confirmAction && confirmNewStatus) {
      addToast("Action updated", "success");
    }
    setConfirmAction(null);
    setConfirmNewStatus(null);
  };

  const handleAddAction = () => {
    addToast("Action created", "success");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Action Items">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 text-[#B91C1C]" />
            Loading...
          </div>
        </PageHeader>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Action Items">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4 text-[#B91C1C]" />
          {MOCK_ACTIONS.filter((a) => a.overdue && a.status !== "Completed").length} overdue
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            label="Assigned To"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            options={assignees.map((a) => ({ label: a, value: a }))}
            className="h-9"
          />
          <Select
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { label: "All", value: "All" },
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
            className="h-9"
          />
          <Select
            label="Meeting"
            value={meetingFilter}
            onChange={(e) => setMeetingFilter(e.target.value)}
            options={meetings.map((m) => ({ label: m, value: m }))}
            className="h-9"
          />
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const colItems = filtered.filter((a) => a.status === col);
          const style = COLUMN_STYLE[col];
          const Icon = style.icon;

          return (
            <div key={col} className="space-y-3">
              <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2", style.bg)}>
                <Icon className={cn("h-4 w-4", style.color)} />
                <h3 className={cn("text-sm font-semibold", style.color)}>
                  {col}
                </h3>
                <span className={cn(
                  "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                  style.bg,
                  style.color
                )}>
                  {colItems.length}
                </span>
              </div>

              <div className="space-y-2">
                {colItems.map((action) => (
                  <Card
                    key={action.id}
                    className={cn(
                      "overflow-hidden transition-shadow hover:shadow-md",
                      action.overdue && action.status !== "Completed" && "border-[#B91C1C] border-l-4"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-[#0B2545] leading-tight">
                          {action.title}
                        </h4>
                        <Badge variant={PRIORITY_VARIANT[action.priority]} className="shrink-0">
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
                        {action.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B2545] text-[9px] font-bold text-white">
                            {action.assignedInitials}
                          </div>
                          <span className="text-xs text-gray-500">{action.assignedTo.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className={cn(
                            "text-xs",
                            action.overdue && action.status !== "Completed"
                              ? "font-medium text-[#B91C1C]"
                              : "text-gray-500"
                          )}>
                            {action.dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{action.source}</span>
                        {action.status !== "Completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() =>
                              handleStatusChange(
                                action,
                                action.status === "To Do" ? "In Progress" : "Completed"
                              )
                            }
                          >
                            {action.status === "To Do" ? "Start" : "Complete"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {colItems.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-xs text-gray-400">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm status change dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
            setConfirmNewStatus(null);
          }
        }}
        onConfirm={handleConfirmStatusChange}
        title="Update Action Status"
        description={
          confirmAction
            ? `Move "${confirmAction.title}" to ${confirmNewStatus}?`
            : ""
        }
        variant="accent"
        confirmLabel="Confirm"
      />
    </div>
  );
}
