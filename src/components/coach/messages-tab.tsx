"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Eye,
  ToggleLeft,
  ToggleRight,
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

interface ParentMessage {
  id: string;
  parentName: string;
  childName: string;
  lastMessage: string;
  date: string;
  unread: boolean;
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
  },
  {
    id: "pm2",
    parentName: "Maria Martinez",
    childName: "Ava",
    lastMessage: "Thanks for the update. Ava loved the new passing drills! She's been practising in the backyard.",
    date: "24 Mar",
    unread: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MessagesTab() {
  const [message, setMessage] = React.useState("");
  const [includeParents, setIncludeParents] = React.useState(true);
  const [showParentMessages, setShowParentMessages] = React.useState(false);
  const [sentMessages, setSentMessages] = React.useState<Announcement[]>(ANNOUNCEMENTS);

  const handleSend = () => {
    if (!message.trim()) return;
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
  };

  return (
    <div className="space-y-6 py-4">
      {/* ---- Compose Area ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Send Announcement
        </h2>
        <Card>
          <CardContent className="p-4">
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] min-h-[100px] resize-y"
              placeholder="Write your message to the team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              {/* Include parents toggle */}
              <button
                type="button"
                className="flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIncludeParents(!includeParents)}
              >
                {includeParents ? (
                  <ToggleRight className="h-6 w-6 text-[#1D4ED8]" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
                <span>Include parents</span>
              </button>

              <Button
                className="min-h-[44px] gap-2 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
                Send to Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Team Announcements ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#0B2545]">
          Team Announcements
        </h2>
        <div className="space-y-2">
          {sentMessages.map((ann) => (
            <Card key={ann.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0B2545]">
                      {ann.sender}
                    </span>
                    <span className="text-xs text-gray-400">{ann.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3.5 w-3.5" />
                    <span>
                      {ann.readCount}/{ann.totalRecipients}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ann.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Parent Messages (collapsible) ---- */}
      <section>
        <button
          type="button"
          className="flex w-full min-h-[44px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setShowParentMessages(!showParentMessages)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#0B2545]" />
            <span className="text-lg font-semibold text-[#0B2545]">
              Parent Messages
            </span>
            {PARENT_MESSAGES.some((m) => m.unread) && (
              <Badge variant="danger">
                {PARENT_MESSAGES.filter((m) => m.unread).length} new
              </Badge>
            )}
          </div>
          {showParentMessages ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {showParentMessages && (
          <div className="mt-2 space-y-2">
            {PARENT_MESSAGES.map((pm) => (
              <Card
                key={pm.id}
                className={cn(
                  "cursor-pointer hover:shadow-sm transition-shadow",
                  pm.unread && "border-[#1D4ED8]/30 bg-blue-50/50"
                )}
              >
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0B2545]">
                        {pm.parentName}
                      </span>
                      <Badge variant="default">{pm.childName}</Badge>
                      {pm.unread && (
                        <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{pm.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {pm.lastMessage}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
