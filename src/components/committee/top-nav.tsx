"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Breadcrumb                                                         */
/* ------------------------------------------------------------------ */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-gray-500"
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-[#1D4ED8] transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-medium text-gray-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Top Nav                                                            */
/* ------------------------------------------------------------------ */

interface TopNavProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function TopNav({
  onMenuClick,
  sidebarCollapsed,
  pageTitle = "Dashboard",
  breadcrumbs = [],
}: TopNavProps) {
  const unreadCount = 3; // demo value

  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-20 transition-[left] duration-200",
        sidebarCollapsed ? "lg:left-16" : "lg:left-[260px]",
        "left-0"
      )}
    >
      {/* Main nav bar */}
      <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-[#0B2545] px-4 lg:px-6">
        {/* Left: hamburger (mobile) + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-white truncate lg:text-lg">
            {pageTitle}
          </h1>
        </div>

        {/* Centre: season phase badge (hidden on small screens) */}
        <div className="hidden md:flex items-center">
          <Badge variant="warning" className="text-xs px-3 py-1">
            Pre-Season 2026
          </Badge>
        </div>

        {/* Right: bell + user + logout */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notification bell */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#B91C1C] px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User avatar + info */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              JS
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium leading-tight text-white">
                Josh Smith
              </p>
              <Badge variant="info" className="mt-0.5 text-[10px] px-1.5 py-0">
                President
              </Badge>
            </div>
          </div>

          {/* Logout */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Breadcrumb bar */}
      {breadcrumbs.length > 0 && (
        <div className="border-b border-gray-200 bg-white px-4 py-2 lg:px-6">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
    </div>
  );
}
