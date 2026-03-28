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
  Send,
  Mail,
  Bell,
  MessageSquare,
  Users,
  Eye,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type MsgType = "Team Announcement" | "Individual" | "Bulk";
type Channel = "Email" | "Push" | "In-App";

interface SentMessage {
  id: number;
  recipients: string;
  subject: string;
  date: string;
  type: MsgType;
  channels: Channel[];
  sent: number;
  delivered: number;
  read: number;
}

const MOCK_MESSAGES: SentMessage[] = [
  {
    id: 1, recipients: "All Parents", subject: "Season 2026 Registration Reminder",
    date: "24 Mar 2026", type: "Bulk", channels: ["Email", "Push", "In-App"],
    sent: 156, delivered: 148, read: 102,
  },
  {
    id: 2, recipients: "Nickol Thunder (U7)", subject: "Training Time Change - Thursday",
    date: "22 Mar 2026", type: "Team Announcement", channels: ["Email", "Push"],
    sent: 14, delivered: 14, read: 11,
  },
  {
    id: 3, recipients: "All Coaches", subject: "Coach Meeting - Sunday 29 March",
    date: "20 Mar 2026", type: "Bulk", channels: ["Email", "In-App"],
    sent: 12, delivered: 12, read: 9,
  },
  {
    id: 4, recipients: "Mary Carter", subject: "RE: Liam's Medical Form",
    date: "19 Mar 2026", type: "Individual", channels: ["Email"],
    sent: 1, delivered: 1, read: 1,
  },
  {
    id: 5, recipients: "Nickol Eagles (U15)", subject: "Away Game Transport Arrangements",
    date: "17 Mar 2026", type: "Team Announcement", channels: ["Email", "Push", "In-App"],
    sent: 18, delivered: 17, read: 14,
  },
];

const TYPE_VARIANT: Record<MsgType, "info" | "default" | "success"> = {
  "Team Announcement": "info",
  Individual: "default",
  Bulk: "success",
};

const CHANNEL_ICON: Record<Channel, React.ElementType> = {
  Email: Mail,
  Push: Bell,
  "In-App": MessageSquare,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MessagingPage() {
  const [showCompose, setShowCompose] = useState(false);
  const [recipientType, setRecipientType] = useState("all-parents");
  const [channels, setChannels] = useState<Set<Channel>>(new Set(["Email"]));

  const toggleChannel = (ch: Channel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  };

  const filterByType = (type: MsgType | "all") =>
    type === "all" ? MOCK_MESSAGES : MOCK_MESSAGES.filter((m) => m.type === type);

  const MessageRow = ({ msg }: { msg: SentMessage }) => (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={TYPE_VARIANT[msg.type]}>{msg.type}</Badge>
          {msg.channels.map((ch) => {
            const Icon = CHANNEL_ICON[ch];
            return (
              <span key={ch} className="flex items-center gap-1 text-xs text-gray-400">
                <Icon className="h-3 w-3" /> {ch}
              </span>
            );
          })}
        </div>
        <p className="mt-1 font-medium text-[#0B2545]">{msg.subject}</p>
        <p className="text-sm text-gray-500">To: {msg.recipients} &middot; {msg.date}</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Send className="h-3 w-3" /> {msg.sent}
        </div>
        <div className="flex items-center gap-1 text-[#15803D]">
          <CheckCircle2 className="h-3 w-3" /> {msg.delivered}
        </div>
        <div className="flex items-center gap-1 text-[#1D4ED8]">
          <Eye className="h-3 w-3" /> {msg.read}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Messaging</h2>
          <p className="text-sm text-gray-500">Send announcements and messages to parents, coaches, and teams</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Compose form */}
      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Recipients</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              >
                <option value="all-parents">All Parents</option>
                <option value="all-coaches">All Coaches</option>
                <option value="team-thunder">Nickol Thunder (U7)</option>
                <option value="team-lightning">Nickol Lightning (U7)</option>
                <option value="team-storm">Nickol Storm (U9A)</option>
                <option value="team-blaze">Nickol Blaze (U9B)</option>
                <option value="team-titans">Nickol Titans (U11)</option>
                <option value="team-hawks">Nickol Hawks (U13)</option>
                <option value="team-eagles">Nickol Eagles (U15)</option>
                <option value="team-wolves">Nickol Wolves (U17)</option>
                <option value="individual">Individual (Search)</option>
              </select>
            </div>

            {recipientType === "individual" && (
              <Input label="Search Recipient" placeholder="Type name or email..." />
            )}

            <Input label="Subject" placeholder="Message subject..." />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
              <textarea
                placeholder="Type your message here..."
                rows={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Send via</label>
              <div className="flex flex-wrap gap-3">
                {(["Email", "Push", "In-App"] as Channel[]).map((ch) => {
                  const Icon = CHANNEL_ICON[ch];
                  const active = channels.has(ch);
                  return (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "border-[#1D4ED8] bg-[#1D4ED8]/5 text-[#1D4ED8]"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {ch === "Push" ? "Push Notification" : ch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
              <Button variant="accent" size="sm">
                <Send className="mr-1.5 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sent messages */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Messages ({MOCK_MESSAGES.length})</TabsTrigger>
          <TabsTrigger value="team">Team Announcements</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="bulk">Bulk</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="mt-4 space-y-3">
            {filterByType("all").map((msg) => <MessageRow key={msg.id} msg={msg} />)}
          </div>
        </TabsContent>
        <TabsContent value="team">
          <div className="mt-4 space-y-3">
            {filterByType("Team Announcement").map((msg) => <MessageRow key={msg.id} msg={msg} />)}
          </div>
        </TabsContent>
        <TabsContent value="individual">
          <div className="mt-4 space-y-3">
            {filterByType("Individual").map((msg) => <MessageRow key={msg.id} msg={msg} />)}
          </div>
        </TabsContent>
        <TabsContent value="bulk">
          <div className="mt-4 space-y-3">
            {filterByType("Bulk").map((msg) => <MessageRow key={msg.id} msg={msg} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
