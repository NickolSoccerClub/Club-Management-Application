"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Clock,
  CheckCircle2,
  Image,
  Eye,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type PostStatus = "Published" | "Draft" | "Scheduled";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  status: PostStatus;
  publishedDate: string;
  author: string;
  thumbnail: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1, title: "Season 2026 Registration Now Open",
    excerpt: "Register your child for the upcoming 2026 season. Early bird discounts available until 15 April.",
    status: "Published", publishedDate: "20 Mar 2026", author: "Sarah Mitchell",
    thumbnail: "from-blue-400 to-blue-600",
  },
  {
    id: 2, title: "New U7 Mini Roos Program Announced",
    excerpt: "Exciting new program for our youngest players. Fun, skills-based training every Saturday morning.",
    status: "Published", publishedDate: "18 Mar 2026", author: "Mark Davies",
    thumbnail: "from-green-400 to-green-600",
  },
  {
    id: 3, title: "Coach Accreditation Weekend - April 11-12",
    excerpt: "FFA Community Coaching course available for all interested parents and volunteers.",
    status: "Scheduled", publishedDate: "01 Apr 2026", author: "David Chen",
    thumbnail: "from-purple-400 to-purple-600",
  },
  {
    id: 4, title: "Nickol SC Awarded Shire Development Grant",
    excerpt: "We are thrilled to announce a $5,000 grant from the Shire of Roebourne for youth sport development.",
    status: "Published", publishedDate: "15 Mar 2026", author: "Karen Williams",
    thumbnail: "from-amber-400 to-amber-600",
  },
  {
    id: 5, title: "Uniform Collection Day - Saturday 28 March",
    excerpt: "Collect your team uniforms at the clubhouse between 9am and 12pm. Bring your registration receipt.",
    status: "Draft", publishedDate: "", author: "Lisa Thompson",
    thumbnail: "from-red-400 to-red-600",
  },
  {
    id: 6, title: "End of Season Presentation Night Save the Date",
    excerpt: "Mark your calendars for the annual awards presentation. More details to follow.",
    status: "Draft", publishedDate: "", author: "Peter Reynolds",
    thumbnail: "from-teal-400 to-teal-600",
  },
];

const STATUS_VARIANT: Record<PostStatus, "success" | "default" | "info"> = {
  Published: "success",
  Draft: "default",
  Scheduled: "info",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NewsManagementPage() {
  const [showEditor, setShowEditor] = useState(false);

  const stats = {
    published: MOCK_POSTS.filter((p) => p.status === "Published").length,
    drafts: MOCK_POSTS.filter((p) => p.status === "Draft").length,
    scheduled: MOCK_POSTS.filter((p) => p.status === "Scheduled").length,
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className={cn("h-32 w-full shrink-0 bg-gradient-to-br sm:h-auto sm:w-40", post.thumbnail)} />
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#0B2545] line-clamp-1">{post.title}</h3>
            <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="text-xs text-gray-400">
              {post.publishedDate ? (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.publishedDate}
                </span>
              ) : (
                <span>Not published</span>
              )}
              <span className="ml-2">by {post.author}</span>
            </div>
            <div className="flex gap-1">
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]">
                <Eye className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-[#B91C1C]">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">News &amp; Updates</h2>
          <p className="text-sm text-gray-500">Create and manage club news posts</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowEditor(!showEditor)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Published", value: stats.published, icon: CheckCircle2, color: "#15803D", bg: "#F0FDF4" },
          { label: "Drafts", value: stats.drafts, icon: FileText, color: "#6B7280", bg: "#F3F4F6" },
          { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "#1D4ED8", bg: "#EFF6FF" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: s.bg }}>
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-[#0B2545]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Editor */}
      {showEditor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Title" placeholder="Enter post title..." />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                placeholder="Brief summary for previews..."
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Content</label>
              <textarea
                placeholder="Write your post content here..."
                rows={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
                <div className="text-center">
                  <Image className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Scheduled</option>
                </select>
              </div>
              <Input label="Publish Date" type="date" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowEditor(false)}>Cancel</Button>
              <Button variant="secondary" size="sm">Save Draft</Button>
              <Button variant="accent" size="sm">Publish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs & post list */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts ({MOCK_POSTS.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({stats.drafts})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({stats.scheduled})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4 mt-4">
            {MOCK_POSTS.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <div className="space-y-4 mt-4">
            {MOCK_POSTS.filter((p) => p.status === "Published").map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="space-y-4 mt-4">
            {MOCK_POSTS.filter((p) => p.status === "Draft").map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4 mt-4">
            {MOCK_POSTS.filter((p) => p.status === "Scheduled").map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
