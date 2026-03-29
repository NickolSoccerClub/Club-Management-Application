"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Users,
  DollarSign,
  Calendar,
  ClipboardCheck,
  MessageSquare,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NotificationType = "action_required" | "info" | "success" | "warning";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  url: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "action_required",
    title: "3 EOI applications pending",
    body: "New player registrations require review in the Registrar module.",
    time: "5 min ago",
    read: false,
    icon: Users,
    url: "/committee/registrar/players",
  },
  {
    id: 2,
    type: "info",
    title: "Grading session completed",
    body: "U11 Pre-Season Grading has been completed. 14 players graded.",
    time: "1 hour ago",
    read: false,
    icon: ClipboardCheck,
    url: "/committee/development/grading",
  },
  {
    id: 3,
    type: "success",
    title: "Team roster submitted",
    body: "Nickol Titans U11 roster has been finalised with 14 players.",
    time: "2 hours ago",
    read: false,
    icon: Users,
    url: "/committee/registrar/teams",
  },
  {
    id: 4,
    type: "warning",
    title: "Budget variance alert",
    body: "Equipment expenses are 15% over budget for this quarter.",
    time: "3 hours ago",
    read: true,
    icon: DollarSign,
    url: "/committee/finance/budget",
  },
  {
    id: 5,
    type: "info",
    title: "Meeting reminder",
    body: "Committee meeting scheduled for tomorrow at 6:00 PM.",
    time: "5 hours ago",
    read: true,
    icon: Calendar,
    url: "/committee/org/meetings",
  },
  {
    id: 6,
    type: "info",
    title: "New drill added to library",
    body: "AI-generated drill 'Triangle Pressing Game' saved to the drill library.",
    time: "Yesterday",
    read: true,
    icon: ClipboardCheck,
    url: "/committee/development/drills",
  },
  {
    id: 7,
    type: "success",
    title: "Social media post published",
    body: "Weekly UGC winner post published to Facebook and Instagram.",
    time: "Yesterday",
    read: true,
    icon: MessageSquare,
    url: "/committee/comms/social",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TYPE_STYLES: Record<NotificationType, { bg: string; text: string }> = {
  action_required: { bg: "bg-red-100", text: "text-[#B91C1C]" },
  warning: { bg: "bg-amber-100", text: "text-[#B45309]" },
  success: { bg: "bg-green-100", text: "text-[#15803D]" },
  info: { bg: "bg-blue-100", text: "text-[#1D4ED8]" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    // Delay listener so the opening click doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /* Mark single notification as read */
  function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  /* Mark all as read */
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute right-0 top-full mt-2 w-[380px] rounded-xl border border-gray-200 bg-white shadow-2xl",
        "transform transition-all duration-200 origin-top-right z-50",
        open
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Badge variant="info" className="text-[10px] px-1.5 py-0">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#1D4ED8] hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark All Read
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ---- Notification List ---- */}
      <div className="max-h-[400px] overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Bell className="h-8 w-8 mb-2" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const style = TYPE_STYLES[notif.type];
            const Icon = notif.icon;

            return (
              <a
                key={notif.id}
                href={notif.url}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "relative flex gap-3 px-4 py-3 border-b border-gray-50 transition-colors",
                  "hover:bg-gray-50",
                  !notif.read && "bg-blue-50/40"
                )}
              >
                {/* Unread indicator */}
                {!notif.read && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#1D4ED8]" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    style.bg,
                    style.text
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm leading-tight",
                      !notif.read
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-700"
                    )}
                  >
                    {notif.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">
                    {notif.body}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {notif.time}
                  </p>
                </div>

                {/* Mark-read button (only for unread) */}
                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      markRead(notif.id);
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors self-center"
                    aria-label="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </a>
            );
          })
        )}
      </div>

      {/* ---- Footer ---- */}
      <div className="border-t border-gray-100 px-4 py-2.5">
        <a
          href="/committee/notifications"
          className="block text-center text-xs font-medium text-[#1D4ED8] hover:text-blue-800 transition-colors"
        >
          View All Notifications
        </a>
      </div>
    </div>
  );
}

/* Export unread count for use by TopNav */
export function getUnreadCount(): number {
  return MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
}
