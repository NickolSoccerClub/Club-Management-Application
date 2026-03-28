"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Gift,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type GrantStatus = "Received" | "Approved" | "Submitted" | "In Progress" | "Identified" | "Rejected";

interface Grant {
  id: number;
  name: string;
  provider: string;
  amount: number;
  status: GrantStatus;
  deadline: string;
  submittedDate: string | null;
  purpose: string;
}

const MOCK_GRANTS: Grant[] = [
  { id: 1, name: "Youth Sport Development Grant", provider: "Shire of Roebourne", amount: 5000, status: "Received", deadline: "28 Feb 2026", submittedDate: "15 Jan 2026", purpose: "Equipment and coaching development" },
  { id: 2, name: "Community Sport Infrastructure", provider: "Dept. of Local Govt", amount: 15000, status: "Approved", deadline: "31 Jan 2026", submittedDate: "10 Jan 2026", purpose: "Ground lighting upgrade" },
  { id: 3, name: "Regional Sport Participation", provider: "Healthway", amount: 8000, status: "Submitted", deadline: "15 Apr 2026", submittedDate: "20 Mar 2026", purpose: "Increase female participation in U7-U11" },
  { id: 4, name: "KidSport Vouchers", provider: "Dept. of Communities", amount: 3600, status: "In Progress", deadline: "30 Jun 2026", submittedDate: null, purpose: "Registration subsidies for eligible families" },
  { id: 5, name: "Pilbara Community Fund", provider: "Pilbara Foundation", amount: 10000, status: "Identified", deadline: "31 May 2026", submittedDate: null, purpose: "Club development and volunteer training" },
  { id: 6, name: "Active Clubs Program", provider: "SportWest", amount: 2000, status: "Rejected", deadline: "01 Dec 2025", submittedDate: "15 Nov 2025", purpose: "Coaching accreditation subsidies" },
];

const STATUS_VARIANT: Record<GrantStatus, "success" | "info" | "warning" | "default" | "danger"> = {
  Received: "success",
  Approved: "success",
  Submitted: "info",
  "In Progress": "warning",
  Identified: "default",
  Rejected: "danger",
};

const STATUS_ICON: Record<GrantStatus, React.ElementType> = {
  Received: CheckCircle2,
  Approved: CheckCircle2,
  Submitted: Clock,
  "In Progress": FileText,
  Identified: Gift,
  Rejected: XCircle,
};

const PIPELINE_STAGES: GrantStatus[] = ["Identified", "In Progress", "Submitted", "Approved", "Received"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GrantsPage() {
  const [showForm, setShowForm] = useState(false);

  const totalReceived = MOCK_GRANTS.filter((g) => g.status === "Received").reduce((s, g) => s + g.amount, 0);
  const totalPipeline = MOCK_GRANTS.filter((g) => !["Received", "Rejected"].includes(g.status)).reduce((s, g) => s + g.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Grant Tracking</h2>
          <p className="text-sm text-gray-500">Track grant applications and funding opportunities</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Grant
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
            <DollarSign className="h-5 w-5 text-[#15803D]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Received</p>
            <p className="text-xl font-bold text-[#15803D]">${totalReceived.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <Gift className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">In Pipeline</p>
            <p className="text-xl font-bold text-[#1D4ED8]">${totalPipeline.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
            <Clock className="h-5 w-5 text-[#B45309]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Applications</p>
            <p className="text-xl font-bold text-[#0B2545]">{MOCK_GRANTS.length}</p>
          </div>
        </div>
      </div>

      {/* Pipeline view */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {PIPELINE_STAGES.map((stage, idx) => {
              const count = MOCK_GRANTS.filter((g) => g.status === stage).length;
              return (
                <React.Fragment key={stage}>
                  <div className={cn(
                    "flex shrink-0 flex-col items-center rounded-lg border p-3 text-center",
                    count > 0 ? "border-[#1D4ED8]/20 bg-[#1D4ED8]/5" : "border-gray-200 bg-gray-50"
                  )}>
                    <p className="text-xs font-medium text-gray-500">{stage}</p>
                    <p className="mt-1 text-2xl font-bold text-[#0B2545]">{count}</p>
                  </div>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Grant form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Add New Grant</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Grant Name" placeholder="Name of the grant program..." />
              <Input label="Provider" placeholder="Granting organisation..." />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Amount ($)" type="number" placeholder="0.00" />
              <Input label="Deadline" type="date" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
                  {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Purpose</label>
              <textarea
                rows={2}
                placeholder="What the grant will fund..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" size="sm">Save Grant</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grants list */}
      <div className="space-y-3">
        {MOCK_GRANTS.map((grant) => {
          const Icon = STATUS_ICON[grant.status];
          return (
            <Card key={grant.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-[#0B2545]">{grant.name}</h4>
                      <Badge variant={STATUS_VARIANT[grant.status]}>
                        <Icon className="mr-1 h-3 w-3" /> {grant.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{grant.provider}</p>
                    <p className="mt-1 text-sm text-gray-400">{grant.purpose}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Deadline: {grant.deadline}
                      </span>
                      {grant.submittedDate && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Submitted: {grant.submittedDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#0B2545]">${grant.amount.toLocaleString()}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs text-[#1D4ED8] hover:underline">
                      <ExternalLink className="h-3 w-3" /> View Details
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
