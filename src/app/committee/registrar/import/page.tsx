"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface ColumnMap {
  source: string;
  target: string;
  matched: boolean;
}

const COLUMN_MAPPINGS: ColumnMap[] = [
  { source: "First Name", target: "first_name", matched: true },
  { source: "Last Name", target: "last_name", matched: true },
  { source: "Date of Birth", target: "dob", matched: true },
  { source: "FFA Number", target: "ffa_number", matched: true },
  { source: "Gender", target: "gender", matched: true },
  { source: "Parent/Guardian Name", target: "guardian_name", matched: true },
  { source: "Parent Email", target: "guardian_email", matched: true },
  { source: "Parent Phone", target: "guardian_phone", matched: true },
  { source: "Street Address", target: "address", matched: true },
  { source: "Suburb", target: "suburb", matched: true },
  { source: "Medical Conditions", target: "medical_notes", matched: true },
  { source: "Registration Type", target: "registration_type", matched: false },
];

interface ImportHistory {
  id: number;
  date: string;
  fileName: string;
  records: number;
  status: "Success" | "Partial" | "Failed";
}

const MOCK_HISTORY: ImportHistory[] = [
  { id: 1, date: "15 Mar 2026", fileName: "playfootball_export_2026_03_15.xlsx", records: 142, status: "Success" },
  { id: 2, date: "01 Mar 2026", fileName: "playfootball_export_2026_03_01.xlsx", records: 89, status: "Success" },
  { id: 3, date: "15 Feb 2026", fileName: "playfootball_export_2026_02_15.xlsx", records: 45, status: "Partial" },
  { id: 4, date: "01 Feb 2026", fileName: "pf_initial_import.xlsx", records: 0, status: "Failed" },
];

const HISTORY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Success: "success",
  Partial: "warning",
  Failed: "danger",
};

