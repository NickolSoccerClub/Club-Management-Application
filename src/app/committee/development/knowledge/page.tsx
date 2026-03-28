"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  FileText,
  Brain,
  Eye,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  File,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type DocStatus = "Ready" | "Processing" | "Failed";

interface KBDocument {
  id: number;
  name: string;
  uploadDate: string;
  status: DocStatus;
  pageCount: number;
  chunksGenerated: number;
  fileSize: string;
  progress?: number; // 0-100, only for Processing status
}

const MOCK_DOCS: KBDocument[] = [
  { id: 1, name: "FFA Grassroots Coaching Manual", uploadDate: "2026-03-10", status: "Ready", pageCount: 124, chunksGenerated: 342, fileSize: "8.2 MB" },
  { id: 2, name: "Club Coaching Philosophy 2026", uploadDate: "2026-03-15", status: "Ready", pageCount: 18, chunksGenerated: 45, fileSize: "1.4 MB" },
  { id: 3, name: "Small-Sided Games Guide", uploadDate: "2026-03-18", status: "Ready", pageCount: 36, chunksGenerated: 98, fileSize: "3.1 MB" },
  { id: 4, name: "Goalkeeper Training Fundamentals", uploadDate: "2026-03-22", status: "Processing", pageCount: 52, chunksGenerated: 0, fileSize: "4.7 MB", progress: 65 },
  { id: 5, name: "Season Planning Template", uploadDate: "2026-03-25", status: "Failed", pageCount: 8, chunksGenerated: 0, fileSize: "0.9 MB" },
];

const STATUS_VARIANT: Record<DocStatus, "success" | "warning" | "danger"> = {
  Ready: "success",
  Processing: "warning",
  Failed: "danger",
};

const STATUS_ICON: Record<DocStatus, React.ElementType> = {
  Ready: CheckCircle,
  Processing: Loader2,
  Failed: XCircle,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KnowledgeBasePage() {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<KBDocument | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = () => {
    addToast("Document uploaded", "success");
  };

  const handleDeleteConfirm = () => {
    addToast("Document deleted", "success");
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Knowledge Base"
          subtitle="Documents uploaded here are processed and made available to Coach Niko AI"
        >
          <Button variant="accent" size="sm" disabled>
            <Upload className="mr-1.5 h-4 w-4" />
            Upload Document
          </Button>
        </PageHeader>
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
      <PageHeader
        title="Knowledge Base"
        subtitle="Documents uploaded here are processed and made available to Coach Niko AI"
      >
        <Button variant="accent" size="sm" onClick={handleUpload}>
          <Upload className="mr-1.5 h-4 w-4" />
          Upload Document
        </Button>
      </PageHeader>

      {/* Upload Area */}
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          dragOver
            ? "border-[#1D4ED8] bg-blue-50/50"
            : "border-gray-300 bg-gray-50/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Upload className="h-6 w-6 text-[#1D4ED8]" />
        </div>
        <p className="mt-3 text-sm font-medium text-[#0B2545]">
          Drag and drop PDF files here
        </p>
        <p className="mt-1 text-xs text-gray-500">
          or click &ldquo;Upload Document&rdquo; to browse
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Supports PDF files up to 50MB
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-[#1D4ED8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">
                {MOCK_DOCS.filter((d) => d.status === "Ready").length}
              </p>
              <p className="text-sm text-gray-500">Documents Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Brain className="h-5 w-5 text-[#15803D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">
                {MOCK_DOCS.reduce((sum, d) => sum + d.chunksGenerated, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Chunks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Loader2 className="h-5 w-5 text-[#B45309]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">
                {MOCK_DOCS.filter((d) => d.status === "Processing").length}
              </p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#0B2545]">Uploaded Documents</h3>
        {MOCK_DOCS.map((doc) => {
          const StatusIcon = STATUS_ICON[doc.status];
          return (
            <Card key={doc.id} className={cn(
              doc.status === "Processing" && "border-[#B45309]/30",
              doc.status === "Failed" && "border-[#B91C1C]/30"
            )}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <File className="h-5 w-5 text-red-500" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#0B2545] truncate">{doc.name}</p>
                    <Badge variant={STATUS_VARIANT[doc.status]}>
                      <StatusIcon className={cn(
                        "mr-1 h-3 w-3",
                        doc.status === "Processing" && "animate-spin"
                      )} />
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Uploaded: {doc.uploadDate}</span>
                    <span>{doc.pageCount} pages</span>
                    <span>{doc.fileSize}</span>
                    {doc.status === "Ready" && (
                      <span className="text-[#15803D]">{doc.chunksGenerated} chunks</span>
                    )}
                  </div>

                  {/* Processing bar */}
                  {doc.status === "Processing" && doc.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-[#B45309]">
                        <span>Processing document...</span>
                        <span>{doc.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[#B45309] transition-all duration-1000"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" size="sm">
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(doc)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
