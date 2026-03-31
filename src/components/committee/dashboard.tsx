"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  AlertCircle,
  MessageSquare,
  Send,
  Activity,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const REGISTRATION_DATA = [
  { date: "17 Mar", count: 3 },
  { date: "18 Mar", count: 5 },
  { date: "19 Mar", count: 2 },
  { date: "20 Mar", count: 8 },
  { date: "21 Mar", count: 12 },
  { date: "22 Mar", count: 6 },
  { date: "23 Mar", count: 4 },
  { date: "24 Mar", count: 7 },
  { date: "25 Mar", count: 15 },
  { date: "26 Mar", count: 9 },
  { date: "27 Mar", count: 11 },
  { date: "28 Mar", count: 6 },
  { date: "29 Mar", count: 8 },
  { date: "30 Mar", count: 10 },
];

const AGE_GROUP_DATA = [
  { group: "U7", count: 24, color: "#3B82F6" },
  { group: "U9", count: 32, color: "#10B981" },
  { group: "U11", count: 28, color: "#F59E0B" },
  { group: "U13", count: 22, color: "#EF4444" },
  { group: "U15", count: 18, color: "#8B5CF6" },
  { group: "U17", count: 12, color: "#EC4899" },
];

const GENDER_DATA = [
  { label: "Male", count: 89, color: "#1D4ED8" },
  { label: "Female", count: 47, color: "#EC4899" },
];

const RECENT_ACTIVITY = [
  { text: "3 new EOI registrations received", time: "10 min ago", type: "info" as const },
  { text: "U11 Pre-Season Grading completed — 14 players graded", time: "2 hours ago", type: "success" as const },
  { text: "Nickol Titans U11 roster submitted with 14 players", time: "3 hours ago", type: "success" as const },
  { text: "Equipment audit flagged 3 low-stock items", time: "5 hours ago", type: "warning" as const },
  { text: "Monthly financial report auto-generated", time: "Yesterday", type: "info" as const },
  { text: "Coach Sarah Mitchell WWCC expiring in 30 days", time: "Yesterday", type: "warning" as const },
];

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */

interface KpiCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
  trend: string;
  trendType: "up" | "action" | "neutral";
}

function KpiCard({ icon: Icon, iconBg, iconColor, label, value, trend, trendType }: KpiCardProps) {
  const trendColor =
    trendType === "up"
      ? "text-[#15803D]"
      : trendType === "action"
        ? "text-[#B45309]"
        : "text-gray-500";

  return (
    <Card className="min-w-[160px] flex-shrink-0 transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#0B2545] leading-tight">{value}</p>
            <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
          </div>
        </div>
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          {trendType === "up" && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
            </svg>
          )}
          {trendType === "action" && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 3.5V7M6 8.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          <span>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card (reused for secondary sections)                          */
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
/*  SVG Bar Chart                                                      */
/* ------------------------------------------------------------------ */

function RegistrationBarChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxCount = Math.max(...REGISTRATION_DATA.map((d) => d.count));
  const totalRegistrations = REGISTRATION_DATA.reduce((sum, d) => sum + d.count, 0);

  const chartPadding = { top: 20, right: 16, bottom: 40, left: 16 };
  const chartWidth = 700;
  const chartHeight = 220;
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const barGap = 8;
  const barWidth = (plotWidth - barGap * (REGISTRATION_DATA.length - 1)) / REGISTRATION_DATA.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-[#0B2545]">
              Registrations — Last 14 Days
            </CardTitle>
          </div>
          <Badge variant="info" className="text-xs font-semibold">
            {totalRegistrations} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = chartPadding.top + plotHeight * (1 - fraction);
            return (
              <line
                key={fraction}
                x1={chartPadding.left}
                y1={y}
                x2={chartWidth - chartPadding.right}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Bars */}
          {REGISTRATION_DATA.map((d, i) => {
            const barHeight = (d.count / maxCount) * plotHeight;
            const x = chartPadding.left + i * (barWidth + barGap);
            const y = chartPadding.top + plotHeight - barHeight;
            const isHovered = hoveredIndex === i;
            const radius = Math.min(4, barWidth / 2);

            return (
              <g
                key={d.date}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible wider hit area */}
                <rect
                  x={x - 2}
                  y={chartPadding.top}
                  width={barWidth + 4}
                  height={plotHeight}
                  fill="transparent"
                />

                {/* Bar with rounded top */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={radius}
                  ry={radius}
                  fill={isHovered ? "#2563EB" : "#1D4ED8"}
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-all duration-150"
                />

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 22}
                      y={y - 30}
                      width={44}
                      height={24}
                      rx={6}
                      fill="#0B2545"
                    />
                    <polygon
                      points={`${x + barWidth / 2 - 5},${y - 6} ${x + barWidth / 2 + 5},${y - 6} ${x + barWidth / 2},${y - 1}`}
                      fill="#0B2545"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 14}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {d.count}
                    </text>
                  </g>
                )}

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill="#9CA3AF"
                  fontSize="10"
                  fontWeight="500"
                >
                  {d.date.replace(" Mar", "")}
                </text>
              </g>
            );
          })}

          {/* X-axis label */}
          <text
            x={chartWidth / 2}
            y={chartHeight}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="10"
          >
            March 2026
          </text>
        </svg>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Donut Chart                                                    */
