"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { Pagination } from "@/components/committee/shared/pagination";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  Download,
  UserPlus,
  Search,
  Trash2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type PlayerStatus = "Registered" | "EOI" | "Pending";

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  ageGroup: string;
  team: string;
  status: PlayerStatus;
  guardianEmail: string;
}

const MOCK_PLAYERS: Player[] = [
  { id: 1, firstName: "Liam", lastName: "Carter", ageGroup: "U12", team: "Sharks", status: "Registered", guardianEmail: "m.carter@email.com" },
  { id: 2, firstName: "Olivia", lastName: "Bennett", ageGroup: "U10", team: "Dolphins", status: "Registered", guardianEmail: "j.bennett@email.com" },
  { id: 3, firstName: "Noah", lastName: "Patel", ageGroup: "U14", team: "Eagles", status: "EOI", guardianEmail: "s.patel@email.com" },
  { id: 4, firstName: "Emma", lastName: "Nguyen", ageGroup: "U12", team: "Sharks", status: "Registered", guardianEmail: "t.nguyen@email.com" },
  { id: 5, firstName: "Oliver", lastName: "Smith", ageGroup: "U16", team: "Thunder", status: "Pending", guardianEmail: "a.smith@email.com" },
  { id: 6, firstName: "Charlotte", lastName: "Jones", ageGroup: "U10", team: "Dolphins", status: "Registered", guardianEmail: "r.jones@email.com" },
  { id: 7, firstName: "William", lastName: "Brown", ageGroup: "U14", team: "Eagles", status: "Registered", guardianEmail: "k.brown@email.com" },
  { id: 8, firstName: "Amelia", lastName: "Wilson", ageGroup: "U12", team: "Unallocated", status: "EOI", guardianEmail: "d.wilson@email.com" },
  { id: 9, firstName: "James", lastName: "Taylor", ageGroup: "U16", team: "Thunder", status: "Registered", guardianEmail: "p.taylor@email.com" },
  { id: 10, firstName: "Sophia", lastName: "Anderson", ageGroup: "U10", team: "Dolphins", status: "Pending", guardianEmail: "l.anderson@email.com" },
  { id: 11, firstName: "Lucas", lastName: "Thomas", ageGroup: "U12", team: "Sharks", status: "Registered", guardianEmail: "m.thomas@email.com" },
  { id: 12, firstName: "Mia", lastName: "Jackson", ageGroup: "U14", team: "Eagles", status: "Registered", guardianEmail: "c.jackson@email.com" },
  { id: 13, firstName: "Henry", lastName: "White", ageGroup: "U10", team: "Unallocated", status: "EOI", guardianEmail: "j.white@email.com" },
  { id: 14, firstName: "Harper", lastName: "Harris", ageGroup: "U16", team: "Thunder", status: "Registered", guardianEmail: "b.harris@email.com" },
  { id: 15, firstName: "Alexander", lastName: "Martin", ageGroup: "U12", team: "Sharks", status: "Pending", guardianEmail: "n.martin@email.com" },
  { id: 16, firstName: "Evelyn", lastName: "Garcia", ageGroup: "U14", team: "Eagles", status: "Registered", guardianEmail: "r.garcia@email.com" },
  { id: 17, firstName: "Benjamin", lastName: "Martinez", ageGroup: "U10", team: "Dolphins", status: "Registered", guardianEmail: "g.martinez@email.com" },
  { id: 18, firstName: "Abigail", lastName: "Robinson", ageGroup: "U12", team: "Unallocated", status: "EOI", guardianEmail: "f.robinson@email.com" },
  { id: 19, firstName: "Jack", lastName: "Clark", ageGroup: "U16", team: "Thunder", status: "Registered", guardianEmail: "h.clark@email.com" },
  { id: 20, firstName: "Emily", lastName: "Lewis", ageGroup: "U14", team: "Eagles", status: "Pending", guardianEmail: "w.lewis@email.com" },
];

const STATUS_VARIANT: Record<PlayerStatus, "success" | "info" | "warning"> = {
  Registered: "success",
  EOI: "info",
  Pending: "warning",
};

const AGE_GROUPS = ["All", "U10", "U12", "U14", "U16"];
const STATUSES = ["All", "Registered", "EOI", "Pending"];

const ageGroupOptions = AGE_GROUPS.map((ag) => ({ label: ag, value: ag }));
const statusOptions = STATUSES.map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlayerManagementPage() {
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const perPage = 10;

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PLAYERS.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.guardianEmail.toLowerCase().includes(q);
      const matchAge = ageFilter === "All" || p.ageGroup === ageFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchAge && matchStatus;
    });
  }, [search, ageFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleExport = () => {
    addToast("Player data exported successfully", "success");
  };

  const handleImport = () => {
    addToast("Import dialog opened", "info");
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} has been deleted`, "success");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Player Management"
        subtitle={`${filtered.length} players found`}
      >
        <Button variant="secondary" size="sm" onClick={handleImport}>
          <Upload className="mr-1.5 h-4 w-4" />
          Import
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </Button>
        <Button variant="accent" size="sm">
          <UserPlus className="mr-1.5 h-4 w-4" />
          Add Player
        </Button>
      </PageHeader>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Age Group
            </label>
            <Select
              options={ageGroupOptions}
              value={ageFilter}
              onChange={(e) => { setAgeFilter(e.target.value); setPage(1); }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Status
            </label>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Data table */}
      {isLoading ? (
        <SkeletonTable />
      ) : paged.length === 0 ? (
        <EmptyState
          title="No players found"
          description="No players match the current filters. Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3 hidden sm:table-cell">Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Guardian Email</th>
                <th className="px-4 py-3 w-12">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((player, idx) => (
                <tr
                  key={player.id}
                  className={cn(
                    "border-t border-gray-100 transition-colors hover:bg-blue-50/40",
                    idx % 2 === 1 && "bg-[#F8FAFC]"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-[#0B2545]">
                    {player.firstName} {player.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{player.ageGroup}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{player.team}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[player.status]}>
                      {player.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {player.guardianEmail}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteTarget(player)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${player.firstName} ${player.lastName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          perPage={perPage}
          onPageChange={setPage}
        />
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Player"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ""
        }
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
