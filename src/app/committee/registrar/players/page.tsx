"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlayerManagementPage() {
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Player Management</h2>
          <p className="text-sm text-gray-500">{filtered.length} players found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Upload className="mr-1.5 h-4 w-4" />
            Import
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
          <Button variant="accent" size="sm">
            <UserPlus className="mr-1.5 h-4 w-4" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
          <Search className="pointer-events-none absolute mt-[-30px] ml-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Age Group
            </label>
            <select
              value={ageFilter}
              onChange={(e) => { setAgeFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
            >
              {AGE_GROUPS.map((ag) => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Age Group</th>
              <th className="px-4 py-3 hidden sm:table-cell">Team</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden md:table-cell">Guardian Email</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No players match the current filters.
                </td>
              </tr>
            ) : (
              paged.map((player, idx) => (
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * perPage + 1}&#8211;
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border text-sm",
                  n === page
                    ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
