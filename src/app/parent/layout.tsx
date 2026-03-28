"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Bell,
  Settings,
  Home,
  Calendar,
  BarChart3,
  Camera,
  Cog,
} from "lucide-react";
import { ParentNavProvider } from "@/components/parent/parent-nav-context";

/* ------------------------------------------------------------------ */
/*  Bottom / top nav items                                            */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "media", label: "Media", icon: Camera },
  { id: "settings", label: "Settings", icon: Cog },
];

/* ------------------------------------------------------------------ */
/*  Layout                                                            */
/* ------------------------------------------------------------------ */

const MOCK_CHILDREN = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Jack" },
];

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [activeChildId, setActiveChildId] = React.useState(MOCK_CHILDREN[0].id);

  return (
    <ParentNavProvider
      value={{
        activeTab,
        setActiveTab,
        children: MOCK_CHILDREN,
        activeChildId,
        setActiveChildId,
      }}
    >
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
            {/* Child switcher tabs */}
            <div className="flex items-center gap-1">
              {MOCK_CHILDREN.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px]",
                    activeChildId === child.id
                      ? "bg-[#0B2545] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveChildId(child.id)}
                >
                  {child.name}
                </button>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E11D48]" />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Top tab nav - tablet/desktop only */}
          <nav className="hidden md:block border-t border-gray-100">
            <div className="mx-auto flex max-w-3xl items-center gap-1 px-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors min-h-[44px]",
                    activeTab === item.id
                      ? "border-[#0B2545] text-[#0B2545]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>

        {/* Bottom tab nav - mobile only */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-around">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors min-h-[56px] justify-center",
                  activeTab === item.id
                    ? "text-[#0B2545]"
                    : "text-gray-400 hover:text-gray-600"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    activeTab === item.id
                      ? "text-[#0B2545]"
                      : "text-gray-400"
                  )}
                />
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </ParentNavProvider>
  );
}
