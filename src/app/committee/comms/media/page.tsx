"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type ModerationStatus = "Pending" | "Approved" | "Rejected";

interface Photo {
  id: number;
  gradient: string;
  uploader: string;
  date: string;
  caption: string;
  status: ModerationStatus;
}

const GRADIENTS = [
  "from-blue-400 to-indigo-600",
  "from-green-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
  "from-purple-400 to-violet-600",
  "from-cyan-400 to-blue-600",
  "from-red-400 to-pink-600",
  "from-emerald-400 to-green-600",
  "from-yellow-400 to-amber-600",
  "from-fuchsia-400 to-purple-600",
  "from-sky-400 to-cyan-600",
  "from-lime-400 to-emerald-600",
  "from-orange-400 to-red-600",
  "from-violet-400 to-indigo-600",
  "from-teal-400 to-green-600",
  "from-indigo-400 to-blue-600",
  "from-rose-400 to-pink-600",
  "from-blue-300 to-purple-600",
  "from-green-300 to-teal-500",
  "from-amber-300 to-orange-500",
];

const MOCK_PENDING: Photo[] = [
  { id: 1, gradient: GRADIENTS[0], uploader: "Sarah Mitchell", date: "26 Mar 2026", caption: "U7 Thunder training session", status: "Pending" },
  { id: 2, gradient: GRADIENTS[1], uploader: "Mark Davies", date: "26 Mar 2026", caption: "New training equipment setup", status: "Pending" },
  { id: 3, gradient: GRADIENTS[2], uploader: "David Chen", date: "25 Mar 2026", caption: "U9 Storm team photo", status: "Pending" },
  { id: 4, gradient: GRADIENTS[3], uploader: "Lisa Thompson", date: "25 Mar 2026", caption: "Ground preparation for season", status: "Pending" },
  { id: 5, gradient: GRADIENTS[4], uploader: "Karen Williams", date: "24 Mar 2026", caption: "U13 Hawks practice match highlights", status: "Pending" },
  { id: 6, gradient: GRADIENTS[5], uploader: "Peter Reynolds", date: "24 Mar 2026", caption: "Coaches meeting at clubhouse", status: "Pending" },
  { id: 7, gradient: GRADIENTS[6], uploader: "James Anderson", date: "23 Mar 2026", caption: "Nickol West Oval sunset", status: "Pending" },
  { id: 8, gradient: GRADIENTS[7], uploader: "Robert Nguyen", date: "23 Mar 2026", caption: "U11 Titans skills day", status: "Pending" },
];

const MOCK_APPROVED: Photo[] = Array.from({ length: 12 }, (_, i) => ({
  id: 100 + i,
  gradient: GRADIENTS[i % GRADIENTS.length],
  uploader: ["Sarah Mitchell", "Mark Davies", "David Chen", "Lisa Thompson", "Karen Williams", "Peter Reynolds"][i % 6],
  date: `${20 - i} Mar 2026`,
  caption: [
    "Season launch BBQ", "U7 Lightning first session", "Club banner at oval",
    "Pre-season fitness testing", "Sponsor board installation", "Volunteer appreciation day",
    "Kit day at clubhouse", "U15 Eagles vs Karratha", "Registration desk setup",
    "Goalpost maintenance", "Mini Roos skills zone", "Committee planning session",
  ][i],
  status: "Approved" as ModerationStatus,
}));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MediaGalleryPage() {
  const [pending, setPending] = useState(MOCK_PENDING);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  // Confirm dialog state
  const [confirmReject, setConfirmReject] = useState<{ open: boolean; photoId: number | null }>({ open: false, photoId: null });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; photoId: number | null }>({ open: false, photoId: null });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (id: number) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
    addToast("Photo approved", "success");
  };

  const handleReject = (id: number) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
    addToast("Photo rejected", "success");
  };

  const handleDelete = (id: number) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
    addToast("Photo deleted", "success");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Media Gallery">
          <Button variant="accent" size="sm" disabled>
            <ImageIcon className="mr-1.5 h-4 w-4" />
            Upload Photos
          </Button>
        </PageHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Media Gallery">
        {pending.length > 0 && (
          <Badge variant="warning">{pending.length} pending review</Badge>
        )}
        <Button variant="accent" size="sm">
          <ImageIcon className="mr-1.5 h-4 w-4" />
          Upload Photos
        </Button>
      </PageHeader>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">
            Moderation Queue ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({MOCK_APPROVED.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected (0)</TabsTrigger>
        </TabsList>

        {/* Moderation Queue */}
        <TabsContent value="queue">
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pending.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className={cn("h-40 w-full bg-gradient-to-br", photo.gradient)} />
                <div className="p-4">
                  <p className="text-sm font-medium text-[#0B2545] line-clamp-1">{photo.caption}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <User className="h-3 w-3" /> {photo.uploader}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" /> {photo.date}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 border border-[#15803D]/20 text-[#15803D] hover:bg-[#15803D]/10"
                      onClick={() => handleApprove(photo.id)}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 border border-[#B91C1C]/20 text-[#B91C1C] hover:bg-[#B91C1C]/10"
                      onClick={() => setConfirmReject({ open: true, photoId: photo.id })}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-[#B91C1C]/20 text-[#B91C1C] hover:bg-[#B91C1C]/10"
                      onClick={() => setConfirmDelete({ open: true, photoId: photo.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Clock className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-400">No photos awaiting moderation</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Approved */}
        <TabsContent value="approved">
          <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {MOCK_APPROVED.map((photo, idx) => {
              const heights = ["h-40", "h-52", "h-36", "h-48", "h-44", "h-56"];
              return (
                <div key={photo.id} className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div className={cn("w-full bg-gradient-to-br", photo.gradient, heights[idx % heights.length])} />
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#0B2545]">{photo.caption}</p>
                    <p className="mt-1 text-xs text-gray-400">{photo.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected">
          <div className="mt-4 py-12 text-center">
            <XCircle className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-400">No rejected photos</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reject Confirm Dialog */}
      <ConfirmDialog
        open={confirmReject.open}
        onOpenChange={(open) => setConfirmReject({ open, photoId: open ? confirmReject.photoId : null })}
        onConfirm={() => {
          if (confirmReject.photoId !== null) handleReject(confirmReject.photoId);
        }}
        title="Reject Photo"
        description="Are you sure you want to reject this photo? It will be removed from the moderation queue."
        variant="danger"
        confirmLabel="Reject"
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ open, photoId: open ? confirmDelete.photoId : null })}
        onConfirm={() => {
          if (confirmDelete.photoId !== null) handleDelete(confirmDelete.photoId);
        }}
        title="Delete Photo"
        description="Are you sure you want to permanently delete this photo? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
