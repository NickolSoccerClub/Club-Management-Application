"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type MemberStatus = "Active" | "Outgoing" | "Vacant";

interface CommitteeMember {
  id: number;
  role: string;
  name: string | null;
  initials: string | null;
  email: string | null;
  phone: string | null;
  termStart: string | null;
  termEnd: string | null;
  status: MemberStatus;
  daysRemaining?: number;
}

const MOCK_MEMBERS: CommitteeMember[] = [
  { id: 1, role: "President", name: "John Henderson", initials: "JH", email: "president@nickolsc.com.au", phone: "0412 111 222", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 2, role: "Vice President", name: "Maria Santos", initials: "MS", email: "vp@nickolsc.com.au", phone: "0423 222 333", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 3, role: "Secretary", name: "Andrew Tran", initials: "AT", email: "secretary@nickolsc.com.au", phone: "0434 333 444", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 4, role: "Treasurer", name: "Rebecca Clarke", initials: "RC", email: "treasurer@nickolsc.com.au", phone: "0445 444 555", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Outgoing", daysRemaining: 42 },
  { id: 5, role: "Registrar", name: "David Kim", initials: "DK", email: "registrar@nickolsc.com.au", phone: "0456 555 666", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 6, role: "Development Officer", name: "Sarah Mitchell", initials: "SM", email: "development@nickolsc.com.au", phone: "0467 666 777", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 7, role: "Communications Officer", name: "Peter Wright", initials: "PW", email: "comms@nickolsc.com.au", phone: "0478 777 888", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Outgoing", daysRemaining: 18 },
  { id: 8, role: "Sponsorship Coordinator", name: "Lisa Patel", initials: "LP", email: "sponsorship@nickolsc.com.au", phone: "0489 888 999", termStart: "2025-11-01", termEnd: "2026-10-31", status: "Active" },
  { id: 9, role: "General Committee Member 1", name: null, initials: null, email: null, phone: null, termStart: null, termEnd: null, status: "Vacant" },
  { id: 10, role: "General Committee Member 2", name: null, initials: null, email: null, phone: null, termStart: null, termEnd: null, status: "Vacant" },
];

const STATUS_STYLE: Record<MemberStatus, string> = {
  Active: "border-l-[#15803D]",
  Outgoing: "border-l-[#B45309]",
  Vacant: "border-l-gray-300 bg-gray-50/50",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommitteeMembersPage() {
  const filled = MOCK_MEMBERS.filter((m) => m.status !== "Vacant").length;
  const total = MOCK_MEMBERS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Committee Members</h2>
          <p className="text-sm text-gray-500">
            2025-2026 Term &middot; {filled}/{total} positions filled
          </p>
        </div>
        <Button variant="accent" size="sm">
          <UserPlus className="mr-1.5 h-4 w-4" />
          Invite New Member
        </Button>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_MEMBERS.map((member) => (
          <Card
            key={member.id}
            className={cn(
              "overflow-hidden border-l-4",
              STATUS_STYLE[member.status]
            )}
          >
            <CardContent className="p-5">
              {/* Role + Status */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {member.role}
                </p>
                {member.status === "Active" && (
                  <Badge variant="success">Active</Badge>
                )}
                {member.status === "Outgoing" && (
                  <Badge variant="warning">
                    <Clock className="mr-1 h-3 w-3" />
                    {member.daysRemaining} days
                  </Badge>
                )}
                {member.status === "Vacant" && (
                  <Badge variant="danger">Vacant</Badge>
                )}
              </div>

              {member.name ? (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-sm font-bold text-white">
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#0B2545]">{member.name}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="text-xs">
                        {member.termStart} to {member.termEnd}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-col items-center justify-center py-6 text-gray-400">
                  <UserPlus className="mb-2 h-8 w-8" />
                  <p className="text-sm">Position vacant</p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Invite Member
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
