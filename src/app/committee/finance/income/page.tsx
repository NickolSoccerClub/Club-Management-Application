"use client";

import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/committee/shared/page-header";
import { Pagination } from "@/components/committee/shared/pagination";
import { SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Trash2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type IncomeCategory = "Registrations" | "Sponsorship" | "Grants" | "Fundraising" | "Canteen" | "Merchandise";
type PaymentStatus = "Received" | "Pending" | "Overdue";

interface IncomeRecord {
  id: number;
  date: string;
  description: string;
  category: IncomeCategory;
  amount: number;
  paidBy: string;
  status: PaymentStatus;
  reference: string;
}

const MOCK_INCOME: IncomeRecord[] = [
  { id: 1, date: "25 Mar 2026", description: "Player Registration - L. Carter", category: "Registrations", amount: 180, paidBy: "Mary Carter", status: "Received", reference: "REG-001" },
  { id: 2, date: "24 Mar 2026", description: "Player Registration - O. Bennett", category: "Registrations", amount: 180, paidBy: "Jane Bennett", status: "Received", reference: "REG-002" },
  { id: 3, date: "22 Mar 2026", description: "ABC Corp Sponsorship - Gold", category: "Sponsorship", amount: 2500, paidBy: "ABC Corp", status: "Received", reference: "SPO-001" },
  { id: 4, date: "20 Mar 2026", description: "Player Registration - N. Patel", category: "Registrations", amount: 180, paidBy: "Sanjay Patel", status: "Pending", reference: "REG-003" },
  { id: 5, date: "18 Mar 2026", description: "Shire Council Development Grant", category: "Grants", amount: 5000, paidBy: "Shire of Roebourne", status: "Received", reference: "GRA-001" },
  { id: 6, date: "15 Mar 2026", description: "Trivia Night Ticket Sales", category: "Fundraising", amount: 1360, paidBy: "Various", status: "Received", reference: "FUN-001" },
  { id: 7, date: "12 Mar 2026", description: "Pilbara Mining Sponsorship - Silver", category: "Sponsorship", amount: 1500, paidBy: "Pilbara Mining", status: "Received", reference: "SPO-002" },
  { id: 8, date: "10 Mar 2026", description: "Canteen Revenue - Round 0 Carnival", category: "Canteen", amount: 420, paidBy: "Canteen", status: "Received", reference: "CAN-001" },
  { id: 9, date: "08 Mar 2026", description: "Jersey Sales (12 units)", category: "Merchandise", amount: 600, paidBy: "Various", status: "Received", reference: "MER-001" },
  { id: 10, date: "05 Mar 2026", description: "Player Registration - E. Nguyen", category: "Registrations", amount: 180, paidBy: "Tom Nguyen", status: "Overdue", reference: "REG-004" },
  { id: 11, date: "02 Mar 2026", description: "Player Registration - O. Smith", category: "Registrations", amount: 180, paidBy: "Adam Smith", status: "Pending", reference: "REG-005" },
  { id: 12, date: "28 Feb 2026", description: "BBQ Fundraiser Revenue", category: "Fundraising", amount: 820, paidBy: "Various", status: "Received", reference: "FUN-002" },
];

const CATEGORIES: IncomeCategory[] = ["Registrations", "Sponsorship", "Grants", "Fundraising", "Canteen", "Merchandise"];

const STATUS_VARIANT: Record<PaymentStatus, "success" | "warning" | "danger"> = {
  Received: "success",
  Pending: "warning",
  Overdue: "danger",
};

/* ------------------------------------------------------------------ */
/*  Zod schema                                                         */
/* ------------------------------------------------------------------ */

const incomeSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  amount: z.number({ invalid_type_error: "Amount is required" }).positive("Amount must be a positive number"),
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IncomePage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const perPage = 8;

  // Form state
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0] as string);
  const [formAmount, setFormAmount] = useState("");
  const [formPaidBy, setFormPaidBy] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirm dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_INCOME.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.description.toLowerCase().includes(q) || r.paidBy.toLowerCase().includes(q);
      const matchCat = catFilter === "All" || r.category === catFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, catFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalIncome = MOCK_INCOME.filter((r) => r.status === "Received").reduce((sum, r) => sum + r.amount, 0);
  const pendingIncome = MOCK_INCOME.filter((r) => r.status === "Pending" || r.status === "Overdue").reduce((sum, r) => sum + r.amount, 0);

  const categoryOptions = CATEGORIES.map((c) => ({ label: c, value: c }));
  const filterCategoryOptions = [{ label: "All", value: "All" }, ...categoryOptions];
  const filterStatusOptions = [
    { label: "All", value: "All" },
    { label: "Received", value: "Received" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  function handleFormSubmit() {
    const parsed = incomeSchema.safeParse({
      description: formDescription,
      category: formCategory,
      amount: formAmount ? parseFloat(formAmount) : undefined,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormDescription("");
    setFormCategory(CATEGORIES[0]);
    setFormAmount("");
    setFormPaidBy("");
    setFormDate("");
    setShowForm(false);
    addToast("Income recorded", "success");
  }

  function handleDeleteClick(id: number) {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    setDeleteTargetId(null);
    addToast("Record deleted", "success");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Income" subtitle="Track all club revenue and incoming payments">
        <Button variant="secondary" size="sm">
          <Download className="mr-1.5 h-4 w-4" /> Export
        </Button>
        <Button variant="accent" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1.5 h-4 w-4" /> Record Income
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
            <TrendingUp className="h-5 w-5 text-[#15803D]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Received</p>
            <p className="text-xl font-bold text-[#15803D]">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
            <DollarSign className="h-5 w-5 text-[#B45309]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending / Overdue</p>
            <p className="text-xl font-bold text-[#B45309]">${pendingIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <DollarSign className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Records</p>
            <p className="text-xl font-bold text-[#0B2545]">{MOCK_INCOME.length}</p>
          </div>
        </div>
      </div>

      {/* Record Income form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Record New Income</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Description"
                placeholder="e.g. Player Registration - J. Smith"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                error={formErrors.description}
              />
              <Select
                label="Category"
                options={categoryOptions}
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                error={formErrors.category}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Amount ($)"
                type="number"
                placeholder="0.00"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                error={formErrors.amount}
              />
              <Input
                label="Paid By"
                placeholder="Name or organisation"
                value={formPaidBy}
                onChange={(e) => setFormPaidBy(e.target.value)}
              />
              <Input
                label="Date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" size="sm" onClick={handleFormSubmit}>Save Record</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1 relative">
          <Input placeholder="Search description or payer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <Select
            label="Category"
            options={filterCategoryOptions}
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          />
          <Select
            label="Status"
            options={filterStatusOptions}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Data table */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No income records found"
          description="Try adjusting your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(""); setCatFilter("All"); setStatusFilter("All"); }}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">Paid By</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, idx) => (
                  <tr key={r.id} className={cn("border-t border-gray-100 transition-colors hover:bg-blue-50/40", idx % 2 === 1 && "bg-[#F8FAFC]")}>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{r.date}</td>
                    <td className="px-4 py-3 font-medium text-[#0B2545]">{r.description}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{r.category}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.paidBy}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#15803D]">+${r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteClick(r.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-[#B91C1C]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            perPage={perPage}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income Record"
        description="Are you sure you want to delete this income record? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
