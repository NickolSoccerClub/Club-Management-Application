"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, User, LogOut, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar - sticky, prominent, tablet-optimised */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:h-[72px] md:px-6 lg:px-8">
          {/* Left: Branding + team info */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2545] md:h-11 md:w-11">
              <span className="text-sm font-bold text-white md:text-base">
                NSC
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#0B2545] md:text-base lg:text-lg">
                Coach Portal
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 md:text-sm">
                  U12 Mixed
                </span>
                <Badge
                  variant="default"
                  className="hidden text-[10px] sm:inline-flex"
                >
                  Season 2026
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Notification + user */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-gray-100 md:h-12 md:w-12"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 md:h-[22px] md:w-[22px]" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#E11D48]" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl px-2 transition-colors hover:bg-gray-100 md:h-12 md:px-3"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D4ED8] text-sm font-medium text-white md:h-10 md:w-10">
                  JR
                </div>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium text-[#0B2545]">
                    Josh R.
                  </span>
                  <span className="text-xs text-gray-400">Head Coach</span>
                </div>
                <ChevronDown
                  className={cn(
                    "hidden h-4 w-4 text-gray-400 transition-transform md:block",
                    menuOpen && "rotate-180"
                  )}
                />
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
                        Josh Richardson
                      </p>
                      <p className="text-xs text-gray-500">
                        Head Coach &middot; U12 Mixed
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 min-h-[48px]"
                    >
                      <User className="h-5 w-5" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#B91C1C] hover:bg-gray-50 min-h-[48px]"
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

      {/* Main content - tablet-optimised padding */}
      <main className="pb-24 md:pb-28">{children}</main>

      {/* Floating "Ask Niko" button — fixed bottom-right */}
      <Link
        href="/coach/niko"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#1D4ED8] text-white shadow-lg transition-all hover:bg-[#1D4ED8]/90 hover:shadow-xl hover:scale-105 active:scale-95",
          "h-14 w-14 justify-center md:h-auto md:w-auto md:px-5 md:py-3.5",
          pathname === "/coach/niko" && "hidden"
        )}
        aria-label="Ask Coach Niko"
      >
        <MessageCircle className="h-6 w-6 md:h-5 md:w-5" />
        <span className="hidden text-sm font-semibold md:inline">
          Ask Niko
        </span>
      </Link>
    </div>
  );
}
