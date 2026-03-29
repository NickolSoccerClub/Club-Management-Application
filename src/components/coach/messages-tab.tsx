"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Send,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Eye,
  ToggleLeft,
  ToggleRight,
  Clock,
  CheckCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Announcement {
  id: string;
  sender: string;
  date: string;
  message: string;
  readCount: number;
  totalRecipients: number;
}

interface ThreadMessage {
  id: string;
  sender: "coach" | "parent";
  senderName: string;
  message: string;
  date: string;
  time: string;
}

interface ParentMessage {
  id: string;
  parentName: string;
  childName: string;
  lastMessage: string;
  date: string;
  unread: boolean;
  thread: ThreadMessage[];
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    sender: "Coach Josh",
    date: "27 Mar 2026",
    message: "Great effort from everyone at training today! Remember to bring shin pads to Saturday's match. Kick-off at 9 AM sharp.",
    readCount: 11,
    totalRecipients: 14,
  },
  {
    id: "a2",
    sender: "Coach Josh",
    date: "25 Mar 2026",
    message: "Training this Thursday is cancelled due to ground maintenance. We'll make up for it next week with an extended session.",
    readCount: 14,
    totalRecipients: 14,
  },
  {
    id: "a3",
    sender: "Coach Josh",
    date: "22 Mar 2026",
    message: "Well done on the 3-1 win against Wickham Warriors! Player of the match goes to Noah Williams for a brilliant two-goal performance.",
    readCount: 13,
    totalRecipients: 14,
  },
  {
    id: "a4",
    sender: "Coach Josh",
    date: "18 Mar 2026",
    message: "Reminder: team photos are being taken next Saturday before the match. Please arrive 30 minutes early in full kit.",
    readCount: 10,
    totalRecipients: 14,
  },
  {
    id: "a5",
    sender: "Coach Josh",
    date: "15 Mar 2026",
    message: "End-of-season presentation night will be held on 15 June at the Nickol clubhouse. Save the date! More details to follow.",
    readCount: 12,
    totalRecipients: 14,
  },
];

const PARENT_MESSAGES: ParentMessage[] = [
  {
    id: "pm1",
    parentName: "Sarah Johnson",
    childName: "Liam",
    lastMessage: "Hi Coach, Liam has a slight knee niggle. OK to train but will let you know if he needs to sit out any drills.",
    date: "26 Mar",
    unread: true,
    thread: [
      {
        id: "t1-1",
        sender: "parent",
        senderName: "Sarah Johnson",
        message: "Hi Coach, just wanted to let you know Liam's been complaining about his right knee after last week's match.",
        date: "24 Mar",
        time: "9:15 AM",
      },
      {
        id: "t1-2",
        sender: "coach",
        senderName: "Coach Josh",
        message: "Thanks for letting me know Sarah. Has he seen a physio? We can adjust his training load this week.",
        date: "24 Mar",
        time: "10:30 AM",
      },
      {
        id: "t1-3",
        sender: "parent",
        senderName: "Sarah Johnson",
        message: "Yes, physio said it's minor. Just needs to ease back in. He's keen to train though!",
        date: "25 Mar",
        time: "8:45 AM",
      },
      {
        id: "t1-4",
        sender: "parent",
        senderName: "Sarah Johnson",
        message: "Hi Coach, Liam has a slight knee niggle. OK to train but will let you know if he needs to sit out any drills.",
        date: "26 Mar",
        time: "7:30 AM",
      },
    ],
  },
  {
    id: "pm2",
    parentName: "Maria Martinez",
    childName: "Ava",
    lastMessage: "Thanks for the update. Ava loved the new passing drills! She's been practising in the backyard.",
    date: "24 Mar",
    unread: false,
    thread: [
      {
        id: "t2-1",
        sender: "coach",
        senderName: "Coach Josh",
        message: "Hi Maria, just wanted to say Ava did really well at training today. Her passing has improved a lot!",
        date: "23 Mar",
        time: "6:15 PM",
      },
      {
        id: "t2-2",
        sender: "parent",
        senderName: "Maria Martinez",
        message: "Thanks for the update. Ava loved the new passing drills! She's been practising in the backyard.",
        date: "24 Mar",
        time: "8:00 AM",
      },
    ],
  },
];

const MAX_CHARS = 500;

