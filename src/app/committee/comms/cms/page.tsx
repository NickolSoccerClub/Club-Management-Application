"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Image,
  Type,
  CalendarDays,
  Heart,
  LogIn,
  Handshake,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CMSSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  lastUpdated: string;
}

const CMS_SECTIONS: CMSSection[] = [
  { id: "hero", title: "Hero Content", description: "Main banner image, tagline, and call to action", icon: Image, lastUpdated: "20 Mar 2026" },
  { id: "season", title: "Season Phase Dates", description: "Planning, pre-season, and active season dates", icon: CalendarDays, lastUpdated: "15 Mar 2026" },
  { id: "sponsors", title: "Sponsors", description: "Sponsor logos and links displayed on the website", icon: Handshake, lastUpdated: "10 Mar 2026" },
  { id: "values", title: "Club Values", description: "Mission statement and core values content", icon: Heart, lastUpdated: "01 Mar 2026" },
  { id: "login", title: "Login Screen", description: "Customise login page background and messaging", icon: LogIn, lastUpdated: "28 Feb 2026" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WebsiteCMSPage() {
  const [previewMode, setPreviewMode] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("hero");
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (id: string) => setExpanded((p) => (p === id ? null : id));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Website Content Management"
          subtitle="Edit content displayed on the public-facing website"
        />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
        title="Website Content Management"
        subtitle="Edit content displayed on the public-facing website"
      >
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
            previewMode
              ? "border-[#1D4ED8] bg-[#1D4ED8]/5 text-[#1D4ED8]"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          )}
        >
          {previewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Preview Mode {previewMode ? "On" : "Off"}
        </button>
      </PageHeader>

      {/* CMS section cards */}
      <div className="space-y-4">
        {CMS_SECTIONS.map((section) => {
          const isExpanded = expanded === section.id;
          const Icon = section.icon;

          return (
            <Card key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
                    <Icon className="h-5 w-5 text-[#1D4ED8]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B2545]">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-gray-400 sm:inline">Updated {section.lastUpdated}</span>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <CardContent className="border-t border-gray-100 pt-6">
                  {/* Hero Content */}
                  {section.id === "hero" && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Hero Image</label>
                        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-[#0B2545] to-[#1D4ED8]">
                          <div className="text-center text-white/70">
                            <Image className="mx-auto h-10 w-10" />
                            <p className="mt-2 text-sm">Click to change hero image</p>
                            <p className="text-xs">Recommended: 1920x600px</p>
                          </div>
                        </div>
                      </div>
                      <Input label="Tagline" defaultValue="Where Pilbara kids kick goals on and off the field" />
                      <Input label="Call to Action Text" defaultValue="Register Now" />
                      <Input label="Call to Action Link" defaultValue="/register" />
                      <div className="flex justify-end">
                        <Button variant="accent" size="sm" onClick={() => addToast("Changes saved", "success")}>
                          <Save className="mr-1.5 h-4 w-4" /> Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Season Phase Dates */}
                  {section.id === "season" && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
                              <th className="pb-3 pr-4">Phase Name</th>
                              <th className="pb-3 pr-4">Start Date</th>
                              <th className="pb-3">End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { phase: "Planning", start: "2026-01-15", end: "2026-02-28" },
                              { phase: "Pre-Season", start: "2026-03-01", end: "2026-03-31" },
                              { phase: "Active Season", start: "2026-04-05", end: "2026-08-30" },
                            ].map((row) => (
                              <tr key={row.phase} className="border-b border-gray-100">
                                <td className="py-3 pr-4 font-medium text-[#0B2545]">{row.phase}</td>
                                <td className="py-3 pr-4">
                                  <input
                                    type="date"
                                    defaultValue={row.start}
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
                                  />
                                </td>
                                <td className="py-3">
                                  <input
                                    type="date"
                                    defaultValue={row.end}
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="accent" size="sm" onClick={() => addToast("Changes saved", "success")}>
                          <Save className="mr-1.5 h-4 w-4" /> Save Dates
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Sponsors */}
                  {section.id === "sponsors" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {["ABC Corp", "Pilbara Mining", "Karratha Auto", "Nickol Hardware"].map((sponsor) => (
                          <div key={sponsor} className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-400">
                              {sponsor.charAt(0)}
                            </div>
                            <p className="mt-2 text-sm font-medium text-[#0B2545]">{sponsor}</p>
                            <Badge variant="info" className="mt-1">Gold</Badge>
                          </div>
                        ))}
                        <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-400 hover:border-[#1D4ED8] hover:text-[#1D4ED8]">
                          <Type className="h-8 w-8" />
                          <p className="mt-2 text-sm font-medium">Add Sponsor</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Club Values */}
                  {section.id === "values" && (
                    <div className="space-y-4">
                      <Input label="Mission Statement" defaultValue="Developing young footballers and building community in the Pilbara" />
                      <Textarea
                        label="Core Values"
                        rows={4}
                        defaultValue={"Inclusivity - Everyone plays\nRespect - On and off the field\nDevelopment - Skills for life\nCommunity - Stronger together"}
                      />
                      <div className="flex justify-end">
                        <Button variant="accent" size="sm" onClick={() => addToast("Changes saved", "success")}>
                          <Save className="mr-1.5 h-4 w-4" /> Save Values
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Login Screen */}
                  {section.id === "login" && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Background Image</label>
                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <div className="text-center">
                            <Image className="mx-auto h-8 w-8 text-gray-300" />
                            <p className="mt-1 text-sm text-gray-400">Upload login background</p>
                          </div>
                        </div>
                      </div>
                      <Input label="Welcome Message" defaultValue="Welcome to Nickol Soccer Club" />
                      <Input label="Subtitle" defaultValue="Sign in to access your dashboard" />
                      <div className="flex justify-end">
                        <Button variant="accent" size="sm" onClick={() => addToast("Changes saved", "success")}>
                          <Save className="mr-1.5 h-4 w-4" /> Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
