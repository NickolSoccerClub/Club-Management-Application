"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Search,
  BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type DocStatus = "Ready" | "Processing" | "Failed";

type DocCategory =
  | "Coaching Manual"
  | "Drill Resource"
  | "Tactical Guide"
  | "Club Document"
  | "Age-Specific";

interface KBDocument {
  id: number;
  name: string;
  uploadDate: string;
  status: DocStatus;
  pageCount: number;
  chunksGenerated: number;
  fileSize: string;
  category: DocCategory;
  progress?: number; // 0-100, only for Processing status
}

const KNOWLEDGE_DOCS: KBDocument[] = [
  {
    id: 1,
    name: "FFA National Football Curriculum",
    uploadDate: "2025-11-02",
    status: "Ready",
    pageCount: 267,
    chunksGenerated: 892,
    fileSize: "18.4 MB",
    category: "Coaching Manual",
  },
  {
    id: 2,
    name: "The Soccer Coaching Bible",
    uploadDate: "2025-11-08",
    status: "Ready",
    pageCount: 384,
    chunksGenerated: 1024,
    fileSize: "24.1 MB",
    category: "Coaching Manual",
  },
  {
    id: 3,
    name: "Youth Soccer Drills - Jim Garland",
    uploadDate: "2025-11-15",
    status: "Ready",
    pageCount: 196,
    chunksGenerated: 534,
    fileSize: "12.7 MB",
    category: "Age-Specific",
  },
  {
    id: 4,
    name: "Basic Soccer Drills for Kids",
    uploadDate: "2025-12-01",
    status: "Ready",
    pageCount: 112,
    chunksGenerated: 298,
    fileSize: "7.3 MB",
    category: "Age-Specific",
  },
  {
    id: 5,
    name: "The Soccer Games & Drills Compendium - 350 Games",
    uploadDate: "2025-12-10",
    status: "Ready",
    pageCount: 448,
    chunksGenerated: 1456,
    fileSize: "31.2 MB",
    category: "Drill Resource",
  },
  {
    id: 6,
    name: "Skills & Strategies for Coaching Soccer",
    uploadDate: "2025-12-18",
    status: "Ready",
    pageCount: 224,
    chunksGenerated: 612,
    fileSize: "14.9 MB",
    category: "Coaching Manual",
  },
  {
    id: 7,
    name: "Coaches Handbook - Nickol SC",
    uploadDate: "2026-01-05",
    status: "Ready",
    pageCount: 86,
    chunksGenerated: 234,
    fileSize: "4.8 MB",
    category: "Club Document",
  },
  {
    id: 8,
    name: "Drill Creation Standards",
    uploadDate: "2026-01-12",
    status: "Ready",
    pageCount: 12,
    chunksGenerated: 28,
    fileSize: "0.9 MB",
    category: "Club Document",
  },
  {
    id: 9,
    name: "Soccer Passing & Ball Control - 84 Drills",
    uploadDate: "2026-01-20",
    status: "Ready",
    pageCount: 156,
    chunksGenerated: 423,
    fileSize: "10.6 MB",
    category: "Drill Resource",
  },
  {
    id: 10,
    name: "Small-Sided Games Guide",
    uploadDate: "2026-02-03",
    status: "Ready",
    pageCount: 92,
    chunksGenerated: 267,
    fileSize: "5.8 MB",
    category: "Drill Resource",
  },
  {
    id: 11,
    name: "Coaching the Modern 4-2-3-1",
    uploadDate: "2026-02-14",
    status: "Ready",
    pageCount: 178,
    chunksGenerated: 489,
    fileSize: "11.3 MB",
    category: "Tactical Guide",
  },
  {
    id: 12,
    name: "Soccer Goalkeeper Training",
    uploadDate: "2026-03-20",
    status: "Processing",
    pageCount: 164,
    chunksGenerated: 0,
    fileSize: "10.1 MB",
    category: "Drill Resource",
    progress: 72,
  },
  {
    id: 13,
    name: "Motivation in Grassroots Soccer",
    uploadDate: "2026-03-25",
    status: "Processing",
    pageCount: 88,
    chunksGenerated: 0,
    fileSize: "5.2 MB",
    category: "Coaching Manual",
    progress: 35,
  },
  {
    id: 14,
    name: "Corner Set Pieces & Formations",
    uploadDate: "2026-03-01",
    status: "Ready",
    pageCount: 74,
    chunksGenerated: 198,
    fileSize: "4.1 MB",
    category: "Tactical Guide",
  },
  {
    id: 15,
    name: "Complete Guide to Coaching Soccer Systems",
    uploadDate: "2026-03-08",
    status: "Ready",
    pageCount: 312,
    chunksGenerated: 856,
    fileSize: "19.7 MB",
    category: "Tactical Guide",
  },
];