type RecipientOption = "team" | "parents" | "all";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MessagesTab() {
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [recipient, setRecipient] = React.useState<RecipientOption>("all");
  const [showParentMessages, setShowParentMessages] = React.useState(false);
  const [sentMessages, setSentMessages] = React.useState<Announcement[]>(ANNOUNCEMENTS);
  const [expandedThread, setExpandedThread] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const addToast = useToastStore((s) => s.addToast);

  const unreadCount = PARENT_MESSAGES.filter((m) => m.unread).length;

  /* Loading skeleton */
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const recipientLabel =
    recipient === "team"
      ? "Players Only"
      : recipient === "parents"
      ? "Parents Only"
      : "All (Players + Parents)";

  const handleSend = () => {
    if (!message.trim()) return;

    /* If sending to parents (all or parents-only), confirm first */
    if (recipient === "all" || recipient === "parents") {
      setConfirmOpen(true);
      return;
    }

    doSend();
  };

  const doSend = () => {
    const newMsg: Announcement = {
      id: `a${Date.now()}`,
      sender: "Coach Josh",
      date: new Date().toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      message: message.trim(),
      readCount: 0,
      totalRecipients: 14,
    };
    setSentMessages((prev) => [newMsg, ...prev]);
    setMessage("");
    addToast("Announcement Sent", "success");
  };

  const handleReply = (pmId: string) => {
    const text = replyText[pmId]?.trim();
    if (!text) return;
    setReplyText((prev) => ({ ...prev, [pmId]: "" }));
    addToast("Message Sent", "success");
  };

  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          <SkeletonCard />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* ---- Confirm dialog for sending to parents ---- */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => setConfirmOpen(open)}
        onConfirm={doSend}
        title="Send to All Parents?"
        description={`This announcement will be sent to ${recipientLabel.toLowerCase()}. Are you sure you want to proceed?`}
        confirmLabel="Send Now"
        cancelLabel="Cancel"
      />

      {/* ---- Compose Area ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545] md:text-xl">
          Send Announcement
        </h2>
        <Card>
          <CardContent className="p-4 md:p-6">
            {/* Recipient selector */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">To:</span>
              {(["all", "team", "parents"] as RecipientOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={cn(
                    "min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    recipient === opt
                      ? "bg-[#1D4ED8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  onClick={() => setRecipient(opt)}
                >
                  {opt === "all"
                    ? "All (Players + Parents)"
                    : opt === "team"
                    ? "Players Only"
                    : "Parents Only"}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                className="w-full rounded-lg border border-gray-300 bg-white p-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] min-h-[140px] md:min-h-[160px] resize-y leading-relaxed"
                placeholder="Write your message to the team..."
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setMessage(e.target.value);
                  }
                }}
                maxLength={MAX_CHARS}
              />
              {/* Character count */}
              <div
                className={cn(
                  "absolute bottom-3 right-3 text-xs",
                  message.length > MAX_CHARS * 0.9
                    ? "text-[#B91C1C] font-medium"
                    : "text-gray-400"
                )}
              >
                {message.length}/{MAX_CHARS}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end">
              <Button
                className="min-h-[48px] min-w-[140px] gap-2 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-base md:min-h-[48px] md:text-base"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
                Send to {recipient === "team" ? "Team" : recipient === "parents" ? "Parents" : "All"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Team Announcements ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545] md:text-xl">
          Team Announcements
        </h2>
        <div className="space-y-3">
          {sentMessages.map((ann) => {
            const readPercent =
              ann.totalRecipients > 0
                ? Math.round((ann.readCount / ann.totalRecipients) * 100)
                : 0;
            const allRead = ann.readCount === ann.totalRecipients;

            return (
              <Card key={ann.id}>
                <CardContent className="p-4 md:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0B2545] md:text-base">
                        {ann.sender}
                      </span>
                      <span className="text-xs text-gray-400">{ann.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      {allRead ? (
                        <CheckCheck className="h-4 w-4 text-[#15803D]" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className={cn(allRead && "text-[#15803D] font-medium")}>
                        {ann.readCount}/{ann.totalRecipients}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed md:text-base">
                    {ann.message}
                  </p>
                  {/* Read progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          allRead ? "bg-[#15803D]" : "bg-[#1D4ED8]"
                        )}
                        style={{ width: `${readPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Read by {readPercent}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- Parent Messages (collapsible) ---- */}
      <section>
        <button
          type="button"
          className="flex w-full min-h-[52px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setShowParentMessages(!showParentMessages)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#0B2545]" />
            <span className="text-lg font-semibold text-[#0B2545]">
              Parent Messages
            </span>
            {unreadCount > 0 && (
              <Badge variant="danger">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {showParentMessages ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {showParentMessages && (
          <div className="mt-3 space-y-3">
            {PARENT_MESSAGES.map((pm) => {
              const isExpanded = expandedThread === pm.id;

              return (
                <Card
                  key={pm.id}
                  className={cn(
                    "transition-shadow",
                    pm.unread && "border-[#1D4ED8]/30 bg-blue-50/50"
                  )}
                >
                  <CardContent className="p-0">
                    {/* Header - clickable to expand */}
                    <button
                      type="button"
                      className="flex w-full min-h-[56px] items-start justify-between gap-2 p-4 text-left md:p-5"
                      onClick={() =>
                        setExpandedThread(isExpanded ? null : pm.id)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[#0B2545] md:text-base">
                            {pm.parentName}
                          </span>
                          <Badge variant="default">{pm.childName}</Badge>
                          {pm.unread && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#1D4ED8]" />
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {pm.lastMessage}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span className="text-xs text-gray-400">
                          {pm.date}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded thread - chat format */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        <div className="max-h-[360px] overflow-y-auto p-4 space-y-3 md:p-5">
                          {pm.thread.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex",
                                msg.sender === "coach"
                                  ? "justify-end"
                                  : "justify-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[75%]",
                                  msg.sender === "coach"
                                    ? "bg-[#1D4ED8] text-white rounded-br-md"
                                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                                )}
                              >
                                <p className="text-sm leading-relaxed">
                                  {msg.message}
                                </p>
                                <div
                                  className={cn(
                                    "mt-1 flex items-center gap-1 text-[11px]",
                                    msg.sender === "coach"
                                      ? "text-white/70 justify-end"
                                      : "text-gray-400"
                                  )}
                                >
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {msg.date} {msg.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply input */}
                        <div className="border-t border-gray-100 p-4 md:p-5">
                          <div className="flex items-end gap-2">
                            <textarea
                              className="flex-1 min-h-[48px] max-h-[120px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] resize-none"
                              placeholder={`Reply to ${pm.parentName}...`}
                              value={replyText[pm.id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [pm.id]: e.target.value,
                                }))
                              }
                              rows={1}
                            />
                            <Button
                              className="min-h-[48px] min-w-[48px] bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
                              onClick={() => handleReply(pm.id)}
                              disabled={!replyText[pm.id]?.trim()}
                              size="sm"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
