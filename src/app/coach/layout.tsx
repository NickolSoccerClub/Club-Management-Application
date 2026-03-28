"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:h-16 md:px-6">
          {/* Left: Team switcher area */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B2545]">
              <span className="text-xs font-bold text-white">NSC</span>
            </div>
            <span className="text-sm font-semibold text-[#0B2545] md:text-base">
              Coach Portal
            </span>
          </div>

          {/* Right: Notification + user */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E11D48]" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-medium text-white">
                  JR
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
                  <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-medium text-[#0B2545]">
                        Josh Richardson
                      </p>
                      <p className="text-xs text-gray-500">Head Coach</p>
                    </div>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 min-h-[44px]"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#B91C1C] hover:bg-gray-50 min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
