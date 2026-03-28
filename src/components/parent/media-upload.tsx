"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Clock,
  CheckCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock recent uploads                                               */
/* ------------------------------------------------------------------ */

interface RecentUpload {
  id: string;
  thumbnail: string;
  caption: string;
  status: "pending" | "approved";
  date: string;
}

const MOCK_UPLOADS: RecentUpload[] = [
  {
    id: "u1",
    thumbnail: "",
    caption: "Great goal by the Thunder!",
    status: "pending",
    date: "25 Mar",
  },
  {
    id: "u2",
    thumbnail: "",
    caption: "Team photo before the match",
    status: "approved",
    date: "18 Mar",
  },
  {
    id: "u3",
    thumbnail: "",
    caption: "Half-time team huddle",
    status: "pending",
    date: "18 Mar",
  },
  {
    id: "u4",
    thumbnail: "",
    caption: "Post-match celebrations",
    status: "approved",
    date: "11 Mar",
  },
];

/* ------------------------------------------------------------------ */
/*  MediaUpload                                                       */
/* ------------------------------------------------------------------ */

export function MediaUpload() {
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);

  // Simulated file selection
  const handleAddFile = () => {
    setSelectedFiles((prev) => [
      ...prev,
      `photo_${prev.length + 1}.jpg`,
    ]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-4 w-4 text-[#1D4ED8]" />
            Share Your Match Day Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag & drop / tap area */}
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
              handleAddFile();
            }}
            onClick={handleAddFile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleAddFile();
            }}
          >
            <Upload
              className={cn(
                "mx-auto mb-3 h-10 w-10",
                isDragging ? "text-[#1D4ED8]" : "text-gray-400"
              )}
            />
            <p className="text-sm font-medium text-gray-600">
              Drag photos here or tap to select
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG up to 10MB each
            </p>
          </div>

          {/* Preview thumbnails */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="group relative h-20 w-20 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center"
                >
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                  <button
                    type="button"
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#B91C1C] text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(i);
                    }}
                    aria-label={`Remove ${file}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 truncate rounded-b-lg bg-black/50 px-1 py-0.5 text-[10px] text-white">
                    {file}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          <Input
            placeholder="Add a caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[44px]"
          />

          {/* Upload button */}
          <Button
            variant="accent"
            size="lg"
            className="w-full min-h-[48px]"
            disabled={selectedFiles.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </CardContent>
      </Card>

      {/* Recent uploads */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {MOCK_UPLOADS.map((upload) => (
              <div
                key={upload.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200"
              >
                {/* Thumbnail placeholder */}
                <div className="flex aspect-square items-center justify-center bg-gray-100">
                  <ImageIcon className="h-8 w-8 text-gray-300" />
                </div>

                {/* Status badge */}
                <div className="absolute left-1.5 top-1.5">
                  {upload.status === "pending" ? (
                    <Badge className="gap-1 bg-white/90 text-[#B45309] shadow-sm text-[10px]">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge className="gap-1 bg-white/90 text-[#15803D] shadow-sm text-[10px]">
                      <CheckCircle className="h-3 w-3" />
                      Approved
                    </Badge>
                  )}
                </div>

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                  <p className="text-xs text-white line-clamp-2">
                    {upload.caption}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/60">
                    {upload.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
