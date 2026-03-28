"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Edit2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface BudgetCategory {
  id: number;
  name: string;
  type: "Income" | "Expense";
  budgeted: number;
  actual: number;
}

const MOCK_BUDGET: BudgetCategory[] = [
  { id: 1, name: "Player Registrations", type: "Income", budgeted: 18000, actual: 12600 },
  { id: 2, name: "Sponsorship", type: "Income", budgeted: 10000, actual: 4000 },
  { id: 3, name: "Grants", type: "Income", budgeted: 8000, actual: 5000 },
  { id: 4, name: "Fundraising", type: "Income", budgeted: 5000, actual: 2180 },
  { id: 5, name: "Canteen & Merchandise", type: "Income", budgeted: 3000, actual: 1020 },
  { id: 6, name: "Equipment", type: "Expense", budgeted: 6000, actual: 834 },
  { id: 7, name: "Facility Hire", type: "Expense", budgeted: 12000, actual: 3600 },
  { id: 8, name: "Coach Development", type: "Expense", budgeted: 3000, actual: 415 },
  { id: 9, name: "Administration", type: "Expense", budgeted: 2500, actual: 216 },
  { id: 10, name: "Insurance", type: "Expense", budgeted: 2000, actual: 1800 },
  { id: 11, name: "Transport", type: "Expense", budgeted: 3000, actual: 480 },
  { id: 12, name: "Events & Social", type: "Expense", budgeted: 2500, actual: 0 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BudgetPage() {
  const [view, setView] = useState<"all" | "income" | "expense">("all");

  const filtered = view === "all" ? MOCK_BUDGET : MOCK_BUDGET.filter((b) => b.type === (view === "income" ? "Income" : "Expense"));

  const totalBudgetedIncome = MOCK_BUDGET.filter((b) => b.type === "Income").reduce((s, b) => s + b.budgeted, 0);
  const totalActualIncome = MOCK_BUDGET.filter((b) => b.type === "Income").reduce((s, b) => s + b.actual, 0);
  const totalBudgetedExpense = MOCK_BUDGET.filter((b) => b.type === "Expense").reduce((s, b) => s + b.budgeted, 0);
  const totalActualExpense = MOCK_BUDGET.filter((b) => b.type === "Expense").reduce((s, b) => s + b.actual, 0);
  const netBudgeted = totalBudgetedIncome - totalBudgetedExpense;
  const netActual = totalActualIncome - totalActualExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Budget Management</h2>
          <p className="text-sm text-gray-500">Season 2026 budget tracking - budgeted vs actual</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
          <Button variant="accent" size="sm"><Edit2 className="mr-1.5 h-4 w-4" /> Edit Budget</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
            <TrendingUp className="h-5 w-5 text-[#15803D]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Budgeted Income</p>
            <p className="text-xl font-bold text-[#15803D]">${totalBudgetedIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-400">${totalActualIncome.toLocaleString()} actual</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF2F2]">
            <TrendingDown className="h-5 w-5 text-[#B91C1C]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Budgeted Expenses</p>
            <p className="text-xl font-bold text-[#B91C1C]">${totalBudgetedExpense.toLocaleString()}</p>
            <p className="text-xs text-gray-400">${totalActualExpense.toLocaleString()} actual</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <PieChart className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Net Budget</p>
            <p className="text-xl font-bold text-[#1D4ED8]">${netBudgeted.toLocaleString()}</p>
            <p className="text-xs text-gray-400">${netActual.toLocaleString()} actual</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
            <AlertTriangle className="h-5 w-5 text-[#B45309]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Over Budget Items</p>
            <p className="text-xl font-bold text-[#B45309]">
              {MOCK_BUDGET.filter((b) => b.type === "Expense" && b.actual > b.budgeted).length}
            </p>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(["all", "income", "expense"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              view === v ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {v === "all" ? "All Categories" : v === "income" ? "Income" : "Expenses"}
          </button>
        ))}
      </div>

      {/* Budget table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Budgeted</th>
                  <th className="px-4 py-3 text-right">Actual</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Variance</th>
                  <th className="px-4 py-3 min-w-[200px]">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, idx) => {
                  const pct = b.budgeted > 0 ? Math.round((b.actual / b.budgeted) * 100) : 0;
                  const variance = b.actual - b.budgeted;
                  const isOver = b.type === "Expense" && b.actual > b.budgeted;
                  const isUnder = b.type === "Income" && b.actual < b.budgeted * 0.5;

                  return (
                    <tr key={b.id} className={cn("border-t border-gray-100 transition-colors hover:bg-blue-50/40", idx % 2 === 1 && "bg-[#F8FAFC]")}>
                      <td className="px-4 py-3 font-medium text-[#0B2545]">{b.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant={b.type === "Income" ? "success" : "warning"}>{b.type}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">${b.budgeted.toLocaleString()}</td>
                      <td className={cn("whitespace-nowrap px-4 py-3 text-right font-medium", b.type === "Income" ? "text-[#15803D]" : "text-[#B91C1C]")}>
                        ${b.actual.toLocaleString()}
                      </td>
                      <td className={cn("whitespace-nowrap px-4 py-3 text-right hidden sm:table-cell font-medium",
                        variance > 0 ? (b.type === "Income" ? "text-[#15803D]" : "text-[#B91C1C]") : (b.type === "Income" ? "text-[#B91C1C]" : "text-[#15803D]")
                      )}>
                        {variance > 0 ? "+" : ""}{variance < 0 ? "-" : ""}${Math.abs(variance).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                isOver ? "bg-[#B91C1C]" : isUnder ? "bg-[#B45309]" : "bg-[#1D4ED8]"
                              )}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs font-medium text-gray-500">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="px-4 py-3 text-[#0B2545]">Total</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ${filtered.reduce((s, b) => s + b.budgeted, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ${filtered.reduce((s, b) => s + b.actual, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 hidden sm:table-cell">
                    ${(filtered.reduce((s, b) => s + b.actual, 0) - filtered.reduce((s, b) => s + b.budgeted, 0)).toLocaleString()}
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
