"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Download,
  ArrowRight,
} from "lucide-react";

interface ImportPlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportStep = "upload" | "preview" | "importing" | "complete";

export function ImportPlayersDialog({ open, onOpenChange }: ImportPlayersDialogProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleFileSelect = () => {
    // Simulate file selection
    setFileName("playfootball_export_2026_03_30.xlsx");
    setStep("preview");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setFileName("playfootball_export_2026_03_30.xlsx");
    setStep("preview");
  };

  const handleImport = async () => {
    setStep("importing");
    await new Promise((r) => setTimeout(r, 2000));
    setStep("complete");
  };

  const handleClose = () => {
    setStep("upload");
    setFileName(null);
    onOpenChange(false);
  };

  const handleComplete = () => {
    addToast("12 players imported successfully", "success");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
            <Upload className="h-4 w-4" />
          </div>
          Import Players
        </DialogTitle>
        <DialogDescription>
          Import player data from a PlayFootball export or CSV file.
        </DialogDescription>

        <div className="mt-4">
          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all ${
                  dragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <FileSpreadsheet className="h-7 w-7 text-blue-600" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0B2545]">
                  Drop your file here or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports .xlsx and .csv files from PlayFootball
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold text-[#0B2545] mb-2">File Requirements:</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    Excel (.xlsx) or CSV format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    First row must contain column headers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    Must include FFA Number for matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    Date of Birth in DD/MM/YYYY format
                  </li>
                </ul>
              </div>

              <button
                onClick={() => addToast("Template downloaded", "success")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Download Import Template
              </button>
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B2545] truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">12 rows detected • 11 columns matched</p>
                </div>
                <Badge variant="success">Ready</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-xs text-gray-500">New Players</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-xs text-gray-500">Updates</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">1</p>
                  <p className="text-xs text-gray-500">Conflicts</p>
                </div>
              </div>

              {/* Conflict preview */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-800">1 Conflict Found</p>
                </div>
                <p className="text-xs text-amber-700">
                  Liam Carter — guardian email differs from existing record. Import value will be used.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Column Mapping Preview</p>
                <div className="space-y-1 text-xs">
                  {["First Name → first_name", "Last Name → last_name", "Date of Birth → dob", "FFA Number → ffa_number", "Parent Email → guardian_email"].map((m) => (
                    <div key={m} className="flex items-center gap-2 text-gray-600">
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === "importing" && (
            <div className="flex flex-col items-center py-10">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="mt-4 text-sm font-semibold text-[#0B2545]">Importing players...</p>
              <p className="mt-1 text-xs text-gray-500">Processing 12 records</p>
              <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-2/3 rounded-full bg-blue-600 animate-pulse" />
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && (
            <div className="flex flex-col items-center py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="mt-4 text-lg font-bold text-[#0B2545]">Import Complete</p>
              <p className="mt-1 text-sm text-gray-500">
                8 new players added, 3 records updated, 1 conflict resolved
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-xs">
                <div className="rounded-lg bg-green-50 p-2 text-center">
                  <p className="text-lg font-bold text-green-600">8</p>
                  <p className="text-[10px] text-green-700">Added</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">3</p>
                  <p className="text-[10px] text-blue-700">Updated</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2 text-center">
                  <p className="text-lg font-bold text-amber-600">1</p>
                  <p className="text-[10px] text-amber-700">Resolved</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "upload" && (
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
          )}
          {step === "preview" && (
            <>
              <Button variant="secondary" size="sm" onClick={() => { setStep("upload"); setFileName(null); }}>
                Back
              </Button>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
              >
                <Upload className="h-4 w-4" />
                Import 12 Players
              </button>
            </>
          )}
          {step === "complete" && (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
            >
              Done
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