const STEPS = ["Upload File", "Map Columns", "Review", "Import"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImportCentrePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showConflicts, setShowConflicts] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0B2545]">Import Centre</h2>
        <p className="text-sm text-gray-500">
          Import player registration data from PlayFootball exports. Upload an .xlsx file to begin the reconciliation process.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step}>
            <button
              onClick={() => setActiveStep(idx)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                idx === activeStep
                  ? "bg-[#1D4ED8] text-white"
                  : idx < activeStep
                  ? "bg-[#15803D]/10 text-[#15803D]"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {idx < activeStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload */}
      {activeStep === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="rounded-lg border-2 border-dashed border-[#1D4ED8]/30 bg-blue-50/30 p-12 text-center">
              <FileSpreadsheet className="mx-auto h-14 w-14 text-[#1D4ED8]/40" />
              <p className="mt-4 text-lg font-medium text-[#0B2545]">
                Drop your PlayFootball export file here
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Accepts .xlsx files from PlayFootball data export
              </p>
              <Button variant="accent" size="md" className="mt-6">
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-[#0B2545]">Format Requirements:</p>
              <ul className="space-y-1 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  File must be in .xlsx format (Excel)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  First row must contain column headers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  Must include FFA Number for matching existing records
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  Date of Birth in DD/MM/YYYY format
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Column mapping */}
      {activeStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Column Mapping Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                    <th className="px-4 py-3">PlayFootball Column</th>
                    <th className="px-4 py-3 text-center">
                      <ArrowRight className="mx-auto h-4 w-4" />
                    </th>
                    <th className="px-4 py-3">System Column</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {COLUMN_MAPPINGS.map((col, idx) => (
                    <tr
                      key={col.source}
                      className={cn(
                        "border-t border-gray-100",
                        idx % 2 === 1 && "bg-[#F8FAFC]"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-[#0B2545]">{col.source}</td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        <ArrowRight className="mx-auto h-4 w-4" />
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">{col.target}</code>
                      </td>
                      <td className="px-4 py-3">
                        {col.matched ? (
                          <Badge variant="success">Auto-Matched</Badge>
                        ) : (
                          <Badge variant="warning">Needs Review</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-4 py-3">
              <Button variant="secondary" size="sm" onClick={() => setActiveStep(0)}>Back</Button>
              <Button variant="accent" size="sm" onClick={() => setActiveStep(2)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review / Reconciliation */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <CheckCircle2 className="h-5 w-5 text-[#15803D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Matched Records</p>
                <p className="text-2xl font-bold text-[#15803D]">118</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
                <UserPlus className="h-5 w-5 text-[#1D4ED8]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">New Records</p>
                <p className="text-2xl font-bold text-[#1D4ED8]">24</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
                <AlertTriangle className="h-5 w-5 text-[#B45309]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Conflicts</p>
                <p className="text-2xl font-bold text-[#B45309]">7</p>
              </div>
            </div>
          </div>

          {/* Conflicts expandable */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setShowConflicts(!showConflicts)}
                className="flex w-full items-center justify-between"
              >
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-[#B45309]" />
                  Conflict Details (7)
                </CardTitle>
                {showConflicts ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
            </CardHeader>
            {showConflicts && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3">Field</th>
                        <th className="px-4 py-3">Current Value</th>
                        <th className="px-4 py-3">Import Value</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { player: "Liam Carter", field: "guardian_email", current: "m.carter@email.com", imported: "mary.carter@newmail.com" },
                        { player: "Emma Nguyen", field: "address", current: "12 Smith St", imported: "45 Jones Rd" },
                        { player: "Oliver Smith", field: "guardian_phone", current: "0412 345 678", imported: "0423 456 789" },
                        { player: "Sophia Anderson", field: "medical_notes", current: "None", imported: "Asthma - carries inhaler" },
                        { player: "Lucas Thomas", field: "guardian_name", current: "Mark Thomas", imported: "Margaret Thomas" },
                        { player: "Henry White", field: "address", current: "8 Ocean Dr", imported: "22 Mountain Rd" },
                        { player: "Harper Harris", field: "guardian_email", current: "b.harris@email.com", imported: "beth.harris@work.com" },
                      ].map((c, idx) => (
                        <tr key={idx} className={cn("border-t border-gray-100", idx % 2 === 1 && "bg-[#F8FAFC]")}>
                          <td className="px-4 py-3 font-medium text-[#0B2545]">{c.player}</td>
                          <td className="px-4 py-3"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{c.field}</code></td>
                          <td className="px-4 py-3 text-gray-500">{c.current}</td>
                          <td className="px-4 py-3 font-medium text-[#B45309]">{c.imported}</td>
                          <td className="px-4 py-3">
                            <select className="rounded border border-gray-300 px-2 py-1 text-xs">
                              <option>Keep Current</option>
                              <option>Use Import</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setActiveStep(1)}>Back</Button>
            <Button variant="accent" size="sm" onClick={() => setActiveStep(3)}>Confirm &amp; Import</Button>
          </div>
        </div>
      )}

      {/* Step 4: Import complete */}
      {activeStep === 3 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-[#15803D]" />
            <h3 className="mt-4 text-lg font-bold text-[#0B2545]">Import Complete</h3>
            <p className="mt-2 text-sm text-gray-500">
              142 records processed: 118 updated, 24 new players added, 7 conflicts resolved.
            </p>
            <Button variant="accent" size="md" className="mt-6" onClick={() => setActiveStep(0)}>
              Start New Import
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Import history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-gray-400" />
            Import History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Records</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((h, idx) => (
                  <tr key={h.id} className={cn("border-t border-gray-100", idx % 2 === 1 && "bg-[#F8FAFC]")}>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{h.date}</td>
                    <td className="px-4 py-3 font-medium text-[#0B2545]">
                      <FileSpreadsheet className="mr-1.5 inline h-4 w-4 text-gray-400" />
                      {h.fileName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{h.records}</td>
                    <td className="px-4 py-3"><Badge variant={HISTORY_VARIANT[h.status]}>{h.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
