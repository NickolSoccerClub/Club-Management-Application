"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Link2Off,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  Calendar,
  Image,
  Trash2,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type PostStatus = "Scheduled" | "Posted" | "Failed";

interface SocialPost {
  id: number;
  content: string;
  hasImage: boolean;
  gradient: string;
  scheduledDate: string;
  platforms: ("Facebook" | "Instagram")[];
  status: PostStatus;
}

const MOCK_POSTS: SocialPost[] = [
  {
    id: 1, content: "Season 2026 registrations are OPEN! Head to our website to sign up your child for an amazing season of football.",
    hasImage: true, gradient: "from-blue-400 to-blue-600", scheduledDate: "28 Mar 2026 09:00",
    platforms: ["Facebook", "Instagram"], status: "Scheduled",
  },
  {
    id: 2, content: "UGC Winner of the Week: Amazing action shot from last weekend's training! Congrats to Liam C. for this epic capture.",
    hasImage: true, gradient: "from-amber-400 to-orange-600", scheduledDate: "27 Mar 2026 17:00",
    platforms: ["Facebook", "Instagram"], status: "Scheduled",
  },
  {
    id: 3, content: "Huge thanks to ABC Corp for their continued sponsorship of Nickol Soccer Club! Your support makes it all possible.",
    hasImage: true, gradient: "from-green-400 to-teal-600", scheduledDate: "25 Mar 2026 10:00",
    platforms: ["Facebook"], status: "Posted",
  },
  {
    id: 4, content: "Coach accreditation weekend coming up April 11-12. Interested in coaching? DM us or visit our website for details!",
    hasImage: false, gradient: "from-purple-400 to-violet-600", scheduledDate: "24 Mar 2026 12:00",
    platforms: ["Facebook", "Instagram"], status: "Posted",
  },
];

const STATUS_VARIANT: Record<PostStatus, "info" | "success" | "danger"> = {
  Scheduled: "info",
  Posted: "success",
  Failed: "danger",
};

const STATUS_ICON: Record<PostStatus, React.ElementType> = {
  Scheduled: Clock,
  Posted: CheckCircle2,
  Failed: XCircle,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SocialMediaPage() {
  const [ugcAutoPost, setUgcAutoPost] = useState(true);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  // Confirm dialog state
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; postId: number | null }>({ open: false, postId: null });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSchedule = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Scheduled" as PostStatus } : p))
    );
    addToast("Post scheduled", "success");
  };

  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    addToast("Post deleted", "success");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Social Media" subtitle="Manage connected accounts and scheduled posts">
          <Badge variant="success">2 Connected</Badge>
        </PageHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <div className="space-y-4">
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
      <PageHeader title="Social Media" subtitle="Manage connected accounts and scheduled posts">
        <Badge variant="success">2 Connected</Badge>
      </PageHeader>

      {/* Connected accounts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Facebook */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10">
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                </div>
                <div>
                  <p className="font-medium text-[#0B2545]">Facebook</p>
                  <p className="text-xs text-gray-500">Nickol Soccer Club</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Connected</Badge>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#B91C1C]">
                  <Link2Off className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E4405F]/10">
                  <Instagram className="h-5 w-5 text-[#E4405F]" />
                </div>
                <div>
                  <p className="font-medium text-[#0B2545]">Instagram</p>
                  <p className="text-xs text-gray-500">@nickolsc</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Connected</Badge>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#B91C1C]">
                  <Link2Off className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UGC Winner Automation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-[#B45309]" />
              UGC Winner Auto-Post
            </CardTitle>
            <button
              onClick={() => setUgcAutoPost(!ugcAutoPost)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                ugcAutoPost ? "bg-[#1D4ED8]" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  ugcAutoPost ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Automatically post UGC (User Generated Content) photo contest winners to connected social media accounts.
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Posting Schedule:</span>
              <Badge variant="info">Weekly - Fridays 5:00 PM</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled/Recent posts */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#0B2545]">Scheduled &amp; Recent Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => {
            const StatusIcon = STATUS_ICON[post.status];
            return (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {post.hasImage && (
                    <div className={cn("flex h-32 w-full shrink-0 items-center justify-center bg-gradient-to-br sm:h-auto sm:w-40", post.gradient)}>
                      <Image className="h-8 w-8 text-white/50" />
                    </div>
                  )}
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                      <Badge variant={STATUS_VARIANT[post.status]} className="shrink-0">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {post.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.scheduledDate}
                      </span>
                      <div className="flex gap-1">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium",
                              p === "Facebook" ? "bg-[#1877F2]/10 text-[#1877F2]" : "bg-[#E4405F]/10 text-[#E4405F]"
                            )}
                          >
                            {p === "Facebook" ? "FB" : "IG"}
                          </span>
                        ))}
                      </div>
                      <div className="ml-auto flex gap-1">
                        {post.status !== "Scheduled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-[#1D4ED8] hover:bg-[#1D4ED8]/10"
                            onClick={() => handleSchedule(post.id)}
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Schedule
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-[#B91C1C] hover:bg-[#B91C1C]/10"
                          onClick={() => setConfirmDelete({ open: true, postId: post.id })}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ open, postId: open ? confirmDelete.postId : null })}
        onConfirm={() => {
          if (confirmDelete.postId !== null) handleDelete(confirmDelete.postId);
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
