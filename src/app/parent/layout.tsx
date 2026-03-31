"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ActiveChildContext, MOCK_CHILDREN, type ParentChild } from "@/components/parent/active-child-context";
import {
  Home,
  Calendar,
  BarChart3,
  Camera,
  Settings,
  Bell,
  ChevronLeft,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Route → title mapping                                              */
/* ------------------------------------------------------------------ */

const TITLES: Record<string, string> = {
  "/parent": "Home",
  "/parent/schedule": "Schedule",
  "/parent/stats": "Player Stats",
  "/parent/media": "Media",
  "/parent/settings": "Settings",
  "/parent/messages": "Messages",
};

function getPageTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (/^\/parent\/schedule\/.+$/.test(pathname)) return "Event Details";
  if (/^\/parent\/stats\/.+$/.test(pathname)) return "Player Stats";
  return "Home";
}

/* ------------------------------------------------------------------ */
/*  Children + context imported from shared module                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Bottom nav items                                                   */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Home", href: "/parent", icon: Home },
  { label: "Schedule", href: "/parent/schedule", icon: Calendar },
  { label: "Stats", href: "/parent/stats", icon: BarChart3 },
  { label: "Media", href: "/parent/media", icon: Camera },
  { label: "Settings", href: "/parent/settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Layout component                                                   */
/* ------------------------------------------------------------------ */

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeChildId, setActiveChildId] = useState(MOCK_CHILDREN[0].id);
  const pathname = usePathname();

  const isHome = pathname === "/parent";
  const pageTitle = getPageTitle(pathname);
  const activeChild = MOCK_CHILDREN.find((c) => c.id === activeChildId) ?? MOCK_CHILDREN[0];
  const notificationCount = 3;

  function isActive(href: string) {
    if (href === "/parent") return pathname === "/parent";
    return pathname.startsWith(href);
  }

  return (
    <ActiveChildContext.Provider value={{ activeChild, setActiveChildId, children: MOCK_CHILDREN }}>
      <div className="min-h-screen bg-gray-50">
        {/* ---- Sticky header ---- */}
        <header className="sticky top-0 z-40 h-14 border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
            {/* Left: Back arrow or logo */}
            <div className="flex items-center gap-2">
              {isHome ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2545]">
                  <span className="text-[10px] font-bold text-white">NSC</span>
                </div>
              ) : (
                <Link
                  href="/parent"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                  aria-label="Back to Home"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Link>
              )}

              {/* Center: Page title */}
              <h1 className="text-base font-semibold text-[#0B2545]">
                {isHome ? "Nickol SC" : pageTitle}
              </h1>
            </div>

            {/* Right: Notification bell */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E11D48] px-1 text-[9px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ---- Child switcher ---- */}
        <div className="sticky top-14 z-30 h-12 border-b border-gray-200 bg-gray-50">
          <div className="mx-auto flex h-full max-w-3xl items-center gap-0 px-4">
            {MOCK_CHILDREN.map((child) => {
              const isSelected = child.id === activeChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  className={cn(
                    "relative flex h-full items-center gap-1.5 px-4 text-sm font-medium transition-colors",
                    "min-h-[48px]",
                    isSelected
                      ? "text-[#0B2545]"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                  onClick={() => setActiveChildId(child.id)}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    )}
                    style={{ backgroundColor: isSelected ? child.color : "#9CA3AF" }}
                  >
                    {child.initials}
                  </span>
                  <span>{child.name}</span>
                  <Badge
                    variant={isSelected ? "info" : "default"}
                    className="text-[10px]"
                  >
                    {child.ageGroup}
                  </Badge>

                  {/* Active underline */}
                  {isSelected && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ backgroundColor: child.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Main content ---- */}
        <main className="mx-auto max-w-3xl px-4 py-5 pb-24">{children}</main>

        {/* ---- Bottom navigation bar ---- */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                    "min-h-[48px]",
                    active
                      ? "text-[#1D4ED8]"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", active && "text-[#1D4ED8]")}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </ActiveChildContext.Provider>
  );
}
