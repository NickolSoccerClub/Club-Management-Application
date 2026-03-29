"use client";

import React, { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/committee/sidebar";
import { TopNav } from "@/components/committee/top-nav";

/* ------------------------------------------------------------------ */
/*  Breadcrumb + page title helpers                                    */
/* ------------------------------------------------------------------ */

const TITLE_MAP: Record<string, string> = {
  "/committee": "Dashboard",
  "/committee/registrar/players": "Player Management",
  "/committee/registrar/teams": "Team Management",
  "/committee/registrar/schedule": "Schedule Management",
  "/committee/registrar/import": "Import Centre",
  "/committee/development/coaches": "Coach Management",
  "/committee/development/players": "Player Development",
  "/committee/development/sessions": "Session Builder",
  "/committee/development/drills": "Drill Library",
  "/committee/development/equipment": "Equipment Inventory",
  "/committee/development/knowledge": "Knowledge Base",
  "/committee/development/grading": "Player Grading",
  "/committee/finance": "Financial Overview",
  "/committee/finance/income": "Income",
  "/committee/finance/expenses": "Expenses",
  "/committee/finance/budget": "Budget",
  "/committee/finance/sponsorship": "Sponsorship",
  "/committee/finance/grants": "Grants",
  "/committee/finance/reports": "Reports",
  "/committee/comms/messaging": "Messaging",
  "/committee/comms/news": "News",
  "/committee/comms/media": "Media Gallery",
  "/committee/comms/social": "Social Media",
  "/committee/comms/cms": "Website CMS",
  "/committee/comms/events": "Events",
  "/committee/org/members": "Committee Members",
  "/committee/org/meetings": "Meetings",
  "/committee/org/actions": "Actions",
  "/committee/org/agm": "AGM",
  "/committee/org/documents": "Documents",
};

function buildBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/committee") return [];
  const segments = pathname.replace("/committee/", "").split("/");
  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/committee" },
  ];
  let path = "/committee";
  segments.forEach((seg, i) => {
    path += `/${seg}`;
    const isLast = i === segments.length - 1;
    const label = TITLE_MAP[path] || seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push(isLast ? { label } : { label, href: path });
  });
  return crumbs;
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on tablet width
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (max-width: 1279px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setCollapsed(true);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = useCallback(() => setCollapsed((p) => !p), []);
  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const pageTitle = TITLE_MAP[pathname] || "Committee Portal";
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      <TopNav
        onMenuClick={toggleMobile}
        sidebarCollapsed={collapsed}
        pageTitle={pageTitle}
        breadcrumbs={breadcrumbs}
      />

      <main
        className={cn(
          "transition-[margin-left] duration-200 pt-16",
          breadcrumbs.length > 0 && "pt-[104px]",
          collapsed ? "lg:ml-16" : "lg:ml-[260px]"
        )}
      >
        <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
