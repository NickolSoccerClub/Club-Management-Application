"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  UserCog,
  CalendarDays,
  Upload,
  GraduationCap,
  TrendingUp,
  Clipboard,
  BookOpen,
  Package,
  Brain,
  ClipboardCheck,
  DollarSign,
  CreditCard,
  PieChart,
  Handshake,
  Gift,
  BarChart3,
  MessageSquare,
  Newspaper,
  Image,
  Share2,
  Globe,
  CalendarCheck,
  UserCheck,
  ClipboardList,
  Gavel,
  Vote,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "REGISTRAR",
    items: [
      { label: "Player Management", href: "/committee/registrar/players", icon: Users },
      { label: "Team Management", href: "/committee/registrar/teams", icon: UserCog },
      { label: "Schedule Management", href: "/committee/registrar/schedule", icon: CalendarDays },
      { label: "Import Centre", href: "/committee/registrar/import", icon: Upload },
    ],
  },
  {
    title: "DEVELOPMENT",
    items: [
      { label: "Coach Management", href: "/committee/development/coaches", icon: GraduationCap },
      { label: "Player Development", href: "/committee/development/players", icon: TrendingUp },
      { label: "Session Builder", href: "/committee/development/sessions", icon: Clipboard },
      { label: "Drill Library", href: "/committee/development/drills", icon: BookOpen },
      { label: "Player Grading", href: "/committee/development/grading", icon: ClipboardCheck },
      { label: "Equipment Inventory", href: "/committee/development/equipment", icon: Package },
      { label: "Knowledge Base", href: "/committee/development/knowledge", icon: Brain },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { label: "Income", href: "/committee/finance/income", icon: DollarSign },
      { label: "Expenses", href: "/committee/finance/expenses", icon: CreditCard },
      { label: "Budget", href: "/committee/finance/budget", icon: PieChart },
      { label: "Sponsorship", href: "/committee/finance/sponsorship", icon: Handshake },
      { label: "Grants", href: "/committee/finance/grants", icon: Gift },
      { label: "Reports", href: "/committee/finance/reports", icon: BarChart3 },
    ],
  },
  {
    title: "COMMUNICATIONS",
    items: [
      { label: "Messaging", href: "/committee/comms/messaging", icon: MessageSquare },
      { label: "News", href: "/committee/comms/news", icon: Newspaper },
      { label: "Media Gallery", href: "/committee/comms/media", icon: Image },
      { label: "Social Media", href: "/committee/comms/social", icon: Share2 },
      { label: "Website CMS", href: "/committee/comms/cms", icon: Globe },
      { label: "Events", href: "/committee/comms/events", icon: CalendarCheck },
    ],
  },
  {
    title: "COMMITTEE",
    items: [
      { label: "Committee Members", href: "/committee/org/members", icon: UserCheck },
      { label: "Meetings", href: "/committee/org/meetings", icon: ClipboardList },
      { label: "Actions", href: "/committee/org/actions", icon: Gavel },
      { label: "AGM", href: "/committee/org/agm", icon: Vote },
      { label: "Documents", href: "/committee/org/documents", icon: FileText },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  /* ---- Section icon mapping (shown in collapsed mode & section headers) ---- */
  const SECTION_ICONS: Record<string, React.ElementType> = {
    REGISTRAR: Users,
    DEVELOPMENT: GraduationCap,
    FINANCIAL: DollarSign,
    COMMUNICATIONS: MessageSquare,
    COMMITTEE: UserCheck,
  };

  /* ---- Determine which section the current route belongs to ---- */
  const activeSection = useMemo(() => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (pathname === item.href || pathname.startsWith(item.href + "/")) {
          return section.title;
        }
      }
    }
    return null;
  }, [pathname]);

  /* ---- Accordion state: only one section open at a time ---- */
  const [expandedSection, setExpandedSection] = useState<string | null>(activeSection);

  /* Auto-expand the section containing the active route on navigation */
  useEffect(() => {
    if (activeSection) {
      setExpandedSection(activeSection);
    }
  }, [activeSection]);

  const handleSectionToggle = useCallback(
    (title: string) => {
      setExpandedSection((prev) => (prev === title ? null : title));
    },
    []
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-wide text-white truncate">
            Nickol SC
          </span>
        )}

        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin">
        {NAV_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.title;
          const sectionHasActive = section.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/")
          );
          const SectionIcon = SECTION_ICONS[section.title] || Shield;

          return (
            <div key={section.title}>
              {/* Section heading — clickable to expand/collapse */}
              {!collapsed ? (
                <button
                  onClick={() => handleSectionToggle(section.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors",
                    sectionHasActive
                      ? "text-white/80"
                      : "text-white/40 hover:text-white/60 hover:bg-white/5"
                  )}
                  aria-expanded={isExpanded}
                  aria-controls={`nav-section-${section.title}`}
                >
                  <span className="flex items-center gap-2.5">
                    <SectionIcon className="h-4 w-4" />
                    {section.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
              ) : (
                /* Collapsed mode: show only the section icon */
                <button
                  onClick={() => handleSectionToggle(section.title)}
                  title={section.title}
                  className={cn(
                    "flex w-full items-center justify-center rounded-md py-2 transition-colors",
                    sectionHasActive
                      ? "text-white bg-white/10"
                      : "text-white/40 hover:text-white/60 hover:bg-white/5"
                  )}
                >
                  <SectionIcon className="h-[18px] w-[18px]" />
                </button>
              )}

              {/* Expandable items list */}
              <div
                id={`nav-section-${section.title}`}
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  isExpanded && !collapsed
                    ? "max-h-[500px] opacity-100"
                    : collapsed
                    ? "max-h-0 opacity-0"
                    : "max-h-0 opacity-0"
                )}
              >
                <ul className="space-y-0.5 pb-2 pt-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onMobileClose}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            collapsed && "justify-center px-0",
                            isActive
                              ? "bg-white/15 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block shrink-0 border-t border-white/10 p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (overlay) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0B2545] transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (static) */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-[#0B2545] transition-[width] duration-200",
          collapsed ? "lg:w-16" : "lg:w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
