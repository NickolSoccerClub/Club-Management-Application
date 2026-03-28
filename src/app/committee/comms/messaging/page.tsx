"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
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
/*  Zod validation schema                                              */
/* ------------------------------------------------------------------ */

const composeSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

/* ------------------------------------------------------------------ */
/*  Recipient options                                                  */
/* ------------------------------------------------------------------ */

const RECIPIENT_OPTIONS = [
  { label: "All Parents", value: "all-parents" },
  { label: "All Coaches", value: "all-coaches" },
  { label: "Nickol Thunder (U7)", value: "team-thunder" },
  { label: "Nickol Lightning (U7)", value: "team-lightning" },
  { label: "Nickol Storm (U9A)", value: "team-storm" },
  { label: "Nickol Blaze (U9B)", value: "team-blaze" },
  { label: "Nickol Titans (U11)", value: "team-titans" },
  { label: "Nickol Hawks (U13)", value: "team-hawks" },
  { label: "Nickol Eagles (U15)", value: "team-eagles" },
  { label: "Nickol Wolves (U17)", value: "team-wolves" },
  { label: "Individual (Search)", value: "individual" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MessagingPage() {
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [recipientType, setRecipientType] = useState("all-parents");
  const [channels, setChannels] = useState<Set<Channel>>(new Set(["Email"]));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [confirmScheduleOpen, setConfirmScheduleOpen] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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

  const validateForm = () => {
    const result = composeSchema.safeParse({ subject, body });
    if (!result.success) {
      const fieldErrors: { subject?: string; body?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "subject" | "body";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendClick = () => {
    if (!validateForm()) return;
    setConfirmSendOpen(true);
  };

  const handleScheduleClick = () => {
    if (!validateForm()) return;
    setConfirmScheduleOpen(true);
  };

  const handleConfirmSend = () => {
    addToast("Message sent", "success");
    setSubject("");
    setBody("");
    setShowCompose(false);
  };

  const handleConfirmSchedule = () => {
    addToast("Message scheduled", "success");
    setSubject("");
    setBody("");
    setShowCompose(false);
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Messaging"
          subtitle="Send announcements and messages to parents, coaches, and teams"
        />
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Messaging"
        subtitle="Send announcements and messages to parents, coaches, and teams"
      >
        <Button variant="accent" size="sm" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Message
        </Button>
      </PageHeader>

      {/* Compose form */}
      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Recipients"
              options={RECIPIENT_OPTIONS}
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
            />

            {recipientType === "individual" && (
              <Input label="Search Recipient" placeholder="Type name or email..." />
            )}

            <Input
              label="Subject"
              placeholder="Message subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={errors.subject}
            />

            <Textarea
              label="Message"
              placeholder="Type your message here..."
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              error={errors.body}
            />

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
              <Button variant="secondary" size="sm" onClick={handleScheduleClick}>
                Schedule
              </Button>
              <Button variant="accent" size="sm" onClick={handleSendClick}>
                <Send className="mr-1.5 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm send dialog */}
      <ConfirmDialog
        open={confirmSendOpen}
        onOpenChange={setConfirmSendOpen}
        onConfirm={handleConfirmSend}
        title="Send Message"
        description="Are you sure you want to send this message now? This action cannot be undone."
        variant="primary"
        confirmLabel="Send"
      />

      {/* Confirm schedule dialog */}
      <ConfirmDialog
        open={confirmScheduleOpen}
        onOpenChange={setConfirmScheduleOpen}
        onConfirm={handleConfirmSchedule}
        title="Schedule Message"
        description="Are you sure you want to schedule this message for later delivery?"
        variant="primary"
        confirmLabel="Schedule"
      />

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
