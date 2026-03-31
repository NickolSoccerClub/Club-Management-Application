"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PreviousUpload {
  id: string;
  thumbnail: string;
  caption: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  event: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const EVENTS = [
  { id: "e1", label: "Saturday Match vs Baynton Bolts — 28 Mar" },
  { id: "e2", label: "Tuesday Training — 25 Mar" },
  { id: "e3", label: "Saturday Match vs Pegs Creek — 21 Mar" },
  { id: "e4", label: "Thursday Training — 20 Mar" },
  { id: "e5", label: "Gala Day — 15 Mar" },
];

const MOCK_UPLOADS: PreviousUpload[] = [
  {
    id: "u1",
    thumbnail: "",
    caption: "Emma celebrating her goal!",
    status: "approved",
    date: "28 Mar 2026",
    event: "Saturday Match vs Baynton Bolts",
  },
  {
    id: "u2",
    thumbnail: "",
    caption: "Team warm-up before kick off",
    status: "pending",
    date: "28 Mar 2026",
    event: "Saturday Match vs Baynton Bolts",
  },
  {
    id: "u3",
    thumbnail: "",
    caption: "Half-time team talk with Coach Sarah",
    status: "approved",
    date: "21 Mar 2026",
    event: "Saturday Match vs Pegs Creek",
  },
  {
    id: "u4",
    thumbnail: "",
    caption: "Dribbling drill at training",
    status: "rejected",
    date: "20 Mar 2026",
    event: "Thursday Training",
  },
  {
    id: "u5",
    thumbnail: "",
    caption: "Gala Day trophy ceremony",
    status: "approved",
    date: "15 Mar 2026",
    event: "Gala Day",
  },
];

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: PreviousUpload["status"] }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="danger" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ParentMediaPage() {
  const [loading, setLoading] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = () => {
    setSelectedFile("photo_upload.jpg");
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setCaption("");
    setSelectedEvent("");
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      addToast("Photo uploaded — pending moderation", "success");
      setSelectedFile(null);
      setCaption("");
      setSelectedEvent("");
      setSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---- Section 1: Upload Area ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Upload Photos
        </h2>
        <Card>
          <CardContent className="space-y-4 p-4">
            {/* Drag-and-drop zone */}
            {!selectedFile && (
              <div
                className={cn(
                  "rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                  isDragging
                    ? "border-[#1D4ED8] bg-blue-50/50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileSelect();
                }}
                onClick={handleFileSelect}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleFileSelect();
                }}
              >
                <Camera
                  className={cn(
                    "mx-auto mb-3 h-10 w-10",
                    isDragging ? "text-[#1D4ED8]" : "text-gray-400"
                  )}
                />
                <p className="text-sm font-medium text-gray-600">
                  Tap to upload or drag photos here
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG up to 10 MB — images only
                </p>
              </div>
            )}

            {/* ---- Section 2: Upload Form (when file selected) ---- */}
            {selectedFile && (
              <div className="space-y-4">
                {/* Preview thumbnail */}
                <div className="relative inline-block">
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                    <ImageIcon className="h-10 w-10 text-gray-300" />
                  </div>
                  <button
                    type="button"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#B91C1C] text-white shadow-sm min-h-[28px] min-w-[28px]"
                    onClick={handleClearFile}
                    aria-label="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="mt-1 block text-xs text-gray-500 truncate max-w-[112px]">
                    {selectedFile}
                  </span>
                </div>

                {/* Caption */}
                <Input
                  label="Caption"
                  placeholder="What's in this photo?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[44px]"
                />

                {/* Event selector */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Event
                  </label>
                  <div className="relative">
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="flex h-11 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1 min-h-[44px]"
                    >
                      <option value="">Select an event...</option>
                      {EVENTS.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full min-h-[48px]"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {submitting ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ---- Section 3: My Uploads ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          My Uploads
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {MOCK_UPLOADS.map((upload) => (
            <Card
              key={upload.id}
              className="overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative flex aspect-square items-center justify-center bg-gray-100">
                <ImageIcon className="h-8 w-8 text-gray-300" />

                {/* Status badge overlay */}
                <div className="absolute left-1.5 top-1.5">
                  <StatusBadge status={upload.status} />
                </div>
              </div>

              {/* Info */}
              <CardContent className="p-3">
                <p className="text-sm font-medium text-[#0B2545] line-clamp-2">
                  {upload.caption}
                </p>
                <p className="mt-1 text-xs text-gray-400">{upload.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Section 4: Photo Guidelines ---- */}
      <section>
        <Card className="border-[#1D4ED8]/20 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-4 w-4 text-[#1D4ED8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0B2545]">
                  Photo Guidelines
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                    All photos are reviewed by a club moderator before publishing.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                    Only upload photos where you have consent from all visible parents/guardians.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                    Photos must not include identifying information (school uniforms, addresses, etc).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                    Photos will only be shared according to each child&apos;s consent level set in Settings.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
