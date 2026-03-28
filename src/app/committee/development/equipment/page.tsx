"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/committee/shared/page-header";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type Condition = "Good" | "Fair" | "Poor";
type EquipmentCategory = "Balls" | "Goals" | "Cones/Markers" | "Bibs" | "First Aid" | "Other";

interface EquipmentItem {
  id: number;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  minStock: number;
  condition: Condition;
  assignedTo: string;
  lastChecked: string;
  notes: string;
}

const MOCK_ITEMS: EquipmentItem[] = [
  { id: 1, name: "Size 4 Match Balls", category: "Balls", quantity: 12, minStock: 10, condition: "Good", assignedTo: "U10/U12 Teams", lastChecked: "2026-03-15", notes: "Adidas brand, purchased Jan 2026" },
  { id: 2, name: "Size 5 Match Balls", category: "Balls", quantity: 8, minStock: 10, condition: "Fair", assignedTo: "U14/U16 Teams", lastChecked: "2026-03-15", notes: "Mix of Adidas and Nike" },
  { id: 3, name: "Size 3 Training Balls", category: "Balls", quantity: 15, minStock: 8, condition: "Good", assignedTo: "U6/U8 Teams", lastChecked: "2026-03-10", notes: "" },
  { id: 4, name: "Portable Goals (Small)", category: "Goals", quantity: 4, minStock: 4, condition: "Good", assignedTo: "Storage Shed", lastChecked: "2026-03-01", notes: "Pop-up style, 1.2m wide" },
  { id: 5, name: "Portable Goals (Medium)", category: "Goals", quantity: 2, minStock: 2, condition: "Fair", assignedTo: "Storage Shed", lastChecked: "2026-03-01", notes: "3m wide, one needs net repair" },
  { id: 6, name: "Training Cones (Orange)", category: "Cones/Markers", quantity: 30, minStock: 40, condition: "Good", assignedTo: "Equipment Bag A", lastChecked: "2026-03-12", notes: "" },
  { id: 7, name: "Flat Disc Markers", category: "Cones/Markers", quantity: 50, minStock: 30, condition: "Good", assignedTo: "Equipment Bag B", lastChecked: "2026-03-12", notes: "Assorted colours" },
  { id: 8, name: "Training Bibs (Red)", category: "Bibs", quantity: 10, minStock: 15, condition: "Poor", assignedTo: "Equipment Bag A", lastChecked: "2026-02-20", notes: "Several torn, need replacing" },
  { id: 9, name: "Training Bibs (Blue)", category: "Bibs", quantity: 15, minStock: 15, condition: "Fair", assignedTo: "Equipment Bag A", lastChecked: "2026-02-20", notes: "" },
  { id: 10, name: "First Aid Kit - Main", category: "First Aid", quantity: 1, minStock: 1, condition: "Good", assignedTo: "Canteen", lastChecked: "2026-03-20", notes: "Fully stocked, expires Dec 2026" },
  { id: 11, name: "First Aid Kit - Portable", category: "First Aid", quantity: 2, minStock: 3, condition: "Fair", assignedTo: "Coach bags", lastChecked: "2026-03-10", notes: "Need to restock bandages" },
  { id: 12, name: "Agility Ladder", category: "Other", quantity: 3, minStock: 2, condition: "Good", assignedTo: "Storage Shed", lastChecked: "2026-03-05", notes: "4m length, adjustable rungs" },
];

const CONDITION_VARIANT: Record<Condition, "success" | "warning" | "danger"> = {
  Good: "success",
  Fair: "warning",
  Poor: "danger",
};

const CATEGORIES: EquipmentCategory[] = ["Balls", "Goals", "Cones/Markers", "Bibs", "First Aid", "Other"];

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "All" },
  ...CATEGORIES.map((c) => ({ label: c, value: c })),
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EquipmentInventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<EquipmentItem | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q);
      const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter]);

  const lowStock = MOCK_ITEMS.filter((item) => item.quantity < item.minStock);

  const handleAdd = () => {
    addToast("Item added", "success");
  };

  const handleEdit = () => {
    addToast("Stock updated", "success");
  };

  const handleDeleteConfirm = () => {
    addToast("Item deleted", "success");
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Equipment Inventory">
          <Button variant="accent" size="sm" disabled>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Item
          </Button>
        </PageHeader>
        <SkeletonTable rows={8} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Equipment Inventory">
        <Button variant="accent" size="sm" onClick={handleAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Item
        </Button>
      </PageHeader>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#B45309] flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Low Stock Alerts
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((item) => (
              <Card key={item.id} className="border-[#B45309]/30 bg-amber-50/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-[#B45309]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0B2545] truncate">{item.name}</p>
                    <p className="text-xs text-[#B45309]">
                      {item.quantity} in stock (min: {item.minStock})
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div>
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No equipment found"
          description="No equipment items match the current filters."
          icon={Package}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3 hidden md:table-cell">Assigned To</th>
                <th className="px-4 py-3 hidden lg:table-cell">Last Checked</th>
                <th className="px-4 py-3 hidden xl:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-t border-gray-100 transition-colors hover:bg-blue-50/40",
                    idx % 2 === 1 && "bg-[#F8FAFC]",
                    item.quantity < item.minStock && "bg-amber-50/40"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-[#0B2545]">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 shrink-0 text-gray-400" />
                      {item.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-medium",
                      item.quantity < item.minStock ? "text-[#B45309]" : "text-[#0B2545]"
                    )}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={CONDITION_VARIANT[item.condition]}>
                      {item.condition}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.assignedTo}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{item.lastChecked}</td>
                  <td className="px-4 py-3 text-gray-500 hidden xl:table-cell truncate max-w-[200px]">
                    {item.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Equipment Item"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
