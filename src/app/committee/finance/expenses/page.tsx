"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  CreditCard,
  Receipt,
  Download,
  Search,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type ExpenseCategory = "Equipment" | "Facilities" | "Development" | "Admin" | "Transport" | "Insurance";
type ApprovalStatus = "Approved" | "Pending Approval" | "Rejected" | "Paid";

interface Expense {
  id: number;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  submittedBy: string;
  approvedBy: string | null;
  status: ApprovalStatus;
  hasReceipt: boolean;
}

const MOCK_EXPENSES: Expense[] = [
  { id: 1, date: "24 Mar 2026", description: "Training Bibs (x30)", category: "Equipment", amount: 245, submittedBy: "Sarah Mitchell", approvedBy: "Karen Williams", status: "Paid", hasReceipt: true },
  { id: 2, date: "23 Mar 2026", description: "Ground Hire - March", category: "Facilities", amount: 1200, submittedBy: "James Anderson", approvedBy: "Karen Williams", status: "Paid", hasReceipt: true },
  { id: 3, date: "21 Mar 2026", description: "First Aid Supplies", category: "Equipment", amount: 89, submittedBy: "Lisa Thompson", approvedBy: null, status: "Pending Approval", hasReceipt: true },
  { id: 4, date: "19 Mar 2026", description: "Coach Accreditation - M. Davies", category: "Development", amount: 350, submittedBy: "Mark Davies", approvedBy: "Karen Williams", status: "Approved", hasReceipt: true },
  { id: 5, date: "17 Mar 2026", description: "Website Hosting - Annual", category: "Admin", amount: 216, submittedBy: "Peter Reynolds", approvedBy: "Karen Williams", status: "Paid", hasReceipt: true },
  { id: 6, date: "15 Mar 2026", description: "Away Game Bus Hire - U15", category: "Transport", amount: 480, submittedBy: "Peter Reynolds", approvedBy: null, status: "Pending Approval", hasReceipt: false },
  { id: 7, date: "12 Mar 2026", description: "Match Balls (x10)", category: "Equipment", amount: 320, submittedBy: "David Chen", approvedBy: "Karen Williams", status: "Paid", hasReceipt: true },
  { id: 8, date: "10 Mar 2026", description: "Public Liability Insurance", category: "Insurance", amount: 1800, submittedBy: "Karen Williams", approvedBy: "James Anderson", status: "Paid", hasReceipt: true },
  { id: 9, date: "08 Mar 2026", description: "Goal Net Replacement (x4)", category: "Equipment", amount: 180, submittedBy: "Robert Nguyen", approvedBy: null, status: "Rejected", hasReceipt: false },
  { id: 10, date: "05 Mar 2026", description: "Coaching Manual Printouts", category: "Development", amount: 65, submittedBy: "David Chen", approvedBy: "Karen Williams", status: "Approved", hasReceipt: true },
];

const CATEGORIES: ExpenseCategory[] = ["Equipment", "Facilities", "Development", "Admin", "Transport", "Insurance"];

const STATUS_VARIANT: Record<ApprovalStatus, "success" | "warning" | "danger" | "info"> = {
  Paid: "success",
  Approved: "info",
  "Pending Approval": "warning",
  Rejected: "danger",
};

const STATUS_ICON: Record<ApprovalStatus, React.ElementType> = {
  Paid: CheckCircle2,
  Approved: CheckCircle2,
  "Pending Approval": Clock,
  Rejected: XCircle,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_EXPENSES.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.description.toLowerCase().includes(q) || r.submittedBy.toLowerCase().includes(q);
      const matchCat = catFilter === "All" || r.category === catFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, catFilter, statusFilter]);

  const totalPaid = MOCK_EXPENSES.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const pendingApproval = MOCK_EXPENSES.filter((r) => r.status === "Pending Approval").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Expenses</h2>
          <p className="text-sm text-gray-500">Track expenses, upload receipts, and manage approvals</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
          <Button variant="accent" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-1.5 h-4 w-4" /> Submit Expense
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF2F2]">
            <CreditCard className="h-5 w-5 text-[#B91C1C]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Paid</p>
            <p className="text-xl font-bold text-[#B91C1C]">${totalPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
            <Clock className="h-5 w-5 text-[#B45309]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending Approval</p>
            <p className="text-xl font-bold text-[#B45309]">{pendingApproval}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <Receipt className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Records</p>
            <p className="text-xl font-bold text-[#0B2545]">{MOCK_EXPENSES.length}</p>
          </div>
        </div>
      </div>

      {/* Submit expense form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Submit New Expense</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Description" placeholder="What was purchased..." />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <select className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Amount ($)" type="number" placeholder="0.00" />
              <Input label="Date" type="date" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Receipt Upload</label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Drop receipt image here or click to browse</p>
                  <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" size="sm">Submit for Approval</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1 relative">
          <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          <Search className="pointer-events-none absolute mt-[-30px] ml-3 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
              <option>All</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30">
              <option>All</option>
              <option>Paid</option>
              <option>Approved</option>
              <option>Pending Approval</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 hidden md:table-cell">Submitted By</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => {
              const Icon = STATUS_ICON[r.status];
              return (
                <tr key={r.id} className={cn("border-t border-gray-100 transition-colors hover:bg-blue-50/40", idx % 2 === 1 && "bg-[#F8FAFC]")}>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{r.date}</td>
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{r.description}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{r.category}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.submittedBy}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#B91C1C]">-${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge></td>
                  <td className="px-4 py-3">
                    {r.hasReceipt ? (
                      <button className="rounded p-1.5 text-[#15803D] hover:bg-green-50">
                        <Receipt className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Pending Approval" && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#15803D] hover:bg-green-50">Approve</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#B91C1C] hover:bg-red-50">Reject</Button>
                      </div>
                    )}
                    {r.status !== "Pending Approval" && (
                      <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
