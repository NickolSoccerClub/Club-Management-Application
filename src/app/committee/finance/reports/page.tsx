"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BarChart3,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  Loader2,
  PieChart,
  TrendingUp,
  CalendarDays,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type ReportStatus = "Ready" | "Generating" | "Scheduled";
type ReportType = "Monthly Summary" | "Quarterly Review" | "Annual Report" | "Budget Variance" | "Sponsorship ROI" | "Custom";

interface Report {
  id: number;
  title: string;
  type: ReportType;
  period: string;
  generatedDate: string | null;
  status: ReportStatus;
  pages: number;
  aiInsights: number;
}

const MOCK_REPORTS: Report[] = [
  { id: 1, title: "March 2026 Financial Summary", type: "Monthly Summary", period: "March 2026", generatedDate: "27 Mar 2026", status: "Ready", pages: 4, aiInsights: 5 },
  { id: 2, title: "February 2026 Financial Summary", type: "Monthly Summary", period: "February 2026", generatedDate: "28 Feb 2026", status: "Ready", pages: 4, aiInsights: 3 },
  { id: 3, title: "Q1 2026 Quarterly Review", type: "Quarterly Review", period: "Q1 2026", generatedDate: null, status: "Scheduled", pages: 0, aiInsights: 0 },
  { id: 4, title: "January 2026 Financial Summary", type: "Monthly Summary", period: "January 2026", generatedDate: "31 Jan 2026", status: "Ready", pages: 3, aiInsights: 4 },
  { id: 5, title: "2025 Annual Financial Report", type: "Annual Report", period: "2025", generatedDate: "15 Jan 2026", status: "Ready", pages: 12, aiInsights: 8 },
  { id: 6, title: "Budget Variance Analysis - Season 2026", type: "Budget Variance", period: "YTD 2026", generatedDate: "20 Mar 2026", status: "Ready", pages: 6, aiInsights: 6 },
  { id: 7, title: "Sponsorship ROI Report 2025", type: "Sponsorship ROI", period: "2025", generatedDate: "10 Jan 2026", status: "Ready", pages: 5, aiInsights: 4 },
];

const TYPE_ICON: Record<ReportType, React.ElementType> = {
  "Monthly Summary": BarChart3,
  "Quarterly Review": PieChart,
  "Annual Report": FileText,
  "Budget Variance": TrendingUp,
  "Sponsorship ROI": TrendingUp,
  Custom: FileText,
};

const STATUS_VARIANT: Record<ReportStatus, "success" | "info" | "default"> = {
  Ready: "success",
  Generating: "info",
  Scheduled: "default",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Financial Reports</h2>
          <p className="text-sm text-gray-500">AI-generated financial reports and analysis</p>
        </div>
        <Button variant="accent" size="sm" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 h-4 w-4" /> Generate Report
            </>
          )}
        </Button>
      </div>

      {/* AI insights banner */}
      <div className="rounded-lg border border-[#1D4ED8]/20 bg-gradient-to-r from-[#1D4ED8]/5 to-[#0B2545]/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8]/10">
            <Sparkles className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0B2545]">AI Financial Insights</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                Registration income is tracking 12% ahead of the same period last season.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                Equipment spending is well within budget at 14% utilised.
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
                Insurance costs are 90% of annual budget already - review recommended.
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" />
                Projected net surplus of $6,500 by end of season based on current trends.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Generate new report area */}
      {generating && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1D4ED8]" />
            <p className="mt-4 font-medium text-[#0B2545]">Generating AI Financial Report...</p>
            <p className="mt-1 text-sm text-gray-500">Analysing transactions, budget data, and historical trends</p>
          </CardContent>
        </Card>
      )}

      {/* Quick generate buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Monthly Summary", icon: BarChart3, color: "#1D4ED8", bg: "#EFF6FF" },
          { label: "Budget Variance", icon: TrendingUp, color: "#15803D", bg: "#F0FDF4" },
          { label: "Sponsorship ROI", icon: PieChart, color: "#B45309", bg: "#FFFBEB" },
          { label: "Custom Report", icon: Sparkles, color: "#7C3AED", bg: "#F5F3FF" },
        ].map((r) => (
          <button
            key={r.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#1D4ED8]/30 hover:bg-blue-50/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: r.bg }}>
              <r.icon className="h-5 w-5" style={{ color: r.color }} />
            </div>
            <span className="text-xs font-medium text-[#0B2545]">{r.label}</span>
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#0B2545]">Report History</h3>
        <div className="space-y-3">
          {MOCK_REPORTS.map((report) => {
            const Icon = TYPE_ICON[report.type];
            return (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0B2545]">{report.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" /> {report.period}
                          </span>
                          {report.generatedDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Generated {report.generatedDate}
                            </span>
                          )}
                          {report.pages > 0 && (
                            <span>{report.pages} pages</span>
                          )}
                          {report.aiInsights > 0 && (
                            <span className="flex items-center gap-1 text-[#1D4ED8]">
                              <Sparkles className="h-3 w-3" /> {report.aiInsights} insights
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {report.status === "Ready" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-1 h-4 w-4" /> PDF
                          </Button>
                        </>
                      )}
                      {report.status === "Scheduled" && (
                        <Badge>Auto-generates 31 Mar</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
