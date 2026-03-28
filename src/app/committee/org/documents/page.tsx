"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  Search,
  FileText,
  FolderOpen,
  Folder,
  Download,
  Eye,
  Trash2,
  ChevronRight,
  ChevronDown,
  File,
  FileSpreadsheet,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type FileType = "PDF" | "DOC" | "XLS";

interface Document {
  id: number;
  name: string;
  folder: string;
  type: FileType;
  uploadedBy: string;
  date: string;
  size: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: 1, name: "Club Constitution 2025.pdf", folder: "Policies", type: "PDF", uploadedBy: "Andrew Tran", date: "2025-11-15", size: "1.2 MB" },
  { id: 2, name: "Code of Conduct.pdf", folder: "Policies", type: "PDF", uploadedBy: "Andrew Tran", date: "2025-11-15", size: "0.8 MB" },
  { id: 3, name: "Privacy Policy.pdf", folder: "Policies", type: "PDF", uploadedBy: "Andrew Tran", date: "2025-11-10", size: "0.5 MB" },
  { id: 4, name: "March 2026 Minutes.docx", folder: "Meeting Minutes", type: "DOC", uploadedBy: "Andrew Tran", date: "2026-03-12", size: "0.3 MB" },
  { id: 5, name: "February 2026 Minutes.docx", folder: "Meeting Minutes", type: "DOC", uploadedBy: "Andrew Tran", date: "2026-02-12", size: "0.3 MB" },
  { id: 6, name: "January 2026 Minutes.docx", folder: "Meeting Minutes", type: "DOC", uploadedBy: "Andrew Tran", date: "2026-01-15", size: "0.4 MB" },
  { id: 7, name: "2026 Operating Budget.xlsx", folder: "Financial Reports", type: "XLS", uploadedBy: "Rebecca Clarke", date: "2026-01-10", size: "0.6 MB" },
  { id: 8, name: "2025 Financial Statement.pdf", folder: "Financial Reports", type: "PDF", uploadedBy: "Rebecca Clarke", date: "2025-12-15", size: "1.5 MB" },
  { id: 9, name: "FFA Grassroots Manual.pdf", folder: "Coaching Resources", type: "PDF", uploadedBy: "Sarah Mitchell", date: "2026-01-20", size: "8.2 MB" },
  { id: 10, name: "Coaching Philosophy 2026.pdf", folder: "Coaching Resources", type: "PDF", uploadedBy: "Sarah Mitchell", date: "2026-02-01", size: "1.4 MB" },
  { id: 11, name: "Session Plan Template.docx", folder: "Templates", type: "DOC", uploadedBy: "Sarah Mitchell", date: "2026-01-25", size: "0.2 MB" },
  { id: 12, name: "Registration Form Template.docx", folder: "Templates", type: "DOC", uploadedBy: "David Kim", date: "2025-12-10", size: "0.3 MB" },
  { id: 13, name: "Sponsorship Proposal Template.docx", folder: "Templates", type: "DOC", uploadedBy: "Lisa Patel", date: "2026-02-15", size: "0.4 MB" },
  { id: 14, name: "Equipment Audit Report.xlsx", folder: "Other", type: "XLS", uploadedBy: "David Kim", date: "2026-03-05", size: "0.3 MB" },
  { id: 15, name: "Insurance Certificate 2026.pdf", folder: "Other", type: "PDF", uploadedBy: "Rebecca Clarke", date: "2026-01-05", size: "0.9 MB" },
];

const FOLDERS = ["Policies", "Meeting Minutes", "Financial Reports", "Coaching Resources", "Templates", "Other"];

const FILE_ICON: Record<FileType, React.ElementType> = {
  PDF: File,
  DOC: FileText,
  XLS: FileSpreadsheet,
};

const FILE_COLOR: Record<FileType, string> = {
  PDF: "text-red-500 bg-red-50",
  DOC: "text-blue-500 bg-blue-50",
  XLS: "text-green-600 bg-green-50",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["Policies", "Meeting Minutes"])
  );
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  const allDocs = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return MOCK_DOCUMENTS;
    return MOCK_DOCUMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.folder.toLowerCase().includes(q)
    );
  }, [search]);

  const recentDocs = useMemo(() => {
    return [...MOCK_DOCUMENTS]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, []);

  const docsByFolder = useMemo(() => {
    const map: Record<string, Document[]> = {};
    FOLDERS.forEach((f) => { map[f] = []; });
    allDocs.forEach((d) => {
      if (map[d.folder]) map[d.folder].push(d);
    });
    return map;
  }, [allDocs]);

  const handleUpload = () => {
    addToast("Document uploaded", "success");
  };

  const handleConfirmDelete = () => {
    addToast("Document deleted", "success");
    setDeleteDoc(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Documents" subtitle={`${MOCK_DOCUMENTS.length} documents`}>
          <Button variant="accent" size="sm" onClick={handleUpload}>
            <Upload className="mr-1.5 h-4 w-4" />
            Upload Document
          </Button>
        </PageHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Documents" subtitle={`${MOCK_DOCUMENTS.length} documents`}>
        <Button variant="accent" size="sm" onClick={handleUpload}>
          <Upload className="mr-1.5 h-4 w-4" />
          Upload Document
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Recent Documents */}
      {!search && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
            <Clock className="h-4 w-4 text-gray-400" />
            Recent Documents
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentDocs.map((doc) => {
              const Icon = FILE_ICON[doc.type];
              return (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", FILE_COLOR[doc.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#0B2545] truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.date}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Folder Structure */}
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
          <FolderOpen className="h-4 w-4 text-[#1D4ED8]" />
          All Folders
        </h3>

        {FOLDERS.map((folder) => {
          const docs = docsByFolder[folder] || [];
          const isExpanded = expandedFolders.has(folder);

          return (
            <Card key={folder} className="overflow-hidden">
              <button
                onClick={() => toggleFolder(folder)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-5 w-5 text-[#1D4ED8]" />
                ) : (
                  <Folder className="h-5 w-5 text-[#B45309]" />
                )}
                <span className="text-sm font-medium text-[#0B2545]">{folder}</span>
                <Badge className="ml-auto">{docs.length}</Badge>
              </button>

              {isExpanded && docs.length > 0 && (
                <div className="border-t border-gray-100">
                  {docs.map((doc, idx) => {
                    const Icon = FILE_ICON[doc.type];
                    return (
                      <div
                        key={doc.id}
                        className={cn(
                          "flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center",
                          idx % 2 === 0 && "bg-gray-50/50"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded", FILE_COLOR[doc.type])}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#0B2545] truncate">{doc.name}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                              <span>{doc.uploadedBy}</span>
                              <span>{doc.date}</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0 pl-11 sm:pl-0">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[#B91C1C] hover:text-[#B91C1C] hover:bg-red-50"
                            onClick={() => setDeleteDoc(doc)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isExpanded && docs.length === 0 && (
                <div className="border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-400">
                  {search ? "No documents match your search in this folder." : "No documents in this folder."}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!deleteDoc}
        onOpenChange={(open) => {
          if (!open) setDeleteDoc(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description={
          deleteDoc
            ? `Are you sure you want to delete "${deleteDoc.name}"? This action cannot be undone.`
            : ""
        }
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
