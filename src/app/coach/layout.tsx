"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Clipboard,
  Trophy,
  Users,
  BookOpen,
  Brain,
  Home,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Route → title mapping                                              */
/* ------------------------------------------------------------------ */

const TITLES: Record<string, string> = {
  "/coach": "Coach Portal",
  "/coach/training": "Training",
  "/coach/training/create": "Create Session",
  "/coach/fixtures": "Fixtures",
  "/coach/players": "Players",
  "/coach/drills": "Drill Library",
  "/coach/niko": "Coach Niko",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (TITLES[pathname]) return TITLES[pathname];

  // Dynamic route patterns
  if (/^\/coach\/training\/.+$/.test(pathname)) return "Training Session";
  if (/^\/coach\/fixtures\/.+$/.test(pathname)) return "Match Day";
  if (/^\/coach\/players\/.+$/.test(pathname)) return "Player Profile";

  return "Coach Portal";
}

/* ------------------------------------------------------------------ */
/*  Bottom nav items                                                   */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Home", href: "/coach", icon: Home },
  { label: "Training", href: "/coach/training", icon: Clipboard },
  { label: "Fixtures", href: "/coach/fixtures", icon: Trophy },
  { label: "Players", href: "/coach/players", icon: Users },
  { label: "Niko", href: "/coach/niko", icon: Brain },
];

/* ------------------------------------------------------------------ */
/*  Layout component                                                   */
/* ------------------------------------------------------------------ */

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/coach";
  const pageTitle = getPageTitle(pathname);

  /** Check if a nav item is active */
  function isActive(href: string) {
    if (href === "/coach") return pathname === "/coach";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- Sticky header ---- */}
      <header className="sticky top-0 z-40 h-16 bg-[#0B2545] shadow-md">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Left: Back arrow or NSC logo */}
          <div className="flex items-center gap-3">
            {isHome ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <span className="text-sm font-bold text-white">NSC</span>
              </div>
            ) : (
              <Link
                href="/coach"
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10"
                aria-label="Back to Coach Portal"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Link>
            )}

            {/* Center: Page title */}
            <h1 className="text-base font-semibold text-white md:text-lg">
              {pageTitle}
            </h1>
          </div>

          {/* Right: Season badge + notification + user */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Season badge — tablet+ */}
            <Badge
              variant="info"
              className="mr-1 hidden text-[10px] sm:inline-flex"
            >
              Season 2026
            </Badge>

            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-white/80" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0B2545] bg-[#E11D48]" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-xl px-2 transition-colors hover:bg-white/10"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-medium text-white md:h-9 md:w-9 md:text-sm">
                  JR
                </div>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium text-[#0B2545]">
                        Josh R.
                      </p>
                      <p className="text-xs text-gray-500">Head Coach</p>
                    </div>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                      style={{ minHeight: 48 }}
                    >
                      <User className="h-5 w-5" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#B91C1C] hover:bg-gray-50"
                      style={{ minHeight: 48 }}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---- Main content ---- */}
      <main className="pb-20 lg:pb-6">{children}</main>

      {/* ---- Bottom navigation bar (mobile / tablet) ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
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

      {/* ---- Floating Niko button (lg+ only, hidden on /coach/niko) ---- */}
      {pathname !== "/coach/niko" && (
        <Link
          href="/coach/niko"
          className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8] text-white shadow-lg transition-all hover:bg-[#1D4ED8]/90 hover:shadow-xl hover:scale-105 active:scale-95 lg:flex"
          aria-label="Ask Coach Niko"
        >
          <Brain className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
