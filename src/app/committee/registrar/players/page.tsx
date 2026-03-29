"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import { PlayerDetailPanel, type PlayerFull } from "@/components/committee/registrar/player-detail-panel";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  Download,
  UserPlus,
  Search,
  Trash2,
  CheckCircle2,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type PlayerStatus = "Registered" | "EOI" | "Pending";

const MOCK_PLAYERS: PlayerFull[] = [
  { id: 1, firstName: "Liam", lastName: "Carter", dob: "15/03/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260001", guardianName: "Mary Carter", guardianEmail: "m.carter@email.com", guardianPhone: "0412 345 678", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "15 Jan 2026", position: "Midfielder", gradeScore: 7.2 },
  { id: 2, firstName: "Olivia", lastName: "Bennett", dob: "22/07/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260002", guardianName: "Jane Bennett", guardianEmail: "j.bennett@email.com", guardianPhone: "0423 456 789", medicalNotes: "Mild asthma — carries inhaler", photoConsent: "Public Website", registeredDate: "16 Jan 2026", position: "Forward", gradeScore: 6.8 },
  { id: 3, firstName: "Noah", lastName: "Patel", dob: "03/11/2012", ageGroup: "U14", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260003", guardianName: "Sanjay Patel", guardianEmail: "s.patel@email.com", guardianPhone: "0434 567 890", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Defender", gradeScore: 7.5 },
  { id: 4, firstName: "Emma", lastName: "Nguyen", dob: "18/05/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260004", guardianName: "Tran Nguyen", guardianEmail: "t.nguyen@email.com", guardianPhone: "0445 678 901", medicalNotes: "Allergy to bee stings — EpiPen in kit bag", photoConsent: "Internal Only", registeredDate: "17 Jan 2026", position: "Goalkeeper", gradeScore: 8.1 },
  { id: 5, firstName: "Oliver", lastName: "Smith", dob: "29/01/2010", ageGroup: "U16", team: "Thunder", status: "Pending", ffaNumber: "FFA-20260005", guardianName: "Andrew Smith", guardianEmail: "a.smith@email.com", guardianPhone: "0456 789 012", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "—", position: "Midfielder", gradeScore: 6.5 },
  { id: 6, firstName: "Charlotte", lastName: "Jones", dob: "11/09/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260006", guardianName: "Rachel Jones", guardianEmail: "r.jones@email.com", guardianPhone: "0467 890 123", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "18 Jan 2026", position: "Defender", gradeScore: 7.0 },
  { id: 7, firstName: "William", lastName: "Brown", dob: "25/04/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260007", guardianName: "Karen Brown", guardianEmail: "k.brown@email.com", guardianPhone: "0478 901 234", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "19 Jan 2026", position: "Forward", gradeScore: 8.3 },
  { id: 8, firstName: "Amelia", lastName: "Wilson", dob: "07/12/2014", ageGroup: "U12", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260008", guardianName: "David Wilson", guardianEmail: "d.wilson@email.com", guardianPhone: "0489 012 345", medicalNotes: "Diabetes Type 1 — insulin pump", photoConsent: "None", registeredDate: "—", position: "Midfielder", gradeScore: 6.9 },
  { id: 9, firstName: "James", lastName: "Taylor", dob: "14/08/2010", ageGroup: "U16", team: "Thunder", status: "Registered", ffaNumber: "FFA-20260009", guardianName: "Peter Taylor", guardianEmail: "p.taylor@email.com", guardianPhone: "0490 123 456", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "20 Jan 2026", position: "Defender", gradeScore: 7.8 },
  { id: 10, firstName: "Sophia", lastName: "Anderson", dob: "30/02/2016", ageGroup: "U10", team: "Dolphins", status: "Pending", ffaNumber: "FFA-20260010", guardianName: "Lisa Anderson", guardianEmail: "l.anderson@email.com", guardianPhone: "0401 234 567", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Forward", gradeScore: 6.2 },
  { id: 11, firstName: "Lucas", lastName: "Thomas", dob: "02/06/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260011", guardianName: "Mark Thomas", guardianEmail: "m.thomas@email.com", guardianPhone: "0412 345 111", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "21 Jan 2026", position: "Midfielder", gradeScore: 7.4 },
  { id: 12, firstName: "Mia", lastName: "Jackson", dob: "19/10/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260012", guardianName: "Chris Jackson", guardianEmail: "c.jackson@email.com", guardianPhone: "0423 456 222", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "22 Jan 2026", position: "Defender", gradeScore: 7.1 },
  { id: 13, firstName: "Henry", lastName: "White", dob: "08/03/2016", ageGroup: "U10", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260013", guardianName: "James White", guardianEmail: "j.white@email.com", guardianPhone: "0434 567 333", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Goalkeeper", gradeScore: 6.5 },
  { id: 14, firstName: "Harper", lastName: "Harris", dob: "26/12/2010", ageGroup: "U16", team: "Thunder", status: "Registered", ffaNumber: "FFA-20260014", guardianName: "Beth Harris", guardianEmail: "b.harris@email.com", guardianPhone: "0445 678 444", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "23 Jan 2026", position: "Forward", gradeScore: 8.0 },
  { id: 15, firstName: "Alexander", lastName: "Martin", dob: "13/09/2014", ageGroup: "U12", team: "Sharks", status: "Pending", ffaNumber: "FFA-20260015", guardianName: "Nicole Martin", guardianEmail: "n.martin@email.com", guardianPhone: "0456 789 555", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 6.7 },
  { id: 16, firstName: "Evelyn", lastName: "Garcia", dob: "05/07/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260016", guardianName: "Ricardo Garcia", guardianEmail: "r.garcia@email.com", guardianPhone: "0467 890 666", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "24 Jan 2026", position: "Midfielder", gradeScore: 7.6 },
  { id: 17, firstName: "Benjamin", lastName: "Martinez", dob: "21/01/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260017", guardianName: "Gloria Martinez", guardianEmail: "g.martinez@email.com", guardianPhone: "0478 901 777", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "25 Jan 2026", position: "Midfielder", gradeScore: 6.4 },
  { id: 18, firstName: "Abigail", lastName: "Robinson", dob: "16/04/2014", ageGroup: "U12", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260018", guardianName: "Frank Robinson", guardianEmail: "f.robinson@email.com", guardianPhone: "0489 012 888", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Forward", gradeScore: 7.3 },
  { id: 19, firstName: "Jack", lastName: "Clark", dob: "10/11/2010", ageGroup: "U16", team: "Thunder", status: "Registered", ffaNumber: "FFA-20260019", guardianName: "Helen Clark", guardianEmail: "h.clark@email.com", guardianPhone: "0490 123 999", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "26 Jan 2026", position: "Goalkeeper", gradeScore: 8.5 },
  { id: 20, firstName: "Emily", lastName: "Lewis", dob: "28/06/2012", ageGroup: "U14", team: "Eagles", status: "Pending", ffaNumber: "FFA-20260020", guardianName: "Wayne Lewis", guardianEmail: "w.lewis@email.com", guardianPhone: "0401 234 000", medicalNotes: "Knee brace — right knee", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 7.0 },
];

const STATUS_VARIANT: Record<PlayerStatus, "success" | "info" | "warning"> = {
  Registered: "success",
  EOI: "info",
  Pending: "warning",
};

const AGE_GROUPS = ["All", "U10", "U12", "U14", "U16"];
const STATUSES = ["All", "Registered", "EOI", "Pending"];
const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Grade (Highest First)", value: "grade-desc" },
  { label: "Grade (Lowest First)", value: "grade-asc" },
  { label: "Age Group", value: "age-group" },
];

const ageGroupOptions = AGE_GROUPS.map((ag) => ({ label: ag, value: ag }));
const statusOptions = STATUSES.map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toFivePoint(score10: number): number {
  return score10 / 2;
}

function gradeLabel(score5: number): string {
  if (score5 >= 4.0) return "Expert";
  if (score5 >= 3.0) return "Competent";
  if (score5 >= 2.0) return "Developing";
  return "Basic";
}

function gradeBadgeVariant(score5: number): "success" | "info" | "warning" | "danger" {
  if (score5 >= 4.0) return "success";
  if (score5 >= 3.0) return "info";
  if (score5 >= 2.0) return "warning";
  return "danger";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlayerManagementPage() {
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PlayerFull | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detailPlayer, setDetailPlayer] = useState<PlayerFull | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);
  const perPage = 10;

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const result = MOCK_PLAYERS.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.guardianEmail.toLowerCase().includes(q);
      const matchAge = ageFilter === "All" || p.ageGroup === ageFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchAge && matchStatus;
    });

    // Sort the filtered results
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "name-desc":
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case "grade-desc":
          return b.gradeScore - a.gradeScore;
        case "grade-asc":
          return a.gradeScore - b.gradeScore;
        case "age-group":
          return a.ageGroup.localeCompare(b.ageGroup);
        default:
          return 0;
      }
    });

    return result;
  }, [search, ageFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  /* Selection handlers */
  const toggleRow = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === paged.length && paged.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((p) => p.id)));
    }
  }, [paged, selected.size]);

  /* Count how many selected are EOI or Pending (convertible) */
  const selectedConvertible = useMemo(() => {
    return MOCK_PLAYERS.filter(
      (p) => selected.has(p.id) && (p.status === "EOI" || p.status === "Pending")
    ).length;
  }, [selected]);

  const handleExport = () => addToast("Player data exported successfully", "success");
  const handleImport = () => addToast("Import dialog opened", "info");

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} has been deleted`, "success");
      setDeleteTarget(null);
    }
  };

  const handleConvertConfirm = () => {
    addToast(`${selectedConvertible} player(s) converted to Registered`, "success");
    setSelected(new Set());
    setConvertOpen(false);
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
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Age Group</label>
            <Select options={ageGroupOptions} value={ageFilter} onChange={(e) => { setAgeFilter(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
            <Select options={statusOptions} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Sort By</label>
            <Select options={SORT_OPTIONS} value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-[#1D4ED8]/20 bg-blue-50 px-4 py-3">
          <span className="text-sm font-medium text-[#1D4ED8]">
            <Users className="mr-1.5 inline h-4 w-4" />
            {selected.size} selected
          </span>
          {selectedConvertible > 0 && (
            <Button variant="accent" size="sm" onClick={() => setConvertOpen(true)}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Convert to Registered ({selectedConvertible})
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => {
            addToast(`${selected.size} player(s) deleted`, "success");
            setSelected(new Set());
          }}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Data table */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={7} />
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
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3 hidden sm:table-cell">Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Grade</th>
                <th className="px-4 py-3 hidden md:table-cell">Guardian Email</th>
                <th className="px-4 py-3 w-12">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((player, idx) => {
                const score5 = toFivePoint(player.gradeScore);
                return (
                  <tr
                    key={player.id}
                    onClick={() => setDetailPlayer(player)}
                    className={cn(
                      "border-t border-gray-100 transition-colors hover:bg-blue-50/40 cursor-pointer",
                      idx % 2 === 1 && "bg-[#F8FAFC]",
                      selected.has(player.id) && "bg-blue-50"
                    )}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(player.id)}
                        onChange={() => toggleRow(player.id)}
                        className="rounded"
                      />
                    </td>
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
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={gradeBadgeVariant(score5)}>
                        {score5.toFixed(1)} {gradeLabel(score5)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {player.guardianEmail}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDeleteTarget(player)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${player.firstName} ${player.lastName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      {/* Player detail slide-over panel */}
      <PlayerDetailPanel
        player={detailPlayer}
        open={detailPlayer !== null}
        onClose={() => setDetailPlayer(null)}
      />

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

      {/* Convert EOI confirmation dialog */}
      <ConfirmDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        onConfirm={handleConvertConfirm}
        title="Convert to Registered"
        description={`Convert ${selectedConvertible} player(s) from EOI/Pending to Registered status? This will mark them as fully registered in the system.`}
        variant="accent"
        confirmLabel="Convert"
      />
    </div>
  );
}