const ALL_CATEGORIES: DocCategory[] = [
  "Coaching Manual",
  "Drill Resource",
  "Tactical Guide",
  "Club Document",
  "Age-Specific",
];

const CATEGORY_COLORS: Record<DocCategory, string> = {
  "Coaching Manual": "bg-blue-100 text-blue-700",
  "Drill Resource": "bg-green-100 text-green-700",
  "Tactical Guide": "bg-purple-100 text-purple-700",
  "Club Document": "bg-amber-100 text-amber-700",
  "Age-Specific": "bg-pink-100 text-pink-700",
};

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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DocCategory | null>(
    null
  );
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* Derived stats */
  const readyDocs = KNOWLEDGE_DOCS.filter((d) => d.status === "Ready");
  const totalChunks = KNOWLEDGE_DOCS.reduce(
    (sum, d) => sum + d.chunksGenerated,
    0
  );
  const processingDocs = KNOWLEDGE_DOCS.filter(
    (d) => d.status === "Processing"
  );

  /* Filtered list */
  const filteredDocs = useMemo(() => {
    return KNOWLEDGE_DOCS.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = activeCategory
        ? doc.category === activeCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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

      {/* AI Knowledge Summary Banner */}
      <Card className="border-[#1D4ED8]/20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8]/10">
            <Brain className="h-6 w-6 text-[#1D4ED8]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#0B2545]">
              Coach Niko AI Knowledge
            </h3>
            <p className="mt-0.5 text-sm text-gray-600">
              {readyDocs.length} documents processed,{" "}
              {totalChunks.toLocaleString()} total chunks available for
              AI-powered drill generation and coaching advice
            </p>
            <p className="mt-1 text-xs text-gray-500">
              These resources power Coach Niko&apos;s understanding of soccer
              coaching principles, drill design, and age-appropriate training
              methods.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-4 w-4 text-[#1D4ED8]" />
            <span className="text-sm font-medium text-[#1D4ED8]">
              {KNOWLEDGE_DOCS.length} Resources
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          dragOver
            ? "border-[#1D4ED8] bg-blue-50/50"
            : "border-gray-300 bg-gray-50/50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
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
                {readyDocs.length}
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
                {totalChunks.toLocaleString()}
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
                {processingDocs.length}
              </p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeCategory === null
                ? "bg-[#0B2545] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All ({KNOWLEDGE_DOCS.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = KNOWLEDGE_DOCS.filter(
              (d) => d.category === cat
            ).length;
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  activeCategory === cat
                    ? "bg-[#0B2545] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#0B2545]">
          Uploaded Documents
          {(search || activeCategory) && (
            <span className="ml-2 font-normal text-gray-400">
              ({filteredDocs.length} of {KNOWLEDGE_DOCS.length})
            </span>
          )}
        </h3>
        {filteredDocs.map((doc) => {
          const StatusIcon = STATUS_ICON[doc.status];
          return (
            <Card
              key={doc.id}
              className={cn(
                doc.status === "Processing" && "border-[#B45309]/30",
                doc.status === "Failed" && "border-[#B91C1C]/30"
              )}
            >
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <File className="h-5 w-5 text-red-500" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-[#0B2545] truncate">
                      {doc.name}
                    </p>
                    <Badge variant={STATUS_VARIANT[doc.status]}>
                      <StatusIcon
                        className={cn(
                          "mr-1 h-3 w-3",
                          doc.status === "Processing" && "animate-spin"
                        )}
                      />
                      {doc.status}
                    </Badge>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                        CATEGORY_COLORS[doc.category]
                      )}
                    >
                      {doc.category}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Uploaded: {doc.uploadDate}</span>
                    <span>{doc.pageCount} pages</span>
                    <span>{doc.fileSize}</span>
                    {doc.status === "Ready" && (
                      <span className="text-[#15803D]">
                        {doc.chunksGenerated.toLocaleString()} chunks
                      </span>
                    )}
                  </div>

                  {/* Processing bar */}
                  {doc.status === "Processing" &&
                    doc.progress !== undefined && (
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
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(doc)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredDocs.length === 0 && (
          <p className="py-12 text-center text-gray-400">
            No documents match your search.
          </p>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove it from Coach Niko's knowledge base. This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
