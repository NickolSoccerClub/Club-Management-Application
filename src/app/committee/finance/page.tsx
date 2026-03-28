"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  BarChart3,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Summary card                                                       */
/* ------------------------------------------------------------------ */

interface SummaryCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

function SummaryCard({ icon: Icon, iconBg, iconColor, label, value, change, changeType }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-xl font-bold text-[#0B2545]">{value}</p>
          </div>
        </div>
        {change && (
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              changeType === "up" && "text-[#15803D]",
              changeType === "down" && "text-[#B91C1C]",
              changeType === "neutral" && "text-gray-500"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock transactions                                                  */
/* ------------------------------------------------------------------ */

type TxnType = "Income" | "Expense";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  type: TxnType;
  amount: number;
  status: "Cleared" | "Pending" | "Overdue";
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, date: "25 Mar 2026", description: "Player Registration - L. Carter", category: "Registrations", type: "Income", amount: 180, status: "Cleared" },
  { id: 2, date: "24 Mar 2026", description: "Training Bibs (x30)", category: "Equipment", type: "Expense", amount: 245, status: "Cleared" },
  { id: 3, date: "24 Mar 2026", description: "Player Registration - O. Bennett", category: "Registrations", type: "Income", amount: 180, status: "Cleared" },
  { id: 4, date: "23 Mar 2026", description: "Ground Hire - March", category: "Facilities", type: "Expense", amount: 1200, status: "Cleared" },
  { id: 5, date: "22 Mar 2026", description: "Sponsorship - ABC Corp", category: "Sponsorship", type: "Income", amount: 2500, status: "Cleared" },
  { id: 6, date: "21 Mar 2026", description: "First Aid Supplies", category: "Equipment", type: "Expense", amount: 89, status: "Pending" },
  { id: 7, date: "20 Mar 2026", description: "Player Registration - N. Patel", category: "Registrations", type: "Income", amount: 180, status: "Pending" },
  { id: 8, date: "19 Mar 2026", description: "Coach Accreditation - M. Davies", category: "Development", type: "Expense", amount: 350, status: "Cleared" },
  { id: 9, date: "18 Mar 2026", description: "Grant - Shire Council", category: "Grants", type: "Income", amount: 5000, status: "Cleared" },
  { id: 10, date: "17 Mar 2026", description: "Website Hosting - Annual", category: "Admin", type: "Expense", amount: 216, status: "Overdue" },
];

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Cleared: "success",
  Pending: "warning",
  Overdue: "danger",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0B2545]">Financial Overview</h2>
        <p className="text-sm text-gray-500">Season 2026 financial summary</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={TrendingUp}
          iconBg="#F0FDF4"
          iconColor="#15803D"
          label="Total Income"
          value="$24,350"
          change="+$2,860 this month"
          changeType="up"
        />
        <SummaryCard
          icon={TrendingDown}
          iconBg="#FEF2F2"
          iconColor="#B91C1C"
          label="Total Expenses"
          value="$18,200"
          change="+$2,100 this month"
          changeType="down"
        />
        <SummaryCard
          icon={Wallet}
          iconBg="#EFF6FF"
          iconColor="#1D4ED8"
          label="Net Position"
          value="$6,150"
          change="Surplus"
          changeType="up"
        />
        <SummaryCard
          icon={FileText}
          iconBg="#FFFBEB"
          iconColor="#B45309"
          label="Outstanding Invoices"
          value="$3,600"
          change="12 invoices (4 overdue)"
          changeType="neutral"
        />
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
            Chart will be rendered here (Recharts / Chart.js)
          </div>
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className={cn(
                      "border-t border-gray-100 transition-colors hover:bg-blue-50/40",
                      idx % 2 === 1 && "bg-[#F8FAFC]"
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0B2545]">
                      {txn.description}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {txn.category}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={txn.type === "Income" ? "success" : "warning"}>
                        {txn.type}
                      </Badge>
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-right font-medium",
                        txn.type === "Income" ? "text-[#15803D]" : "text-[#B91C1C]"
                      )}
                    >
                      {txn.type === "Income" ? "+" : "-"}${txn.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant={STATUS_VARIANT[txn.status]}>
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
