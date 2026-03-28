"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Users,
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  AlertCircle,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Stat card helper                                                   */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: { label: string; variant: "success" | "warning" | "danger" | "info" | "default" };
}

function StatCard({ icon: Icon, iconBg, iconColor, title, value, subtitle, badge }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
          {badge && (
            <Badge variant={badge.variant} className="text-[10px]">
              {badge.label}
            </Badge>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold text-[#0B2545]">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B2545]">
          Welcome back, Josh
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening across the club today.
        </p>
      </div>

      {/* ---- Universal cards ---- */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Overview
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CalendarDays}
            iconBg="#FFFBEB"
            iconColor="#B45309"
            title="Season Phase"
            value="Pre-Season"
            subtitle="Season 2026 starts 11 Apr"
            badge={{ label: "6 weeks away", variant: "warning" }}
          />
          <StatCard
            icon={CheckCircle2}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            title="My Open Actions"
            value={4}
            subtitle="2 due this week"
            badge={{ label: "2 overdue", variant: "danger" }}
          />
          <StatCard
            icon={ClipboardList}
            iconBg="#EFF6FF"
            iconColor="#1D4ED8"
            title="Next Committee Meeting"
            value="2 Apr"
            subtitle="7:00 PM at Clubhouse"
            badge={{ label: "6 days", variant: "info" }}
          />
          <StatCard
            icon={Users}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            title="Season Stats"
            value="147"
            subtitle="Registered players"
            badge={{ label: "+12 this week", variant: "success" }}
          />
        </div>
      </section>

      {/* ---- Registrar cards ---- */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Registrar
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={AlertCircle}
            iconBg="#FFFBEB"
            iconColor="#B45309"
            title="Unallocated Players"
            value={18}
            subtitle="Awaiting team assignment"
            badge={{ label: "Action needed", variant: "warning" }}
          />
          <StatCard
            icon={Clock}
            iconBg="#FEF2F2"
            iconColor="#B91C1C"
            title="Reconciliation Queue"
            value={7}
            subtitle="Payments to match"
            badge={{ label: "3 older than 7 days", variant: "danger" }}
          />
        </div>
      </section>

      {/* ---- Treasurer cards ---- */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Treasurer
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            title="Income vs Budget"
            value="$24,350"
            subtitle="of $42,000 target"
            badge={{ label: "58%", variant: "success" }}
          />
          <StatCard
            icon={CreditCard}
            iconBg="#FFFBEB"
            iconColor="#B45309"
            title="Expenses vs Budget"
            value="$18,200"
            subtitle="of $38,500 budget"
            badge={{ label: "47%", variant: "warning" }}
          />
          <StatCard
            icon={Wallet}
            iconBg="#EFF6FF"
            iconColor="#1D4ED8"
            title="Cash Balance"
            value="$6,150"
            subtitle="As of 27 Mar 2026"
            badge={{ label: "Healthy", variant: "success" }}
          />
          <StatCard
            icon={DollarSign}
            iconBg="#FEF2F2"
            iconColor="#B91C1C"
            title="Outstanding Invoices"
            value={12}
            subtitle="$3,600 pending"
            badge={{ label: "4 overdue", variant: "danger" }}
          />
        </div>
      </section>

      {/* ---- Communications cards ---- */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Communications
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={MessageSquare}
            iconBg="#FFFBEB"
            iconColor="#B45309"
            title="Pending Moderation"
            value={5}
            subtitle="Posts awaiting review"
            badge={{ label: "Review", variant: "warning" }}
          />
          <StatCard
            icon={Send}
            iconBg="#EFF6FF"
            iconColor="#1D4ED8"
            title="Scheduled Posts"
            value={3}
            subtitle="Next: Tomorrow 9:00 AM"
            badge={{ label: "On track", variant: "info" }}
          />
        </div>
      </section>
    </div>
  );
}