/* ------------------------------------------------------------------ */

interface DonutSegment {
  label: string;
  count: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutSegment[];
}

function DonutChart({ title, data }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const radius = 70;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  const center = 100;

  // Calculate segment offsets
  let cumulativeOffset = 0;
  const segments = data.map((d, i) => {
    const segmentLength = (d.count / total) * circumference;
    const gap = 3; // gap between segments
    const dashArray = `${Math.max(0, segmentLength - gap)} ${circumference - Math.max(0, segmentLength - gap)}`;
    // Rotate so first segment starts at top (-90deg equivalent offset)
    const dashOffset = -(cumulativeOffset - circumference * 0.25);
    cumulativeOffset += segmentLength;

    return {
      ...d,
      dashArray,
      dashOffset,
      index: i,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#0B2545]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-5">
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map((seg) => {
            const isHovered = hoveredIndex === seg.index;
            return (
              <circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                opacity={hoveredIndex !== null && !isHovered ? 0.5 : 1}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Center text */}
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            fill="#0B2545"
            fontSize="28"
            fontWeight="700"
          >
            {hoveredIndex !== null ? data[hoveredIndex].count : total}
          </text>
          <text
            x={center}
            y={center + 14}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="11"
            fontWeight="500"
          >
            {hoveredIndex !== null ? data[hoveredIndex].label : "Total"}
          </text>
        </svg>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((d, i) => (
            <div
              key={d.label}
              className="flex items-center gap-1.5 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-gray-600 font-medium">
                {d.label}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity Feed                                                      */
/* ------------------------------------------------------------------ */

const activityDotColor: Record<string, string> = {
  info: "#1D4ED8",
  success: "#15803D",
  warning: "#B45309",
};

function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#1D4ED8]" />
          <CardTitle className="text-base font-semibold text-[#0B2545]">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-gray-50"
            >
              <span
                className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: activityDotColor[item.type] }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
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
      {/* ── Welcome ── */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B2545]">
          Welcome back, Josh
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening across the club today.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <section>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-200">
          <KpiCard
            icon={Users}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            label="Total Players"
            value={136}
            trend="+12 this week"
            trendType="up"
          />
          <KpiCard
            icon={Clock}
            iconBg="#FFFBEB"
            iconColor="#B45309"
            label="EOI Pending"
            value={18}
            trend="Action needed"
            trendType="action"
          />
          <KpiCard
            icon={CheckCircle2}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            label="Registered"
            value={104}
            trend="76% conversion"
            trendType="up"
          />
          <KpiCard
            icon={Users}
            iconBg="#EFF6FF"
            iconColor="#1D4ED8"
            label="Teams Created"
            value={8}
            trend="2 draft"
            trendType="neutral"
          />
          <KpiCard
            icon={ClipboardCheck}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
            label="Players Graded"
            value={82}
            trend="60% complete"
            trendType="neutral"
          />
          <KpiCard
            icon={DollarSign}
            iconBg="#F0FDF4"
            iconColor="#15803D"
            label="Revenue YTD"
            value="$24,350"
            trend="58% of target"
            trendType="up"
          />
        </div>
      </section>

      {/* ── Registrations Bar Chart ── */}
      <section>
        <RegistrationBarChart />
      </section>

      {/* ── Donut Charts Row ── */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DonutChart
          title="Players by Age Group"
          data={AGE_GROUP_DATA.map((d) => ({ label: d.group, count: d.count, color: d.color }))}
        />
        <DonutChart
          title="Players by Gender"
          data={GENDER_DATA}
        />
      </section>

      {/* ── Recent Activity ── */}
      <section>
        <ActivityFeed />
      </section>

      {/* ── Registrar ── */}
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

      {/* ── Treasurer ── */}
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

      {/* ── Communications ── */}
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
