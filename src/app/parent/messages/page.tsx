"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Megaphone,
  User,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  sender: "parent" | "coach";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  coachName: string;
  team: string;
  childName: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

interface TeamAnnouncement {
  id: string;
  coachName: string;
  team: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    coachName: "Sarah Mitchell",
    team: "Nickol Thunder (U9s)",
    childName: "Emma",
    lastMessage: "Thanks Sarah, we'll make sure she brings her shin pads on Saturday!",
    lastTime: "2:15 PM",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        sender: "coach",
        text: "Hi Sarah! Just a heads-up that this Saturday's match has been moved to Millars Well Oval due to the upgrade works at Bulgarra. Kick-off is still 9 AM.",
        time: "Mon 9:30 AM",
      },
      {
        id: "m2",
        sender: "parent",
        text: "Thanks for letting us know! We'll be there. Is there parking near the oval?",
        time: "Mon 10:12 AM",
      },
      {
        id: "m3",
        sender: "coach",
        text: "Yes, there's a car park on the north side. Also, can you make sure Emma brings her shin pads? She forgot them at training last week.",
        time: "Mon 11:45 AM",
      },
      {
        id: "m4",
        sender: "parent",
        text: "Thanks Sarah, we'll make sure she brings her shin pads on Saturday!",
        time: "Mon 2:15 PM",
      },
    ],
  },
  {
    id: "conv-2",
    coachName: "David Chen",
    team: "Nickol Storm (U12s)",
    childName: "Jack",
    lastMessage: "Jack has been selected for the district rep squad trials next month.",
    lastTime: "Yesterday",
    unreadCount: 2,
    messages: [
      {
        id: "m5",
        sender: "coach",
        text: "Good news! Jack has been selected for the district rep squad trials next month. The trial is on April 12 at Karratha Leisureplex.",
        time: "Sun 4:00 PM",
      },
      {
        id: "m6",
        sender: "coach",
        text: "He'll need to bring his own boots and water. The club will provide the training kit. I'd recommend he gets some extra shooting practice this week.",
        time: "Sun 4:02 PM",
      },
      {
        id: "m7",
        sender: "parent",
        text: "That's fantastic news! Jack will be so excited. We'll definitely be there. Should we arrive early for registration?",
        time: "Sun 5:30 PM",
      },
      {
        id: "m8",
        sender: "coach",
        text: "Yes, arrive by 8:30 AM for a 9 AM start. Registration is at the front desk. I'll send through the info pack later this week.",
        time: "Sun 6:15 PM",
      },
    ],
  },
];

const MOCK_ANNOUNCEMENTS: TeamAnnouncement[] = [
  {
    id: "ann-1",
    coachName: "Sarah Mitchell",
    team: "Nickol Thunder (U9s)",
    title: "End of Season Presentation",
    body: "Hi parents! The end of season presentation night will be held on Saturday 18 April at the Karratha Leisure Centre from 5:30 PM. Please RSVP by replying to this message. Each player will receive their trophy, and we'll have a BBQ and drinks provided.",
    date: "28 Mar 2026",
    read: true,
  },
  {
    id: "ann-2",
    coachName: "David Chen",
    team: "Nickol Storm (U12s)",
    title: "Training Schedule Change",
    body: "Due to the long weekend, there will be no training on Thursday 2 April. Training will resume the following Tuesday at the usual time (5:00 PM, Bulgarra Oval). Players should use the break to rest up before our final two games of the season.",
    date: "26 Mar 2026",
    read: false,
  },
  {
    id: "ann-3",
    coachName: "Sarah Mitchell",
    team: "Nickol Thunder (U9s)",
    title: "Team Photo Day",
    body: "Team photos will be taken this Saturday before the match. Please ensure your child is wearing a clean team jersey and arrives by 8:30 AM. Individual photos will also be available for $15 each. Order forms will be sent home with the players.",
    date: "22 Mar 2026",
    read: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ParentMessagesPage() {
  const [loading, setLoading] = React.useState(true);
  const [activeConversation, setActiveConversation] = React.useState<string | null>(null);
  const [messageInput, setMessageInput] = React.useState("");
  const [conversations, setConversations] = React.useState(MOCK_CONVERSATIONS);
  const [announcements, setAnnouncements] = React.useState(MOCK_ANNOUNCEMENTS);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConversation) return conv;
        const newMessage: Message = {
          id: `m-${Date.now()}`,
          sender: "parent",
          text: messageInput.trim(),
          time: "Just now",
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput.trim(),
          lastTime: "Just now",
        };
      })
    );
    setMessageInput("");

    // Scroll after state update
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const markAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* ---- Active Conversation View ---- */
  if (currentConversation) {
    return (
      <div className="flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setActiveConversation(null)}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-[#0B2545]">
              Coach {currentConversation.coachName}
            </h2>
            <p className="text-xs text-gray-500">
              {currentConversation.team} &middot; {currentConversation.childName}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {currentConversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.sender === "parent" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.sender === "parent"
                    ? "rounded-br-md bg-[#1D4ED8] text-white"
                    : "rounded-bl-md bg-gray-100 text-[#0B2545]"
                )}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.sender === "parent"
                      ? "text-white/60"
                      : "text-gray-400"
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-200 bg-white pt-3 pb-1">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[44px] flex-1"
          />
          <Button
            variant="accent"
            className="h-11 w-11 shrink-0 min-h-[44px] min-w-[44px] p-0"
            disabled={!messageInput.trim()}
            onClick={handleSendMessage}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  /* ---- Conversation List + Announcements ---- */
  return (
    <div className="space-y-6">
      {/* ---- Section 1: Conversations ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">Messages</h2>
        </div>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 focus-visible:ring-offset-2 rounded-lg"
              onClick={() => {
                setActiveConversation(conv.id);
                // Clear unread
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === conv.id ? { ...c, unreadCount: 0 } : c
                  )
                );
              }}
            >
              <Card
                className={cn(
                  "transition-colors hover:bg-gray-50 active:bg-gray-100",
                  conv.unreadCount > 0 && "border-[#1D4ED8]/30"
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B2545]">
                    <User className="h-5 w-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm text-[#0B2545] truncate",
                          conv.unreadCount > 0 ? "font-bold" : "font-medium"
                        )}
                      >
                        Coach {conv.coachName}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400">
                        {conv.lastTime}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{conv.team}</p>
                    <p
                      className={cn(
                        "mt-1 truncate text-sm",
                        conv.unreadCount > 0
                          ? "font-medium text-[#0B2545]"
                          : "text-gray-500"
                      )}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unreadCount > 0 && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </div>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Section 2: Team Announcements ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Team Announcements
          </h2>
        </div>
        <div className="space-y-2">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className={cn(
                !ann.read && "border-[#1D4ED8]/30 bg-blue-50/20"
              )}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          "text-sm text-[#0B2545]",
                          !ann.read ? "font-bold" : "font-medium"
                        )}
                      >
                        {ann.title}
                      </h3>
                      {!ann.read && (
                        <Badge variant="info">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Coach {ann.coachName} &middot; {ann.team}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {ann.date}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {ann.body}
                </p>
                {!ann.read && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-[#1D4ED8] hover:underline min-h-[44px] flex items-center"
                    onClick={() => markAnnouncementRead(ann.id)}
                  >
                    Mark as read
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
